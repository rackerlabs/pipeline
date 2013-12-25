module.exports = function (grunt) {
    grunt.registerTask('default',
        'Default task will lint code, run unit, mid and functional tests, build code and generate docs.',
        [
            'server'
        ]
    );
};
