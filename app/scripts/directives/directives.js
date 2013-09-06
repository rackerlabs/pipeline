angular.module("pipelineDirectives", []).

directive("rxNavBar", function (Auth, $location){
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/directives/nav-bar.html",
        controller: function ($scope) {
            $scope.Auth = Auth;
            $scope.loc = $location;
        },
        link: function (scope, element, attrs) {
        }
    };
}).
directive('rxPipeline', function (Auth) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "/directives/pipeline.html",
        scope: {
            pipeline: '=',
            step: '='
        },
		link: function(scope, element, attrs) {
		}
    };
}).
directive("rxPipelineStep", function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "/directives/pipelineStep.html",
        scope: {
            'pipeline': '=',
            'step': '='
        },
        link: function (scope, element, attrs) {
            var localOnly = attrs["localOnly"];
            
            scope.showStep = (((localOnly == "true") && (scope.step.global == false))||(localOnly != "true")) ? true : false;
        }
    };
}).
directive("rxPipelineList", function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "/directives/pipelineList.html",
        scope: {
            "pipelines": "=",
            "steps": "=",
            "auth": "="
        },
        link: function (scope, element, attrs) {
            scope.pipelineData = scope.pipelines.getPipelines();
            
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
directive("rxPipelineStepControls", function($compile, Socket) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/directives/pipelineStepControls.html",
        scope: {
            pipelineStep: "="
        },
        link: function (scope, element, attrs) {
            scope.Socket = Socket;
            scope.modalState = true;
            
        }
    };
}).
directive("rxConsoleOutput", function (Socket) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/directives/consoleOutput.html',
        scope: {
            build: '=',
            closeConsole: '&',
            modalState: '='
        },
        link: function (scope, element, attrs) {
            var consoleInfo = {'data': 'Console data placeholder', 'stillRunning': true}
            
            scope.consoleOutput = scope.modalState;
            
            scope.closeConsole = function () {
                scope.consoleOutput = false;
                $("#console-output").remove();
            };
            
            // Pre-Fill the console output with what's already run
            scope.consoleData = consoleInfo.data;
            
            if (consoleInfo.stillRunning) {
                // We're going to hook the consoleData variable into the socket output
                console.log("Hooking: " + scope)
                Socket.on('builds:update', function( data ) {
                    console.log('client socket on');
                    console.log("> " + data);
                    scope.consoleData += data;
                });
            }
        }
    };
}).

directive("rxGlobalStep", function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/directives/globalStep.html",
        scope: {
            'step': '=',
            'currentTab': '='
        },
        link: function (scope, element, attrs) {
        }
   };
}).
directive("rxBuildConfiguration", function($compile) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/directives/buildConfiguration.html",
        scope: {
            'builds': '=',
            'buildId': '=',
            'view': '='
        },
        link: function (scope, element, attrs) {
            scope.builds.updateBuilds();
            scope.build = scope.builds.getBuild(scope.buildId);
            if (!scope.build) {
                scope.build = {};
            }
            scope.addCommand = function (build) {
                if (!build.hasOwnProperty("commands")) {
                    build.commands = [];
                }
                build.commands.push({command: "", stopBuildOnFailure: false});
            }

            scope.removeCommand = function (build, i) {
                if (i < build.commands.length) {
                    build.commands.splice(i, 1);
                }
            }

            scope.displayConsole = function () {
                scope.modalState = true;

                scope.modalOpts = {
                    backdrop: true,
                    keyboard: true,
                    show: true
                };
                
                var d = document.createElement("rx-console-output");
                d.setAttribute("build", "build");
                d.setAttribute("options", "modalOpts");
                d.setAttribute("close-console", "closeConsole()");
                d.setAttribute("modal-state", "modalState");
                
                d = $compile(d)(scope);
                
                element.parent().append(d);
            };
        }
   };
}).
directive("rxBuildSelector", function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/directives/buildSelector.html",
        scope: {
            'builds': '=',
            'stepModel': '=',
            'selectorId': '='
        },
        link: function (scope, element, attrs) {
            scope.builds.updateBuilds();
        }
    };
}).
directive("rxPipelineConfiguration", function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "/directives/pipelineConfiguration.html",
        scope: {
            'pipelines': '=',
            'pipelineId': '=',
            'builds': '=',
            'view': '='
        },
        link: function (scope, element, attrs) {
            scope.pipelines.updatePipelines();
            scope.pipeline = scope.pipelines.getPipeline(scope.pipelineId);

            if (!scope.pipeline) {
                scope.pipeline = {};
            }

            scope.addBranch = function (pipeline) {
                if (!pipeline.hasOwnProperty("branches")) {
                    pipeline.branches = [];
                }
                pipeline.branches.push({type: "", name: "", repoUrl: ""});
            }

            scope.removePipeline = function (pipeline, i) {
                if (i < pipeline.branches.length) {
                    pipeline.branches.splice(i, 1);
                }
            }

            scope.addStep = function (pipeline) {
                if (!pipeline.hasOwnProperty("steps")) {
                    pipeline.steps = [];
                }
                pipeline.steps.push({buildId: "none"});
            }

            scope.removeStep = function (pipeline, i) {
                if (i < pipeline.steps.length) {
                    pipeline.steps.splice(i, 1);
                }
            }
        }
   };
});
