angular.module('rxPipelineSvc', ['ngResource'])
    .factory('Pipeline', function ($resource) {
        return $resource('/api/pipeline/:id',
            {},
            {
                list: { method: 'GET', isArray: true }
            });
    });