angular.module("pipelineAuth", []).

factory('Auth', function($http) {
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
                try {
                    var stored_auth = $.cookies.get("GHAuth");
                } catch (err) {
                    var stored_auth = undefined;
                }

                if (stored_auth) {
                    this.username = stored_auth.username;
                    this.email = stored_auth.email;
                    this.github_id = stored_auth.github_id;
                    this.name = stored_auth.name;
                    this.auth_token = stored_auth.auth_token;
                    this.auth_cache_date = new Date();

                    $http.defaults.headers.common["GH-AUTH-TOKEN"] = this.auth_token;
                }
                else {
                    this.username = undefined;
                    this.github_id = undefined;
                    this.email = undefined;
                    this.name = undefined;
                    this.auth_token = undefined;
                    this.auth_cache_date = undefined;

                    if ($http.defaults.headers.common.hasOwnProperty("GH-AUTH-TOKEN")) {
                        location.href = "/";
                    }
                }
            }

            return {"username": this.username, "name": this.name, "auth_token": this.auth_token, "email": this.email, "github_id": this.github_id };
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
directive("rxAuth", function(Auth) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/authSignIn.html',
        scope: false,
        link: function(scope, element, attrs) {
            scope.auth = Auth;
            if (scope.auth.needToLogin()) {
                scope.auth.signIn();
            }
        }
    };
}).
directive("rxAuthForm", function(Auth) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/authForm.html',
        scope: false,
        link: function(scope, element, attrs) {
            scope.Auth = Auth;
        }
    };
});