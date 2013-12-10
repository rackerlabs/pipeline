angular.module('rxPipelineSvc', ['ngResource'])
    .factory('Pipeline', function ($resource) {
        return $resource('/api/pipelines/:id',
            {},
            {
                list: { method: 'GET', isArray: true }
            });
    }).
    factory('Task', function ($resource) {
        return $resource('/api/tasks/:id',
            { id: '@id' },
            {
                list: { method: 'GET', isArray: true }
            });
    });