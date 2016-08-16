var submissionApp = angular.module('submissionApp', ['ngSubmit', 'ngMessages']);

submissionApp.controller('submissionController', function($scope, $http, $log) {
    $scope.name = 'johnny';
    $log.log("hello there");
});