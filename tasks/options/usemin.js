var config = require('../util/config.js');

module.exports = {
    config: config,
    html: ['<%= usemin.config.dist %>/{,*/}*.html'],
    css: ['<%= usemin.config.dist %>/styles/{,*/}*.css'],
    options: {
        dirs: ['<%= usemin.config.dist %>']
    }
};