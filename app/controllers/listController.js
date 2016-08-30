'use strict';

angular.module('app')

.controller('listController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $log.log("list controller active");

    var myGames = new Array();

    $http.get("/allGames").then(function(res) {
        $scope.list = res.data; //array
    });

    $http.get("/allUsers").then(function(res) {
       $scope.userlist = res.data;
    });

    // defaults
    $scope.button = "add to list";


    // ng-click function to add a game to user's game list
    $scope.addToList = function(id, name) {
        console.log("clicked add button w/ id: " + id.toString());

        var postData = {
            gameId      : id,
            gameName    : name
        };

        // remember when doing a post, the data needs to be in JSON format i.e. {id : id}
        $http.post('/addToGameList', postData).then(function(res) {
            console.log("res: " + JSON.stringify(res, null, 4));
            // if added successfully, disable 'add to list button'
        });
    };

}]);