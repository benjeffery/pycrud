var pycrud = angular.module('pycrud', ['ngResource', 'ui', 'ui-gravatar']);
pycrud.value('ui.config', {
    highlight: {
        caseSensitive: false
    }
});

//Init the connection to mongo
pycrud.factory('Mongo', function($resource) {
        return $resource('/api/:collection/:id');
    }
);

pycrud.config(function($routeProvider) {
        $routeProvider.
            when('/', {controller:"CollectionListCtrl", templateUrl:'static/collection_list.html'}).
            when('/studies', {controller:"StudiesCtrl", templateUrl:'static/studies.html'}).
            when('/studies/:id', {controller:"ViewStudyCtrl", templateUrl:'static/study.html'}).
            when('/studies/:id/edit', {controller:"EditStudyCtrl", templateUrl:'static/edit_study.html'}).
            when('/contact_persons', {controller:"ContactPersonsCtrl", templateUrl:'static/contact_persons.html'}).
            when('/contact_persons/:id', {controller:"ViewContactPersonCtrl", templateUrl:'static/contact_person.html'}).
            when('/contact_persons/:id/edit', {controller:"EditContactPersonCtrl", templateUrl:'static/edit_contact_person.html'}).
//            when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
            otherwise({redirectTo:'/'});
    });

pycrud.controller("CollectionListCtrl", function($scope, Mongo) {
        $scope.collections = Mongo.query()
});

pycrud.controller("StudiesCtrl", function($scope, Mongo) {
    $scope.studies = Mongo.query({collection:'studies'}, function() {
        for (var i=0;i<$scope.studies.length;i++) {
            var count = 0;
            for (var j=0;j<$scope.studies[i].sample_contexts.length;j++) {
                count += $scope.studies[i].sample_contexts[j].samples.length
            }
            $scope.studies[i].sample_count = count
        }
    });
});

pycrud.controller("ViewStudyCtrl", function($scope, $routeParams, Mongo) {
    $scope.study = Mongo.get({collection:'studies', id:$routeParams.id}, function() {
    });
    $scope.mapOptions = {
        center: new google.maps.LatLng(35.784, -78.670),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
});

pycrud.controller("EditStudyCtrl", function($scope, $routeParams, Mongo) {
    $scope.study = Mongo.get({collection:'studies', id:$routeParams.id}, function() {
    });
});

pycrud.controller("ContactPersonsCtrl", function($scope, Mongo) {
    $scope.contact_persons = Mongo.query({collection:'contact_persons'}, function() {
    });
});
pycrud.controller("ViewContactPersonCtrl", function($scope, $routeParams, Mongo) {
    $scope.person = Mongo.get({collection:'contact_persons', id:$routeParams.id}, function() {
    });
});
pycrud.controller("EditContactPersonCtrl", function($scope, $routeParams, Mongo) {
    $scope.person = Mongo.get({collection:'contact_persons', id:$routeParams.id}, function() {
    });
});


//function ObjCtrl($scope, $attrs, $routeParams, Mongo) {
//    $scope.data = Mongo.get({collection:$attrs.collection, id:$attrs.objid});
//    $scope.remove = function(array, element) {
//        array.splice(array.indexOf(element), 1);
//        $scope.form_data.$dirty=true;
//    }
//}
//
//
//

angular.module('ng').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };
});

angular.module('ng').filter('markdown', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';
        var converter = new Showdown.converter();
        return converter.makeHtml(value);
    };
});