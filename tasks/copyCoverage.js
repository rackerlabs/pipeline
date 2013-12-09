var fs  = require('fs-extra'),
    _   = require('lodash');

module.exports = function (grunt) {
    grunt.registerTask('copyCoverage',
        'Copies coverage report into dist directory with a common name',

        function() {
            var dirs = fs.readdirSync('coverage');

            var dir = _.find(dirs, function (file) {
                return grunt.file.isDir('coverage/' + file);
            });

            fs.mkdirsSync('dist/coverage');
            fs.copySync('coverage/' + dir, 'dist/coverage');
        }
    );
};