import React from 'react';
import {Provider} from 'react-redux';
import {WrapperProvider} from 'create-react-server/wrapper';
import configureStore from './store/configureStore';
import getRoutes, {getServerRouter} from './routes';
import {BrowserRouter} from 'react-router-dom';
import './styles/main.css';
import './styles/app.css';

export default ({state, props}) => {

	const store = configureStore(state);

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
			<BrowserRouter>
				{getRoutes()}
			</BrowserRouter>
		</Provider>
	)
};
