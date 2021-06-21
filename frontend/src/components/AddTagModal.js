import React from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";

export function AddTagModal({ isOpen, close }) {
	const { addToast } = useToasts();

	const onSubmit = async e => {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target).entries());
		const uploadResult = await performFormUpload(formData);

		if (uploadResult.success) {
			close();
			addNotification("Tag added", "success");
		} else {
			console.error(uploadResult.message);
			addNotification(uploadResult.message, "error");
		}
	};

	const performFormUpload = async formData => {
		const res = await authPost("http://localhost:3001/dev/addTag", {
			formData: formData
		});

		return res;
	};

	const addNotification = (msg, type) => {
		addToast(msg, {
			appearance: type,
			autoDismiss: true
		});
	};

	return (
		<Modal show={isOpen} onHide={close} backdrop="static" centered animation={false}>
			<Modal.Header closeButton>
				<Modal.Title>Add Tag</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSubmit} id="upload-form" className="w-100">
					<Form.Row>
						<Form.Label column xs={3}>Tag:</Form.Label>
						<Col>
							<Form.Control name="tag" type="text" required />
						</Col>
					</Form.Row>

					<hr />

					<Form.Row style={{ flexWrap: "nowrap" }}>
						<Button variant="success" type="submit" className="w-25">Submit</Button>
					</Form.Row>
				</Form>
			</Modal.Body>
		</Modal>
	);
}