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
const { providers } = require("ethers");

contract("NFT", function (accounts) {
	// const [gall, neutral, buy] = accounts;
	// currently gallery is address at 0
	const gallery = "0x0E418f11756905C3544a4D632306E20a5DeC5c61";
	const buyer = "0x07AE5fCC202205AdB0E199c283b00cF08b9e5e9E";
	const price = 1;
	const fakePrice = 100;
	const artist = "john doe";
	const title = "best nft ever";
	const index = 0;
	const uri =
		"https://ipfs.io/ipfs/bafybeido4wnjbmthgpygr5wubsiodnavmdbmlf7hbp262leaptffls2qdm";
	let instance;
	let buyerInstance;

	beforeEach(async () => {
		instance = await NFT.new(gallery);
		// separate contract initiation (buyer)
		buyerInstance = await NFT.new(buyer);
	});

	describe("Variables", () => {
		it("Contract should have an owner", async () => {
			assert.equal(
				typeof instance.owner,
				"function",
				"the contract has no owner"
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

		it("Art piece should have a `currentOwner`", () => {
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

		it("Art piece should have a `buyer`", () => {
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

	describe("Use Cases", () => {
		// buyer should not have minterRole = true
		it("Buyers should not have minterRole = true by default", async function () {
			const minterRole = await instance.getMinterRole(gallery);
			expect(minterRole).to.equal(false);
		});
		// gallery should be made into minter role
		it("Only the gallery should have minterRole", async () => {
			await instance.addMinter(gallery);
			const minterRole = await instance.getMinterRole(gallery);
			expect(minterRole).to.equal(true);
		});

		it("The piece should be minted with provided uri", async () => {
			await instance.addMinter(accounts[0]);
			await instance.mint(
				title,
				artist,
				uri,
				accounts[0],
				accounts[0],
				accounts[2],
				price
			);
			const tokenUri = await instance.tokenURI(0);
			const balanceOfOwner = await instance.balanceOf(accounts[0]);
			assert.equal(tokenUri, uri);
			assert.equal(balanceOfOwner, 1);
		});

		// error when not enough
		it("It should error when not enough value is sent when purchasing an item", async () => {
			await instance.addMinter(accounts[0]);
			await instance.mint(
				title,
				artist,
				uri,
				accounts[0],
				accounts[0],
				accounts[2],
				price
			);
			await catchRevert(buyerInstance.buy(index, { value: fakePrice }));
		});

		// check if item is for sale
		it("It should allow someone to check if item is for sale", async () => {
			await instance.addMinter(accounts[0]);
			await instance.mint(
				title,
				artist,
				uri,
				accounts[0],
				accounts[0],
				accounts[2],
				price
			);
			const result = await instance.checkNft(index);
			assert.equal(result._forSale, true, "the item should be for sale");
		});

		// not done - purchase and transfer

		it("It should allow someone to purchase an item", async () => {
			var initialGalleryBalance = await web3.eth.getBalance(accounts[0]);
			console.log("Gallery Balance Before Minting: " + initialGalleryBalance);
			await instance.addMinter(accounts[0]);
			await instance.mint(
				title,
				artist,
				uri,
				accounts[0],
				accounts[0],
				accounts[2],
				price
			);
			// const result = await instance.checkNft(index);
			// console.log(result);
			// const tokenId = result._tokenId.toNumber();
			// console.log("Token ID: " + tokenId);

			await instance.checkNft(index);

			//before
			var galleryBalanceBefore = await web3.eth.getBalance(accounts[0]);
			var buyerBalanceBefore = await web3.eth.getBalance(accounts[2]);
			console.log("Gallery Balance Before Purchase " + galleryBalanceBefore);
			console.log("Buyer Balance Before Purchase: " + buyerBalanceBefore);

			//during
			await instance.allow(index, buyer);
			await buyerInstance.buy(index, { value: price }); // will "index" return wrong token Id?

			//after
			var galleryBalanceAfter = await web3.eth.getBalance(accounts[0]);
			var buyerBalanceAfter = await web3.eth.getBalance(buyer);
			console.log("Gallery Balance After Purchase: " + galleryBalanceAfter);
			console.log("Buyer Balance After Purchase: " + buyerBalanceAfter);

			const after = await buyerInstance.checkNft(index);
			console.log(after._currentOwner);
			// assert.equal(
			// 	after._currentOwner,
			// 	address[2],
			// 	"the piece should now be owned by the buyer"
			// );

			// assert.equal(
			// 	Number(galleryBalanceAfter),
			// 	Number(galleryBalanceBefore).add(price),
			// 	"gallery's balance should be increased by the price of the item"
			// );

			// assert.isBelow(
			// 	Number(buyerBalanceAfter),
			// 	Number(buyerBalanceBefore).sub(price),
			// 	"buyer's balance should be reduced by more than the price of the item (including gas costs)"
			// );
		});
	});
});
