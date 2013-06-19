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
            var localOnly = attrs["localOnly"];
            
            scope.showStep = (((localOnly == "true") && (scope.step.global == false))||(localOnly != "true")) ? true : false;
            console.log(scope.step);
        }
    };
}).
directive("rxPipelineList", function (Pipelines, Steps) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "directives/pipelineList.html",
        link: function (scope, element, attrs) {
            scope.Pipelines = Pipelines;
            scope.pipelineData = Pipelines.getPipelines();
            scope.Steps = Steps;
            
            scope.getCurrentTab = function() {
                return scope.currentTab;
            }
            scope.setTab = function(tab) {
                scope.currentTab = tab;
            }
            scope.setTab("pipelines");
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
}).
directive("rxGlobalStep", function(Steps) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "directives/globalStep.html",
        link: function (scope, element, attrs) {
        }
   };
});