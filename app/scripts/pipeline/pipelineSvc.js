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
    .factory('PipelineRun', function () {
        return {
            list: function () {
                return [
                    {
                        '_id': 1,
                        number: 1,
                        tasks: [
                            {
                                name: 'Task1',
                                lastEndDate: '2013-09-06T20:04:04.343Z',
                                lastStartDate: '2013-09-06T20:04:00.343Z',
                                lastRunBy: 'Chris',
                                status: 'success'
                            },
                            {
                                name: 'Task2',
                                lastEndDate: '2013-09-06T20:04:04.343Z',
                                lastStartDate: '2013-09-06T20:04:00.343Z',
                                lastRunBy: 'Roger',
                                status: 'inprogress'
                            },
                            {
                                name: 'Task3',
                                lastEndDate: '2013-09-06T20:04:04.343Z',
                                lastStartDate: '2013-09-06T20:04:00.343Z',
                                lastRunBy: 'Rahman',
                                status: 'error'
                            },
                            {
                                name: 'Task4',
                                lastEndDate: '2013-09-06T20:04:04.343Z',
                                lastStartDate: '2013-09-06T20:04:00.343Z',
                                lastRunBy: 'Rahman',
                                status: 'ready'
                            },
                            {
                                name: 'Task5',
                                lastEndDate: '2013-09-06T20:04:04.343Z',
                                lastStartDate: '2013-09-06T20:04:00.343Z',
                                lastRunBy: 'Chris'
                            }
                        ]
                    }
                ];
            }
        };
    });