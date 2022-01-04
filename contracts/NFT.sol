// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// contract NFT is ERC721, Ownable {
contract NFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenCounter;
    struct Item {
        uint256 tokenId;
        string title;
        string artist;
        string tokenURI;
        address payable gallery;
        address payable currentOwner;
        address payable buyer;
        uint256 price;
        bool forSale;
    }

    // Puts all pieces in a collection
    Item[] public collection;

    // Has owner
    address payable public _owner;

    // FOR MINTING & MINTER ROLE
    // Creates role for minting only
    mapping(address => bool) public galleryOnlyMinter;

    function getMinterRole(address _account) public view returns (bool) {
        return galleryOnlyMinter[_account];
    }

    function addMinter(address _minter) public payable {
        require(galleryOnlyMinter[_minter] == false);
        galleryOnlyMinter[_minter] = true;
    }

    // Contract can get data and msg not destroyed
    receive() external payable {}

    fallback() external payable {}

    // FOR CHECKING TOTAL SUPPLY
    function totalSupply() public view returns (uint256) {
        return _tokenCounter.current();
    }

    // Initialize contract while deployment with contract's collection name and token
    constructor(address payable gallery) ERC721("NFT Gallery", "NFT") {
        // _owner = msg.sender;
        // _setBaseURI("ipfs://");
        // tokenCounter = 0;
        // _mint(msg.sender, 1);
    }

    //Setting NFT info to collection
    function _setNft(string memory _title, string memory _artist, string memory _tokenURI, address payable _gallery, address payable _currentOwner, address payable _buyer, uint256 _price) public returns (string memory) {
        Item memory item;
        item.tokenId = totalSupply();
        item.artist = _artist;
        item.tokenURI = _tokenURI;
        item.gallery = _gallery;
        item.currentOwner = _currentOwner;
        item.buyer = _buyer;
        item.price = _price;
        item.title = _title;
        item.forSale = true;
        collection.push(item);
        return (collection[item.tokenId - 1].tokenURI);
    }

    //Getting the collection data
    function checkNft(uint _index) public view returns (uint256 _tokenId, string memory _artist, string memory _title, bool _forSale, string memory _tokenURI, address _currentOwner) {
        Item storage item = collection[_index];
        return (item.tokenId, item.artist, item.title, item.forSale, item.tokenURI, item.currentOwner);
    }

    event Mint(address owner, uint256 price, uint256 id, string uri);

    //Mint all - how to get preloaded IPFS files upon connection -- only one right now
    function mint(string memory _title, string memory _artist, string memory _tokenURI, address payable _gallery, address payable _currentOwner, address payable _buyer, uint256 _price) public returns (uint256) {
        require(galleryOnlyMinter[_gallery], "Only the gallery can mint!");
        uint256 tokenId = _tokenCounter.current();
        _tokenCounter.increment();
        _safeMint(_gallery, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _setNft(_title, _artist, _tokenURI, _gallery, _currentOwner, _buyer, _price);
        emit Mint(_gallery, _price, tokenId, _tokenURI);
        return tokenId;
    }

    // modifier isOwner() {
    //     require(msg.sender == _owner, "Not the owner!");
    //     _;
    // }

// Mapping for tokenURIs
    mapping(uint256 => string) _tokenURIs;

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
    {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId));
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    event Purchase(address _seller, address _buyer, uint256 _price);

// Reference: https://stackoverflow.com/questions/67317392/how-to-transfer-a-nft-from-one-account-to-another-using-erc721
//How to simulate the sale:

// The contract deployer (msg.sender) gets token ID 1.
// Execute allowBuy(1, 2) that will allow anyone to buy token ID 1 for 2 wei.
// From a second address, execute buy(1) sending along 2 wei, to buy the token ID 1.
// Call (the parent ERC721) function ownerOf(1) to validate that the owner is now the second address.
    function allow(uint256 _tokenId, address payable buyer) external {
        require(msg.sender == ownerOf(_tokenId), "Not the owner of this token!");
        approve(buyer, _tokenId);
        collection[_tokenId].forSale == true;
    }

    function disallow(uint256 _tokenId) external view {
        require(msg.sender == ownerOf(_tokenId), "Not the owner of this token!");
        collection[_tokenId].forSale == false;
    }

    function buy(uint256 _tokenId) external payable {
        require(msg.sender != address(0));
        require(collection[_tokenId].forSale == true, "This token is not for sale!");
        require(msg.value >= collection[_tokenId].price, "Incorrect value!");
        address seller = collection[_tokenId].currentOwner;
        payable(seller).transfer(msg.value); // send to the seller
        collection[_tokenId].forSale == false;
        collection[_tokenId].currentOwner == msg.sender;
        emit Purchase(seller, msg.sender, msg.value);
    }
    
    // function buy(uint256 _id) external payable {
    //     _validate(_id);
    //     _trade(_id);
    //     emit Purchase(msg.sender, collection[_id].price, _id, collection[_id].tokenURI);
    // }

    // function _validate(uint256 _id) internal {
    //     require(_exists(collection[_id].tokenId), "Error, wrong Token id");
    //     require(msg.value >= collection[_id].price, "Error, Token costs more");
    // }

    // function _trade(uint256 _id) internal {
    //     _transfer(address(this), msg.sender, collection[_id].tokenId);
    //     _owner.transfer(msg.value);
    //     collection[_id].forSale = true;
    // }
}
