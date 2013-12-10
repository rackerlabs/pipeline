angular.module('rxPipelineApp')
    .directive('rxNavBar', function ($location){
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/directives/rx-nav-bar.html',
            controller: function ($scope, Auth) {
                Auth.loggedIn(); //will redirect user to login page if not logged in

                $scope.logout = function () {
                    Auth.logout( function () {
                        $location.path('/');
                    });
                };
            }
        };
    });