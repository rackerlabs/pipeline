module.exports = {
    scripts: {
        files: ['Gruntfile.js', 'app/scripts/**/*.js', '!app/scripts/**/*.spec.js', '!app/scripts/debug.js'],
        tasks: ['jshint:scripts', 'test:unit'],
        options: {
            livereload: true
        }
    },
    specs: {
        files: ['app/scripts/**/*.spec.js'],
        tasks: ['jshint:specs', 'test:unit'],
        options: {
            livereload: false
        }
    },
    css: {
        files: ['app/styles/**/*.less'],
        tasks: ['less'],
        options: {
            livereload: true
        }
    },
    html: {
        files: ['app/index.html', 'app/views/{,*/}*.html'],
        options: {
            livereload: true
        }
    }
};
