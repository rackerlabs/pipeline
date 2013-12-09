var config = require('../util/config.js');

module.exports = {
    // By default, your `index.html` <!-- Usemin Block --> will take care of
    // minification. This option is pre-configured if you do not wish to use
    // Usemin blocks.
    config: config,
    dist: {
        files: {
            '<%= cssmin.config.dist %>/styles/result.css': [
                '.tmp/styles/{,*/}*.css',
                '<%= cssmin.config.app %>/styles/{,*/}*.css'
            ]
        }
    }
};