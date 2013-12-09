module.exports = {
    development: {
        options: {
            // Specifies directories to scan for @import directives when parsing.
            // Default value is the directory of the source, which is probably what you want.
            paths: ['{.tmp, app/styles/']
        },
        files: {
            // compilation.css  :  source.less
            'app/styles/result.css': 'app/styles/app.less'
        }
    }
};