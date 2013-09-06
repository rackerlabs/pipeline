angular.module("pipelineAuth", []).

factory('Auth', function($location, $http, $cookies, Server) {
    return {
        AUTH_REQUIRED: true,
        username: undefined,
        name: undefined,
        auth_id: undefined,
        loggedIn: false,
        auth_cache_date: undefined,
        signIn: function () {
            if (!this.isLoggedIn()) {
                $location.path("/login");
            }
        },
        signOut: function() {
            $cookies.PipelineAuth = undefined;
            delete $http.defaults.headers.common["PIPELINE-AUTH-ID"];
            this.username = undefined;
            this.auth_id = undefined;
            this.loggedIn = false;

            if (this.AUTH_REQUIRED) {
                location.reload(true);
            }
        },
        getAuthObject: function() {
            if (!this.auth_cache_date||(((new Date()).getTime() - this.auth_cache_date.getTime()) / 1000 > 10)) {
                var stored_auth = $cookies.PipelineAuth;

                if (stored_auth) {
                    this.username = stored_auth.username;
                    this.auth_id = stored_auth.auth_id;
                    this.loggedIn = true;

                    $http.defaults.headers.common["PIPELINE-AUTH-ID"] = this.auth_token;
                }
                else {
                    this.username = undefined;
                    this.auth_id = undefined;
                    this.loggedIn = false;

                    if ($http.defaults.headers.common.hasOwnProperty("PIPELINE-AUTH-ID")) {
                        $location.path("/");
                    }
                }
            }

            return {"username": this.username, "auth_id": this.auth_id, "loggedIn": this.loggedIn };
        },
        getAuthHeader: function() {
            if (this.isLoggedIn()) {
                return {'auth_id': this.getAuthObject().auth_id};
            }

            return {};
        },
        registerAuthObject: function(obj) {
            this.username = obj.username;
            this.auth_id = (obj.hasOwnProperty("auth_id")) ? obj.auth_id : obj._id;
            this.loggedIn = obj.loggedIn;

            $http.defaults.headers.common["PIPELINE-AUTH-ID"] = this.auth_id;

            $cookies.PipelineAuth = {username: this.username, auth_id: this.auth_id};
        },
        finishAuth: function(resultData, resultStatus, resultHeaders, resultConfig) {
            this.authError = undefined;
            this.registerAuthObject(resultData)

            console.log(this);
            console.log($cookies.PipelineAuth);
            $location.path("/");
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
                var frm = $("form.login-form");
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
            var frm = $("form.login-form");
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

                Server.auth({username: username, password: password})
                    .success(this.finishAuth.bind(this))
                    .error(this.failAuth.bind(this) );
            }
        },
        userFullName: function() {
            return (this.name) ? this.name : this.username;
        },
        isLoggedIn: function() {
            return (this.getAuthObject().auth_id !== undefined);
        },
        needToLogin: function() {
            return (this.AUTH_REQUIRED&&(!this.isLoggedIn()));
        }
    }
}).
directive("rxAuth", function(Auth) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/authSignIn.html',
        scope: {
            "auth": "=",
            "currentPath": "="
        },
        link: function(scope, element, attrs) {
            if (scope.auth.needToLogin()) {
                scope.auth.signIn();
            }
        }
    };
});
