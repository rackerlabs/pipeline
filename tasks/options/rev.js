var config = require('../util/config.js');

module.exports = {
    config: config,
    dist: {
        files: {
            src: [
                '<%= rev.config.dist %>/scripts/{,*/}*.js',
                '<%= rev.config.dist %>/styles/{,*/}*.css',
                '<%= rev.config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                '<%= rev.config.dist %>/styles/fonts/*'
            ]
        }
    }
};