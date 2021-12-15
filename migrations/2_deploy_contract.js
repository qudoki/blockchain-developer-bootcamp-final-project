const NFT = artifacts.require('./NFT.sol');

module.exports = async function (deployer, _network, address) {
    await deployer.deploy(NFT, address[0]);
    const nftContract = await NFT.deployed();
    console.log("NFT Gallery deployed to:", nftContract.address);
}