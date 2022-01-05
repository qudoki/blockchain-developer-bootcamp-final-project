let BN = web3.utils.BN;
const assert = require("assert");
const { load } = require("dotenv");
const NFT = artifacts.require("../contracts/NFT.sol");
// let { catchRevert } = require("./exceptionsHelpers.js");
const {
	items: ItemStruct,
	isDefined,
	isPayable,
	isType,
} = require("./ast-helper");
const { providers } = require("ethers");

contract("NFT", async (accounts) => {
	let nftCollection;
	let result;
	let collectionCount;

	// let buyerInstance;

	// currently gallery is address at 0
	const gallery = "0x09c74b9D99cce82CEaDaA60a90Ec8453A5d12450";
	const buyer = "0x5150CC17aeab7426faaac01A834b4bA85B2Ea49f";
	const price = 1;
	const fakePrice = 100;
	const artist = "Rebecca Johnson";
	const title = "First Ever NFT";
	const index = 0;
	const uri =
		"https://ipfs.io/ipfs/bafybeido4wnjbmthgpygr5wubsiodnavmdbmlf7hbp262leaptffls2qdm";
	const uritwo =
		"https://ipfs.io/ipfs/bafybeia23kjkkvtgxwbxqhojdbzlmxxuhi7ffuxfuerot4hzpe7umttjva";
	const urithree =
		"https://ipfs.io/ipfs/bafybeiflu2fdax4i7o6g2eoyu6to7qs7cdol5s3vmqsnvpc6nml4tfo5ju";
	const urifour =
		"https://ipfs.io/ipfs/bafybeig3l6fag6fbzzxj3syzxco3ul6j2uy5ocyxx7j3m4t7hmsdqwc66i";
	const urifive =
		"https://ipfs.io/ipfs/bafybeigmzl32jd3c7xiqtd4nphmjwkxgs4dvxqvmfqv7sk3xdhdwpublny";

	before(async () => {
		//was instance
		nftCollection = await NFT.deployed();
		// separate contract initiation (buyer)
		// buyerInstance = await NFT.new(buyer);
	});

	describe("Deployment", async () => {
		it("Contract should have an address", async () => {
			const address = await nftCollection.address;
			assert.notEqual(address, 0x0);
			assert.notEqual(address, "");
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
			console.log("Contract was deployed to: " + address);
		});
		it("Contract has a name", async () => {
			const name = await nftCollection.collectionName();
			assert.equal(name, "NFT Gallery");
		});
		it("Contract has a symbol", async () => {
			const symbol = await nftCollection.collectionNameSymbol();
			assert.equal(symbol, "NFT");
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
	});

	describe("Use Cases", () => {
		// buyer should not have minterRole = true
		it("Buyers should not have minterRole = true by default", async function () {
			const minterRole = await nftCollection.getMinterRole(gallery);
			assert.equal(minterRole, false);
		});
		// gallery should be made into minter role
		it("Only the gallery should have minterRole", async () => {
			await nftCollection.addMinter(gallery);
			const minterRole = await nftCollection.getMinterRole(gallery);
			assert.equal(minterRole, true);
		});

		// allows gallery to mint ERC721 token
		it("The piece should be minted with provided count, name and uri", async () => {
			collectionCount = await nftCollection.tokenCounter();
			assert.equal(collectionCount.toNumber(), 0);
			let tokenExists;
			tokenExists = await nftCollection.getTokenExists(1, {
				from: accounts[0],
			});
			assert.equal(tokenExists, false);
			let tokenURIExists;
			tokenURIExists = await nftCollection.tokenURIExists(uri, {
				from: accounts[0],
			});
			assert.equal(tokenURIExists, false);
			let tokenNameExists;
			tokenNameExists = await nftCollection.tokenNameExists("First NFT", {
				from: accounts[0],
			});
			assert.equal(tokenNameExists, false);
			// await nftCollection.addMinter(gallery);
			result = await nftCollection.mint(
				"First NFT",
				title,
				artist,
				uri,
				accounts[0],
				accounts[0],
				price,
				{ from: gallery }
			);
			collectionCount = await nftCollection.tokenCounter();
			assert.equal(collectionCount.toNumber(), 1);
			tokenExists = await nftCollection.getTokenExists(1, {
				from: accounts[0],
			});
			assert.equal(tokenExists, true);
			tokenURIExists = await nftCollection.tokenURIExists(uri, {
				from: accounts[0],
			});
			assert.equal(tokenURIExists, true);

			await nftCollection.mint(
				"Second NFT",
				"Second Ever NFT",
				artist,
				uritwo,
				accounts[0],
				accounts[0],
				price,
				{ from: gallery }
			);

			await nftCollection.mint(
				"Third NFT",
				"Third Ever NFT",
				artist,
				urithree,
				accounts[0],
				accounts[0],
				price,
				{ from: gallery }
			);

			await nftCollection.mint(
				"Fourth NFT",
				"Fourth Ever NFT",
				artist,
				urifour,
				accounts[0],
				accounts[0],
				price,
				{ from: gallery }
			);

			await nftCollection.mint(
				"FIfth NFT",
				"Fifth Ever NFT",
				artist,
				urifive,
				accounts[0],
				accounts[0],
				price,
				{ from: gallery }
			);
			// transaction of first minting
			// console.log(result);
		});

		it("Returns the address of the token's current owner", async () => {
			const tokenOwner = await nftCollection.getTokenOwner(2);
			assert.equal(tokenOwner, accounts[0]);
		});

		it("Returns metadata of a token", async () => {
			const tokenMetaData = await nftCollection.getTokenMetaData(3);
			assert.equal(tokenMetaData, urithree);
		});

		it("Returns total number of tokens minted so far", async () => {
			const totalNumberOfTokensMinted =
				await nftCollection.getNumberOfTokensMinted();
			assert.equal(totalNumberOfTokensMinted.toNumber(), 5);
		});

		it("Returns total number of tokens owned by an address", async () => {
			const totalNumberOfTokensOwnedByAnAddress =
				await nftCollection.getTotalNumberOfTokensOwnedByAnAddress(accounts[0]);
			assert.equal(totalNumberOfTokensOwnedByAnAddress.toNumber(), 5);
		});

		it("Allows users to buy token for specified amount", async () => {
			const priorTokenOwner = await nftCollection.getTokenOwner(1);
			assert.equal(priorTokenOwner, accounts[0]);

			// Check prior token owner's balance
			let priorTokenOwnerBalance;
			priorTokenOwnerBalance = await web3.eth.getBalance(accounts[0]);
			// Below makes priorTokenOwnerBalance a weird BN alphanumeric
			// priorTokenOwnerBalance = new web3.utils.BN(priorTokenOwnerBalance);
			console.log("Prior Token Owner Balance Before Transaction: " + priorTokenOwnerBalance);

			// Check prior seller token count
			let priorTotalTokensOfSeller;
			priorTotalTokensOfSeller =
				await nftCollection.getTotalNumberOfTokensOwnedByAnAddress(accounts[0]);
			assert.equal(priorTotalTokensOfSeller.toNumber(), 5);

			// Check that no transfers have been made thus far
			let artPiece;
			artPiece = await nftCollection.collection(1, {
				from: accounts[0],
			});
			assert.equal(artPiece.numberOfTransfers.toNumber(), 0);

			// Check prospective token buyer balance
			let priorBuyerBalance;
			priorBuyerBalance = await web3.eth.getBalance(accounts[2]);
			console.log("Buyer Balance Before Transaction: " + priorBuyerBalance);

			// Purchase token
			result = await nftCollection.buy(1, {
				from: accounts[2],
				value: web3.utils.toWei("1", "Ether"),
			});

			// Check prior token owner's balance after transaction
			let priorTokenOwnerBalanceAfterTx;
			priorTokenOwnerBalanceAfterTx = await web3.eth.getBalance(accounts[0]);
			console.log("Prior Token Owner Balance After Transaction: " + priorTokenOwnerBalanceAfterTx);

			// Check new token owner
			const newTokenOwner = await nftCollection.getTokenOwner(1);
			assert.equal(newTokenOwner, accounts[2]);

			// Check new token owner's balance after transaction
			let newTokenOwnerBalance;
			newTokenOwnerBalance = await web3.eth.getBalance(accounts[2]);
			console.log("Buyer Balance After Transaction: " + newTokenOwnerBalance);







		});

		// 	// error when not enough
		// 	it("It should error when not enough value is sent when purchasing an item", async () => {
		// 		await nftCollection.addMinter(accounts[0]);
		// 		await nftCollection.mint(
		// 			title,
		// 			artist,
		// 			uri,
		// 			accounts[0],
		// 			accounts[0],
		// 			accounts[2],
		// 			price
		// 		);
		// 		await catchRevert(buyerInstance.buy(index, { value: fakePrice }));
		// 	});

		// 	// check if item is for sale
		// 	it("It should allow someone to check if item is for sale", async () => {
		// 		await nftCollection.addMinter(accounts[0]);
		// 		await nftCollection.mint(
		// 			title,
		// 			artist,
		// 			uri,
		// 			accounts[0],
		// 			accounts[0],
		// 			accounts[2],
		// 			price
		// 		);
		// 		const result = await nftCollection.checkNft(index);
		// 		assert.equal(result._forSale, true, "the item should be for sale");
		// 	});

		// 	// not done - purchase and transfer

		// 	it("It should allow someone to purchase an item", async () => {
		// 		var initialGalleryBalance = await web3.eth.getBalance(accounts[0]);
		// 		console.log("Gallery Balance Before Minting: " + initialGalleryBalance);
		// 		await nftCollection.addMinter(accounts[0]);
		// 		await nftCollection.mint(
		// 			title,
		// 			artist,
		// 			uri,
		// 			accounts[0],
		// 			accounts[0],
		// 			accounts[2],
		// 			price
		// 		);
		// 		// const result = await instance.checkNft(index);
		// 		// console.log(result);
		// 		// const tokenId = result._tokenId.toNumber();
		// 		// console.log("Token ID: " + tokenId);

		// 		await nftCollection.checkNft(index);

		// 		//before
		// 		var galleryBalanceBefore = await web3.eth.getBalance(accounts[0]);
		// 		var buyerBalanceBefore = await web3.eth.getBalance(accounts[2]);
		// 		console.log("Gallery Balance Before Purchase " + galleryBalanceBefore);
		// 		console.log("Buyer Balance Before Purchase: " + buyerBalanceBefore);

		// 		//during
		// 		await nftCollection.allow(index, buyer);
		// 		await buyerInstance.buy(index, { value: price }); // will "index" return wrong token Id?

		// 		//after
		// 		var galleryBalanceAfter = await web3.eth.getBalance(accounts[0]);
		// 		var buyerBalanceAfter = await web3.eth.getBalance(buyer);
		// 		console.log("Gallery Balance After Purchase: " + galleryBalanceAfter);
		// 		console.log("Buyer Balance After Purchase: " + buyerBalanceAfter);

		// 		const after = await buyerInstance.checkNft(index);
		// 		console.log(after._currentOwner);
		// 		// assert.equal(
		// 		// 	after._currentOwner,
		// 		// 	address[2],
		// 		// 	"the piece should now be owned by the buyer"
		// 		// );

		// 		// assert.equal(
		// 		// 	Number(galleryBalanceAfter),
		// 		// 	Number(galleryBalanceBefore).add(price),
		// 		// 	"gallery's balance should be increased by the price of the item"
		// 		// );

		// 		// assert.isBelow(
		// 		// 	Number(buyerBalanceAfter),
		// 		// 	Number(buyerBalanceBefore).sub(price),
		// 		// 	"buyer's balance should be reduced by more than the price of the item (including gas costs)"
		// 		// );
		// 	});
	});
});
