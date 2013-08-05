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
            git: _res('GET', true, { action: 'gitData.json'})
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
    factory('Auth', function() {
        return {
            AUTH_REQUIRED: true,
            username: undefined,
            name: undefined,
            email: undefined,
            coreid: undefined,
            auth_token: undefined,
            auth_cache_date: undefined,
            signIn: function() {
                if (!this.isLoggedIn()) {
                    if ($("#auth_signin_form").modal) {
                        $("#auth_signin_form").modal("show");
                        $("#auth_signin_form #auth_user").focus();
                    }
                }
            },
            signOut: function() {
                TQSettings.destroySessionData("TQAuth");
                delete $http.defaults.headers.common["RX-AUTH-TOKEN"];
                this.username = undefined;
                this.coreid = undefined;
                this.email = undefined;
                this.name = undefined;
                this.auth_token = undefined;

                if (this.AUTH_REQUIRED) {
                    location.reload(true);
                }
            },
            getAuthObject: function() {
                if (!this.auth_cache_date||(((new Date()).getTime() - this.auth_cache_date.getTime()) / 1000 > 10)) {
                    var stored_auth = TQSettings.fetchSessionData("TQAuth");

                    if (stored_auth) {
                        this.username = stored_auth.username;
                        this.email = stored_auth.email;
                        this.coreid = stored_auth.coreid;
                        this.name = stored_auth.name;
                        this.auth_token = stored_auth.auth_token;
                        this.auth_cache_date = new Date();

                        $http.defaults.headers.common["RX-AUTH-TOKEN"] = this.auth_token;
                    }
                    else {
                        this.username = undefined;
                        this.coreid = undefined;
                        this.email = undefined;
                        this.name = undefined;
                        this.auth_token = undefined;
                        this.auth_cache_date = undefined;

                        if ($http.defaults.headers.common.hasOwnProperty("RX-AUTH-TOKEN")) {
                            location.reload(true);
                        }
                        //delete $http.defaults.headers.common["RX-AUTH-TOKEN"];
                    }
                }

                return {"username": this.username, "name": this.name, "auth_token": this.auth_token, "email": this.email, "coreid": this.coreid };
            },
            getAuthHeader: function() {
                if (this.isLoggedIn()) {
                    return {'RX-AUTH-TOKEN': this.getAuthObject().auth_token};
                }

                return {};
            },
            registerAuthObject: function(obj) {
                this.username = obj["RX-RACKER-SSO"]
                this.auth_token = obj["RX-AUTH-TOKEN"];
                this.email = obj["RX-RACKER-EMAIL"];
                this.coreid = obj["RX-RACKER-CORE-ID"];
                if (obj["RX-RACKER-FULL-NAME"]) {
                    this.name = obj["RX-RACKER-FULL-NAME"];
                }

                $http.defaults.headers.common["RX-AUTH-TOKEN"] = this.auth_token;

                TQSettings.storeSessionData("TQAuth", {username: this.username, name: this.name, auth_token: this.auth_token, email: this.email, coreid: this.coreid});
                
                EventManager.fire("initiate-refresh-timer");
            },
            finishAuthScope: function(scope) {
                return function(resultData, resultStatus, resultHeaders, resultConfig) {
                    scope.finishAuth(resultData, resultStatus, resultHeaders, resultConfig);
                };
            },
            finishAuth: function(resultData, resultStatus, resultHeaders, resultConfig) {
                this.authError = undefined;
                this.registerAuthObject(resultData)

                $("#auth_signin_form form")[0].reset();

                location.reload(true);

                $("#auth_signin_form").modal("hide");
            },
            failAuthScope: function(scope) {
                return function(resultData, resultStatus, resultHeaders, resultConfig) {
                    scope.failAuth(resultData, resultStatus, resultHeaders, resultConfig);
                };
            },
            fetchLockoutMessage: function(timeRemaining) {
                if (timeRemaining > 0) {
                    return "This workstation has been locked out due to excessive login attempts...\nThere are " + timeRemaining + " seconds remaining...";
                }
                else {
                    return undefined;
                }
            },
            failAuth: function(resultData, resultStatus, resultHeaders, resultConfig) {
                this.authError = {};
                
                function reEnableForm() {
                    var frm = $("#auth_signin_form form");
                    var u_field = frm.find("#auth_user");
                    var p_field = frm.find("#auth_pass");
                    var btn = frm.find("button[type='submit']");

                    btn.prop("disabled", false);
                    u_field.prop("disabled", false);
                    p_field.prop("disabled", false);
                    btn.text(btn.attr("data-original-value"));
                    btn.removeAttr("data-original-value");
                }

                switch(parseInt(resultStatus, 10)) {
                    case 404: 
                        this.authError.message = "404: Unable to locate the authentication service!";
                    break;
                    case 401:
                    case 403:
                        this.authError.message = "Invalid Login!";
                    break;
                    case 430:
                        this.lockoutTimeRemaining = 60;
                        
                        $("#auth_signin_form form").find("button[type='submit']").text("Locked Out");

                        if (resultData) {
                            if (resultData.lockoutTimeRemaining) {
                                this.lockoutTimeRemaining = resultData.lockoutTimeRemaining;
                            }
                        }
                        
                        var sc = this;
                        var em = EventManager;

                        var lockoutTimer = function() {
                            if (sc.lockoutTimeRemaining > 0) {
                                var errorMessage = sc.fetchLockoutMessage(sc.lockoutTimeRemaining--);
                                if (errorMessage !== undefined) {
                                    sc.authError.message = errorMessage;
                                }
                                else {
                                    sc.authError = undefined;
                                }
                                
                                $timeout(lockoutTimer, 1000);
                            } else {
                                reEnableForm();
                                sc.authError = undefined;
                            }
                        };
                        
                        lockoutTimer();
                    break;
                    default:
                        this.authError.message = "There was a Server Error!";

                }

                if (parseInt(resultStatus) != 430) {
                    reEnableForm();
                }
            },
            submitAuth: function() {
                var frm = $("#auth_signin_form form");
                var u_field = frm.find("#auth_user");
                var p_field = frm.find("#auth_pass");
                var username = frm.find("#auth_user").val();
                var password = frm.find("#auth_pass").val();
                var btn = frm.find("button[type='submit']");

                this.authError = undefined;

                if ((username.length == 0)||(password.length == 0)) {
                    this.authError = {"message": "Username or Password Cannot Be Blank!"};
                }
                else {
                    btn.prop("disabled", true);
                    u_field.prop("disabled", true);
                    p_field.prop("disabled", true);
                    btn.attr("data-original-value", btn.text());
                    btn.text(btn.attr("data-loading-text"));

                    Ticket.auth($.param({username: username, password: password} ))
                        .success(this.finishAuthScope(this))
                        .error(this.failAuthScope(this) );
                }
            },
            userFullName: function() {
                return (this.name) ? this.name : this.username;
            },
            isLoggedIn: function() {
                return (this.getAuthObject().auth_token !== undefined);
            },
            needToLogin: function() {
                return (this.AUTH_REQUIRED&&(!this.isLoggedIn()));
            }
        }
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