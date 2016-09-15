'use strict';

angular.module('app')

.controller('gameController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $log.log("game controller active");

    $scope.userData = "";
    $scope.gameState = {
        added : false,
        addText : "add to list",
        completed : false,
        completeText : "complete",
        playingNow : false,
        playingNowText : "currently playing",
        initRan : false
    };



    $scope.$watchGroup(['init', 'rating', 'hoursPlayed'], function(newVal, oldVal) {
        console.log(JSON.stringify(newVal[1]) + " " + JSON.stringify(oldVal[1]) + ", " + JSON.stringify(newVal[2]) + " " + JSON.stringify(oldVal[2]));
console.log(JSON.stringify(newVal[0]) + " " + JSON.stringify(oldVal[0]));

        // if 'rating' changed by the user, update it in db
        if((newVal[1] != oldVal[1]) && (typeof oldVal[1] != "undefined")) {
            console.log("updating rating..." + $scope.rating);
            var postData = {
                gameId : $scope.init.gameId,
                rating : $scope.rating
            };
            $http.post('/updateGameRating', postData).then(function(res) {
                console.log("updated rating");
            });
        }

        // Watch for hoursPlayed change (other than 0 or on-load)
        // TODO: what if hours played was changed from X to 0? wrap w/ OR
        if((newVal[2] != oldVal[2]) && (typeof oldVal[2] != "undefined")) {
            console.log("updating hours played..." + $scope.hoursPlayed);

            var postData = {
                gameId : $scope.init.gameId,
                hoursPlayed : $scope.hoursPlayed
            };
            $http.post('/updateHoursPlayed', postData).then(function(res) {
               console.log('updated hours played');
            });
        }

        // get info about the game and check if it has a rating/is added the user's list
        // apparently I can't run an http.get initially and instead have to do it here because there's an issue with the ng-init values not being set when http.get is run.
        if(newVal[0].userId && !$scope.gameState.initRan) {

            // Check if user is logged in, because if not, I don't have to load anything
            console.log("KASDHKAJS " + typeof $scope.init.userId);
            if (parseInt($scope.init.userId)) {


                $http.get('/' + $scope.init.userId + '/' + $scope.init.gameId).then(function (res) {
                    console.log('getting user info about the game');

                    $scope.userData = res.data;
                    var game = res.data;

                    // if something was returned, that means its already been added
                    if (game) {
                        $scope.gameState.added = true;
                        $scope.gameState.addText = "added";
                    }

                    // if rating exists, show it
                    if (game.rating) {
                        $scope.rating = game.rating;
                        $scope.rateButton.visible = false;
                    }
                    else {
                        $scope.rating = 0;
                    }

                    // update hoursPlayed
                    if (game.hoursPlayed) {
                        $scope.hoursPlayed = game.hoursPlayed;
                    }
                    else {
                        $scope.hoursPlayed = 0;
                    }


                    // completed
                    if (game.completed) {
                        $scope.gameState.completed = true;
                        $scope.gameState.completeText = "completed";
                    }

                    // playing now
                    $scope.gameState.playingNow = game.playingNow;

                    $scope.gameState.initRan = true;  //set flag so it doesn't run again.
                }).catch(function (response) {
                    console.error('error', response.status, response.data);
                });
            }//end if not 0
        }
    });

    // rating init/func.
    $scope.rateButton = { visible : true };
    $scope.rateGame = function() {
        $scope.rateButton.visible = !$scope.rateButton.visible;
    };


    // TODO: need to add user rating to game
    // ng-click function to add a game to user's game list
    $scope.addToList = function(id, name) {
        console.log("clicked add button w/ id: " + id.toString());

        var postData = {
            gameId      : id,
            gameName    : name
        };

        // remember when doing a post, the data needs to be in JSON format i.e. {id : id}
        $http.post('/addToGameList', postData).then(function(res) {
            //console.log("res: " + JSON.stringify(res, null, 4));
            // if added successfully, disable 'add to list button'

            $scope.gameState.added = true;
            $scope.gameState.addText = "added";
            //$scope.init.gameId = id.toString();

            $scope.rating = 0;
            $scope.hoursPlayed = 0;

            $scope.gameState.initRan = true;
        });
    };

    $scope.removeFromList = function(id) {
        var postData = {
            gameId : id
        };

        $http.post('/removeFromGameList', postData).then(function(res) {
            console.log("removing game from list");
            $scope.gameState.added = false;
            $scope.rating = 0;
            $scope.hoursPlayed = 0;

            $scope.gameState.initRan = false;
        }).catch(function(err) {
            console.log("what the fuck happened");
        });
    };



    $scope.toggleCompleted = function(id, complete) {

        // if complete=false, we need to set it to true in the DB and UI
        console.log("clicked button w/ id: " + id.toString());

        var postData = {
            gameId      : id,
            completed    : !complete
        };
        $http.post('/toggleCompleted', postData).then(function(res) {
            console.log("res: " + JSON.stringify(res, null, 4));
            // if added successfully, disable 'add to list button'

            if (!complete) {
                $scope.gameState.completed = true;
                $scope.gameState.completeText = "completed";
            }
            else {
                $scope.gameState.completed = false;
                $scope.gameState.completeText = "complete";
            }

        });
    };

    $scope.toggleNowPlaying = function(id, playingNow) {
        var postData = {
            gameId      : id,
            playingNow  : !playingNow
        };
        $http.post('/toggleNowPlaying', postData).then(function(res) {
            $scope.gameState.playingNow = !playingNow;
        });
    };


}]);