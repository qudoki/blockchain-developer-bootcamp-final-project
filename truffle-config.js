require("dotenv").config();
const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env["MNEMONIC"];
const tokenKey = process.env["ENDPOINT_KEY"];

module.exports = {
	// See <http://truffleframework.com/docs/advanced/configuration>
	// to customize your Truffle configuration!
	contracts_build_directory: path.join(__dirname, "client/src/contracts"),
	networks: {
		local: {
			host: "localhost",
			port: 8545,
			network_id: "*",
		},
		development: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "*",
			websockets: true,
			// gasPrice: 0x1,
			// gas: 0x1fffffffffffff
		},
		rinkeby: {
			provider: function () {
				return new HDWalletProvider(
					mnemonic,
					"https://rinkeby.infura.io/v3/" + tokenKey,
					0,
					1
				);
			},
			gas: 5000000,
			gasPrice: 5000000000, // 5 gwei
			network_id: 4,
			skipDryRun: true,
			// truffle migrate --reset --network rinkeby
		},
	},
	test: {
		host: "127.0.0.1",
		port: 8545,
		network_id: "*",
		// gasPrice: 0x1,
		// gas: 0x1fffffffffffff
	},
	compilers: {
		solc: {
			version: ">=0.5.16 <0.9.0",

			parser: "solcjs",
		},
	},
	settings: {
		optimizer: {
			enabled: true,
			runs: 200,
		},
	},
};
