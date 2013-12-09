module.exports = {
    stubsServer: {
        options: {
            stubs: 3000
        },
        files: [{
            src: [ 'test/api-mocks/*.yaml' ]
        }]
    }
};