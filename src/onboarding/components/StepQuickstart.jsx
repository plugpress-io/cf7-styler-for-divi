/**
 * Step Quickstart Component
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const StepQuickstart = () => {
	return (
		<div className="dcs-onboarding-step">
			<div className="dcs-onboarding-icon">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
				</svg>
			</div>
			<h2 className="dcs-onboarding-title">{__('Quick Start', 'cf7-styler-for-divi')}</h2>
			<p className="dcs-onboarding-description">
				{__('Using CF7 Styler is simple:', 'cf7-styler-for-divi')}
			</p>
			<ul className="dcs-onboarding-list">
				<li>{__('Create or edit a page with Divi Builder', 'cf7-styler-for-divi')}</li>
				<li>{__('Add the CF7 Styler module to your page', 'cf7-styler-for-divi')}</li>
				<li>{__('Select your Contact Form 7 form', 'cf7-styler-for-divi')}</li>
				<li>{__("Customize the styling using Divi's visual controls", 'cf7-styler-for-divi')}</li>
			</ul>
		</div>
	);
};

export default StepQuickstart;
