import React, { useState, useEffect } from "react";
import NFTGalleryContract from "./contracts/NFTGallery.json";
import getWeb3 from "./getWeb3";
import Popup from "./components/Popup/popup.js";

import "./App.css";

//This is the top of application.js
require("dotenv").config();

//This is an example of process.env later in the file
// var PrivateKey = new Buffer(process.env.["PRIVATE_KEY"], "hex"));

//Here is another example of using process.env
// const APIKey = process.env.API_KEY;

function App() {
	const [storageValue, setStorageValue] = useState(20);
	const [web3, setWeb3] = useState(undefined);
	const [contract, setContract] = useState([]);
	const [accounts, setAccounts] = useState([]);
	const [balance, setBalance] = useState(undefined);
	// const [artName, setArtName] = useState([]);
	// const [artPrice, setArtPrice] = useState([]);
	// const [modalShow, setModal] = useState(false);

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
				const deployedNetwork = NFTGalleryContract.networks[networkId];
				const contract = new web3.eth.Contract(
					NFTGalleryContract.abi,
					deployedNetwork && deployedNetwork.address
				);
				// Set web3, accounts, and contract to the state, and then proceed with an
				setWeb3(web3);
				setAccounts(accounts);
				setContract(contract);
				setBalance(balance);

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
				const openModal = (props) => {
					// console.log(x, y);
					if (x >= 34 && x <= 42 && y >= 50 && y <= 60) {
						console.log("Modal opened for NFT 1");
					} else if (x >= 85 && x <= 95 && y >= 72 && y <= 82) {
						console.log("Modal opened for NFT 2");
					} else if (x >= 125 && x <= 135 && y >= 127 && y <= 136) {
						console.log("Modal opened for NFT 3");
					} else {
						alert(
							`Try landing on a green dot for art!`
						);
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

	// this is where you should connect to contracts?
	useEffect(() => {
		const load = async () => {
			// // Stores a given value, 5 by default.
			// await contract.methods.set(5).send({ from: accounts[0] });

			// // Get the value from the contract to prove it worked.
			// const response = await contract.methods.get().call();

			// // Update state with the result.
			// setStorageValue(response);
		};
		if (
			typeof web3 !== "undefined" &&
			typeof accounts !== "undefined" &&
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
			<p>The stored value is: {storageValue}</p>

			<div>The account address is: {accounts}</div>
			<div>The account balance is: Ξ {balance}</div>
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
			{/* <div>
				<Popup />
			</div> */}
		</div>
	);
}

export default App;
