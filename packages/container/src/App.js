import {
	createGenerateClassName,
	StylesProvider,
} from "@material-ui/core/styles";
import { createBrowserHistory } from "history";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import Header from "./components/Header";
import Progress from "./components/Progress";

const AuthLazy = lazy(() => import("./components/AuthApp"));
const MarketingLazy = lazy(() => import("./components/MarketingApp"));
const DashboardLazy = lazy(() => import("./components/DashboardApp"));

const generateClassName = createGenerateClassName({
	productionPrefix: "co",
});

const history = createBrowserHistory();

export default () => {
	const [isSignedIn, setIsSignedIn] = useState(false);

	useEffect(() => {
		if (isSignedIn) {
			history.push("/dashboard");
		}
	}, [isSignedIn]);

	return (
		<Router history={history}>
			<StylesProvider generateClassName={generateClassName}>
				<div>
					<Header
						onSignOut={() => setIsSignedIn(false)}
						isSignedIn={isSignedIn}
					/>
					<Suspense fallback={<Progress />}>
						<Switch>
							<Route path="/auth">
								<AuthLazy onSignIn={() => setIsSignedIn(true)} />
							</Route>
							<Route path="/dashboard">
								{!isSignedIn && <Redirect to="/" />}
								<DashboardLazy />
							</Route>
							<Route path="/" component={MarketingLazy} />
						</Switch>
					</Suspense>
				</div>
			</StylesProvider>
		</Router>
	);
};
