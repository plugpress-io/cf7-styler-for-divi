/**
 * Admin app entry – mount React app on #cf7-mate-app-root.
 *
 * @package CF7_Mate
 */

import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import './style.scss';
import { App } from './App';

domReady(() => {
	const rootElement = document.getElementById('cf7-mate-app-root');
	if (!rootElement) return;
	render(<App />, rootElement);
});
