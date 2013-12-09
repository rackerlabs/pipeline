var config = require('../util/config.js');

module.exports = {
    config: config,
    dist: {
        files: [{
            expand: true,
            cwd: '<%= svgmin.config.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%= svgmin.config.dist %>/images'
        }]
    }
};