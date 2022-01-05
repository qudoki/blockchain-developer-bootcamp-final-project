// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFT is ERC721URIStorage, Ownable {
    // using Counters for Counters.Counter;
    // Counters.Counter private _tokenCounter;

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
    // Item[] public collection;
    mapping(uint256 => Item) public collection;

    // Checking if token name exists
    mapping(string => bool) public tokenNameExists;
    // Check if tokenURI exists
    mapping(string => bool) public tokenURIExists;

    // Creates role for minting only
    mapping(address => bool) public galleryOnlyMinter;

    // // Mapping for tokenURIs
    // mapping(uint256 => string) _tokenURIs;

    // Initialize contract while deployment with contract's collection name and token
    constructor() ERC721("NFT Gallery", "NFT") {
        collectionName = name();
        collectionNameSymbol = symbol();
        // _owner = msg.sender;
        // _setBaseURI("ipfs://");
        // tokenCounter = 0;
        // _mint(msg.sender, 1);
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

    //Mint all - how to get preloaded IPFS files upon connection -- only one right now
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

        // Emit mint event
        emit Mint(_gallery, _price, tokenCounter, _tokenURI);
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



    //Getting the collection data
    // function checkNft(uint _index) public view returns (uint256 _tokenId, string memory _artist, string memory _title, bool _forSale, string memory _tokenURI, address _currentOwner) {
    //     Item storage item = collection[_index];
    //     return (item.tokenId, item.artist, item.title, item.forSale, item.tokenURI, item.currentOwner);
    // }

    // FOR CHECKING TOTAL SUPPLY
    // function totalSupply() public view returns (uint256) {
    //     return tokenCounter.current();
    // }

    // function _setTokenURI(uint256 tokenId, string memory _tokenURI)
    //     internal
    // {
    //     _tokenURIs[tokenId] = _tokenURI;
    // }

    // function tokenURI(uint256 tokenId)
    //     public
    //     view
    //     virtual
    //     override
    //     returns (string memory)
    // {
    //     require(_exists(tokenId));
    //     string memory _tokenURI = _tokenURIs[tokenId];
    //     return _tokenURI;
    // }

    // event Purchase(address _seller, address _buyer, uint256 _price);

    // Reference: https://stackoverflow.com/questions/67317392/how-to-transfer-a-nft-from-one-account-to-another-using-erc721
    //How to simulate the sale:

    // The contract deployer (msg.sender) gets token ID 1.
    // Execute allowBuy(1, 2) that will allow anyone to buy token ID 1 for 2 wei.
    // From a second address, execute buy(1) sending along 2 wei, to buy the token ID 1.
    // Call (the parent ERC721) function ownerOf(1) to validate that the owner is now the second address.
    // function allow(uint256 _tokenId, address payable buyer) external {
    //     require(msg.sender == ownerOf(_tokenId), "Not the owner of this token!");
    //     approve(buyer, _tokenId);
    //     collection[_tokenId].forSale == true;
    // }

    // function disallow(uint256 _tokenId) external view {
    //     require(msg.sender == ownerOf(_tokenId), "Not the owner of this token!");
    //     collection[_tokenId].forSale == false;
    // }

    // function buy(uint256 _tokenId) external payable {
    //     require(msg.sender != address(0));
    //     require(collection[_tokenId].forSale == true, "This token is not for sale!");
    //     require(msg.value >= collection[_tokenId].price, "Incorrect value!");
    //     address seller = collection[_tokenId].currentOwner;
    //     payable(seller).transfer(msg.value); // send to the seller
    //     collection[_tokenId].forSale == false;
    //     collection[_tokenId].currentOwner == msg.sender;
    //     emit Purchase(seller, msg.sender, msg.value);
    // }
}
