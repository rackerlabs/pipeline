var config = require('../util/config.js');

// Put files not handled in other tasks here
module.exports = {
    config: config,
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= copy.config.app %>',
            dest: '<%= copy.config.dist %>',
            src: [
                '*.{ico,png,txt}',
                '.htaccess',
                'bower_components/**/*',
                'images/{,*/}*.{gif,webp}',
                'fonts/*',
                'views/**/*'
            ]
        }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= copy.config.dist %>/images',
            src: [
                'generated/*'
            ]
        }]
    },
    plato: {
        files:[{
            expand: true,
            dot: true,
            dest: '<%= copy.config.dist %>',
            src: [
                'report/**/*'
            ]
        }]
    }
};