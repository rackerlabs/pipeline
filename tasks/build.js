module.exports = function (grunt) {
    grunt.registerTask('build',
        'Compiles, Lints, and minifies artifacts for deployment',
        [
            'clean:dist',
            // 'jshint',
            'useminPrepare',
            'concurrent:dist',
            'concat',
            'copy:dist',
            'ngmin',
            'less',
            'cssmin',
            'uglify',
            'rev',
            'usemin',
            'docs',
            'shell:commitPush',
            'copy:plato',
            // 'copyCoverage',
        ]
    );
};