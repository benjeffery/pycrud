var pycrud = angular.module('pycrud', ['ngResource', 'ui', 'ui-gravatar']);

//Init the connection to mongo
pycrud.factory('Mongo', function($resource) {
        return $resource('/api/:collection/:id',
            {},
            {update: {method:'PUT'}});
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

pycrud.controller("EditStudyCtrl", function($scope, $routeParams, $location, Mongo) {
    $scope.study = Mongo.get({collection:'studies', id:$routeParams.id}, function() {
    });
    $scope.save = function() {
        //TODO - Shouldn't be whole person object
        $scope.study.contact_person = {'_id':$scope.study.contact_person._id, 'name':$scope.study.contact_person.name};
        Mongo.update({collection:'studies', id:$scope.study._id}, $scope.study, function(study) {
            $location.path('/studies/'+$scope.study._id);
        });
    };
});

pycrud.controller("ContactPersonsCtrl", function($scope, Mongo) {
    $scope.contact_persons = Mongo.query({collection:'contact_persons'}, function() {
    });
});
pycrud.controller("ViewContactPersonCtrl", function($scope, $routeParams, Mongo) {
    $scope.person = Mongo.get({collection:'contact_persons', id:$routeParams.id}, function() {
    });
});
pycrud.controller("EditContactPersonCtrl", function($scope, $routeParams, $location, Mongo) {
    $scope.person = Mongo.get({collection:'contact_persons', id:$routeParams.id}, function() {
    });
    $scope.save = function() {
        Mongo.update({collection:'contact_persons', id:$scope.person._id}, $scope.person, function(person) {
            $location.path('/contact_persons/'+$scope.person._id);
        });
    };
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
