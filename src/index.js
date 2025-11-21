import {createRoot} from 'react-dom/client';
import React from 'react';
import './styles/main.css';
import createApp from './app';

/*import {whyDidYouUpdate} from 'why-did-you-update';

if (process.env.NODE_ENV !== 'production') {
	whyDidYouUpdate(React, { exclude: [/^(Connect|Link)/] });
}*/

const Root = () => (
	createApp({state: window['__INITIAL__STATE__'], props: window['__INITIAL__PROPS__']})
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);

if (module.hot) module.hot.accept();

