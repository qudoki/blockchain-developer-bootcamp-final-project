// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFT is ERC721URIStorage, Ownable {
    // Contract's collection name
    string public collectionName;
    // Contract's token symbol
    string public collectionNameSymbol;
    // Total number of NFT's minted
    uint256 public tokenCounter;
    struct Item {
        uint256 tokenId;
        string title;
        string artist;
        string tokenURI;
        address payable gallery; //minted by
        address payable currentOwner;
        uint256 price;
        uint256 numberOfTransfers;
        bool forSale;
    }

    // Puts all pieces in a collection
    mapping(uint256 => Item) public collection;

    // Checking if token name exists
    mapping(string => bool) public tokenNameExists;
    // Check if tokenURI exists
    mapping(string => bool) public tokenURIExists;

    // Creates role for minting only
    mapping(address => bool) public galleryOnlyMinter;

    // Initialize contract while deployment with contract's collection name and token
    constructor() ERC721("NFT Gallery", "NFT") {
        collectionName = name();
        collectionNameSymbol = symbol();
    }

    // Minting permissions
    function getMinterRole(address _account) public view returns (bool) {
        return galleryOnlyMinter[_account];
    }

    function addMinter(address _minter) public payable {
        require(galleryOnlyMinter[_minter] == false);
        galleryOnlyMinter[_minter] = true;
    }

    event Mint(address owner, uint256 price, uint256 id, string uri);

    //Minting function
    function mint(
        string memory _name,
        string memory _title,
        string memory _artist,
        string memory _tokenURI,
        address payable _gallery,
        address payable _currentOwner,
        uint256 _price
    ) public {
        // Only the gallery can mint
        require(galleryOnlyMinter[_gallery], "Only the gallery can mint!");
        // Increment Counter
        tokenCounter++;
        // Check if token exists with above token id (incremented counter)
        require(!_exists(tokenCounter));
        // Check if token URI exists
        require(!tokenURIExists[_tokenURI]);
        // Check if token name exists
        require(!tokenNameExists[_tokenURI]);
        // Make passed token URI as exists
        tokenURIExists[_tokenURI] = true;
        // Make token name passed as exists
        tokenNameExists[_name] = true;

        // Minting
        _mint(_gallery, tokenCounter);
        // Set tokenURI (bind token id with the passed in token URI)
        _setTokenURI(tokenCounter, _tokenURI);

        // Emit mint event
        emit Mint(_gallery, _price, tokenCounter, _tokenURI);

        // Create a new NFT item struct and pass in new values
        Item memory newItem = Item(
            tokenCounter,
            _title,
            _artist,
            _tokenURI,
            _gallery,
            _currentOwner,
            _price,
            0,
            true
        );

        collection[tokenCounter] = newItem;
    }

    // Get owner of the token
    function getTokenOwner(uint256 _tokenId) public view returns (address) {
        address _tokenOwner = ownerOf(_tokenId);
        return _tokenOwner;
    }

    // Get metadata of token
    function getTokenMetaData(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        string memory tokenMetaData = tokenURI(_tokenId);
        return tokenMetaData;
    }

    // Get total number of tokens minted
    function getNumberOfTokensMinted() public view returns (uint256) {
        uint256 totalNumberOfTokensMinted = tokenCounter;
        return totalNumberOfTokensMinted;
    }

    // Get total number of tokens owned by an address
    function getTotalNumberOfTokensOwnedByAnAddress(address _owner)
        public
        view
        returns (uint256)
    {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }

    // Check if the token already exists
    function getTokenExists(uint256 _tokenId) public view returns (bool) {
        bool tokenExists = _exists(_tokenId);
        return tokenExists;
    }

    event Purchase(address _seller, address _buyer, uint256 _price);

    // Buying a token by passing in the token ID
    function buy(uint256 _tokenId) public payable {
        // Check if the function caller is not a zero account address
        require(msg.sender != address(0));
        // Check if the id exists
        require(_exists(_tokenId));
        // Get the token's owner
        address tokenOwner = ownerOf(_tokenId);
        // Function caller should not be the owner
        require(tokenOwner != msg.sender);
        // Get the token from collection mapping and create memory of it as defined from struct => newItem
        Item memory newItem = collection[_tokenId];
        // Price sent in to buy should >= token's price
        require(msg.value >= newItem.price);
        // Token should be for sale
        require(newItem.forSale = true);
        // Transfer token from owner to buyer
        _transfer(tokenOwner, msg.sender, _tokenId);
        // Get owner of the token
        address payable sendTo = newItem.currentOwner;
        // Send token's value to the owner
        sendTo.transfer(msg.value);
        // Update current owner
        newItem.currentOwner = payable(msg.sender);
        newItem.numberOfTransfers += 1;
        collection[_tokenId] = newItem;
        emit Purchase(tokenOwner, msg.sender, msg.value);
    }

    // Toggle forSale
    function toggleForSale(uint256 _tokenId) public {
        // Require token exists
        require(_exists(_tokenId));
        // Get token's owner
        address tokenOwner = ownerOf(_tokenId);
        // Check token's owner should be caller
        require(tokenOwner == msg.sender);
        // Get the token from collection mapping and create memory of it as defined from struct => newItem
        Item memory newItem = collection[_tokenId];
        // Toggle forSale
        if(newItem.forSale = true) {
            newItem.forSale = false;
        } else {
            newItem.forSale = true;
        }
        collection[_tokenId] = newItem;
    }

}
