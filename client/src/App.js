import React, { useState, useEffect } from "react";
// import React, { Component } from "react";
// import { NFTStorage, File } from "nft.storage";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import Popup from "./components/Popup/popup.js";
import "./App.css";
import Web3 from "web3";

// This is the top of application.js
require("dotenv").config();

// // Using NFT Storage API Key from dotenv
// const apiKey = process.env.NFT_STORAGE_API_KEY;
// const client = new NFTStorage({ token: apiKey });
// // const metadata = await client.store({
// // })

// Hard coding the nft data for minting all at once
const gallery = "0xf96ad6d96Ff2387224F1521A3861Ed16F865f1B0";
const buyer = "0x101a150e1cf42f806dc930ec4287f93d533a6720";
const url = "https://ipfs.io/ipfs/";
let nftArray = [
	{
		name: "moon",
		title: "White Moon Over Blue Seascape",
		artist: "Rebecca Johnson",
		tokenURI:
			url + "bafybeigmzl32jd3c7xiqtd4nphmjwkxgs4dvxqvmfqv7sk3xdhdwpublny",
		minter: gallery,
		owner: gallery,
		price: 1,
	},
	{
		name: "wolf",
		title: "White Wolf Over Red Landscape",
		artist: "Rebecca Johnson",
		tokenURI:
			url + "bafybeig3l6fag6fbzzxj3syzxco3ul6j2uy5ocyxx7j3m4t7hmsdqwc66i",
		minter: gallery,
		owner: gallery,
		price: 1,
	},
	{
		name: "flower",
		title: "Flower Over Purple Desert",
		artist: "Rebecca Johnson",
		tokenURI:
			url + "bafybeiflu2fdax4i7o6g2eoyu6to7qs7cdol5s3vmqsnvpc6nml4tfo5ju",
		minter: gallery,
		owner: gallery,
		price: 1,
	},
	{
		name: "stork",
		title: "Red Stork Over White Gaudi Feature",
		artist: "Rebecca Johnson",
		tokenURI:
			url + "bafybeia23kjkkvtgxwbxqhojdbzlmxxuhi7ffuxfuerot4hzpe7umttjva",
		minter: gallery,
		owner: gallery,
		price: 1,
	},
	{
		name: "disco",
		artist: "Rebecca Johnson",
		tokenURI:
			url + "bafybeido4wnjbmthgpygr5wubsiodnavmdbmlf7hbp262leaptffls2qdm",
		title: "Disco Ball Over Red Partyscape",
		minter: gallery,
		owner: gallery,
		price: 1,
	},
];

// HOOKS, FUNCTIONAL COMPONENTS AND LIFECYCLE METHOD BELOW

