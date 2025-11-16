import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import {setService} from '../../actions/services';

/**
 * RouteWithService - Wrapper component that handles service (steem/golos) routing
 * Updated for React Router v6 with hooks
 */
const RouteWithService = ({children, serviceName, setService: setServiceAction}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const pathname = location.pathname;

	useEffect(() => {
		// Set service based on URL
		if (pathname.includes('/' + Constants.SERVICES.golos.name)) {
			setServiceAction(Constants.SERVICES.golos.name);
		} else if (serviceName === Constants.SERVICES.golos.name) {
			// If service is golos but not in URL, redirect
			navigate('/golos' + pathname, { replace: true });
		}
	}, [pathname, serviceName, setServiceAction, navigate]);

	return <>{children}</>;
};

const mapStateToProps = (state) => {
	return {
		serviceName: state.services.name
	}
};

const mapDispatchToProps = dispatch => {
	return {
		setService: serviceName => {
			dispatch(setService(serviceName));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteWithService);
