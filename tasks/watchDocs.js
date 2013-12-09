module.exports = function (grunt) {
    grunt.registerTask('watchDocs',
        'Watches JS files to iterate over JS Docs',
        [
            'ngdocs',
            'concurrent:server',
            'connect:docs',
            'open',
            'watch'
        ]
    );
};