module.exports = {
	webpack5: true,
	webpack: (config) => {
		config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false, os: false };

		return config;
	},
};
