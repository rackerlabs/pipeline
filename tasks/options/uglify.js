var config = require('../util/config.js');

//TODO: Verify functionality
module.exports = {
    config: config,
    dist: {
        files: {
            '<%= uglify.config.dist %>/scripts/scripts.js': [
                '<%= uglify.config.dist %>/scripts/scripts.js'
            ]
        }
    }
};