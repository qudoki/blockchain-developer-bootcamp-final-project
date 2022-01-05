import React, { useState, useEffect } from "react";
// import { NFTStorage, File } from "nft.storage";
import NFT from "./contracts/NFT.json";
import getWeb3 from "./getWeb3";
import Popup from "./components/Popup/popup.js";
import "./App.css";

// This is the top of application.js
require("dotenv").config();

// // Using NFT Storage API Key from dotenv
// const apiKey = process.env.NFT_STORAGE_API_KEY;
// const client = new NFTStorage({ token: apiKey });
// // const metadata = await client.store({
// // })

// Hard coding the nft data for minting
const url = "https://ipfs.io/ipfs/";
let nftOne = {
	link: url + "bafybeigmzl32jd3c7xiqtd4nphmjwkxgs4dvxqvmfqv7sk3xdhdwpublny",
	title: "White Moon Over Blue Seascape",
	artist: "Rebecca Johnson",
	minter: "",
	owner: "",
	price: 1,
}
let nftTwo = {
	link: url + "bafybeig3l6fag6fbzzxj3syzxco3ul6j2uy5ocyxx7j3m4t7hmsdqwc66i",
	title: "White Wolf Over Red Landscape",
	artist: "Rebecca Johnson",
	minter: "",
	owner: "",
	price: 1,
}
let nftThree = {
	link: url + "bafybeiflu2fdax4i7o6g2eoyu6to7qs7cdol5s3vmqsnvpc6nml4tfo5ju",
	title: "Flower Over Purple Desert",
	artist: "Rebecca Johnson",
	minter: "",
	owner: "",
	price: 1,
}
let nftFour = {
	link: url + "bafybeia23kjkkvtgxwbxqhojdbzlmxxuhi7ffuxfuerot4hzpe7umttjva",
	title: "Red Stork Over White Gaudi Feature",
	artist: "Rebecca Johnson",
	minter: "",
	owner: "",
	price: 1,
}
let nftFive = {
	link: url + "bafybeido4wnjbmthgpygr5wubsiodnavmdbmlf7hbp262leaptffls2qdm",
	title: "Disco Ball Over Red Partyscape",
	artist: "Rebecca Johnson",
	minter: "",
	owner: "",
	price: 1,
};


function App() {
	// State variables
	const [web3, setWeb3] = useState(undefined);

	const [accounts, setAccounts] = useState("");
	const [balance, setAccountBalance] = useState("");
	const [contract, setContract] = useState(null);
	const [currentOwner, setCurrentOwner] = useState("");
	const [collectionCount, setCollectionCount] = useState(0);
	const [nftCollection, setNftCollection] = useState([]);
	const [loading, setLoading] = useState(true);
	const [metamaskConnected, setMetaMaskConnected] = useState(false);
	const [contractDetected, setContractDetected] = useState(false);
	const [totalTokensMinted, setTotalTokensMinted] = useState(0);
	const [totalTokensOwnedByAccount, setTotalTokensOwnedByAccount] = useState(0);
	const [nameIsUsed, setNameIsUsed] = useState(false);
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	const [tokenURIs, setTokenURIs] = useState([]);
	const [artTitles, setArtTitles] = useState([]);
	const [artPrices, setArtPrices] = useState([]);
	const [numberOfTransfers, setNumberOfTransfers] = useState(0);
	const [forSale, setForSale] = useState(false);

	// Connecting to web 3 and getting initial balances, and sets off character
	useEffect(() => {
		const init = async () => {
			try {
				// Get network provider and web3 instance.
				const web3 = await getWeb3();
				// Use web3 to get the user's accounts.
				const accounts = await web3.eth.getAccounts();
				const balance = await web3.eth
					.getBalance(accounts[0])
					.then((result) => web3.utils.fromWei(result, "ether"));

				// Get the contract instance.
				const networkId = await web3.eth.net.getId();
				const deployedNetwork = NFT.networks[networkId];
				const contract = new web3.eth.Contract(
					NFT.abi,
					deployedNetwork && deployedNetwork.address
				);
				// Set web3, accounts, and contract to the state
				setWeb3(web3);
				setAccounts(accounts[0]);
				setContract(contract);
				setAccountBalance(balance);

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
						handleShow();
					} else if (x >= 85 && x <= 95 && y >= 72 && y <= 82) {
						handleShow();
						console.log("Modal opened for NFT 2");
					} else if (x >= 141 && x <= 151 && y >= 89 && y <= 99) {
						handleShow();
						console.log("Modal opened for NFT 3");
					} else if (x >= 30 && x <= 40 && y >= 100 && y <= 110) {
						handleShow();
						console.log("Modal opened for NFT 4");
					} else if (x >= 85 && x <= 95 && y >= 22 && y <= 32) {
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

	// Mint all NFTs - NOT DONE!
	// mintAllNfts = async ()

	// this is where you should connect to contracts and get response back to state
	useEffect(() => {
		const load = async () => {
			// // Stores a given value, 5 by default.
			// await contract.methods.set(5).send({ from: accounts[0] });
			// // Get the value from the contract to prove it worked.
			// const response = await contract.methods.get().call();
			// // Update state with the result.
			// setStorageValue(response);
			// from nd tutorial
		};
		if (
			typeof web3 !== "undefined" &&
			typeof accounts !== "undefined" &&
			typeof balance !== "undefined" &&
			typeof contract !== "undefined"
		) {
			load();
		}
	}, [web3, accounts, balance, contract]);

	if (typeof web3 === "undefined") {
		return <div>Loading Web3, accounts, and contract...</div>;
	}
	return (
		<div className="App">
			<h1 className="Header">NFT GALLERY</h1>

			{/* mint button below */}
			<button className="loadBtn">Load NFTs</button>
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
				/>
			</div>
		</div>
	);
}

export default App;
