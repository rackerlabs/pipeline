angular.module('rxPipelineApp')
	.controller('PipelineCreateCtrl', function ($scope, $location, Pipeline) {
		$scope.create = function () {
			Pipeline.save($scope.pipeline,
				function (data) {
					console.log(data);
					$location.path('/pipelines');
				},
				function (error) {
					console.log(error);
				});
		};
	});