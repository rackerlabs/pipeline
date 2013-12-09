var config = require('../util/config.js');

//TODO: Test options in htmlmin
module.exports = {
    config: config,
    dist: {
        options: {
            // removeCommentsFromCDATA: true,
            // // https://github.com/htmlmin.config/grunt-usemin/issues/44
            // collapseWhitespace: true,
            // collapseBooleanAttributes: true,
            // removeAttributeQuotes: true,
            // removeRedundantAttributes: true,
            // useShortDoctype: true,
            // removeEmptyAttributes: true,
            // removeOptionalTags: true
        },
        files: [{
            expand: true,
            cwd: '<%= htmlmin.config.app %>',
            src: ['*.html', 'views/**/*.html'],
            dest: '<%= htmlmin.config.dist %>'
        }]
    }
};