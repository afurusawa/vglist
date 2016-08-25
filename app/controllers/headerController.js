'use strict';

angular.module('app')
.controller('listController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $scope.login = {
        state : false
    };

    $scope.toggle = function() {
        $scope.login.state = !$scope.login.state;
    };
}]);