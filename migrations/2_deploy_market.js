const NFTMarket = artifacts.require('./NFTMarket.sol');


// module.exports = async function (deployer, _network, _accounts) {
//     await deployer.deploy(NFTGallery);
//     await deployer.deploy(NFTMarket);

// }

module.exports = async function (deployer) {
    await deployer.deploy(NFTMarket);
    const nftMarket = await NFTMarket.deployed();
    console.log("nftmarket deployed to:", nftMarket.address);
}

// module.exports = async function (deployer, _network, accounts) {