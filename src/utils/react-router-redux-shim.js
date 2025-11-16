/**
 * React Router Redux Compatibility Shim
 * Provides backward compatibility for code using react-router-redux (deprecated)
 * with React Router v6
 *
 * This allows existing code to continue working while migration is in progress
 */

let navigateFunction = null;

// Store the navigate function from useNavigate hook
export const setNavigateFunction = (navigate) => {
	navigateFunction = navigate;
};

// Action creator for push (navigate forward)
export const push = (path) => {
	return (dispatch) => {
		if (navigateFunction) {
			navigateFunction(path);
		} else {
			console.warn('[react-router-redux-shim] Navigate function not initialized. Using fallback.');
			window.location.href = path;
		}
	};
};

// Action creator for replace (navigate and replace history)
export const replace = (path) => {
	return (dispatch) => {
		if (navigateFunction) {
			navigateFunction(path, { replace: true });
		} else {
			console.warn('[react-router-redux-shim] Navigate function not initialized. Using fallback.');
			window.location.replace(path);
		}
	};
};

// Action creator for go (navigate n steps in history)
export const go = (n) => {
	return (dispatch) => {
		if (navigateFunction) {
			navigateFunction(n);
		} else {
			console.warn('[react-router-redux-shim] Navigate function not initialized. Using fallback.');
			window.history.go(n);
		}
	};
};

// Action creator for goBack
export const goBack = () => {
	return (dispatch) => {
		if (navigateFunction) {
			navigateFunction(-1);
		} else {
			window.history.back();
		}
	};
};

// Action creator for goForward
export const goForward = () => {
	return (dispatch) => {
		if (navigateFunction) {
			navigateFunction(1);
		} else {
			window.history.forward();
		}
	};
};

// Export all for compatibility
export default {
	push,
	replace,
	go,
	goBack,
	goForward,
	setNavigateFunction
};
