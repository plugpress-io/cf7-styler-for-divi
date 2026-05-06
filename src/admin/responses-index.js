/**
 * Responses app entry: standalone Responses page (form submissions).
 *
 * @package CF7_Mate
 */

import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import './style.scss';
import { ResponsesApp } from './ResponsesApp';

domReady(() => {
	const rootElement = document.getElementById('cf7-mate-app-root');
	if (!rootElement) return;
	render(<ResponsesApp />, rootElement);
});
