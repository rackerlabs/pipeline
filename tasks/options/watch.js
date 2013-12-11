module.exports = {
    express: {
        files: ['server/**/*.js'],
        tasks: ['express:dev'],
        options: {
            spawn:false
        }
    },
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
    less: {
        files: ['app/styles/less/**/*.less'],
        tasks: ['less'],
        options: {
            livereload: true
        }
    },
    css: {
        files: ['app/styles/**/*.css'],
        options: {
            livereload: true
        }
    },
    html: {
        files: ['app/index.html', 'app/directives/**/*.html', 'app/views/**/*.html'],
        options: {
            livereload: true
        }
    }
};
