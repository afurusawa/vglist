'use strict';

var userSessionApp = angular.module('userSessionApp', []);

userSessionApp.controller('userSessionController', ['$scope', '$http', '$log', function($scope, $http, $log) {



}]);

userSessionApp.controller('searchBarController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    // init
    $scope.search = "";

    $scope.$watch('search', function() {
        console.log("execute query to show search results");

        if($scope.search.length >= 3) {
            // remember when doing a post, the data needs to be in JSON format i.e. {id : id}
            $http.get('/search/' + $scope.search).then(function(res) {
                console.log("res: " + JSON.stringify(res, null, 4));
                // if added successfully, disable 'add to list button'
                $scope.results = res.data;
            });
        }

    })

}]);
