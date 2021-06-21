import React, { useState, useEffect } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { authFetch } from "../lib/auth-fetch";
import { AddOrEditUserModal } from "../components/AddOrEditUserModal";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router";

export default function ManageUsersTable() {
	const [isLoading, setIsLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState({});
	const [userIsBeingEdited, setUserIsBeingEdited] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const { addToast } = useToasts();
	const history = useHistory();
	
	useEffect(() => {
		if(!modalIsOpen) {
			setIsLoading(true);
			loadUsers();
			setSelectedUser({});
		}
	}, [modalIsOpen]);

	const loadUsers = async () => {
		const res = await authFetch("http://localhost:3001/dev/listUsers");

		if (res && res.users) {
			setUsers(res.users);
			setIsLoading(false);
		}
	};

	const onEditClicked = userHash => {
		setModalIsOpen(true);
		setUserIsBeingEdited(true);
		setSelectedUser(users.find(x => x.UserHash === userHash));
	};

	const onDeleteClicked = async userHash => {
		const res = await authFetch(`http://localhost:3001/dev/deleteUser?userHash=${userHash}`);
		
		if(res && res.success) {
			addNotification("User deleted", "success");

			if(userHash === "$2a$10$yGsdhh0HUIWMoECia9IcLeY2R8VMPeYLWSskup3bqHdbVAmNnGNRi") {
				history.go(0);
			} else {
				await loadUsers();
			}
		} else {
			addNotification("Error deleting user", "error");
		}
	};

	const onAddUserClicked = () => {
		setModalIsOpen(true);
		setUserIsBeingEdited(false);
	};

	const addNotification = (msg, type) => {
		addToast(msg, {
			appearance: type,
			autoDismiss: true
		});
	};

	return (
		<>
			<Table className="mb-5" striped bordered hover responsive>
				<thead>
					<tr>
						<th colSpan="99" className="text-center bg-white">
							<div className="d-inline-block pt-1">Manage Users</div>
							<Button
								variant="success"
								size="sm"
								className="float-right"
								onClick={() => onAddUserClicked()}
							>
									Add User
							</Button>
						</th>
					</tr>
					<tr>
						<th>Name</th>
						<th>Hash</th>
						<th>Tags</th>
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
						users.map(user => (
							<tr key={user.DisplayName}>
								<td>{user.DisplayName}</td>
								<td style={{ maxWidth: "100px", textOverflow: "ellipsis", overflow: "hidden" }}>{user.UserHash}</td>
								<td>{user.Tags.join(", ")}</td>
								<td className="d-flex w-20">
									<Button
										variant="warning"
										size="sm"
										className="ml-auto mr-1"
										onClick={() => onEditClicked(user.UserHash)}
									>
										Edit
									</Button>
									<Button
										variant="danger"
										size="sm"
										className="ml-auto"
										onClick={() => { 
											if (window.confirm("Are you sure you wish to delete this item?")) {
												onDeleteClicked(user.UserHash);
											}
										}}
										disabled={users.length === 1}
									>
										Delete
									</Button>
									<div className='delete-button'  />
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>

			<AddOrEditUserModal
				user={selectedUser}
				isOpen={modalIsOpen}
				close={() => setModalIsOpen(false)} 
				editUserMode={userIsBeingEdited}
			/>
		</>
	);
}
