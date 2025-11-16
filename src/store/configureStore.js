import {applyMiddleware, legacy_createStore as createStore} from 'redux';
import {thunk} from 'redux-thunk';
import {createLogger} from 'redux-logger';
import rootReducer from '../reducers';

let storeBase;

// Custom promise middleware to replace redux-promise
const promiseMiddleware = store => next => action => {
	if (action && action.payload && typeof action.payload.then === 'function') {
		return action.payload.then(
			result => next({...action, payload: result}),
			error => {
				next({...action, payload: error, error: true});
				return Promise.reject(error);
			}
		);
	}
	return next(action);
};

export default function configureStore(initialState, history) {
	const logger = createLogger({
		collapsed: true
	});
	let middleware;
	if (process.env.NODE_ENV === 'production') {
		middleware = applyMiddleware(thunk, promiseMiddleware);
	} else {
		middleware = applyMiddleware(thunk, promiseMiddleware, logger);
	}

	const store = createStore(
		rootReducer,
		initialState,
		middleware
	);
	setStoreBase(store);
	return store;
}

function setStoreBase(newStore) {
	storeBase = newStore;
}

export function getStore() {
	if (!storeBase) {
		return configureStore();
	}
	return storeBase;
}
