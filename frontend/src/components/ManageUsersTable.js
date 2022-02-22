import React, { useState, useEffect } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { authGet } from "../lib/auth-fetch";
import { AddOrEditUserModal } from "../components/AddOrEditUserModal";
import { useToasts } from "react-toast-notifications";
import { useNavigate } from "react-router";

export default function ManageUsersTable() {
	const [isLoading, setIsLoading] = useState(true);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState({});
	const [userIsBeingEdited, setUserIsBeingEdited] = useState(false);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const { addToast } = useToasts();
	const navigate = useNavigate();

	useEffect(() => {
		setIsLoading(true);
		loadUsers();
	}, []);

	const loadUsers = async () => {
		const res = await authGet("http://localhost:3001/dev/listUsers");

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

	const onDeleteClicked = (userToDelete) => {
		const msg = userToDelete.UserHash === "$2a$10$yGsdhh0HUIWMoECia9IcLeY2R8VMPeYLWSskup3bqHdbVAmNnGNRi"
			? "Are you sure you want to delete the temporary admin user? If you haven't created another admin user, you will lose access to this page"
			: `Are you sure you wish to delete ${userToDelete.DisplayName} ?`;

		if (window.confirm(msg)) {
			deleteUser(userToDelete.UserHash);
		}
	};

	const deleteUser = async userHash => {
		setIsLoading(true);
		const res = await authGet(`http://localhost:3001/dev/deleteUser?userHash=${userHash}`);

		if (res && res.success) {
			addNotification("User deleted", "success");

			// When users delete the temporary admin, immediately redirect them to login
			if (userHash === "$2a$10$yGsdhh0HUIWMoECia9IcLeY2R8VMPeYLWSskup3bqHdbVAmNnGNRi") {
				navigate("/");
				window.location.reload("/");
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

	const onModalClosed = (performReload) => {
		setModalIsOpen(false);
		setSelectedUser({});

		if (performReload === true) {
			setIsLoading(true);
			loadUsers();
		}
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
						<th style={{ width: "300px" }}>Name</th>
						<th>Hash</th>
						<th>Tags</th>
						<th style={{ width: "130px" }}></th>
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
								<td style={{ maxWidth: "100px", textOverflow: "ellipsis", overflow: "hidden" }} title={user.UserHash}>{user.UserHash}</td>
								<td>{user.Tags.join(", ")}</td>
								<td>
									<Button
										variant="warning"
										size="sm"
										className="ml-auto mr-1"
										onClick={() => onEditClicked(user.UserHash)}
										disabled={user.UserHash === "$2a$10$yGsdhh0HUIWMoECia9IcLeY2R8VMPeYLWSskup3bqHdbVAmNnGNRi"}
									>
										Edit
									</Button>
									<Button
										variant="danger"
										size="sm"
										className="ml-auto"
										onClick={() => onDeleteClicked(user)}
										disabled={users.length === 1}
									>
										Delete
									</Button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>

			<AddOrEditUserModal
				user={selectedUser}
				isOpen={modalIsOpen}
				close={onModalClosed}
				editUserMode={userIsBeingEdited}
			/>
		</>
	);
}
