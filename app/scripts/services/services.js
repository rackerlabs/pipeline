'use strict';

angular.module('pipelineServices', ['ngResource']).
    factory('Server', function ($http) {
        var BASE_URL = '/api/:action';

        var _url = function (params, query) {
            var p, ret_str = BASE_URL;
            
            for (p in params) {
                ret_str = ret_str.replace(":" + p, params[p]);
            }
            
            if (query) {
                if (typeof query != "string") {
                    for (var i in query) {
                        if (typeof query[i] == "object") {
                            query[i] = query[i].join(",");
                        }
                    }
                }
            }
            return ret_str + (query ? "?" + $.param(query) : "");
        };
        
        var _res = function(method, isArray, params) {
            return function(query) {
                if (["POST", "PUT"].indexOf(method.toUpperCase()) >= 0) {
                    return $http({method: method, url: _url(params), data: query});
                } else {
                    return $http({method: method, url: _url(params, query)});
                }
            };
        };

        return {
            steps: _res("GET", true, { action: 'stepData.json'}),
            pipelines: _res('GET', true, { action: 'pipeline'}),
            builds: _res('GET', true, {action: 'build'}),
            git: _res('GET', true, { action: 'gitData.json'}),
            auth: _res('POST', true, {action: 'auth'})
        };
	}).
    factory('Socket', function (socket) {
        return {
            on: socket.on,
            emit: socket.emit,
            startBuild: function (build_id) {
                this.emit("builds:startBuild", {"id": build_id});
            }
        };
    }).
    factory('Git', function(Server) {
        return {
            pipelineData: [],
            lastUpdated: undefined,
            getGitData: function() {
                var gitScope = this;
                
                if (this.lastUpdated && ((new Date()).getSeconds() - this.lastUpdated.getSeconds() < 15000)) {
                    return this.pipelineData;
                }
                
                
                Server.git().success(function (data) {
                    gitScope.pipelineData = data;
                    gitScope.lastUpdated = new Date();
                }).error(function (response) {
                });
                
                return this.pipelineData;
            },
            getRepo: function(repo_name) {
                return _.find(this.getGitData(), {"repo": repo_name});
            },
            getRepoType: function(repo_name) {
                var r = this.getRepo(repo_name);
                
                if (r) {
                    return r.type;
                }
            },
            getRepoURL: function(repo_name) {
                var r = this.getRepo(repo_name);
                
                if (r) {
                    return r.url;
                }
            },
            getBranchURL: function(repo_name, branch_name) {
                var r = this.getRepoURL(repo_name);
                
                if (r) {
                    return r + ((r.substr(-1) != "/") ? "/" : "") + "tree/" + branch_name;
                }
            },
            getRepoName: function(repo_name) {
                var b = _.find(this.getGitData(), {"type": repo_name});
                
                if (b) {
                    return b.name;
                }
            }
        };
    }).
    factory('Pipelines', function (PipelineSteps, Steps, Server) {
        return {
            pipelineData: [],
            lastUpdated: undefined,
            getPipelines: function() {
                var pipelineScope = this;
                
                if (this.lastUpdated && ((new Date()).getSeconds() - this.lastUpdated.getSeconds() < 15000)) {
                    return this.pipelineData;
                }
                
                var procPipes = this.processPipelineData;
                
                Server.pipelines().success(function (data) {
                    pipelineScope.pipelineData = procPipes(data);
                    pipelineScope.lastUpdated = new Date();
                }).error(function (response) {
                });
                
                return this.pipelineData;
            },
            processPipelineData: function ( data ) {
                _.forEach(data, function (v, i, c) {
                    v.steps = this.parseSteps(v.steps, v.id);
                }, PipelineSteps);
                
                return data;
            },
            getPipeline: function(pipeline_id) {
                return _.find(this.getPipelines(), {"id": pipeline_id});
            }
        };
    }).
    factory("Steps", function (Server) {
        return {
            stepData: [],
            lastUpdated: undefined,
            getGlobalSteps: function() {
                return _.filter(this.getSteps(), {"global": true});
            },
            getLocalSteps: function() {
                return _.filter(this.getSteps(), {"global": false});
            },
            getSteps: function() {
                var stepScope = this;
                
                if (this.lastUpdated && ((new Date()).getSeconds() - this.lastUpdated.getSeconds() < 15000)) {
                    return this.stepData;
                }
                
                Server.steps().success(function (data) {
                    stepScope.stepData = data;
                    stepScope.lastUpdated = new Date();
                }).error(function (response) {
                });

                return this.stepData;
            }
        };
    }).
    factory("PipelineSteps", function(Steps, Socket) {
        return {
            lastUpdated: undefined,
            getSteps: function(pipeline_id) {
                var ret_data = [];
                ret_data = Steps.getSteps();
                
                _.forEach(ret_data, function(v, i, c) {
                    c[i].pipeline_id = this;
                }, pipeline_id);
                
                return ret_data;
            },
            getStep: function(pipeline_id, step_id) {
                return _.find(this.getSteps(pipeline_id), {"id": step_id});
            },
            parseSteps: function ( steps, pipeline_id ) {
                _.forEach(steps, function(v, i, c) {
                    _.extend(v, this);
                }, this);
                
                return steps;
            },
            getConsoleData: function () {
                return {'data': 'Console data placeholder', 'stillRunning': true}
            },
            hookConsoleOutput: function (scope) {
                console.log("Hooking: " + scope)
                Socket.on('builds:update', function( data ) {
                    console.log('client socket on');
                    console.log("> " + data);
                    scope.consoleData += data;
                });
            }
        };
    });