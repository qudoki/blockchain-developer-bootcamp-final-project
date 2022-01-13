var path = require("path");
var webpack = require("webpack");

// module.exports = {
// 	// webpack5: true,
// 	// webpack: (config) => {
// 	// 	config.resolve.fallback = { fs: false};
// 	// 	config.node = { fs: 'empty' };
// 	// 	return config;
// 	// },
// 	target: "node",
// 	// devtool: options.devtool,
// 	// target: 'web', // Make web variables accessible to webpack, e.g. window
// 	// ignoreStub: true
// };

module.exports = {
	entry: "./src/App.js",
	// bundling for node.js
	// target: "node",
	// bundling for client-side/browser
	target: "web",
	output: {
		path: path.join(__dirname, "build"),
		filename: "backend.js",
	},
	webpack: (config) => {config.resolve.fallback = { "fs": false, "os": require.resolve("os-browserify/browser") }}
};
