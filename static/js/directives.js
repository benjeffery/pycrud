pycrud.directive('buttonToggle', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, attr, ctrl) {
            var classToToggle = attr.buttonToggle;
            element.bind('click', function() {
                var checked = ctrl.$viewValue;
                $scope.$apply(function(scope) {
                    ctrl.$setViewValue(!checked);
                });
            });

            $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                newValue ? element.addClass(classToToggle) : element.removeClass(classToToggle);
            });
        }
    };
});

pycrud.directive('mongoLink', function (Mongo) {
    var options = {
        highlight: {
            caseSensitive: false
        }
    };
    return {
        require: '?ngModel',
        compile: function (tElm, tAttrs) {
            var isMultiple = (tAttrs.multiple !== undefined);
            var objects = [];
            var objects_by_id = {};

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var ext_opts = {
                    query: function (options) {
                        var matches = objects.filter(function(obj) {return obj.text.toUpperCase().indexOf(options.term.toUpperCase())>=0;})
                        options.callback({
                            more: false,
                            results: matches
                        });
                    }
                };
                var opts = angular.extend({}, options, ext_opts);

                if (isMultiple) {
                    opts.multiple = true;
                }

                if (controller) {
                    // Watch the model for programmatic changes
                    controller.$render = function () {
                        if (isMultiple && !controller.$modelValue) {
                            elm.select2('data', []);
                        } else if (controller.$modelValue && '_id' in controller.$modelValue) {
                            elm.select2('data', objects_by_id[controller.$modelValue['_id']]);
                        }
                    };
                }

                // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                elm.bind("change", function () {
                    scope.$apply(function () {
                        var val = {'_id': elm.select2('data')['_id']};
                        controller.$setViewValue(val);
                    });
                });

                if (opts.initSelection) {
                    var initSelection = opts.initSelection;
                    opts.initSelection = function (element, callback) {
                        initSelection(element, function (value) {
                            var val = {'_id': value['_id']};
                            controller.$setViewValue(val);
                            callback(value);
                        });
                    };
                }

                attrs.$observe('disabled', function (value) {
                    elm.select2(value && 'disable' || 'enable');
                });

                scope.$watch(attrs.ngMultiple, function(newVal) {
                    elm.select2(opts);
                });
                // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
                setTimeout(function () {
                    //get the possible selections and add in ID and TEXT as required by select2
                    objects = Mongo.query({collection:tAttrs.collection}, function() {
                        for (var i=0;i<objects.length;i++) {
                            objects[i].id = objects[i]['_id'];
                            objects[i].text = objects[i][attrs.nameField];
                            objects_by_id[objects[i]['_id']] = objects[i];
                        }
                        elm.select2(opts);
                        var current_val = scope.$eval(attrs.ngModel);
                        if (current_val && '_id' in current_val) {
                            elm.select2("data",objects_by_id[scope.$eval(attrs.ngModel)['_id']]);
                        }
                    });
                });
            };
        }
    };
});
