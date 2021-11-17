const NFT = artifacts.require('NFTGallery');

module.exports = async function (deployer, _network, accounts) {
    await deployer.deploy(NFTGallery);
    const nft = await NFT.deployed();
    await nft.mint(accounts[0]);
}