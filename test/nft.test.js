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
	const [_owner, alice, bob] = accounts;
	// currently gallery is address at 0
	const gallery = "0xE535F187b199aBDEdb7441d2390eD92E32Ba0d43";
	const price = 1;
	const artist = "john doe";
	const title = "best nft ever";
	const buyer = "buyerperson";
	const currentOwner = "ownerperson";
	const tokenId = 1;
	const uri =
		"https://ipfs.io/ipfs/bafybeido4wnjbmthgpygr5wubsiodnavmdbmlf7hbp262leaptffls2qdm";
	let instance;

	beforeEach(async () => {
		instance = await NFT.new(gallery);
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

	describe("Use Cases", () => {
		// buyer should not have minterRole = true
		it("should not have minterRole = true by default", async function () {
			const minterRole = await instance.getMinterRole(gallery);
			expect(minterRole).to.equal(false);
		});
		// gallery should be made into minter role
		it("gallery should have minterRole", async () => {
			await instance.addMinter(gallery);
			const minterRole = await instance.getMinterRole(gallery);
			expect(minterRole).to.equal(true);
		});

		it("piece should be minted with provided uri", async () => {
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
		it("should error when not enough value is sent when purchasing an item", async () => {
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
			await catchRevert(instance.buy(0, { from: bob, value: 1 }));
		});


		// check if item is for sale
		it("should allow someone to check if item is for sale", async () => {
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
			const result = await instance.checkNft(0);
			// console.log(result);
			assert.equal(
				result._forSale,
				true,
				"the item should be for sale"
			);
		});


		// not done - purchase and transfer

		it("should allow someone to purchase an item", async () => {
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
			// const index = await instance.totalSupply();
			var galleryBalanceBefore = await web3.eth.getBalance(accounts[0]);
			var buyerBalanceBefore = await web3.eth.getBalance(accounts[2]);
			console.log(galleryBalanceBefore);
			console.log(buyerBalanceBefore);
			
			await instance.buy(tokenId);
			// var galleryBalanceAfter = await web3.eth.getBalance(accounts[0]);
			// var buyerBalanceAfter = await web3.eth.getBalance(accounts[2]);
			// console.log(galleryBalanceAfter);
			// console.log(buyerBalanceAfter);

			assert.equal(
				new BN(galleryBalanceAfter).toString(),
				new BN(galleryBalanceBefore).add(new BN(price)).toString(),
				"gallery's balance should be increased by the price of the item"
			);

			assert.isBelow(
				Number(buyerBalanceAfter),
				Number(new BN(buyerBalanceBefore).sub(new BN(price))),
				"buyer's balance should be reduced by more than the price of the item (including gas costs)"
			);
		});

			// not done - should emit purchase event
		// 	it("should emit Purchase event when item is purchased", async () => {
		// 		var eventEmitted = false;
		// 		await instance.addMinter(accounts[0]);
		// 		await instance.mint(accounts[0], uri);
		// 		const tx = await instance.buy(0, { from: bob, value: excessAmount });
		// 		if (tx.logs[0].event == "Purchased") {
		// 			eventEmitted = true;
		// 		}
		// 		assert.equal(
		// 			eventEmitted,
		// 			true,
		// 			"adding an item should emit a Sold event"
		// 		);
		// });


	});
});
