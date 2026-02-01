/**
 * Resources & Support section (docs, video, support links).
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

export function HowToSection() {
	return (
		<div className="dcs-howto">
			<div className="dcs-howto__header">
				<h2 className="dcs-howto__title">{__('Resources & Support', 'cf7-styler-for-divi')}</h2>
				<p className="dcs-howto__desc">{__('Everything you need to get started and get help.', 'cf7-styler-for-divi')}</p>
			</div>
			<div className="dcs-howto__grid">
				<a href="https://divipeople.com/docs/cf7-mate/" target="_blank" rel="noopener noreferrer" className="dcs-howto__card">
					<div className="dcs-howto__icon dcs-howto__icon--docs">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</div>
					<div className="dcs-howto__content">
						<h3 className="dcs-howto__card-title">{__('Documentation', 'cf7-styler-for-divi')}</h3>
						<p className="dcs-howto__card-desc">{__('Step-by-step guides and feature explanations', 'cf7-styler-for-divi')}</p>
					</div>
					<span className="dcs-howto__arrow">→</span>
				</a>
				<a href="https://www.youtube.com/@divipeople" target="_blank" rel="noopener noreferrer" className="dcs-howto__card">
					<div className="dcs-howto__icon dcs-howto__icon--video">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" /><path d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</div>
					<div className="dcs-howto__content">
						<h3 className="dcs-howto__card-title">{__('Video Tutorials', 'cf7-styler-for-divi')}</h3>
						<p className="dcs-howto__card-desc">{__('Watch how-to videos on our YouTube channel', 'cf7-styler-for-divi')}</p>
					</div>
					<span className="dcs-howto__arrow">→</span>
				</a>
				<a href="https://divipeople.com/support/" target="_blank" rel="noopener noreferrer" className="dcs-howto__card">
					<div className="dcs-howto__icon dcs-howto__icon--support">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</div>
					<div className="dcs-howto__content">
						<h3 className="dcs-howto__card-title">{__('Get Support', 'cf7-styler-for-divi')}</h3>
						<p className="dcs-howto__card-desc">{__('Contact our team for technical assistance', 'cf7-styler-for-divi')}</p>
					</div>
					<span className="dcs-howto__arrow">→</span>
				</a>
			</div>
		</div>
	);
}
