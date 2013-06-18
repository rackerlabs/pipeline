angular.module("pipelineDirectives", []).

directive('rxPipeline', function (Pipelines) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "directives/pipeline.html",
		link: function(scope, element, attrs) {
            console.log(attrs["pipelineId"]);
            scope.pipeline = Pipelines.getPipeline(attrs["pipelineId"]);
		}
    };
}).
directive("rxPipelineStep", function (Pipelines, PipelineSteps) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "directives/pipelineStep.html",
        link: function (scope, element, attrs) {
            
        }
    };
}).
directive("rxPipelineList", function (Pipelines) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "directives/pipelineList.html",
        link: function (scope, element, attrs) {
            scope.Pipelines = Pipelines;
            scope.pipelineData = Pipelines.getPipelines();
        }
    };
}).
directive("rxPipelineStepControls", function(PipelineSteps) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "directives/pipelineStepControls.html",
        link: function (scope, element, attrs) {
            scope.pipelineStep = PipelineSteps.getStep(attrs["pipelineId"], attrs["stepId"]);
            
            console.log(scope.pipelineStep);
        }
    };
});