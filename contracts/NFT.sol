// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// contract NFT is ERC721, Ownable {
contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenCounter;
    mapping(uint256 => string) _tokenURIs;

    // has owner
    address _owner = msg.sender;

    // creates role for minting only
    mapping(address => bool) public galleryOnlyMinter;

    function getMinterRole(address _account) public view returns (bool) {
        return galleryOnlyMinter[_account];
    }

    function addMinter(address _minter) public payable {
        // require(_minter != address(0));
        require(galleryOnlyMinter[_minter] == false);
        galleryOnlyMinter[_minter] = true;
    }

    // contract can get data and msg not destroyed
    receive() external payable {}
    fallback() external payable {}

    // initialize contract while deployment with contract's collection name and token
    constructor(address payable gallery) ERC721("NFT Gallery", "NFT") {
        // _setBaseURI("ipfs://");
        // _owner = gallery;
        // tokenCounter = 0;
    }

    // <enum State: ForSale, NotForSale, Pending>
    enum State {
        ForSale,
        NotForSale,
        Pending
    }
    struct Item {
        uint256 tokenId;
        string title;
        string artist;
        string tokenURI;
        address payable gallery;
        address payable currentOwner;
        address payable buyer;
        uint256 price;
        uint256 numberOfTransfers;
        State status;
    }

    mapping(uint256 => Item) public collection;

    //Checks total supply
    function totalSupply() public view returns (uint256) {
        return _tokenCounter.current();
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) override internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId));
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    //Mint all preloaded IPFS files upon connection -- only one right now
    function mint(address to, string memory uri) public returns (uint256) {
        require(galleryOnlyMinter[to], "Only the gallery can mint!");
        uint256 tokenId = _tokenCounter.current();
        _tokenCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    // modifier isOwner() {
    //     require(msg.sender == _owner, "Not the owner!");
    //     _;
    // }

    event Purchase(address owner, uint256 price, uint256 id, string uri);

        // function buy(uint256 _id) public payable {
        //     _validate(_id);
        //     _trade(_id);
        //     emit Purchase(msg.sender, price[_id], _id, tokenURI(_id));
        // }

        // //If for sale and balance is enough
        // function _validate(uint256 _id) internal {
        //     require(_exists(_id), "Error, wrong Token id");
        //     require(!sold[_id], "Error, Token is not for sale");
        //     require(msg.value >= price[_id], "Error, Token costs more");
        // }

        // function _trade(uint256 _id) internal {
        //     safeTransferFrom(address(this), msg.sender, _id);
        //     sold[_id] = true;
        // }

    
}
