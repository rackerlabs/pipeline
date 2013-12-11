angular.module('rxPipelineApp')
    .controller('HomeCtrl', function ($scope, Pipeline) {
        $scope.pipelines = Pipeline.list();
    });