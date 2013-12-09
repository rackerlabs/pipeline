var config = require('../util/config.js');

module.exports = {
    config: config,
    dist: {
        files: [{
            expand: true,
            cwd: '<%= imagemin.config.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= imagemin.config.dist %>/images'
        }]
    }
};