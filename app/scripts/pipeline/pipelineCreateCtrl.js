angular.module('rxPipelineApp')
	.controller('PipelineCreateCtrl', function ($scope, $location, Pipeline, Task) {
		$scope.save = function () {
			var pipe = new Pipeline($scope.pipeline);
			pipe.$save();

			//TODO add flash message creation was successful
			$location.path('/home');
		};

		$scope.tasks = Task.list();
	});