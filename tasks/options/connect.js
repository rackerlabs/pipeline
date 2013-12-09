var config = require('../util/config.js');

module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost'
    },
    proxies: [
        {
            context: '/shim',
            host: '10.69.245.149',
            port: 4000,
            https: false,
            xforward: true,
            changeOrigin: true,
            rewrite: {
                '/shim': '/v1'
            }
        },{
            context: '/api',
            host: 'dev.virt.encore.rackspace.com',
            port: 443,
            https: true,
            xforward: true,
            changeOrigin: true,
            rewrite: {
                '/api': '/api'
            }
        },{
            context: '/ctkapi',
            host: 'dev.virt.encore.rackspace.com',
            port: 443,
            https: true,
            xforward: true,
            changeOrigin: true,
            rewrite: {
                '/ctkapi': '/ctkapi/'
            }
        }
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
