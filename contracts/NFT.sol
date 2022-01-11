// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

/// @title A gallery for NFTs
/// @author Qian Dong-Kilkenny
/// @notice You can use this contract for minting, purchasing, and extracting info.
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFT is ERC721URIStorage, Ownable {
    /// @notice Contract's collection name
    string public collectionName;
    /// @notice Contract's token symbol
    string public collectionNameSymbol;
    /// @notice Total number of NFT's from minting
    uint256 public tokenCounter;
    struct Item {
        uint256 tokenId;
        string name;
        string title;
        string artist;
        string tokenURI;
        address payable gallery;
        address payable currentOwner;
        uint256 price;
        uint256 numberOfTransfers;
        bool forSale;
    }

    /// @notice Puts all pieces in a collection
    mapping(uint256 => Item) public collection;
    /// @notice Checking if token name exists
    mapping(string => bool) public tokenNameExists;
    /// @notice Check if tokenURI exists
    mapping(string => bool) public tokenURIExists;
    /// @notice Creates role for minting only
    mapping(address => bool) public galleryOnlyMinter;

    /// @notice Initialize contract while deployment with contract's collection name and token
    constructor() ERC721("NFT Gallery", "NFT") {
        collectionName = name();
        collectionNameSymbol = symbol();
    }

    /// @notice Minting permissions
    /// @param _account from user
    /// @return boolean allowing minting
    function getMinterRole(address _account) public view returns (bool) {
        return galleryOnlyMinter[_account];
    }
    function addMinter(address _minter) public payable returns (bool) {
        require(galleryOnlyMinter[_minter] == false);
        galleryOnlyMinter[_minter] = true;
        return galleryOnlyMinter[_minter];
    }

    /// @notice Sets up minting event
    event Mint(address owner, uint256 price, uint256 id, string uri);

    /// @notice Minting function
    function mint(
        string memory _name,
        string memory _title,
        string memory _artist,
        string memory _tokenURI,
        address payable _gallery,
        address payable _currentOwner,
        uint256 _price
    ) public {
        /// @notice Only the gallery can mint
        require(
            galleryOnlyMinter[_gallery] == true,
            "Only the gallery can mint!"
        );
        /// @notice Increment Counter
        tokenCounter++;
        /// @notice Check if token exists with above token id (incremented counter)
        require(!_exists(tokenCounter), "Token Count exists!");
        /// @notice Check if token URI exists
        require(!tokenURIExists[_tokenURI], "Token URI exists!");
        /// @notice Check if token name exists
        require(!tokenNameExists[_tokenURI], "Token Name exists!");
        /// @notice Make passed token URI as exists
        tokenURIExists[_tokenURI] = true;
        /// @notice Make token name passed as exists
        tokenNameExists[_name] = true;

        /// @notice Minting
        _mint(_gallery, tokenCounter);
        /// @notice Set tokenURI (bind token id with the passed in token URI)
        _setTokenURI(tokenCounter, _tokenURI);

        /// @notice Emit mint event
        emit Mint(_gallery, _price, tokenCounter, _tokenURI);

        /// @notice Create a new NFT item struct and pass in new values
        Item memory newItem = Item(
            tokenCounter,
            _name,
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


    function getItem(uint256 _tokenId)
        public
        view
        returns (uint256 tokenId, string memory name, string memory title, string memory artist, string memory tokenURI, address gallery, address currentOwner, uint256 price, uint256 numberOfTransfers, bool forSale)
    {
        /// @notice Copy the data into memory
        Item memory x = collection[_tokenId];
        
        /// @notice Break the struct's members out into a tuple in the same order that they appear in the struct
        return (x.tokenId, x.name, x.title , x.artist , x.tokenURI, x.gallery, x.currentOwner, x.price, x.numberOfTransfers, x.forSale);
    }

    /// @notice Get owner of the token
    function getTokenOwner(uint256 _tokenId) public view returns (address) {
        address _tokenOwner = ownerOf(_tokenId);
        return _tokenOwner;
    }

    /// @notice Get metadata of token
    function getTokenMetaData(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        string memory tokenMetaData = tokenURI(_tokenId);
        return tokenMetaData;
    }

    function getNumberTransfers(uint256 _tokenId) public view returns (uint256)
    {
        uint256 num = collection[_tokenId]
            .numberOfTransfers;
        return num;
    }

    /// @notice Get total number of tokens minted
    function getNumberOfTokensMinted() public view returns (uint256) {
        uint256 totalNumberOfTokensMinted = tokenCounter;
        return totalNumberOfTokensMinted;
    }

    /// @notice Get total number of tokens owned by an address
    function getTotalNumberOfTokensOwnedByAnAddress(address _owner)
        public
        view
        returns (uint256)
    {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }

    /// @notice Check if the token already exists
    function getTokenExists(uint256 _tokenId) public view returns (bool) {
        bool tokenExists = _exists(_tokenId);
        return tokenExists;
    }

    /// @notice Sets up purchase event
    event Purchase(address _seller, address _buyer, uint256 _price);

    /// @notice Buying a token by passing in the token ID
    function buy(uint256 _tokenId) public payable {
        /// @notice Check if the function caller is not a zero account address
        require(msg.sender != address(0));
        /// @notice Check if the id exists
        require(_exists(_tokenId));
        /// @notice Get the token's owner
        address tokenOwner = ownerOf(_tokenId);
        /// @notice Function caller should not be the owner
        require(tokenOwner != msg.sender);
        /// @notice Get the token from collection mapping and create memory of it as defined from struct => newItem
        Item memory newItem = collection[_tokenId];
        /// @notice Price sent in to buy should >= token's price
        require(msg.value >= newItem.price);
        /// @notice Token should be for sale
        require(newItem.forSale = true);
        /// @notice Transfer token from owner to buyer
        _transfer(tokenOwner, msg.sender, _tokenId);
        /// @notice Get owner of the token
        address payable sendTo = newItem.currentOwner;
        /// @notice Send token's value to the owner
        sendTo.transfer(msg.value);
        /// @notice Update current owner
        newItem.currentOwner = payable(msg.sender);
        newItem.numberOfTransfers += 1;
        collection[_tokenId] = newItem;
        emit Purchase(tokenOwner, msg.sender, msg.value);
    }

    /// @notice Toggle forSale
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
        if (newItem.forSale = true) {
            newItem.forSale = false;
        } else {
            newItem.forSale = true;
        }
        collection[_tokenId] = newItem;
    }
}