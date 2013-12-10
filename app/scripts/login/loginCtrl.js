angular.module('rxPipelineApp')
    .controller('LoginCtrl', function ($scope, $location, Auth) {
        $scope.login = function () {
            Auth.login($scope.user, function() {
                $location.path('/');
            }, function () {
                alert('Failed!');
            });
        };
    });