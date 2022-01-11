import React, { } from "react";
import { Col, Modal } from "react-bootstrap";
import Switch from "../Switch/switch";
import "./popup.css";

const Popup = (props) => {
	const { show, onClose, toggleForSale, tokenURIs, numberOfTransfers, buyToken, tokenIds, titles, piece, prices, artists, owners, isToggled } = props;

	return (
		<Modal
			show={show}
			onHide={onClose}
			animation={true}
			className="modal"
			backdrop="static"
			size="lg"
		>
			<Modal.Header closeButton onClick={onClose}></Modal.Header>
			<Modal.Body className="modalBody">
			<h6 className="header">Your Selection: Token {tokenIds[piece]}</h6>

				<Col className="org1">
					<p className="title">Title: {titles[piece]}</p>
					<p className="artist">Artist: {artists[piece]}</p>
					<p className="artist">Owner: {owners[piece]}</p>
				</Col>
				<Col className="org2">
					<p className="artist"># Transfers: {numberOfTransfers[piece]}</p>
					<p className="forSale">Availability
					<Switch piece={piece} isToggled={isToggled} onClick={toggleForSale} />
					</p>
				</Col>
				<div className="art">
					<img
						className="image"
						alt="sampleimg"
						src=
						{tokenURIs[piece]}
					/>
				</div>
				<div>
					<button className="mainBtn" onClick={() => buyToken(piece)}>
						PURCHASE FOR Ξ {prices[piece]} ETHER
					</button>
				</div>
					<h6 className="header">Your Account</h6>
				<Col className="org1">

					<p className="balance">Balance: Ξ {props.balance} ether</p>
					<p className="address">Address: {props.accounts}</p>
				</Col>
				<Col className="org2">
				<p className="balance">NFT Count: {props.totalTokensOwnedByAccount || "0" } </p>
				</Col>
			</Modal.Body>
		</Modal>
	);
};

export default Popup;
