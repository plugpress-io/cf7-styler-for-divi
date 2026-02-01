/**
 * Support CTA block (Need Help? Get Support).
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

export function SupportSection() {
	return (
		<div className="dcs-support">
			<div className="dcs-support__icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<div className="dcs-support__content">
				<h3 className="dcs-support__title">{__('Need Help?', 'cf7-styler-for-divi')}</h3>
				<p className="dcs-support__desc">{__('Check our documentation or contact support for assistance.', 'cf7-styler-for-divi')}</p>
			</div>
			<a href="https://divipeople.com/support/" target="_blank" rel="noopener noreferrer" className="dcs-support__btn">
				{__('Get Support', 'cf7-styler-for-divi')}
			</a>
		</div>
	);
}
