// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTGallery is ERC721 {
    using SafeMath for uint256;

    address public owner;
    uint256 public purchasePrice;
    // address public currentOwner;
    mapping(uint256 => bool) public sold;
    mapping(uint256 => uint256) public listIdPricing;
    event Purchase(
        address owner,
        uint256 listIdPricing,
        uint256 id,
        string uri
    );
    bool public stopped = false;

    //only owner access
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //stopping others during purchase
    modifier stopInCaseOfEmergency() {
        require(!stopped);
        _;
    }

    modifier onlyInCaseOfEmergency() {
        require(stopped);
        _;
    }

function getBalance(uint256) public {
    
}

    //test from simple storage
    // function set(uint256 x) public {
    //     storedData = x;
    // }

    function emergency() public onlyOwner {
        if (stopped == false) {
            stopped = true;
        } else {
            stopped = false;
        }
    }

    //sets contract owner as currentOwner
    constructor() public ERC721("NFT Gallery Pieces", "Artwork") {
        owner = msg.sender;
    }

    // function mint(string memory _tokenURI, uint256 _price)
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

    //     function _trade(uint256 _id) internal {
    //         _transfer(address(this), msg.sender, _id);
    //         _owner.transfer(msg.value);
    //         sold[_id] = true;
    //     }
}
