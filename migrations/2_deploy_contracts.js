const NFTGallery = artifacts.require('./NFTGallery.sol');
const NFTMarket = artifacts.require('./NFTMarket.sol');

module.exports = async function (deployer, accounts) {
    await deployer.deploy(NFTGallery);
    const nftGallery = await NFTGallery.deployed();
    console.log("nftgallery deployed to:", nftGallery.address);

}

module.exports = async function (deployer) {
    await deployer.deploy(NFTMarket);
    const nftMarket = await NFTMarket.deployed();
    console.log("nftmarket deployed to:", nftMarket.address);
}

// module.exports = async function (deployer, _network, accounts) {