import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Spinner } from "react-bootstrap";
import { authGet } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";

export default function EditVideoModal ({ isOpen, setIsOpen, video, onEditFormSubmitted }) {
	const [isLoadingTags, setIsLoadingTags] = useState(false);
	const [allTags, setAllTags] = useState([]);
	const { addToast } = useToasts();

	useEffect(() => {
		if(isOpen) {
			loadTags();
		}
	}, [isOpen]);

	const loadTags = async () => {
		setIsLoadingTags(true);
		const res = await authGet("http://localhost:3001/dev/listAllTags");

		if(res && res.tags) {
			setAllTags(res.tags.map(x => x.TagName));
		}
		setIsLoadingTags(false);
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const formData = getFormData(e.target);

		const newVideo = { ...video };
		newVideo.Title = formData.title;
		newVideo.VideoDate = formData.videoDate;
		newVideo.ViewCount = formData.viewCount;
		newVideo.Description = formData.description;
		newVideo.Tags = getSelectedTags(formData);

		if(newVideo.Tags.length === 0) {
			addToast("Error: at least one tag must be selected", {
				appearance: "warning",
				autoDismiss: true,
				autoDismissTimeout: 10000
			});
		} else {
			onEditFormSubmitted(newVideo);
			setIsOpen(false);
		}
	};

	const getFormData = form => {
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		return data;
	};

	const getSelectedTags = formData => {
		const selectedTags = Object.keys(formData).filter(key => allTags.includes(key));

		return selectedTags;
	};

	return (
		<Modal show={isOpen} onHide={() => setIsOpen(false)} backdrop="static" centered animation={false}>
			<Modal.Header closeButton>
				<Modal.Title>
					<h5 className="mb-0">Edit video</h5>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="px-4 py-3">
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

					<Form.Row>
						<Form.Label column xs={3}>Tags:</Form.Label>
						<Col className="pt-2">
							{isLoadingTags ? (
								<Spinner animation="grow" size="sm" />
							) : (
								allTags.map(tag => (
									<Form.Check
										key={tag}
										custom
										inline
										label={tag}
										type="checkbox"
										name={tag}
										id={tag}
										value={true}
										defaultChecked={video.Tags ? video.Tags.includes(tag) : false}
									/>
								))
							)}
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