/**
 * Navigation Helper
 * Provides navigation utilities compatible with React Router v6
 * Replaces react-router-redux push/replace actions
 */

let navigateRef = null;

export const setNavigate = (navigate) => {
	navigateRef = navigate;
};

export const navigateTo = (path, options = {}) => {
	if (navigateRef) {
		navigateRef(path, options);
	} else {
		console.warn('Navigate not set. Call setNavigate() in your root component');
		// Fallback to window.location
		window.location.href = path;
	}
};

export const navigateReplace = (path) => {
	navigateTo(path, { replace: true });
};

// Action creators compatible with Redux thunks
export const push = (path) => {
	return () => {
		navigateTo(path);
	};
};

export const replace = (path) => {
	return () => {
		navigateReplace(path);
	};
};

export default {
	setNavigate,
	navigateTo,
	navigateReplace,
	push,
	replace
};
