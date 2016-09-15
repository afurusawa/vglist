'use strict';

angular.module('app')

.controller('headerController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    // LOGIN
    $scope.login = {
        state : false
    };

    $scope.toggle = function() {
        $scope.login.state = !$scope.login.state;
    };

    $scope.list = [];


    // Retrieve all your gamelist data. Will be used in updateDisplay()
    var myGames;
    $http.get("/myGames").then(function(res) {
        myGames = res.data[0];
    });

    // SEARCH
    // init (I need this because when I do '$scope.search.length' it'll give me error saying I can't get length of undefined)
    $scope.search = "";

    // WATCH
    $scope.$watch('search', function() {
        //console.log("execute query to show search results");

        if($scope.search.length >= 3) {
            // remember when doing a post, the data needs to be in JSON format i.e. {id : id}
            $http.get('/search/' + $scope.search).then(function(res) {
                //console.log("res: " + JSON.stringify(res, null, 4));
                // if added successfully, disable 'add to list button'
                $scope.results = res.data;

                updateDisplay(res.data, myGames);
            });
        }

    });


    // TODO: need to do this eventually.
    // check search results to see if game has been added already
    function updateDisplay(searchlist, myGames) {

        for (var i = 0; i < searchlist.length; i++) {

            // for each result, check if the user has it in their list
            console.log("GET: " + myGames.userId + "/" + JSON.stringify(searchlist[i]));
            $http.get('/' + myGames.userId + '/' + searchlist[i]._id).then(function(res) {

                console.log('match found!');

                var gameState = {
                    game : res.data[0],
                    matches : true
                };

                $scope.list.push(gameState);
            }).catch(function(response) {
                //console.error('error', response.status, response.data);
            });

        }


    }

}]);
