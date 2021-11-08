import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

//This is the top of application.js
require("dotenv").config();

//This is an example of process.env later in the file
// var PrivateKey = new Buffer(process.env.["PRIVATE_KEY"], "hex"));

//Here is another example of using process.env
// const APIKey = process.env.API_KEY;

class App extends Component {
	state = {
		storageValue: 0,
		web3: null,
		accounts: null,
		contract: null,
	};

	componentDidMount = async () => {
    // player movement logic
		var player = document.querySelector(".player-img");
		var map = document.querySelector(".map");
    // state of player
    var x = 0;
    var y = 0;
    var heldDirections = [];
    var speed = 1;
    const placePlayer = () => {
      var pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
      );
      const heldDirection = heldDirections[0];
      if (heldDirection) {
        if (heldDirection === directions.right) {x += speed;}
        if (heldDirection === directions.left) {x -= speed;}
        if (heldDirection === directions.down) {y += speed;}
        if (heldDirection === directions.up) {y -= speed;}
        player.setAttribute("facing", heldDirection);
      }
      // player.setAttribute("walking", heldDirection ? "true" : "false");
      
      var cameraLeft = pixelSize * 66;
      var cameraTop = pixelSize * 42;

      // player.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0)`;
      // map.style.transform = `translate3d( ${-x*pixelSize+cameraLeft}px, ${-y*pixelSize+cameraTop}px, 0)`;
    }
    // set up the game loop
    const step = () => {
      placePlayer();
      window.requestAnimationFrame(() => {
        step();
      })
    }
    step();

        //direction key state
        const directions = {
          up: "up",
          down: "down",
          left: "left",
          right: "right",
        }
        const keys = {
          38: directions.up,
          37: directions.left,
          39: directions.right,
          40: directions.down,
        }
        document.addEventListener("keydown", (e) => {
          var dir = keys[e.which];
          if (dir && heldDirections.indexOf(dir) === -1) {
            heldDirections.unshift(dir)
          }
        })
        document.addEventListener("keyup", (e) => {
          var dir = keys[e.which];
          var index = heldDirections.indexOf(dir);
          if (index > -1) {
            heldDirections.splice(index, 1)
          }
        });
    // end of player movement logic

		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the contract instance.
			const networkId = await web3.eth.net.getId();
    //   const networkId = 5777;
    //   console.log(networkId);
			const deployedNetwork = SimpleStorageContract.networks[networkId];
      console.log(deployedNetwork);
      console.log(deployedNetwork.address);
			const instance = new web3.eth.Contract(
				SimpleStorageContract.abi,
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

	runExample = async () => {
		const { accounts, contract } = this.state;

		// Stores a given value, 5 by default.
    console.log(accounts[0]);
		await contract.methods.set(5).send({ from: accounts[0] });

		// Get the value from the contract to prove it worked.
		const response = await contract.methods.get().call();

		// Update state with the result.
		this.setState({ storageValue: response });
	};

	handleClick(event) {
		const contract = this.state.contract;
		const account = this.state.account;
		var value = 3;
		contract
			.set(value, { from: account })
			.then((result) => {
				return contract.get.call();
			})
			.then((result) => {
				return this.setState({ storageValue: result.c[0] });
			});
	}

	render() {
		if (!this.state.web3) {
			return <div>Loading Web3, accounts, and contract...</div>;
		}
		return (
			<div className="App">
				<h1>Good to Go!</h1>
				<p>Your Truffle Box is installed and ready.</p>
        {/* Logic for camera and player */}
				<div class="camera">
					<div
						class="map background-img"
						alt=""
						// src="../../assets/Gallery-Base.png"
					>
						<div class="player-img" alt="player" src="../../assets/Player.png">

            </div>
					</div>
				</div>
        {/* end logic for camera and player */}
				<h2>Smart Contract Example</h2>
				<p>
					If your contracts compiled and migrated successfully, below will show
					a stored value of 5 (by default).
				</p>
				<p>
					Try changing the value stored on <strong>line 42</strong> of App.js.
				</p>
				<div>The stored value is: {this.state.storageValue}</div>
				<button onClick={this.handleClick.bind(this)}>Set Storage</button>
			</div>
		);
	}
}

export default App;
