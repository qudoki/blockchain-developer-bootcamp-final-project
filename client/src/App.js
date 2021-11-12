import React, { Component } from "react";
import NFTGalleryContract from "./contracts/NFTGallery.json";
import getWeb3 from "./getWeb3";

import "./App.css";

//This is the top of application.js
require("dotenv").config();

//This is an example of process.env later in the file
// var PrivateKey = new Buffer(process.env.["PRIVATE_KEY"], "hex"));

//Here is another example of using process.env
// const APIKey = process.env.API_KEY;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			storageValue: 20,
			web3: null,
			accounts: null,
			contract: null,
			balance: null,
		};
	}

	componentDidMount = async () => {
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
			const instance = new web3.eth.Contract(
				NFTGalleryContract.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState(
				{ web3, accounts, balance, contract: instance },
				this.runExample
			);

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
				var rightLimit = 16 * 11 + 8;
				var topLimit = -8 + 32;
				var bottomLimit = 16 * 7 + 25;
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

				var camera_left = pixelSize * 66;
				var camera_top = pixelSize * 42;

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

	// runExample = async () => {
	// const { accounts, contract } = this.state;

	// // Stores a given value, 5 by default.
	// await contract.methods.set(5).send({ from: accounts[0] });

	// // Get the value from the contract to prove it worked.
	// const response = await contract.methods.get().call();

	// // Update state with the result.
	// this.setState({ storageValue: response });
	// };

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<h1>NFT Gallery</h1>
				{/* <h2>Smart Contract Example</h2> */}
				{/* <p>
					If your contracts compiled and migrated successfully, below will show
					a stored value of 20 (by default). Try changing the value stored on{" "}
					<strong>line 95</strong> of App.js.
				</p> */}
				<div>The stored value is: {this.state.storageValue}</div>

				<div>The account address is: {this.state.accounts}</div>
				<div>The account balance is: Ξ {this.state.balance}</div>
				<div className="camera">
					<div
						className="map background-img"
						alt="mapping"
						src="../../assets/Gallery-Base.png"
					>
						<div className="Character">
							<img
								className="Character_spritesheet pixelart face-up"
								alt="characer"
								src="../../assets/Sprite-BG.png"
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
