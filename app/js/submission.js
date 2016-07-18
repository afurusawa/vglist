var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
    $scope.myTxt = "You have not yet clicked submit";
    $scope.myFunc = function () {
        $scope.myTxt = "You clicked submit!";
    }
});