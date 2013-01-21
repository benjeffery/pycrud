pycrud.controller("CollectionListCtrl", function($scope, Mongo) {
    $scope.collections = Mongo.query()
});

pycrud.controller("ProblemsCtrl", function($scope, $http) {
    $http({method: 'GET', url: '/problems'}).
        success(function(data, status, headers, config) {
            $scope.problems = data;
        }).
        error(function(data, status, headers, config) {
            //TODO
        });
});

pycrud.controller("StudiesCtrl", function($scope, Mongo) {
    $scope.studies = Mongo.query({collection:'studies'}, function() {
        for (var i=0;i<$scope.studies.length;i++) {
            var count = 0;
            for (var j=0;j<$scope.studies[i].sample_contexts.length;j++) {
                count += $scope.studies[i].sample_contexts[j].samples.length
            }
            $scope.studies[i].sample_count = count;
//            for (j=0;j<$scope.studies[i].contact_persons.length;j++) {
//                $scope.studies[i].contact_persons[j] = Mongo.get({collection:'contact_persons', id:$scope.studies[i].contact_persons[j]._id})
//            }
        }
    });
});

pycrud.controller("ViewStudyCtrl", function($scope, $routeParams, Mongo) {
    $scope.study = Mongo.get({collection:'studies', id:$routeParams.id}, function() {
    });
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
    $scope.add = function() {
        $scope.person.affiliations.push('');
        $scope.form_person.$dirty=true;
    }
    $scope.remove = function(element) {
        $scope.person.affiliations.splice($scope.person.affiliations.indexOf(element), 1);
        $scope.form_person.$dirty=true;
    }
});