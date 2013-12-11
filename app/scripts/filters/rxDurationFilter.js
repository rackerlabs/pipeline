angular.module('rxPipelineApp')
    .filter('rxDuration', function () {
        return function (startDate, endDate) {
            if (startDate && endDate) {
                var diff = new Date(startDate).getTime() - new Date(endDate).getTime();
                return moment.duration(diff * 60).humanize();
            }

            return 0;
        };
    });