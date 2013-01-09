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