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
                function view_to_model(view){
                    if (isMultiple) {
                        var val = [];
                        for (var i=0;i<view.length;i++) {
                            val.push({'_id':view[i]['_id']})
                        }
                        return val;
                    } else {
                        return {'_id': view['_id']};
                    }
                }
                function model_to_view(model){
                    if (isMultiple) {
                        if (!model) {
                            return [];
                        }
                        else {
                            var choices = [];
                            for (var i=0;i<model.length;i++) {
                                choices.push(objects_by_id[model[i]['_id']]);
                            }
                            return choices;
                        }
                    } else {
                        if (model && '_id' in model) {
                            return objects_by_id[model['_id']];
                        } else {
                            return null;
                        }
                    }
                }

                // instance-specific options
                var ext_opts = {
                    query: function (options) {
                        var matches = objects.filter(function(obj) {return obj.text.toUpperCase().indexOf(options.term.toUpperCase())>=0;})
                        options.callback({
                            more: false,
                            results: matches
                        });
                    },
                    multiple: isMultiple
                };
                var opts = angular.extend({}, options, ext_opts);

                if (controller) {
                    // Watch the model for programmatic changes
                    controller.$render = function () {
                        elm.select2('data', model_to_view(controller.$modelValue));
                    };
                }

                elm.bind("change", function () {
                    scope.$apply(function () {
                        controller.$setViewValue(view_to_model(elm.select2('data')));
                    });
                });

                if (opts.initSelection) {
                    var initSelection = opts.initSelection;
                    opts.initSelection = function (element, callback) {
                        initSelection(element, function (value) {
                            controller.$setViewValue(view_to_model(value));
                            callback(value);
                        });
                    };
                }

                attrs.$observe('disabled', function (value) {
                    elm.select2(value && 'disable' || 'enable');
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
                        elm.select2('data', model_to_view(scope.$eval(attrs.ngModel)));
                    });
                });
            };
        }
    };
});

function bindMapEvents(scope, eventsStr, googleObject, element) {
    angular.forEach(eventsStr.split(' '), function (eventName) {
      //Prefix all googlemap events with 'map-', so eg 'click'
      //for the googlemap doesn't interfere with a normal 'click' event
      var $event = { type: 'map-' + eventName };
      google.maps.event.addListener(googleObject, eventName, function (evt) {
        element.trigger(angular.extend({}, $event, evt));
        //We create an $apply if it isn't happening. we need better support for this
        //We don't want to use timeout because tons of these events fire at once,
        //and we only need one $apply
        if (!scope.$$phase) scope.$apply();
      });
    });
  }

pycrud.directive('uiMap2',
	    ['ui.config', '$parse', function (uiConfig, $parse) {

	      var mapEvents = 'bounds_changed center_changed click dblclick drag dragend ' +
	        'dragstart heading_changed idle maptypeid_changed mousemove mouseout ' +
	        'mouseover projection_changed resize rightclick tilesloaded tilt_changed ' +
	        'zoom_changed';
	      var options = uiConfig.map || {};

	      return {
	        restrict: 'A',
	        //doesn't work as E for unknown reason
	        link: function (scope, elm, attrs) {
	          var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
	          var map = new google.maps.Map(elm[0], opts);
	          var model = $parse(attrs.uiMap2);

	          //Set scope variable for the map
	          model.assign(scope, map);

	          bindMapEvents(scope, mapEvents, map, elm);
	          
	          new google.maps.Marker({
	              map: map,
	              position: opts.center
	              })
	        }
	      };
	    }]);