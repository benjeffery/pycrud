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
        },
        id: function(obj) {
            return obj['_id'];
        },
        data: []
    };
    return {
        require: '?ngModel',
        compile: function (tElm, tAttrs) {
            var repeatOption,
                repeatAttr,
                isMultiple = (tAttrs.multiple !== undefined);

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var name_field = attrs.nameField;
                var ext_opts = {
                        formatSelection: function(obj) {
                            return obj[name_field];
                        },
                        formatResult: function(obj) {
                            return obj[name_field];
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
                        } else {
                            elm.select2('data', controller.$modelValue);
                        }
                    };
                }

                // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                elm.bind("change", function () {
                    scope.$apply(function () {
                        var val = {'_id': elm.select2('data')['_id']};
                        val[attrs.nameField] = elm.select2('data')[attrs.nameField];
                        controller.$setViewValue(val);
                    });
                });

                if (opts.initSelection) {
                    var initSelection = opts.initSelection;
                    opts.initSelection = function (element, callback) {
                        initSelection(element, function (value) {
                            controller.$setViewValue(value);
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
                        // Set initial value since Angular doesn't
                        var data = Mongo.query({collection:attrs.collection}, function() {
                        angular.extend(opts.data, data);
                        elm.select2(opts);
                        elm.select2("data",scope.$eval(attrs.ngModel));
                    });
                });
            };
        }
    };
});
