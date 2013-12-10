angular.module('rxPipelineApp')
    .controller('LoginCtrl', function ($scope, $location) {
        $scope.login = function () {
            alert('Logging in');
            console.log($location);
        };
    });