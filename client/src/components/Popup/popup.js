import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./popup.css";


const Popup = (props) => {
    const [show, setShow] = useState(false);
    // const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    return (
			<Modal
                className="modal"
				show={show}
                onHide={handleClose}
				backdrop="static"
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title> Modal title right Here </Modal.Title>
				</Modal.Header>
				<Modal.Body className="modalBody">
					put buttons here or something
				</Modal.Body>
			</Modal>
	);
};

export default Popup;
