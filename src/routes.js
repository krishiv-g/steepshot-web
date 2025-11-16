import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import App from './components/App';
import NotFound from './components/NotFound/NotFound';
import PrivateRoute from './components/Routes/PrivateRoute';
import Feed from './components/Feed/Feed';
import About from './components/About/About';
import Testing from './components/Common/Testing/Testing';
import SinglePost from './components/SinglePost/SinglePost';
import Search from './components/Search/Search';
import EditPost from './components/EditPost/EditPost';
import UserProfile from './components/UserProfile/UserProfile';
import Login from './components/Login/Login';
import Browse from './components/Browse/Browse';
import Settings from './components/Settings/Settings';
import RouteWithService from './components/Routes/RouteWithService';
import SteemConnect from './components/SteemConnect/SteemConnect';
import AuthService from './services/AuthService';
import Wallet from './components/Wallet/Wallet';
import BrowseServerPage from './serverPages/BrowseServerPage';
import LoginServerPage from './serverPages/LoginServerPage';
import AboutServerPage from './serverPages/AboutServerPage';
import SinglePostServerPage from './serverPages/SinglePostServerPage';
import UserProfileServerPage from './serverPages/UserProfileServerPage';
import SearchServerPage from './serverPages/SearchServerPage';
import EditPostServerPage from './serverPages/EditPostServerPage';
import NotFoundSeverPage from './serverPages/NotFoundSeverPage';

export default function getRoutes() {
	return (
		<App>
			<Routes>
				<Route path="/" element={<Navigate to="/browse" replace />} />
				<Route path="/steemConnect" element={<SteemConnect />} />
				<Route path="/signin" element={
					AuthService.isAuth() ? (
						<Navigate to="/feed" replace />
					) : (
						<Login/>
					)
				} />
				<Route path="/guide" element={<About />} />
				<Route path="/dev/test" element={<Testing />} />
				<Route path="/:service?/browse/:filter?" element={<RouteWithService><Browse /></RouteWithService>} />
				<Route path="/:service?/post" element={<RouteWithService><SinglePost /></RouteWithService>} />
				<Route path="/:service?/@:username" element={<RouteWithService><UserProfile /></RouteWithService>} />
				<Route path="/:service?/search/:searchValue" element={<RouteWithService><Search /></RouteWithService>} />
				<Route path="/:service?/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
				<Route path="/createPost" element={<Navigate to="/editPost" replace />} />
				<Route path="/:service?/editPost/:category?/:username?/:permlink?" element={<PrivateRoute><EditPost /></PrivateRoute>} />
				<Route path="/:service?/Profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
				<Route path="/:service?/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
				<Route path="/:service?/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</App>
	);
}


export function getServerRouter() {
	return (
		<Routes>
			<Route path="/" element={<BrowseServerPage />} />
			<Route path="/:service?/browse/:filter?" element={<RouteWithService><BrowseServerPage /></RouteWithService>} />
			<Route path="/:service?/feed" element={<BrowseServerPage />} />
			<Route path="/signin" element={<LoginServerPage />} />
			<Route path="/guide" element={<AboutServerPage />} />
			<Route path="/:service?/post" element={<RouteWithService><SinglePostServerPage /></RouteWithService>} />
			<Route path="/:service?/@:username" element={<RouteWithService><UserProfileServerPage /></RouteWithService>} />
			<Route path="/:service?/Profile" element={<RouteWithService><UserProfileServerPage /></RouteWithService>} />
			<Route path="/:service?/search/:searchValue" element={<RouteWithService><SearchServerPage /></RouteWithService>} />
			<Route path="/createPost" element={<EditPostServerPage />} />
			<Route path="/:service?/editPost/:category?/:username?/:permlink?" element={<RouteWithService><EditPostServerPage /></RouteWithService>} />
			<Route path="*" element={<NotFoundSeverPage />} />
		</Routes>
	)
}
