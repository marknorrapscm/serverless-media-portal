import React, { useState, useEffect } from "react";
import { Button, Col, Form, Spinner, Modal } from "react-bootstrap";
import { authGet, authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";
import generateUserHash from "../lib/generate-user-hash";

export function AddOrEditUserModal({ user, isOpen, close, editUserMode }) {
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

	const onSubmit = async e => {
		e.preventDefault();

		const formData = getFormData(e.target);
		const uploadResult = await performFormUpload(formData);

		if (uploadResult.success) {
			close(true);

			const msg = editUserMode
				? "User updated"
				: "New user added";
			addNotification(msg, "success");
		} else {
			console.error(uploadResult.message);
			addNotification(uploadResult.message, "error");
		}
	};

	const getFormData = form => {
		const formData = Object.fromEntries(new FormData(form).entries());
		
		const dataObj = {
			UserHash: getUserHash(formData),
			DisplayName: formData.displayName,
			Tags: getSelectedTags(formData)
		};

		return dataObj;
	};

	const performFormUpload = async formData => {
		const url = getUploadUrl();
		const res = await authPost(url, {
			formData: formData
		});

		return res;
	};

	const getUploadUrl = () => {
		return editUserMode
			? "http://localhost:3001/dev/editUser" 
			: "http://localhost:3001/dev/addUser";
	};

	const getSelectedTags = formData => {
		const selectedTags = Object.keys(formData).filter(key => allTags.includes(key));

		return selectedTags;
	};

	const getUserHash = formData => {
		const userHash = editUserMode 
			? formData.userHash
			: generateUserHash(formData.displayName, formData.dateOfBirth, formData.password);

		return userHash;
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
				<Modal.Title>
					<h5 className="mb-0">
						{editUserMode ? (
							<>Edit User: {user.DisplayName}</>
						) : (
							<>Add New User</>
						)}
					</h5>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={onSubmit} id="upload-form" className="w-100">
					<Form.Control name="userHash" type="hidden" defaultValue={user.UserHash} required />

					<Form.Row>
						<Form.Label column xs={3}>Name:</Form.Label>
						<Col>
							<Form.Control name="displayName" type="text" defaultValue={user.DisplayName} maxLength="75" required />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Date of Birth:</Form.Label>
						<Col>
							<Form.Control name="dateOfBirth" type="date" disabled={editUserMode} required={!editUserMode} />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Password:</Form.Label>
						<Col>
							<Form.Control name="password" type="password" disabled={editUserMode} required={!editUserMode} />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Visible Tags:</Form.Label>
						<Col style={{ paddingTop: "10px" }}>
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
										defaultChecked={user.Tags ? user.Tags.includes(tag) : false}
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