import React from "react";
import { Button, Col, Form, Modal, Spinner } from "react-bootstrap";
import { authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";

export function AddTagModal({ isOpen, close }) {
	const [isLoading, setIsLoading] = useState(false);
	const { addToast } = useToasts();

	const onSubmit = async e => {
		e.preventDefault();
		setIsLoading(true);
		const uploadResult = await performFormUpload(e.target);
		setIsLoading(false);

		if (uploadResult.success) {
			addNotification("Tag added", "success");
			close(true);
		} else {
			console.error(uploadResult.message);
			addNotification(uploadResult.message, "error");
		}
	};

	const performFormUpload = async target => {
		const formData = Object.fromEntries(new FormData(target).entries());
		const res = await authPost("http://localhost:3001/dev/addTag", {
			formData: {
				Tag: formData.tag
			}
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
						<Button variant="success" type="submit" className="w-25">
							{isLoading ? (
								<Spinner animation="border" size="sm" />
							) : (
								"Submit"
							)}
						</Button>
					</Form.Row>
				</Form>
			</Modal.Body>
		</Modal>
	);
}