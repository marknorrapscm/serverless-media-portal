import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Browse from "./pages/Browse";
import Watch from "./pages/Watch";
import { createBrowserHistory } from "history";
import { AuthWrapper } from "./components/AuthWrapper";
import Upload from "./pages/Upload";
import Settings from "./pages/Settings";
import { ToastProvider } from "react-toast-notifications";

export const history = createBrowserHistory({
	// eslint-disable-next-line no-undef
	basename: process.env.PUBLIC_URL
});

export default function App() {
	return (
		<AuthWrapper>
			<ToastProvider>
				<Router basename={process.env.PUBLIC_URL}>
					<Layout>
						<Routes>
							<Route path="/" exact element={<Browse />} />
							<Route path="/watch/:videoHash" exact element={<Watch />} />
							<Route path="/upload" exact element={<Upload />} />
							<Route path="/settings" exact element={<Settings />} />
						</Routes>
					</Layout>
				</Router>
			</ToastProvider>
		</AuthWrapper>
	);
}
