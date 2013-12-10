angular.module('rxPipelineSvc', ['ngResource'])
    .factory('Pipeline', function ($resource) {
        return $resource('/api/pipelines/:id',
            {},
            {
                list: { method: 'GET', isArray: true }
            });
    }).
    factory('Build', function ($resource) {
        return $resource('/api/build/:id',
            { id: '@id' },
            {
                list: { method: 'GET', isArray: true }
            });
    });