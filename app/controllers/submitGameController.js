'use strict';

angular.module('app')

.controller('submitGameController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    $scope.platformData = [];

    $scope.consoles = [
        {
            name            : "Playstation 4",
            manufacturer    : "Sony",
            state           : false
        },
        {
            name            : "Xbox One",
            manufacturer    : "Microsoft",
            state           : false
        },
        {
            name            : "Wii U",
            manufacturer    : "Nintendo",
            state           : false
        },
        {
            name            : "PlayStation 3",
            manufacturer    : "Sony",
            state           : false
        },
        {
            name            : "Wii",
            manufacturer    : "Nintendo",
            state           : false
        },
        {
            name            : "Xbox 360",
            manufacturer    : "Microsoft",
            state           : false
        },
        {
            name            : "Xbox",
            manufacturer    : "Microsoft",
            state           : false
        },
        {
            name            : "GameCube",
            manufacturer    : "Nintendo",
            state           : false
        },
        {
            name            : "PlayStation 2",
            manufacturer    : "Sony",
            state           : false
        },
        {
            name            : "Dreamcast",
            manufacturer    : "Sega",
            state           : false
        },
        {
            name            : "Nintendo 64",
            manufacturer    : "Nintendo",
            state           : false
        },
        {
            name            : "PlayStation",
            manufacturer    : "Sony",
            state           : false
        }
    ];

    $scope.handhelds = [
        {
            name            : "PlayStation Vita",
            manufacturer    : "Sony",
            state           : false
        },
        {
            name            : "Nintendo 3DS",
            manufacturer    : "Nintendo",
            state           : false
        },
        {
            name            : "PlayStation Portable",
            manufacturer    : "Sony",
            state           : false
        },
        {
            name            : "Nintendo DS",
            manufacturer    : "Nintendo",
            state           : false
        },
        {
            name            : "Game Boy Advance",
            manufacturer    : "Nintendo",
            state           : false
        },
        {
            name            : "Game Boy Color",
            manufacturer    : "Nintendo",
            state           : false
        }
    ];

    $scope.checkmyshit = function() {

        console.log($scope.platformData);
    };

    $scope.toggle = function() {
        this.unit.state = !this.unit.state;

        var platformList = [];
        for (var i = 0; i < $scope.consoles.length; i++) {
            if ($scope.consoles[i].state) {
                platformList.push($scope.consoles[i].name);
            }
        }
        $scope.platformData = platformList;
    };

    // ng-click function to add a game to user's game list
    $scope.submitGame = function(id, name, index) {
        console.log("clicked add button w/ id: " + id.toString());

        var postData = {
            gameId      : id,
            gameName    : name
        };

        // remember when doing a post, the data needs to be in JSON format i.e. {id : id}
        $http.post('/addGame', postData).then(function(res) {
            console.log("res: " + JSON.stringify(res, null, 4));
            // if added successfully, disable 'add to list button'
        });
    };

}]);