angular.module('rxTaskSvc', ['ngResource'])
    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:id',
            { id: '@id' },
            {
                list: { method: 'GET', isArray: true },
                get: { method: 'GET', isArray: false },
                update: { method: 'PUT', isArray: false}
            });
    });