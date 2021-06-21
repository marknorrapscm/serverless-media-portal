import React, { useState, useEffect } from "react";
import { Button, Col, Form, Spinner, Modal } from "react-bootstrap";
import { authFetch, authPost } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";
import generateUserHash from "../lib/generate-user-hash";

export function AddOrEditUserModal({ user, isOpen, close, editUserMode }) {
	const [allTags, setAllTags] = useState([]);
	const { addToast } = useToasts();

	useEffect(() => {
		loadTags();
	}, []);

	const loadTags = async () => {
		const res = await authFetch("http://localhost:3001/dev/getAllTags");

		if(res && res.tags) {
			setAllTags(res.tags);
		}
	};

	const onSubmit = async e => {
		e.preventDefault();

		const formData = getFormData(e.target);
		const uploadResult = await performFormUpload(formData);

		if (uploadResult.success) {
			close();

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
			userHash: getUserHash(formData),
			displayName: formData.displayName,
			dateOfBirth: formData.dateOfBirth,
			tags: getSelectedTags(formData)
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
			? "http://localhost:3001/dev/updateUser" 
			: "http://localhost:3001/dev/addUser";
	};

	const getSelectedTags = formData => {
		const tagNames = allTags.map(x => x.TagName);
		const selectedTags = Object.keys(formData).filter(key => tagNames.includes(key));

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
							<Form.Control name="displayName" type="text" defaultValue={user.DisplayName} required />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Date of Birth:</Form.Label>
						<Col>
							<Form.Control name="dateOfBirth" type="date" disabled={editUserMode} />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Password:</Form.Label>
						<Col>
							<Form.Control name="password" type="password" disabled={editUserMode} />
						</Col>
					</Form.Row>

					<Form.Row>
						<Form.Label column xs={3}>Visible Tags:</Form.Label>
						<Col style={{ paddingTop: "10px" }}>
							{allTags.length === 0 ? (
								<Spinner animation="grow" size="sm" />
							) : (
								allTags.map(x => (
									<Form.Check
										key={x.TagName}
										custom
										inline
										label={x.TagName}
										type="checkbox"
										name={x.TagName}
										id={x.TagName}
										value={true}
										defaultChecked={user.Tags ? user.Tags.includes(x.TagName) : false}
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