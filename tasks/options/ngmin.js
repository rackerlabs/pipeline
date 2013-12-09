var config = require('../util/config.js');

module.exports = {
    config: config,
    dist: {
        files: [{
            expand: true,
            cwd: '<%= ngmin.config.dist %>/scripts',
            src: '*.js',
            dest: '<%= ngmin.config.dist %>/scripts'
        }]
    }
};