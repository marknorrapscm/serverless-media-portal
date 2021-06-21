import React, { useState, useEffect } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { authFetch } from "../lib/auth-fetch";
import { useToasts } from "react-toast-notifications";
import { AddTagModal } from "./AddTagModal";

export default function ManageTagsTable() {
	const [isLoading, setIsLoading] = useState(true);
	const [tags, setTags] = useState([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const { addToast } = useToasts();

	useEffect(() => {
		if(!modalIsOpen) {
			setIsLoading(true);
			loadTags();
		}
	}, [modalIsOpen]);

	const loadTags = async () => {
		const res = await authFetch("http://localhost:3001/dev/getAllTags");

		if (res && res.tags) {
			setTags(res.tags);
			setIsLoading(false);
		}
	};

	const onDeleteClicked = async tagName => {
		const res = await authFetch(`http://localhost:3001/dev/deleteTag?tagName=${tagName}`);
		
		if(res && res.success) {
			await loadTags();
			addNotification("Tag deleted", "success");
		} else {
			addNotification("Error deleting tag", "error");
		}
	};

	const addTagClicked = () => {
		setModalIsOpen(true);
	};

	const addNotification = (msg, type) => {
		addToast(msg, {
			appearance: type,
			autoDismiss: true
		});
	};

	return (
		<>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						<th colSpan="99" className="text-center bg-white">
							<div className="d-inline-block pt-1">Manage Tags</div>
							<Button
								variant="success"
								size="sm"
								className="float-right"
								onClick={() => addTagClicked()}
							>
								Add Tag
							</Button>
						</th>
					</tr>
					<tr>
						<th>Name</th>
						<th style={{ width: 0 }}></th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td colSpan="4" className="text-center">
								<Spinner animation="border" size="sm" />
							</td>
						</tr>
					) : (
						tags.map(tag => (
							<tr key={tag.TagName}>
								<td>{tag.TagName}</td>
								<td className="d-flex w-20">
									<Button
										variant="danger"
										size="sm"
										className="ml-auto"
										onClick={() => { 
											if (window.confirm("Are you sure you wish to delete this tag?")) {
												onDeleteClicked(tag.TagName);
											}
										}}
										disabled={tag.TagName === "Admin"}
									>
										Delete
									</Button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>

			<AddTagModal 
				isOpen={modalIsOpen} 
				close={() => setModalIsOpen(false)} 
			/>
		</>
	);
}
