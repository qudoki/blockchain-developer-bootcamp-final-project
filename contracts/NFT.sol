// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFT is ERC721URIStorage, Ownable {
    // has owner
    address _owner = msg.sender;
    mapping(uint256 => bool) public sold;
    mapping(uint256 => uint256) public price;
    // has tokenCounter
    uint public tokenCounter;

    event Purchase(address owner, uint256 price, uint256 id, string uri);

    // initialize contract while deployment with contract's collection name and token
    constructor(address gallery) ERC721("NFT Gallery", "NFT") {
        _owner = gallery;
        tokenCounter = 0;
    }

    // <enum State: ForSale, Sold>
    enum State {
        ForSale,
        NotForSale
    }
    struct Item {
        uint256 tokenId;
        string title;
        string artist;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable buyer;
        uint256 price;
        uint256 numberOfTransfers;
    }

    mapping(uint256 => Item) public collection;

        modifier isOwner() {
        require(msg.sender == _owner, "Not the owner!");
        _;
    }

//NFT Factory
    function createNft(string memory tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter ++;
        return newItemId;
    }

}

// minting a new piece
// function mint(string memory _name, string memory _tokenURI, uint256 _price) external {
//     require(msg.sender != address(0));
// }
//     public
//     onlyOwner
//     returns (bool)
// {
//     uint256 _tokenId = totalSupply() + 1;
//     price[_tokenId] = _price;

//     _mint(address(this), _tokenId);
//     _setTokenURI(_tokenId, _tokenURI);

//     return true;
// }

// function buy(uint256 _id) external payable {
//     _validate(_id);
//     _trade(_id);

//     emit Purchase(msg.sender, price[_id], _id, tokenURI(_id));
// }

// function _validate(uint256 _id) internal {
//     require(_exists(_id), "Error, wrong Token id");
//     require(!sold[_id], "Error, Token is sold");
//     require(msg.value >= price[_id], "Error, Token costs more");
// }

// function _trade(uint256 _id) internal {
//     _transfer(address(this), msg.sender, _id);
//     _owner.transfer(msg.value);
//     sold[_id] = true;
// }
