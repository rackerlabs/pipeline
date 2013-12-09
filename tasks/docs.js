module.exports = function (grunt) {
    grunt.registerTask('docs',
        'Generates test reports, angular js docs and styleguide',
        [
            'plato',
            'ngdocs',
            'styledocco'
        ]
    );
};