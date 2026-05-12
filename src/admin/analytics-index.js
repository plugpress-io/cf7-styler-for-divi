/**
 * Analytics app entry: standalone Analytics page.
 *
 * @package CF7_Mate
 */

import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import './style.scss';
import { AnalyticsApp } from './AnalyticsApp';

domReady(() => {
	const rootElement = document.getElementById('cf7-mate-app-root');
	if (!rootElement) return;
	render(<AnalyticsApp />, rootElement);
});
