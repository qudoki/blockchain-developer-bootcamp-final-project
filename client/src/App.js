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

// // player movement logic
// var player = document.querySelector(".player-img");
// // var map = document.querySelector(".map");
// // state of player
// var x = 0;
// var y = 0;
// var heldDirections = [];
// var speed = 1;
// const placePlayer = () => {
// 	var pixelSize = parseInt(
// 		getComputedStyle(document.documentElement).getPropertyValue(
// 			"--pixel-size"
// 		)
// 	);
// 	const heldDirection = heldDirections[0];
// 	if (heldDirection) {
// 		if (heldDirection === directions.right) {
// 			x += speed;
// 		}
// 		if (heldDirection === directions.left) {
// 			x -= speed;
// 		}
// 		if (heldDirection === directions.down) {
// 			y += speed;
// 		}
// 		if (heldDirection === directions.up) {
// 			y -= speed;
// 		}
// 		player.setAttribute("facing", heldDirection);
// 	}
// 	// player.setAttribute("walking", heldDirection ? "true" : "false");

// 	var cameraLeft = pixelSize * 66;
// 	var cameraTop = pixelSize * 42;

// 	// player.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0)`;
// 	// map.style.transform = `translate3d( ${-x*pixelSize+cameraLeft}px, ${-y*pixelSize+cameraTop}px, 0)`;
// };
// // set up the game loop
// const step = () => {
// 	placePlayer();
// 	window.requestAnimationFrame(() => {
// 		step();
// 	});
// };
// step();

// //direction key state
// const directions = {
// 	up: "up",
// 	down: "down",
// 	left: "left",
// 	right: "right",
// };
// const keys = {
// 	38: directions.up,
// 	37: directions.left,
// 	39: directions.right,
// 	40: directions.down,
// };
// document.addEventListener("keydown", (e) => {
// 	var dir = keys[e.which];
// 	if (dir && heldDirections.indexOf(dir) === -1) {
// 		heldDirections.unshift(dir);
// 	}
// });
// document.addEventListener("keyup", (e) => {
// 	var dir = keys[e.which];
// 	var index = heldDirections.indexOf(dir);
// 	if (index > -1) {
// 		heldDirections.splice(index, 1);
// 	}
// });
// // end of player movement logic

class App extends Component {
	state = { storageValue: 0, web3: null, accounts: null, contract: null };

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = NFTGalleryContract.networks[networkId];
			const instance = new web3.eth.Contract(
				NFTGalleryContract.abi,
				deployedNetwork && deployedNetwork.address
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ web3, accounts, contract: instance }, this.runExample);
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

		// Stores a given value, 5 by default.
		// await contract.methods.set(5).send({ from: accounts[0] });

		// Get the value from the contract to prove it worked.
		// const response = await contract.methods.get().call();

		// Update state with the result.
		// this.setState({ storageValue: response });
	// };

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<h1>Good to Go!</h1>
				<p>Your Truffle Box is installed and ready.</p>
				<h2>Smart Contract Example</h2>
				<p>
					If your contracts compiled and migrated successfully, below will show
					a stored value of 5 (by default).
				</p>
				<p>
					Try changing the value stored on <strong>line 42</strong> of App.js.
				</p>
				<div>The stored value is: {this.state.storageValue}</div>
			</div>
		);
	}
}

export default App;
