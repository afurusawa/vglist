'use strict';

var gameApp = angular.module('gameApp', []);

gameApp.controller('gameController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $log.log("game controller active");

}]);