const assert = require("assert");
const NFT = artifacts.require("../contracts/NFT.sol");

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
		it("Contract should have an owner", async () => {
			instance.owner().then(function (result) {
				assert.equal(typeof result, "address");
			});
			
			// instance = NFT.new(emptyAddress);
			// console.log(instance.owner());
			// assert.equal(typeof instance.owner(), "address");
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
});
