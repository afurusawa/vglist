'use strict';

var listApp = angular.module('listApp', []);

listApp.controller('listController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $log.log("list controller active");

    $http.get("/browse-games").then(function(res) {
        $scope.list = res.data;
    })
}]);