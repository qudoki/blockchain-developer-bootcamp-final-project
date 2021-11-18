const assert = require("assert");
// const ethers = require('ethers');
const NFTGallery = artifacts.require('NFTGallery.sol');
const NFTMarket = artifacts.require('NFTMarket.sol');

contract("NFTMarket", function () {
	describe("Should create and execute market sales", async () => {
		it("should assert true", async function () {

			const market = await NFTMarket.new();
			const marketAddress = market.address;
			const gallery = await NFTGallery.new(marketAddress);
			const nftContractAddress = gallery.address;

			// const Market = await ethers.getContractFactory("NFTMarket");
			// const market = await Market.deploy();
			// await market.deployed();
			// const marketAddress = market.address;

			// const NFT = await ethers.getContractFactory("NFTGallery");
			// const nft = await NFT.deploy(marketAddress);
			// await nft.deployed();
			// const nftContractAddress = nft.address;

			let listingPrice = await market.getListingPrice();
			listingPrice = listingPrice.toString();

			// const auctionPrice = ethers.utils.parseUnits("1", "ether");

			await gallery.createToken("https://www.tokenurl1.com");
			await gallery.createToken("https://www.tokenurl2.com");

			// await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
			// 	value: listingPrice,
			// });

			// await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
			// 	value: listingPrice,
			// });

			await market.createMarketItem(nftContractAddress, 1, {
				value: listingPrice,
			});

			await market.createMarketItem(nftContractAddress, 2, {
				value: listingPrice,
			});

			// const buyerAddress = "0x9B1a3b1B56595e55172b9345CcfC6535Ee4C0c44";
			// const [_, buyerAddress] = await ethers.getSigners();

			await market.connect(buyerAddress).createMarketSale(
				nftContractAddress,
				1,
				{ value: listingPrice }
			);

			const items = await market.fetchMarketItems();

			console.log("items: ", items);

			// assert.isTrue(true);
		});
	});
});
//     it("was deployed and has an initial value of 0", async () => {
//       // get subject
//       const ssInstance = await NFTGallery.deployed();
//       // verify that it starts with zero
//       const storedData = await ssInstance.getStoredData.call();
//       assert.equal(storedData, 0, `Initial state should be zero`);
//     });
//   });
//   describe("Functionality", () => {
//     it("should store a new value 42", async () => {
//       // get subject
//       const ssInstance = await NFTGallery.deployed();
//       // change the number
//       await ssInstance.setStoredData(42, { from: accounts[0] });
//       // verify we changed the subject
//       const storedData = await ssInstance.getStoredData.call();
//       assert.equal(storedData, 42, `${storedData} was not stored!`);
//     });
//   });
//   it("should not let someone else change the variable", async () => {
//     // grab instance
//     const [owner, badJoe] = accounts;
//     const ssInstance = await NFTGallery.new(42);
//     try {
//       await ssInstance.setStoredData(22, { from: badJoe })
//     } catch(err) { }
//     const balance = await web3.eth.getBalance(accounts[2]);
//     console.log(balance);
//     const storedData = await ssInstance.getStoredData.call();
//     assert.equal(storedData, 42, 'storedData was not changed!')
//   })
// });

// from previous test simple storage:
// pragma solidity >=0.4.21 <0.7.0;

// contract TestSimpleStorage {

//   function testItStoresAValue() public {
//     SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

//     simpleStorage.set(89);

//     uint expected = 89;

//     Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
