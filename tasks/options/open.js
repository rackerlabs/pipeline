var config = require('../util/config');

module.exports =  {
    server: {
        config: config,
        url: 'http://' + config.open.hostname + ':' + config.open.port
    }
};