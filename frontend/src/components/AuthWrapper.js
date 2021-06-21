import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { logUserIn } from "../lib/auth-fetch";
import { Login } from "./Login";

export function AuthWrapper(props) {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [hasFailedLoginAttempts, setHasFailedLoginAttempts] = useState(false);

	useEffect(async () => {
		processLogin(false);
	}, []);

	const processLogin = async (userInitiatedLogin, hash = undefined) => {
		try {
			setIsLoading(true);

			if (await logUserIn(hash)) {
				setIsAuthorized(true);
			} else if (userInitiatedLogin) {
				setHasFailedLoginAttempts(true);
			}

			setIsLoading(false);
		} catch (e) {
			console.error(e);
		}
	};

	const style = {
		centered: {
			position: "absolute",
			left: "50%",
			top: "40%"
		}
	};

	return (
		<div>
			{isLoading ? (
				<Spinner
					animation="border"
					role="status"
					style={style.centered}
				/>
			) : !isAuthorized ? (
				<Login
					processLogin={processLogin}
					hasFailedLoginAttempts={hasFailedLoginAttempts}
				/>
			) : (
				{ ...props.children }
			)}
		</div>
	);
}
