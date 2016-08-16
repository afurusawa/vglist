'use strict';

var submissionApp = angular.module('submissionApp', []);

submissionApp.controller('submissionController', ['$scope', '$http', '$log', function($scope, $http, $log) {
    $scope.name = 'johnny';
    $log.log("hello there");
}]);