angular.module('rxAuthSvc', ['ngResource'])
    .factory('Auth', function ($resource) {
        return $resource('/api/auth/:action',
            {  },
            {
                login: { method: 'POST', isArray: false, ignoreAuthModule: true },
                logout: { method: 'DELETE', isArray: false, ignoreAuthModule: true },
                loggedIn: { method: 'GET', isArray: false, params: { action: 'loggedIn' } }
            });
    });