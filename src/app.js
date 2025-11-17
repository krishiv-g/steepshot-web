import React from 'react';
import {Provider} from 'react-redux';
import {WrapperProvider} from 'create-react-server/wrapper';
import configureStore from './store/configureStore';
import getRoutes, {getServerRouter} from './routes';
import {createMemoryHistory, createBrowserHistory} from 'history';
import {ConnectedRouter} from './utils/react-router-redux-shim';
import './styles/main.css';
import './styles/app.css';

export default ({state, props}) => {

	let history = (global.isServerSide) ? createMemoryHistory() : createBrowserHistory();

	const store = configureStore(state, history);

	if (global.isServerSide) {
		return (
			<Provider store={store}>
				<WrapperProvider initialProps={props}>
					{getServerRouter()}
				</WrapperProvider>
			</Provider>
		)
	}

	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				{getRoutes()}
			</ConnectedRouter>
		</Provider>
	)
};
