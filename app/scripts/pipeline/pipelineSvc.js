angular.module('rxPipelineSvc', ['ngResource'])
    .factory('Pipeline', function ($resource) {
        return $resource('/api/pipeline',
            {},
            {
                list: { method: 'GET', isArray: true }
            });
    });