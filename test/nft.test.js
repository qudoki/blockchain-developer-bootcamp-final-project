let BN = web3.utils.BN;
const assert = require("assert");
const NFT = artifacts.require("../contracts/NFT.sol");
let { catchRevert } = require("./exceptionsHelpers.js");
const {
	items: ItemStruct,
	isDefined,
	isPayable,
	isType,
} = require("./ast-helper");

contract("NFT", function (accounts) {
	const [_owner, alice, bob] = accounts;
	const emptyAddress = "0x0000000000000000000000000000000000000000";
	const price = 1;
	const artist = "john doe";
	const title = "best nft ever";
	const buyer = "buyerperson";
	const currentOwner = "ownerperson";

	let instance;

	beforeEach(async () => {
		instance = await NFT.new(emptyAddress);
	});

	describe("Variables", () => {
		// it("Contract should have an owner", async () => {
		// 	instance.owner().then(function (result) {
		// 		assert.equal(typeof result, "address");
		// 	});

		it("Contract should have an owner", async () => {
			assert.equal(
				typeof instance.owner,
				"function",
				"the contract has no owner"
			);
			// instance = NFT.new(emptyAddress);
			// console.log(instance.owner());
			// assert.equal(typeof instance.owner(), "address");
		});

		it("Contract should have an token count", async () => {
			assert.equal(
				typeof instance.tokenCounter,
				"function",
				"the contract has no token count"
			);
		});

		// let artPiece;
		// before(() => {
		// 	artPiece = ArtPieceStruct(NFT);
		// 	assert(artPiece !== null, "The contract should define an `Art Piece`");
		// });

		// it("should have a `title`", () => {
		// 	assert(
		// 		isDefined(artPiece)("title"),
		// 		"ArtPieceStruct should have a `title`"
		// 	);
		// 	assert(
		// 		isType(artPiece)("artist")("string"),
		// 		"`artist` should be of type `string`"
		// 	);
		// });

		// it("should have a `price`", () => {
		// 	assert(
		// 		isDefined(artPiece)("price"),
		// 		"ArtPieceStruct should have a `price`"
		// 	);
		// 	assert(
		// 		isType(artPiece)("price")("uint"),
		// 		"`price` should be of type `uint`"
		// 	);
		// });

		// it("should have a `seller`", () => {
		// 	assert(
		// 		isDefined(artPiece)("seller"),
		// 		"ArtPieceStruct should have a `seller`"
		// 	);
		// 	assert(
		// 		isType(artPiece)("seller")("address"),
		// 		"`seller` should be of type `address`"
		// 	);
		// 	assert(isPayable(artPiece)("seller"), "`seller` should be payable");
		// });

		// it("should have a `buyer`", () => {
		// 	assert(
		// 		isDefined(artPiece)("buyer"),
		// 		"ArtPieceStruct should have a `buyer`"
		// 	);
		// 	assert(
		// 		isType(artPiece)("buyer")("address"),
		// 		"`buyer` should be of type `address`"
		// 	);
		// 	assert(isPayable(artPiece)("buyer"), "`buyer` should be payable");
		// });
	});

	describe("Enum State", () => {
		let enumState;
		before(() => {
			enumState = NFT.enums.State;
			assert(enumState, "The contract should define an Enum called State");
		});

		it("should define `ForSale`", () => {
			assert(
				enumState.hasOwnProperty("ForSale"),
				"The enum does not have a `ForSale` value"
			);
		});

		it("should define `NotForSale`", () => {
			assert(
				enumState.hasOwnProperty("NotForSale"),
				"The enum does not have a `NotForSale` value"
			);
		});
	});

	describe("Art Piece Struct", () => {
		let artPieceStruct;
		before(() => {
			artPieceStruct = ItemStruct(NFT);
			assert(
				artPieceStruct !== null,
				"The contract should define an `Art Piece Struct`"
			);
		});

		it("Art piece should have a `title`", () => {
			assert(
				isDefined(artPieceStruct)("title"),
				"The art piece should have a `title`"
			);
			assert(
				isType(artPieceStruct)("title")("string"),
				"`title` should be of type `string`"
			);
		});

		it("Art piece should have an `artist`", () => {
			assert(
				isDefined(artPieceStruct)("artist"),
				"The art piece should have an `artist`"
			);
			assert(
				isType(artPieceStruct)("artist")("string"),
				"`artist` should be of type `string`"
			);
		});

		it("Art piece should have a `price`", () => {
			assert(
				isDefined(artPieceStruct)("price"),
				"The art piece should have a `price`"
			);
		});

		it("Art piece should have a `tokenURI`", () => {
			assert(
				isDefined(artPieceStruct)("tokenURI"),
				"The art piece should have a `tokenURI`"
			);
		});

		it("should have a `currentOwner`", () => {
			assert(
				isDefined(artPieceStruct)("currentOwner"),
				"Struct Item should have a `currentOwner`"
			);
			assert(
				isType(artPieceStruct)("currentOwner")("address"),
				"`seller` should be of type `address`"
			);
			assert(
				isPayable(artPieceStruct)("currentOwner"),
				"`seller` should be payable"
			);
		});

		it("should have a `buyer`", () => {
			assert(
				isDefined(artPieceStruct)("buyer"),
				"Struct Item should have a `buyer`"
			);
			assert(
				isType(artPieceStruct)("buyer")("address"),
				"`buyer` should be of type `address`"
			);
			assert(isPayable(artPieceStruct)("buyer"), "`buyer` should be payable");
		});
	});
});
