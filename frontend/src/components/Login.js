import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import styles from "./Login.module.css";
import generateUserHash from "../lib/generate-user-hash";

export function Login({ processLogin, hasFailedLoginAttempts }) {
	const [name, setName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState();
	const [password, setPassword] = useState("");
	const [validated, setValidated] = useState(false);

	const onLoginClicked = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		setValidated(true);

		if (event.currentTarget.checkValidity()) {
			const hash = generateUserHash(name, dateOfBirth, password);
			await processLogin(true, hash);
		}
	};

	return (
		<>
			<Helmet
				style={[{
					"cssText": `
						body {
							background-color: #f7f9fc;
						}

						#root {
							height: 100vh;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					`
				}]}
			/>

			<Card className={styles["login-card"]}>
				<Card.Body>
					<Form onSubmit={async (e) => onLoginClicked(e)} validated={validated}>
						<Form.Group className="mb-2">
							<Form.Label className={`mb-1 ${styles.label}`}>Your name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="John Smith"
								onChange={e => setName(e.target.value)}
								minLength="1"
								required
							/>
							<Form.Control.Feedback type="invalid">
								Please provide your name
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-2">
							<Form.Label className={`mb-1 ${styles.label}`}>
								Your date of birth:
							</Form.Label>
							<Form.Control
								type="date"
								onChange={e => setDateOfBirth(e.target.value)}
								required
							/>
							<Form.Control.Feedback type="invalid">
								Please provide your D.O.B.
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-4">
							<Form.Label className={`mb-1 ${styles.label}`}>
								Password:
							</Form.Label>
							<Form.Control
								type="password"
								onChange={e => setPassword(e.target.value)}
								required
							/>
							<Form.Control.Feedback type="invalid">
								Please supply the password
							</Form.Control.Feedback>
						</Form.Group>

						<Button
							type="submit"
							variant="success"
							block
						>
							Login
						</Button>
						<Form.Control.Feedback type="invalid" style={{ display: hasFailedLoginAttempts ? "block" : "none" }}  >
							Login failed; please try again. If you keep getting this error please contact me.
						</Form.Control.Feedback>
					</Form>
				</Card.Body>
			</Card>
		</>
	);
}
