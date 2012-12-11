var myApp = angular.module('myApp', ['ngResource']);

myApp.directive('markdown', function() {
    var converter = new Showdown.converter();
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var htmlText = converter.makeHtml(element.text());
            element.html(htmlText);
        }
    }
});

myApp.factory('Mongo', function($resource) {
        return $resource('/object/:collection/:id.json');
    }
);

//myApp.config(function($routeProvider) {
//    $routeProvider.
//        when('/object/:collection/:id.html', {controller:ObjCtrl})
//});

function ObjCtrl($scope, $attrs, $routeParams, Mongo) {
    $scope.data = Mongo.get({collection:$attrs.collection, id:$attrs.objid});
    $scope.remove = function(array, element) {
        array.splice(array.indexOf(element), 1);
        $scope.form_data.$dirty=true;
    }
}