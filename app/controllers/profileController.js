'use strict';

angular.module('app')

.controller('profileController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $log.log("profile controller active");

    $http.get("/games/").then(function(res) {
        $scope.list = res.data; //array
    });

}]);