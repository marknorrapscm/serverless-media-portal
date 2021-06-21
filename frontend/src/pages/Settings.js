import React from "react";
import { Col, Row } from "react-bootstrap";
import ManageUsersTable from "../components/ManageUsersTable";
import ManageTagsTable from "../components/ManageTagsTable";

export default function Settings() {
	return (
		<Row className="mx-3 mt-4">
			<Col xs={12} md={9}>
				<ManageUsersTable />
			</Col>
			<Col xs={12} md={3}>
				<ManageTagsTable />
			</Col>
		</Row>
	);
}