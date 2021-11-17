import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./popup.css";

const Popup = (props) => {
	const [show, setShow] = useState(true);
	// const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);
	return (
		<Modal
			animation={true}
			show={show}
			className="modal"
			onHide={handleClose}
			backdrop="static"
			size="lg"
			balance={props.balance}
			accounts={props.accounts}
		>
			<Modal.Header closeButton></Modal.Header>
			<Modal.Body className="modalBody">
				<div className="art">Art?</div>
				<div>
					<button className="mainBtn">Mint (TBD)</button>
				</div>
				<div>
					<button className="mainBtn">Purchase</button>
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
