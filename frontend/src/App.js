import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
						<Switch>
							<Route path="/" exact component={Browse} />
							<Route path="/watch/:videoHash" exact component={Watch} />
							<Route path="/upload" exact component={Upload} />
							<Route path="/settings" exact component={Settings} />
						</Switch>
					</Layout>
				</Router>
			</ToastProvider>
		</AuthWrapper>
	);
}
