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
		it("Contract should have an owner", async () => {
			assert.equal(
				typeof instance.owner,
				"function",
				"the contract has no owner"
			);
		});

		it("Contract should have an token count", async () => {
			assert.equal(
				typeof instance.tokenCounter,
				"function",
				"the contract has no token count"
			);
		});
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

	describe("Use Cases", () => {
		// not done - should add all items
		it("should add an item with the provided name and price", async () => {
			await instance.addItem(name, price, { from: alice });

			const result = await instance.fetchItem.call(0);

			assert.equal(
				result[0],
				name,
				"the name of the last added item does not match the expected value"
			);
			assert.equal(
				result[2].toString(10),
				price,
				"the price of the last added item does not match the expected value"
			);
			assert.equal(
				result[3].toString(10),
				NFT.State.ForSale,
				'the state of the item should be "For Sale"'
			);
			assert.equal(
				result[4],
				alice,
				"the address adding the item should be listed as the seller"
			);
			assert.equal(
				result[5],
				emptyAddress,
				"the buyer address should be set to 0 when an item is added"
			);
		});

		// not done - should add all items as for sale
		it("should emit a LogForSale event when an item is added", async () => {
			let eventEmitted = false;
			const tx = await instance.addItem(name, price, { from: alice });

			if (tx.logs[0].event == "LogForSale") {
				eventEmitted = true;
			}

			assert.equal(
				eventEmitted,
				true,
				"adding an item should emit a For Sale event"
			);
		});

		// not done - purchase and transfer
		it("should allow someone to purchase an item and update state accordingly", async () => {
			await instance.addItem(name, price, { from: alice });
			var aliceBalanceBefore = await web3.eth.getBalance(alice);
			var bobBalanceBefore = await web3.eth.getBalance(bob);

			await instance.buyItem(0, { from: bob, value: excessAmount });

			var aliceBalanceAfter = await web3.eth.getBalance(alice);
			var bobBalanceAfter = await web3.eth.getBalance(bob);

			const result = await instance.fetchItem.call(0);

			assert.equal(
				result[3].toString(10),
				NFT.State.Sold,
				'the state of the item should be "Sold"'
			);

			assert.equal(
				result[5],
				bob,
				"the buyer address should be set bob when he purchases an item"
			);

			assert.equal(
				new BN(aliceBalanceAfter).toString(),
				new BN(aliceBalanceBefore).add(new BN(price)).toString(),
				"alice's balance should be increased by the price of the item"
			);

			assert.isBelow(
				Number(bobBalanceAfter),
				Number(new BN(bobBalanceBefore).sub(new BN(price))),
				"bob's balance should be reduced by more than the price of the item (including gas costs)"
			);
		});

		// not done - error when not enough
		it("should error when not enough value is sent when purchasing an item", async () => {
			await instance.addItem(name, price, { from: alice });
			await catchRevert(instance.buyItem(0, { from: bob, value: 1 }));
		});
		// not done - should emit sold event
		it("should emit LogSold event when and item is purchased", async () => {
			var eventEmitted = false;

			await instance.addItem(name, price, { from: alice });
			const tx = await instance.buyItem(0, { from: bob, value: excessAmount });

			if (tx.logs[0].event == "LogSold") {
				eventEmitted = true;
			}

			assert.equal(
				eventEmitted,
				true,
				"adding an item should emit a Sold event"
			);
		});
	});
});
