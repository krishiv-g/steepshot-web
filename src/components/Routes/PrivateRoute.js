import React from 'react';
import {Navigate} from 'react-router-dom';
import AuthService from '../../services/AuthService';

/**
 * PrivateRoute - Wrapper component for protected routes
 * Redirects to /signin if user is not authenticated
 *
 * Updated for React Router v6
 */
const PrivateRoute = ({children}) => {
	if (!AuthService.isAuth()) {
		return <Navigate to="/signin" replace />;
	}
	return <>{children}</>;
};

export default PrivateRoute;
