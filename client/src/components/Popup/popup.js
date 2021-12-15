import React, { useState } from "react";
import { Modal } from "react-bootstrap";
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
			<p className="title">Title: </p>
			<p className="artist">Artist: </p>
			{/* currently hardcoded - fix when info back from BC */}
				<div className="art">
					<img className="image" src="https://ipfs.io/ipfs/bafybeido4wnjbmthgpygr5wubsiodnavmdbmlf7hbp262leaptffls2qdm" />
					</div>
				{/* <div>
					<button className="mainBtn">Mint (TBD)</button>
				</div> */}
				<div>
					<button className="mainBtn">Purchase for {props.artPrice} ether</button>
				</div>
				<div>
					<h5 className="header">Your Account</h5>
					<p className="balance">Balance: Ξ {props.balance} ether</p>
					<p className="address">Address: {props.accounts}</p>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default Popup;
