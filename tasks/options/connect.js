var config = require('../util/config.js');

module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost'
    },
    proxies: [
    ],
    livereload: {
        options: {
            middleware: function(cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.\\w+$ /']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },
    test: {
        options: {
            middleware: function(cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.\\w+$ /']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },
    dist: {
        options: {
            middleware: function(cnct) {
                return [
                    config.mountFolder(cnct, config.dist)
                ];
            }
        }
    },
    docs: {
        options: {
            middleware: function (cnct) {
                return [
                    config.mountFolder(cnct, config.ngdocs)
                ];
            }
        }
    }
};
