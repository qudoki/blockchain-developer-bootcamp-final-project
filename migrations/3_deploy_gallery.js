const NFTGallery = artifacts.require('./NFTGallery.sol');

module.exports = async function (deployer, _network, address) {
    await deployer.deploy(NFTGallery, address[0]);
    const nftGallery = await NFTGallery.deployed();
    console.log("nftgallery deployed to:", nftGallery.address);
}