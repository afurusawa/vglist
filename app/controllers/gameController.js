'use strict';

angular.module('app')

.controller('gameController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $log.log("game controller active");

    $scope.userData = "";
    $scope.rating = 0;

    var initRan = false;

    $scope.$watchGroup(['init', 'rating'], function(newVal, oldVal) {
        //console.log(JSON.stringify(newVal[0]) + " " + JSON.stringify(oldVal[0]));
        // if rating is something other than 0
        if (newVal[1] > 0) {
            console.log("updating rating..." + $scope.rating);
            var postData = {
                gameId : $scope.init.gameId,
                rating : $scope.rating
            };
            $http.post('/updateGameRating', postData).then(function(res) {
                console.log("updated rating");
            });
        }

        if (newVal[0] && !initRan) {
            $http.get('/' + $scope.init.userId + '/' + $scope.init.gameId).then(function(res) {
                console.log('getting user info about the game');
                initRan = true; //set flag so it doesn't run again.
                $scope.userData = res.data;
                var game = res.data.gameList[0];
                $scope.rating = game.rating;
                if($scope.rating > 0) {
                    $scope.rateButton.visible = false;
                }

            });
        }

    });

    // rating init/func.
    $scope.rateButton = { visible : true };
    $scope.rateGame = function() {
        $scope.rateButton.visible = !$scope.rateButton.visible;
    };

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