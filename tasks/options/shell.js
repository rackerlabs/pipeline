var grunt = require('grunt');

module.exports = {
    protractor: {
        options: {
            stdout: true
        },
        command: function (file) {
            var localConfigFile = 'test/protractor.conf.local.js';
            var defaultConfigFile = 'test/protractor.conf.js';
            var configFile =  grunt.file.isFile(localConfigFile) ? localConfigFile : defaultConfigFile;
            var cmd = 'protractor ' + configFile;

            if (typeof file !== 'undefined' && file.length > 0) {
                cmd += ' --specs ' + file;
            }

            console.log('Command: ' + cmd);
            return cmd;
        }
    },
    commitPush: {
        options: {
            stdout: true
        },
        command: [
            'git checkout master',
            'git pull',
            'git add .',
            'git commit -m "Build: Committing auto-generated reports"',
            'git push origin master'
        ].join('&&')
    }
};