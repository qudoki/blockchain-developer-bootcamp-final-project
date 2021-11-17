const NFT = artifacts.require('./NFTGallery.sol');

module.exports = async function (deployer, _network, accounts) {
    await deployer.deploy(NFT);
    const nft = await NFT.deployed();
    await nft.mint(accounts[0]);
}