import React from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";

export default function EditVideoModal ({ isOpen, setIsOpen, video, onEditFormSubmitted }) {
	const onSubmit = (e) => {
		e.preventDefault();
		const formData = getFormData(e.target);

		const newVideo = { ...video };
		newVideo.Title = formData.title;
		newVideo.VideoDate = formData.videoDate;
		newVideo.ViewCount = formData.viewCount;
		newVideo.Description = formData.description;

		onEditFormSubmitted(newVideo);
		setIsOpen(false);
	};

	const getFormData = form => {
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		return data;
	};

	return (
		<Modal show={isOpen} onHide={() => setIsOpen(false)} backdrop="static" centered animation={false}>
			<Modal.Header closeButton>
				<Modal.Title>
					<h5 className="mb-0">Edit video</h5>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSubmit} id="upload-form" className="w-100">
					<Form.Control name="userHash" type="hidden" defaultValue={video.VideoHash} required />

					<Form.Row>
						<Form.Label column xs={3}>Title:</Form.Label>
						<Col>
							<Form.Control name="title" type="text" defaultValue={video.Title} required />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Video date:</Form.Label>
						<Col>
							<Form.Control name="videoDate" type="date" defaultValue={video.VideoDate} required />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>View count:</Form.Label>
						<Col>
							<Form.Control name="viewCount" type="number" defaultValue={video.ViewCount} required />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Description:</Form.Label>
						<Col>
							<Form.Control name="description" type="text" defaultValue={video.Description} />
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