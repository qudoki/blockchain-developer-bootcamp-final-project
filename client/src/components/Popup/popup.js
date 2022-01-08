import React, { useState } from "react";
import { Col, Modal } from "react-bootstrap";
import Switch from "../Switch/switch";
import "./popup.css";

const Popup = (props) => {
	const { show, onClose } = props;

	return (
		<Modal
			show={show}
			onHide={onClose}
			animation={true}
			className="modal"
			backdrop="static"
			size="lg"
			balance={props.balance}
			accounts={props.accounts}
		>
			<Modal.Header closeButton onClick={onClose}></Modal.Header>
			<Modal.Body className="modalBody">
			<h6 className="header">Your Selection</h6>

				<Col className="org1">
					<p className="title">Title: </p>
					<p className="artist">Artist: </p>
					<p className="artist">Owner: </p>
				</Col>
				<Col className="org2">
					<p className="artist"># Transfers: </p>
					<p className="forSale">Availability
					<Switch /></p>
				</Col>
				{/* currently hardcoded - fix when info back from BC */}
				<div className="art">
					<img
						className="image"
						src="https://ipfs.io/ipfs/bafybeido4wnjbmthgpygr5wubsiodnavmdbmlf7hbp262leaptffls2qdm"
					/>
				</div>
				{/* <div>
					<button className="mainBtn">Mint (TBD)</button>
				</div> */}
				<div>
					<button className="mainBtn">
						PURCHASE FOR Ξ{props.artPrice} ETHER
					</button>
				</div>
					<h6 className="header">Your Account</h6>
				<Col className="org1">

					<p className="balance">Balance: Ξ {props.balance} ether</p>
					<p className="address">Address: {props.accountAddress}</p>
				</Col>
				<Col className="org2">
				<p className="balance">NFT Count: {props.totalTokensOwnedByAccount || "0" } </p>
				</Col>
			</Modal.Body>
		</Modal>
	);
};

export default Popup;