function App() {
	// State variables
	const [web3, setWeb3] = useState(null);
	const [accounts, setAccounts] = useState([]);
	const [balance, setAccountBalance] = useState("");
	const [contract, setContract] = useState(null);
	const [tokenURIs, setTokenURIs] = useState([]);
	const [owners, setOwners] = useState([]);

	const [currentURI, setCurrentURI] = useState("");
	const [currentOwner, setCurrentOwner] = useState("");

	const [nftCollection, setNftCollection] = useState([]);
	const [totalTokensMinted, setTotalTokensMinted] = useState(0);

	const [totalTokensOwnedByAccount, setTotalTokensOwnedByAccount] = useState(0);
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const [artTitles, setArtTitles] = useState([]);
	const [artists, setArtists] = useState([]);
	const [artPrices, setArtPrices] = useState([]);
	const [numberOfTransfers, setNumberOfTransfers] = useState(0);
	const [forSale, setForSale] = useState(false);
	const [piece, setPiece] = useState(null);

	// Load Web3
	const loadWeb3 = async () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert("Non-Ethereum browser detected. Please use Metamask!");
		}
	};

	// Load Blockchain data
	const loadBlockchainData = async () => {
		const web3 = await getWeb3();
		// Use web3 to get the user's accounts.
		const accounts = await web3.eth.getAccounts();
		if (accounts.length === 0) {
			console.log("No accounts loaded!");
		} else {
			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = NFT.networks[networkId];
			const instance = new web3.eth.Contract(NFT.abi, deployedNetwork.address);
			setContract(instance);
			// Set account to first
			setAccounts(accounts[0]);
			// Get balance and set
			const balance = await web3.eth
				.getBalance(accounts[0])
				.then((result) => web3.utils.fromWei(result, "ether"));
			setAccountBalance(balance);
			// Set web3, accounts, and contract to the state
			setWeb3(web3);
		}
	};
	// Add minter
	const addCurrentMinter = async (x) => {
		const res = await contract.methods.addMinter(x).send({ from: accounts });
		console.log(res);
	};

	// Mint all NFTs - not working
	const mintAllNfts = async () => {
		for (let i = 0; i < nftArray.length; i++) {
			await contract.methods
				.mint(
					nftArray[i].name,
					nftArray[i].title,
					nftArray[i].artist,
					nftArray[i].tokenURI,
					nftArray[i].minter,
					nftArray[i].owner,
					nftArray[i].price
				)
				.send({ from: accounts });
		}
		window.location.reload();
	};

	// Check quantity of total minted tokens and set to address count
	const checkMintedTokens = async () => {
		const minted = await contract.methods.getNumberOfTokensMinted().call();
		console.log(minted);
		setTotalTokensMinted(minted);
		const ownerTokens = await contract.methods
			.getTotalNumberOfTokensOwnedByAnAddress(accounts)
			.call();
		setTotalTokensOwnedByAccount(ownerTokens);
		// Get all token info and set to state - not working
		getAllTokenInfo();
	};

	// Get token info
	const getAllTokenInfo = async () => {
		for (let i = 1; i < 6; i++) {
			const returnedItem = await contract.methods.getItem(i).call();
			console.log(returnedItem);
			setNftCollection(...nftCollection, returnedItem);
		}
	};

	// Connecting to web3 and getting initial balances, and sets off character
	useEffect(() => {
		const init = async () => {
			// Load web3
			await loadWeb3();
			// Load Blockchain data
			await loadBlockchainData();
			try {
				// character movement logic
				var character = document.querySelector(".Character");
				var map = document.querySelector(".map");

				// state of character
				var x = 40;
				var y = 35;
				var heldDirections = [];
				var speed = 0.75;

				const placeCharacter = () => {
					var pixelSize = parseInt(
						getComputedStyle(document.documentElement).getPropertyValue(
							"--pixel-size"
						)
					);

					const heldDirection = heldDirections[0];
					if (heldDirection) {
						if (heldDirection === directions.right) {
							x += speed;
						}
						if (heldDirection === directions.left) {
							x -= speed;
						}
						if (heldDirection === directions.down) {
							y += speed;
						}
						if (heldDirection === directions.up) {
							y -= speed;
						}
						character.setAttribute("facing", heldDirection);
					}
					character.setAttribute("walking", heldDirection ? "true" : "false");

					// wall boundaries
					var leftLimit = 35;
					var rightLimit = 16 * 9 + 2;
					var topLimit = -8 + 35;
					var bottomLimit = 16 * 7 + 24;
					if (x < leftLimit) {
						x = leftLimit;
					}
					if (x > rightLimit) {
						x = rightLimit;
					}
					if (y < topLimit) {
						y = topLimit;
					}
					if (y > bottomLimit) {
						y = bottomLimit;
					}

					var camera_left = pixelSize * 75;
					var camera_top = pixelSize * 41;

					map.style.transform = `translate3d( ${
						-x * pixelSize + camera_left
					}px, ${-y * pixelSize + camera_top}px, 0 )`;
					character.style.transform = `translate3d( ${x * pixelSize}px, ${
						y * pixelSize
					}px, 0 )`;
				};

				// set up the game loop
				const step = () => {
					placeCharacter();
					window.requestAnimationFrame(() => {
						step();
					});
				};
				step();

				// open modal on space bar
				const openModal = () => {
					// console.log(x, y);
					if (x >= 34 && x <= 42 && y >= 50 && y <= 60) {
						console.log("Modal opened for NFT 1");
						setPiece(1);
						handleShow();
					} else if (x >= 85 && x <= 95 && y >= 72 && y <= 82) {
						setPiece(2);
						handleShow();
						console.log("Modal opened for NFT 2");
					} else if (x >= 141 && x <= 151 && y >= 89 && y <= 99) {
						setPiece(3);
						handleShow();
						console.log("Modal opened for NFT 3");
					} else if (x >= 30 && x <= 40 && y >= 100 && y <= 110) {
						setPiece(4);
						handleShow();
						console.log("Modal opened for NFT 4");
					} else if (x >= 85 && x <= 95 && y >= 22 && y <= 32) {
						setPiece(5);
						handleShow();
						console.log("Modal opened for NFT 5");
					} else if (x >= 87 && x <= 92 && y >= 132 && y <= 136) {
						alert(`Please don't go!`);
						return;
					} else {
						alert(`Try landing on a green dot for art!`);
						return;
					}
				};

				// key listener for space
				document.addEventListener("keydown", (event) => {
					if (event.keyCode === 32) {
						openModal();
						// console.log(x, y);
					} else {
						return;
					}
				});

				//direction key state
				const directions = {
					up: "up",
					down: "down",
					left: "left",
					right: "right",
				};
				const keys = {
					38: directions.up,
					37: directions.left,
					39: directions.right,
					40: directions.down,
				};
				document.addEventListener("keydown", (e) => {
					var dir = keys[e.which];
					if (dir && heldDirections.indexOf(dir) === -1) {
						heldDirections.unshift(dir);
					}
				});
				document.addEventListener("keyup", (e) => {
					var dir = keys[e.which];
					var index = heldDirections.indexOf(dir);
					if (index > -1) {
						heldDirections.splice(index, 1);
					}
				});
				// end of player movement logic
			} catch (error) {
				// Catch any errors for any of the above operations.
				alert(
					`Failed to load web3, accounts, or contract. Check console for details.`
				);
				console.error(error);
			}
		};
		init();
	}, []);

	// setMetaData = async () => {
	// 	this.state.nftCollection.map(async (piece) => {
	// 		const result = await fetch(piece.tokenURI);
	// 		const metaData = await result.json();
	// 		setNftCollection({
	// 			nftCollection.tokenId.toNumber() === Number(metaData.tokenId)
	// 		}))
	// 	})
	// }

	// //Buy an NFT art piece
	// buyNft = (tokenId, price) => {
	// 	this.state.nftCollection.methods
	// 		.buyToken(tokenId)
	// 		.send({ from: this.state.accounts, value: price })
	// 		.on("confirmation", () => {
	// 			console.log("Bought?");
	// 			window.location.reload();
	// 		});
	// };

	// //Toggle forSale
	// const toggleForSale = async () => {
	// 	if (accounts == gallery) {
	// 		contract.methods
	// 			.toggleForSale(tokenId)
	// 			.send({ from: accounts })
	// 			.on("confirmation", () => {
	// 				console.log("Toggled!");
	// 				window.location.reload();
	// 			});
	// 	} else {
	// 		alert("Only the gallery can toggle the availability!");
	// 	}
	// };

	if (typeof web3 === "undefined") {
		return <div>Loading Web3, accounts, and contract...</div>;
	}
	return (
		<div className="App">
			<h1 className="Header">NFT GALLERY</h1>
			<button onClick={() => addCurrentMinter(accounts)} className="loadBtn">
				Add Minter
			</button>
			<button onClick={mintAllNfts} className="loadBtn">
				Load NFTs
			</button>
			<button onClick={checkMintedTokens} className="loadBtn">
				Check Qty Minted: {totalTokensMinted}
			</button>
			<p className="directions">
				Use the arrow keys to move and the space bar to select a piece.
			</p>
			<div className="camera">
				<div
					className="map background-img"
					alt="mapping"
					src="../../assets/Gallery-Base.png"
				>
					<div className="Character">
						<img
							className="Character_spritesheet pixelart"
							alt="characer"
							src="../../assets/Sprite-BG.png"
						/>
					</div>
				</div>
			</div>
			<div className="popWrap">
				<Popup
					onClose={handleClose}
					contract={contract}
					accounts={accounts}
					balance={balance}
					show={show}
					totalTokensOwnedByAccount={totalTokensOwnedByAccount}
					tokenURIs={tokenURIs}
					// toggleForSale={toggleForSale}
					piece={piece}
					// owners={owners}
					currentOwner={currentOwner}
				/>
			</div>
		</div>
	);
}

export default App;
