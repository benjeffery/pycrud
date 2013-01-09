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
