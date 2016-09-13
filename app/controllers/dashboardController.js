'use strict';

angular.module('app')

.controller('dashboardController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $log.log("dashboard controller active");

    // After getting gamelist, load currently playing and completed
    $http.get("/myGames").then(function(res) {

        $scope.allData = {
            gameList : [],
            currentlyPlaying : [],
            completed : [],
            statistics : {
                games : 0,
                completed : 0,
                hours : 0,
                averageRating : 0
            }
        };

        console.log(res.data[0]);

        // all
        $scope.allData.gameList = res.data[0].gameList;

        for (var i = 0; i < res.data[0].gameList.length; i++) {

            var game = res.data[0].gameList[i];

            // currently playing
            if (res.data[0].gameList[i].playingNow) {
                $scope.allData.currentlyPlaying.push(res.data[0].gameList[i]);
            }

            // completed
            if (res.data[0].gameList[i].completed) {
                $scope.allData.completed.push(res.data[0].gameList[i]);
            }

            // statistics
            // hours spent
            $scope.allData.statistics.hours += game.hoursPlayed;


        }

        $scope.allData.statistics.games = res.data[0].gameList.length;
    });

}]);