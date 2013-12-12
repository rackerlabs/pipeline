var grunt = require('grunt');

module.exports = {
    default: {
        options: {
            jshint: grunt.file.readJSON('.jshintrc'),
            exclude: /app\/scripts\/lib/ // excludes files in lib directory
        },
        files: {
            'report': ['app/scripts/**/*.js', 'server/**/*.js']
        }
    }
};