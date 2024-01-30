const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/mobile' : '/',
	// publicPath: '/',
	configureWebpack: {
		plugins: [
		  new NodePolyfillPlugin()
		]
	}
}