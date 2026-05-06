/**
 * Settings app entry: Dashboard + Settings tabs.
 *
 * @package CF7_Mate
 */

import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import './style.scss';
import { SettingsApp } from './SettingsApp';

domReady(() => {
	const rootElement = document.getElementById('cf7-mate-app-root');
	if (!rootElement) return;
	render(<SettingsApp />, rootElement);
});
