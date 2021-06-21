import React from "react";
import { Spinner } from "react-bootstrap";

export default function SpinnerCentered() {
	return (
		<div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
			<Spinner
				animation="border"
				role="status"
			/>
		</div>
	);
}
