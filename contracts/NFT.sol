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
    }

    //Setting NFT info to collection
    function _setNft(uint256 _tokenId, string memory _title, string memory _artist, string memory _tokenURI, address payable _gallery, address payable _currentOwner, address payable _buyer, uint256 _price) public {
        Item memory item;
        item.tokenId = _tokenId;
        item.artist = _artist;
        item.tokenURI = _tokenURI;
        item.gallery = _gallery;
        item.currentOwner = _currentOwner;
        item.buyer = _buyer;
        item.price = _price;
        item.title = _title;
        item.forSale = true;
        collection.push(item);
        // mint(_gallery, _price, _tokenURI);
        // return Item;
    }

    //Getting the collection data
    function getNft(uint _index) public view returns (uint256 _tokenId, bool _forSale) {
        Item storage item = collection[_index];
        return (item.tokenId, item.forSale);
    }

    event Mint(address owner, uint256 price, uint256 id, string uri);

    //Mint all - how to get preloaded IPFS files upon connection -- only one right now
    function mint(uint256 _tokenId, string memory _title, string memory _artist, string memory _tokenURI, address payable _gallery, address payable _currentOwner, address payable _buyer, uint256 _price) public returns (uint256) {
        require(galleryOnlyMinter[_gallery], "Only the gallery can mint!");
        uint256 tokenId = _tokenCounter.current();
        _tokenCounter.increment();
        _safeMint(_gallery, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _setNft(_tokenId, _title, _artist, _tokenURI, _gallery, _currentOwner, _buyer, _price);
        emit Mint(_gallery, _price, tokenId, _tokenURI);
        return tokenId;
    }








    modifier isOwner() {
        require(msg.sender == _owner, "Not the owner!");
        _;
    }

    mapping(uint256 => string) _tokenURIs;
    mapping(uint256 => bool) public forSale;
    mapping(uint256 => uint256) public price;
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    // Mapping owner address to token count
    mapping(address => uint256) private _balances;



    // Figure out how to return token Id
    // function getTokenId(uint256 tokenId, address owner) public view returns (uint, uint) {

    // }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        override
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



    //From Open Zepp for reference
    // function _transfer(address from, address to, uint256 tokenId) internal override virtual {
    //     require(ERC721.ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
    //     require(to != address(0), "ERC721: transfer to the zero address not allowed");
    //     _beforeTokenTransfer(from, to, tokenId);
    //     //Clear approvals from the previous owner
    //     _approve(address(0), tokenId);
    //     _balances[from] -= 1;
    //     _balances[to] += 1;
    //     _owners[tokenId] = to;
    //     emit Transfer(from, to, tokenId);
    // }

    event Purchase(address owner, uint256 price, uint256 id, string uri);

    function buy(uint256 _id) external payable {
        _validate(_id);
        _trade(_id);
        emit Purchase(msg.sender, price[_id], _id, tokenURI(_id));
    }

    function _validate(uint256 _id) internal {
        require(_exists(_id), "Error, wrong Token id");
        require(msg.value >= price[_id], "Error, Token costs more");
    }

    function _trade(uint256 _id) internal {
        _transfer(address(this), msg.sender, _id);
        _owner.transfer(msg.value);
        forSale[_id] = true;
    }
}
