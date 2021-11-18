const assert = require("assert");
const NFTGallery = artifacts.require("NFTGallery");
const NFTMarket = artifacts.require("NFTMarket");

// import { ENGINE_METHOD_CIPHERS } from "constants";
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NFTGallery.sol";
import "../contracts/NFTMarket.sol";

// let address;
// let owner;
// let purchasePrice;
// let currentOwner;
// let sold;
// let listIdPricing;
// let stopped;

contract("NFTGallery", function () {
	describe("Should create and execute market sales", async () => {
		it("should assert true", async function () {
			const Market = await NFTMarket.deployed();
			const marketAddress = Market.address;
			const NFT = await NFTGallery.deployed();
			const nftContractAddress = NFT.address;

			let listingPrice = await Market.getListingPrice();
			listingPrice = listingPrice.toString();

			//ignoring getting auction price
			const auctionPrice = ethers.utils.parseUnits("100", "ether");

			await NFTGallery.createToken("tokenurl1");
			await NFTGallery.createToken("tokenurl2");

			await NFTMarket.createMarketItem(nftContractAddress, 1, auctionPrice, {
				value: listingPrice,
			});
			await NFTMarket.createMarketItem(nftContractAddress, 2, auctionPrice, {
				value: listingPrice,
			});

			const [_, buyerAddress] = await ethers.getSigners();

			await Market.connect(buyerAddress).createMarketSale(
				nftContractAddress,
				1,
				{ value: auctionPrice }
			);

			const items = await Market.fetchMarketItems();

			console.log("items: ", items);

			assert.isTrue(true);
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
