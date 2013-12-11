angular.module('rxPipelineSvc', ['ngResource'])
    .factory('Pipeline', function ($resource) {
        return $resource('/api/pipelines/:id',
            {},
            {
                list: { method: 'GET', isArray: true }
            });
    })
    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:id',
            { id: '@id' },
            {
                list: { method: 'GET', isArray: true }
            });
    })
    .factory('PipelineRuns', function () {
        return [{
            number: 1,
            tasks: [
                {
                    name: 'Task1',
                    lastUpdate: '2013-09-06T20:04:04.343Z',
                    lastRunBy: 'Chris',
                    status: 'success'
                },
                {
                    name: 'Task2',
                    lastUpdate: '2013-09-06T20:04:04.343Z',
                    lastRunBy: 'Rahman',
                    status: 'error'
                }
            ]
        }];
    });