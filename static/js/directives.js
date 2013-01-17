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
                        elm.select2('data', model_to_view(scope.$eval(attrs.ngModel)));
                    });
                });
            };
        }
    };
});

pycrud.directive('countrySelect', function (Mongo) {
    var countries = [{"text":"Afghanistan","id":"AF","country-code":"004"},{"text":"Åland Islands","id":"AX","country-code":"248"},{"text":"Albania","id":"AL","country-code":"008"},{"text":"Algeria","id":"DZ","country-code":"012"},{"text":"American Samoa","id":"AS","country-code":"016"},{"text":"Andorra","id":"AD","country-code":"020"},{"text":"Angola","id":"AO","country-code":"024"},{"text":"Anguilla","id":"AI","country-code":"660"},{"text":"Antarctica","id":"AQ","country-code":"010"},{"text":"Antigua and Barbuda","id":"AG","country-code":"028"},{"text":"Argentina","id":"AR","country-code":"032"},{"text":"Armenia","id":"AM","country-code":"051"},{"text":"Aruba","id":"AW","country-code":"533"},{"text":"Australia","id":"AU","country-code":"036"},{"text":"Austria","id":"AT","country-code":"040"},{"text":"Azerbaijan","id":"AZ","country-code":"031"},{"text":"Bahamas","id":"BS","country-code":"044"},{"text":"Bahrain","id":"BH","country-code":"048"},{"text":"Bangladesh","id":"BD","country-code":"050"},{"text":"Barbados","id":"BB","country-code":"052"},{"text":"Belarus","id":"BY","country-code":"112"},{"text":"Belgium","id":"BE","country-code":"056"},{"text":"Belize","id":"BZ","country-code":"084"},{"text":"Benin","id":"BJ","country-code":"204"},{"text":"Bermuda","id":"BM","country-code":"060"},{"text":"Bhutan","id":"BT","country-code":"064"},{"text":"Bolivia, Plurinational State of","id":"BO","country-code":"068"},{"text":"Bonaire, Sint Eustatius and Saba","id":"BQ","country-code":"535"},{"text":"Bosnia and Herzegovina","id":"BA","country-code":"070"},{"text":"Botswana","id":"BW","country-code":"072"},{"text":"Bouvet Island","id":"BV","country-code":"074"},{"text":"Brazil","id":"BR","country-code":"076"},{"text":"British Indian Ocean Territory","id":"IO","country-code":"086"},{"text":"Brunei Darussalam","id":"BN","country-code":"096"},{"text":"Bulgaria","id":"BG","country-code":"100"},{"text":"Burkina Faso","id":"BF","country-code":"854"},{"text":"Burundi","id":"BI","country-code":"108"},{"text":"Cambodia","id":"KH","country-code":"116"},{"text":"Cameroon","id":"CM","country-code":"120"},{"text":"Canada","id":"CA","country-code":"124"},{"text":"Cape Verde","id":"CV","country-code":"132"},{"text":"Cayman Islands","id":"KY","country-code":"136"},{"text":"Central African Republic","id":"CF","country-code":"140"},{"text":"Chad","id":"TD","country-code":"148"},{"text":"Chile","id":"CL","country-code":"152"},{"text":"China","id":"CN","country-code":"156"},{"text":"Christmas Island","id":"CX","country-code":"162"},{"text":"Cocos (Keeling) Islands","id":"CC","country-code":"166"},{"text":"Colombia","id":"CO","country-code":"170"},{"text":"Comoros","id":"KM","country-code":"174"},{"text":"Congo","id":"CG","country-code":"178"},{"text":"Congo, the Democratic Republic of the","id":"CD","country-code":"180"},{"text":"Cook Islands","id":"CK","country-code":"184"},{"text":"Costa Rica","id":"CR","country-code":"188"},{"text":"Côte d'Ivoire","id":"CI","country-code":"384"},{"text":"Croatia","id":"HR","country-code":"191"},{"text":"Cuba","id":"CU","country-code":"192"},{"text":"Curaçao","id":"CW","country-code":"531"},{"text":"Cyprus","id":"CY","country-code":"196"},{"text":"Czech Republic","id":"CZ","country-code":"203"},{"text":"Denmark","id":"DK","country-code":"208"},{"text":"Djibouti","id":"DJ","country-code":"262"},{"text":"Dominica","id":"DM","country-code":"212"},{"text":"Dominican Republic","id":"DO","country-code":"214"},{"text":"Ecuador","id":"EC","country-code":"218"},{"text":"Egypt","id":"EG","country-code":"818"},{"text":"El Salvador","id":"SV","country-code":"222"},{"text":"Equatorial Guinea","id":"GQ","country-code":"226"},{"text":"Eritrea","id":"ER","country-code":"232"},{"text":"Estonia","id":"EE","country-code":"233"},{"text":"Ethiopia","id":"ET","country-code":"231"},{"text":"Falkland Islands (Malvinas)","id":"FK","country-code":"238"},{"text":"Faroe Islands","id":"FO","country-code":"234"},{"text":"Fiji","id":"FJ","country-code":"242"},{"text":"Finland","id":"FI","country-code":"246"},{"text":"France","id":"FR","country-code":"250"},{"text":"French Guiana","id":"GF","country-code":"254"},{"text":"French Polynesia","id":"PF","country-code":"258"},{"text":"French Southern Territories","id":"TF","country-code":"260"},{"text":"Gabon","id":"GA","country-code":"266"},{"text":"Gambia","id":"GM","country-code":"270"},{"text":"Georgia","id":"GE","country-code":"268"},{"text":"Germany","id":"DE","country-code":"276"},{"text":"Ghana","id":"GH","country-code":"288"},{"text":"Gibraltar","id":"GI","country-code":"292"},{"text":"Greece","id":"GR","country-code":"300"},{"text":"Greenland","id":"GL","country-code":"304"},{"text":"Grenada","id":"GD","country-code":"308"},{"text":"Guadeloupe","id":"GP","country-code":"312"},{"text":"Guam","id":"GU","country-code":"316"},{"text":"Guatemala","id":"GT","country-code":"320"},{"text":"Guernsey","id":"GG","country-code":"831"},{"text":"Guinea","id":"GN","country-code":"324"},{"text":"Guinea-Bissau","id":"GW","country-code":"624"},{"text":"Guyana","id":"GY","country-code":"328"},{"text":"Haiti","id":"HT","country-code":"332"},{"text":"Heard Island and McDonald Islands","id":"HM","country-code":"334"},{"text":"Holy See (Vatican City State)","id":"VA","country-code":"336"},{"text":"Honduras","id":"HN","country-code":"340"},{"text":"Hong Kong","id":"HK","country-code":"344"},{"text":"Hungary","id":"HU","country-code":"348"},{"text":"Iceland","id":"IS","country-code":"352"},{"text":"India","id":"IN","country-code":"356"},{"text":"Indonesia","id":"ID","country-code":"360"},{"text":"Iran, Islamic Republic of","id":"IR","country-code":"364"},{"text":"Iraq","id":"IQ","country-code":"368"},{"text":"Ireland","id":"IE","country-code":"372"},{"text":"Isle of Man","id":"IM","country-code":"833"},{"text":"Israel","id":"IL","country-code":"376"},{"text":"Italy","id":"IT","country-code":"380"},{"text":"Jamaica","id":"JM","country-code":"388"},{"text":"Japan","id":"JP","country-code":"392"},{"text":"Jersey","id":"JE","country-code":"832"},{"text":"Jordan","id":"JO","country-code":"400"},{"text":"Kazakhstan","id":"KZ","country-code":"398"},{"text":"Kenya","id":"KE","country-code":"404"},{"text":"Kiribati","id":"KI","country-code":"296"},{"text":"Korea, Democratic People's Republic of","id":"KP","country-code":"408"},{"text":"Korea, Republic of","id":"KR","country-code":"410"},{"text":"Kuwait","id":"KW","country-code":"414"},{"text":"Kyrgyzstan","id":"KG","country-code":"417"},{"text":"Lao People's Democratic Republic","id":"LA","country-code":"418"},{"text":"Latvia","id":"LV","country-code":"428"},{"text":"Lebanon","id":"LB","country-code":"422"},{"text":"Lesotho","id":"LS","country-code":"426"},{"text":"Liberia","id":"LR","country-code":"430"},{"text":"Libya","id":"LY","country-code":"434"},{"text":"Liechtenstein","id":"LI","country-code":"438"},{"text":"Lithuania","id":"LT","country-code":"440"},{"text":"Luxembourg","id":"LU","country-code":"442"},{"text":"Macao","id":"MO","country-code":"446"},{"text":"Macedonia, the former Yugoslav Republic of","id":"MK","country-code":"807"},{"text":"Madagascar","id":"MG","country-code":"450"},{"text":"Malawi","id":"MW","country-code":"454"},{"text":"Malaysia","id":"MY","country-code":"458"},{"text":"Maldives","id":"MV","country-code":"462"},{"text":"Mali","id":"ML","country-code":"466"},{"text":"Malta","id":"MT","country-code":"470"},{"text":"Marshall Islands","id":"MH","country-code":"584"},{"text":"Martinique","id":"MQ","country-code":"474"},{"text":"Mauritania","id":"MR","country-code":"478"},{"text":"Mauritius","id":"MU","country-code":"480"},{"text":"Mayotte","id":"YT","country-code":"175"},{"text":"Mexico","id":"MX","country-code":"484"},{"text":"Micronesia, Federated States of","id":"FM","country-code":"583"},{"text":"Moldova, Republic of","id":"MD","country-code":"498"},{"text":"Monaco","id":"MC","country-code":"492"},{"text":"Mongolia","id":"MN","country-code":"496"},{"text":"Montenegro","id":"ME","country-code":"499"},{"text":"Montserrat","id":"MS","country-code":"500"},{"text":"Morocco","id":"MA","country-code":"504"},{"text":"Mozambique","id":"MZ","country-code":"508"},{"text":"Myanmar","id":"MM","country-code":"104"},{"text":"Namibia","id":"NA","country-code":"516"},{"text":"Nauru","id":"NR","country-code":"520"},{"text":"Nepal","id":"NP","country-code":"524"},{"text":"Netherlands","id":"NL","country-code":"528"},{"text":"New Caledonia","id":"NC","country-code":"540"},{"text":"New Zealand","id":"NZ","country-code":"554"},{"text":"Nicaragua","id":"NI","country-code":"558"},{"text":"Niger","id":"NE","country-code":"562"},{"text":"Nigeria","id":"NG","country-code":"566"},{"text":"Niue","id":"NU","country-code":"570"},{"text":"Norfolk Island","id":"NF","country-code":"574"},{"text":"Northern Mariana Islands","id":"MP","country-code":"580"},{"text":"Norway","id":"NO","country-code":"578"},{"text":"Oman","id":"OM","country-code":"512"},{"text":"Pakistan","id":"PK","country-code":"586"},{"text":"Palau","id":"PW","country-code":"585"},{"text":"Palestinian Territory, Occupied","id":"PS","country-code":"275"},{"text":"Panama","id":"PA","country-code":"591"},{"text":"Papua New Guinea","id":"PG","country-code":"598"},{"text":"Paraguay","id":"PY","country-code":"600"},{"text":"Peru","id":"PE","country-code":"604"},{"text":"Philippines","id":"PH","country-code":"608"},{"text":"Pitcairn","id":"PN","country-code":"612"},{"text":"Poland","id":"PL","country-code":"616"},{"text":"Portugal","id":"PT","country-code":"620"},{"text":"Puerto Rico","id":"PR","country-code":"630"},{"text":"Qatar","id":"QA","country-code":"634"},{"text":"Réunion","id":"RE","country-code":"638"},{"text":"Romania","id":"RO","country-code":"642"},{"text":"Russian Federation","id":"RU","country-code":"643"},{"text":"Rwanda","id":"RW","country-code":"646"},{"text":"Saint Barthélemy","id":"BL","country-code":"652"},{"text":"Saint Helena, Ascension and Tristan da Cunha","id":"SH","country-code":"654"},{"text":"Saint Kitts and Nevis","id":"KN","country-code":"659"},{"text":"Saint Lucia","id":"LC","country-code":"662"},{"text":"Saint Martin (French part)","id":"MF","country-code":"663"},{"text":"Saint Pierre and Miquelon","id":"PM","country-code":"666"},{"text":"Saint Vincent and the Grenadines","id":"VC","country-code":"670"},{"text":"Samoa","id":"WS","country-code":"882"},{"text":"San Marino","id":"SM","country-code":"674"},{"text":"Sao Tome and Principe","id":"ST","country-code":"678"},{"text":"Saudi Arabia","id":"SA","country-code":"682"},{"text":"Senegal","id":"SN","country-code":"686"},{"text":"Serbia","id":"RS","country-code":"688"},{"text":"Seychelles","id":"SC","country-code":"690"},{"text":"Sierra Leone","id":"SL","country-code":"694"},{"text":"Singapore","id":"SG","country-code":"702"},{"text":"Sint Maarten (Dutch part)","id":"SX","country-code":"534"},{"text":"Slovakia","id":"SK","country-code":"703"},{"text":"Slovenia","id":"SI","country-code":"705"},{"text":"Solomon Islands","id":"SB","country-code":"090"},{"text":"Somalia","id":"SO","country-code":"706"},{"text":"South Africa","id":"ZA","country-code":"710"},{"text":"South Georgia and the South Sandwich Islands","id":"GS","country-code":"239"},{"text":"South Sudan","id":"SS","country-code":"728"},{"text":"Spain","id":"ES","country-code":"724"},{"text":"Sri Lanka","id":"LK","country-code":"144"},{"text":"Sudan","id":"SD","country-code":"729"},{"text":"Suriname","id":"SR","country-code":"740"},{"text":"Svalbard and Jan Mayen","id":"SJ","country-code":"744"},{"text":"Swaziland","id":"SZ","country-code":"748"},{"text":"Sweden","id":"SE","country-code":"752"},{"text":"Switzerland","id":"CH","country-code":"756"},{"text":"Syrian Arab Republic","id":"SY","country-code":"760"},{"text":"Taiwan, Province of China","id":"TW","country-code":"158"},{"text":"Tajikistan","id":"TJ","country-code":"762"},{"text":"Tanzania, United Republic of","id":"TZ","country-code":"834"},{"text":"Thailand","id":"TH","country-code":"764"},{"text":"Timor-Leste","id":"TL","country-code":"626"},{"text":"Togo","id":"TG","country-code":"768"},{"text":"Tokelau","id":"TK","country-code":"772"},{"text":"Tonga","id":"TO","country-code":"776"},{"text":"Trinidad and Tobago","id":"TT","country-code":"780"},{"text":"Tunisia","id":"TN","country-code":"788"},{"text":"Turkey","id":"TR","country-code":"792"},{"text":"Turkmenistan","id":"TM","country-code":"795"},{"text":"Turks and Caicos Islands","id":"TC","country-code":"796"},{"text":"Tuvalu","id":"TV","country-code":"798"},{"text":"Uganda","id":"UG","country-code":"800"},{"text":"Ukraine","id":"UA","country-code":"804"},{"text":"United Arab Emirates","id":"AE","country-code":"784"},{"text":"United Kingdom","id":"GB","country-code":"826"},{"text":"United States","id":"US","country-code":"840"},{"text":"United States Minor Outlying Islands","id":"UM","country-code":"581"},{"text":"Uruguay","id":"UY","country-code":"858"},{"text":"Uzbekistan","id":"UZ","country-code":"860"},{"text":"Vanuatu","id":"VU","country-code":"548"},{"text":"Venezuela, Bolivarian Republic of","id":"VE","country-code":"862"},{"text":"Viet Nam","id":"VN","country-code":"704"},{"text":"Virgin Islands, British","id":"VG","country-code":"092"},{"text":"Virgin Islands, U.S.","id":"VI","country-code":"850"},{"text":"Wallis and Futuna","id":"WF","country-code":"876"},{"text":"Western Sahara","id":"EH","country-code":"732"},{"text":"Yemen","id":"YE","country-code":"887"},{"text":"Zambia","id":"ZM","country-code":"894"},{"text":"Zimbabwe","id":"ZW","country-code":"716"}]
    var countries_by_code = {}
    angular.forEach(countries, function(country) {
        countries_by_code[country['id']] = country;
    });

    function view_to_model(view){
        return view['id'];
    }
    function model_to_view(model){
        return countries_by_code[model];
    }

    var options = {
        highlight: {
            caseSensitive: false
        },
        data: countries
    };
    return {
        require: '?ngModel',
        compile: function (tElm, tAttrs) {

            return function (scope, elm, attrs, controller) {
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

                attrs.$observe('disabled', function (value) {
                    elm.select2(value && 'disable' || 'enable');
                });

                // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
                setTimeout(function () {
                    //get the possible selections and add in ID and TEXT as required by select2
                    elm.select2(options);
                    elm.select2('data', model_to_view(scope.$eval(attrs.ngModel)));
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

pycrud.directive('mapPoint',
    function () {
        var mapEvents = 'bounds_changed center_changed click dblclick drag dragend ' +
            'dragstart heading_changed idle maptypeid_changed mousemove mouseout ' +
            'mouseover projection_changed resize rightclick tilesloaded tilt_changed ' +
            'zoom_changed';
        return {
            require: 'ngModel',
            restrict: 'A',
            //doesn't work as E for unknown reason
            link: function (scope, elm, attrs, controller) {
                var latlong = scope.$eval(attrs.ngModel);
                var options = {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoom: scope.$eval(attrs.zoom) || 9,
                    center: new google.maps.LatLng(parseFloat(latlong.lat), parseFloat(latlong.lon))
                };
                var map = new google.maps.Map(elm[0], options);
                var marker = new google.maps.Marker({
                    map: map,
                    position: options.center
                });
                bindMapEvents(scope, mapEvents, map, elm);
                controller.$render = function () {
                    var pos = controller.$modelValue;
                    marker.setPosition(new google.maps.LatLng(parseFloat(pos.lat), parseFloat(pos.lon)));
                };
                if (attrs.editable !== undefined) {
                    elm.bind("map-click", function (event) {
                        scope.$apply(function () {
                            var model = controller.$modelValue;
                            model.lat = event.latLng.lat();
                            model.lon = event.latLng.lng();
                            marker.setPosition(new google.maps.LatLng(parseFloat(model.lat), parseFloat(model.lon)));
                            controller.$setViewValue(model);
                        });
                    });
                }
            }
        };
    });

pycrud.directive('editList', function () {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            var separator = attr.editList || ',';
            if (separator === "\\n")
                separator = "\n";

            var parse = function(viewValue) {
                var list = [];

                if (viewValue) {
                    angular.forEach(viewValue.split(separator), function(value) {
                        if (value) list.push($.trim(value));
                    });
                }
                return list;
            };
            ctrl.$parsers.push(parse);
            ctrl.$formatters.push(function(value) {
                if (angular.isArray(value)) {
                    return value.join(separator);
                }

                return undefined;
            });
        }
    };
});