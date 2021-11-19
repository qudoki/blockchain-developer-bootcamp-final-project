const NFT = artifacts.require('./NFT.sol');
const TOKENID = 0
module.exports = async callback => {
    const nftTx = await NFT.deployed()
    console.log('Let\'s set the tokenURI of your pieces')
    const tx = await nftTx.setTokenURI(0, "")
    const tx1 = await nftTx.setTokenURI(1, "")
    const tx2 = await nftTx.setTokenURI(2, "")
    const tx3 = await nftTx.setTokenURI(3, "")
    const tx4 = await nftTx.setTokenURI(4, "")
    const tx5 = await nftTx.setTokenURI(5, "")
    const tx6 = await nftTx.setTokenURI(6, "")
    console.log(tx)
    callback(tx.tx)
}


// sample ipfs address for "": https://ipfs.io/ipfs/QmaSED9ZSbdGts5UZqueFJjrJ4oHH3GnmGJdSDrkzpYqRS?filename=the-chainlink-knight.json