module.exports = {
	options: {
		background: true,
		port: 9000
	},
	dev: {
		options: {
			script: 'server/server.js',
			background:true
		}
	},
	test: {
		options: {
			script: 'server/server.js',
			node_env: 'test'
		}
	},
	prod: {
		options: {
			script: 'server/server.js',
			node_env: 'production'
		}
	}
};