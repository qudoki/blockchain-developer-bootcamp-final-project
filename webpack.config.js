module.exports = {
	webpack5: true,
	webpack: (config) => {
		config.resolve.fallback = { fs: false };

		return config;
	},
	target: "node",
	node: {
		fs: "empty",
	},
};
