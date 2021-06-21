import React, { useState, useEffect } from "react";
import logo from "../logo.svg";
import { Link, useHistory } from "react-router-dom";
import "./Layout.css";
import { ReactComponent as HouseIcon } from "../images/home.svg";
import { ReactComponent as ArrowIcon } from "../images/arrow-left.svg";
import { clearSavedHash } from "../lib/local-storage";
import isUserAdmin from "../lib/is-user-admin";

/**
 * HTML based on template:
 * Start Bootstrap - Simple Sidebar (https://startbootstrap.com/template/simple-sidebar)
 */
export default function Layout(props) {
	const [isMenuOpen, setIsMenuOpen] = useState(true);
	const [restrictedLinks, setRestrictedLinks] = useState([]);
	const [showConfirmSignoutBtn, setShowConfirmSignoutBtn] = useState(false);
	const history = useHistory();

	useEffect(() => {
		loadRestrictedLinks();
	}, []);

	const loadRestrictedLinks = async () => {
		const _restrictedLinks = [];

		if (await isUserAdmin()) {
			_restrictedLinks.push(
				<Link key="upload" to="/upload" className="list-group-item list-group-item-action bg-dark">
					Upload
				</Link>
			);

			_restrictedLinks.push(
				<Link key="settings" to="/settings" className="list-group-item list-group-item-action bg-dark">
					Settings
				</Link>
			);
		}

		setRestrictedLinks(_restrictedLinks);
	};

	const onSignOutClicked = () => {
		setShowConfirmSignoutBtn(true);
	};

	const onConfirmSignOutClicked = () => {
		clearSavedHash();
		window.location.reload();
	};

	const onCancelSignoutClicked = () => {
		setShowConfirmSignoutBtn(false);
	};

	return (
		<div className={`d-flex ${isMenuOpen || "toggled"}`} id="wrapper">
			<div className="bg-dark border-right" id="sidebar-wrapper">
				<div className="sidebar-heading">
					<img src={logo} alt="logo" />
					Family Media Portal
				</div>
				<div className="list-group list-group-flush">
					<Link to="/" className="list-group-item list-group-item-action bg-dark">
						Home
					</Link>
					{restrictedLinks.map(x => x)}
				</div>
			</div>

			<div id="page-content-wrapper">
				<nav className="navbar navbar-expand-lg navbar-light border-bottom" style={{ justifyContent: "left" }}>
					<div>
						<button className="btn btn-info back-btn" onClick={() => history.goBack()}>
							<ArrowIcon />
						</button>

						<Link to="/">
							<button className="btn btn-info home-btn">
								<HouseIcon />
							</button>
						</Link>
					</div>

					<button
						className="btn btn-secondary menu-toggle-btn"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						Toggle Menu
					</button>

					<div className="ml-auto">
						<button
							className={`btn btn-default ${!showConfirmSignoutBtn || "d-none"}`}
							onClick={onSignOutClicked}
							style={{ border: "1px solid #a0a0a0", opacity: 0.8 }}
						>
						Sign Out
						</button>

						<button
							className={`btn btn-secondary mr-1 ${showConfirmSignoutBtn || "d-none"}`}
							onClick={onCancelSignoutClicked}
						>
						Cancel
						</button>

						<button
							className={`btn btn-danger ml-auto ${showConfirmSignoutBtn || "d-none"}`}
							onClick={onConfirmSignOutClicked}
						>
						Confirm sign out
						</button>
					</div>
				</nav>

				<div className="container-fluid pl-0 pr-0">{props.children}</div>
			</div>
		</div>
	);
}
