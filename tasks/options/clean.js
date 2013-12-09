var config = require('../util/config.js');

module.exports = {
    config: config,
    dist: {
        files: [{
            dot: true,
            src: [
                '.tmp',
                '<%= clean.config.dist %>/*',
                '<%= clean.config.dist %>/.git*'
            ]
        }]
    },
    server: '.tmp'
};