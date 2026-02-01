/**
 * Compact resources row (docs, video, support).
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

export function HowToSection() {
	return (
		<div className="dcs-howto">
			<span className="dcs-howto__label">{__('Resources', 'cf7-styler-for-divi')}</span>
			<nav className="dcs-howto__links" aria-label={__('Resources & Support', 'cf7-styler-for-divi')}>
				<a href="https://divipeople.com/docs/cf7-mate/" target="_blank" rel="noopener noreferrer" className="dcs-howto__link">
					{__('Docs', 'cf7-styler-for-divi')}
				</a>
				<span className="dcs-howto__sep" aria-hidden="true">·</span>
				<a href="https://www.youtube.com/@divipeople" target="_blank" rel="noopener noreferrer" className="dcs-howto__link">
					{__('Videos', 'cf7-styler-for-divi')}
				</a>
				<span className="dcs-howto__sep" aria-hidden="true">·</span>
				<a href="https://divipeople.com/support/" target="_blank" rel="noopener noreferrer" className="dcs-howto__link">
					{__('Support', 'cf7-styler-for-divi')}
				</a>
			</nav>
		</div>
	);
}
