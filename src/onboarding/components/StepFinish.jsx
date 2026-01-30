/**
 * Step Finish – quick win + clear next action (SaaS: aha moment, need to do more)
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const StepFinish = ({ onComplete }) => {
	const cf7Url = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.cf7_admin_url
		? dcsOnboarding.cf7_admin_url
		: '/wp-admin/admin.php?page=wpcf7';
	const createUrl = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.create_page_url
		? dcsOnboarding.create_page_url
		: '/wp-admin/post-new.php?post_type=page';
	const pricingUrl = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.pricing_url
		? dcsOnboarding.pricing_url
		: '/wp-admin/admin.php?page=cf7-mate-pricing';

	const go = (url) => {
		if (onComplete) onComplete();
		window.location.href = url;
	};

	return (
		<div className="dcs-onboarding-step dcs-step-finish">
			<div className="dcs-step-header">
				<span className="dcs-step-label">{__('Step 4 of 4', 'cf7-styler-for-divi')}</span>
				<div className="dcs-finish-icon" aria-hidden="true">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<h2 className="dcs-onboarding-title">
					{__("You're all set", 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-onboarding-description">
					{__('Your next step: add the CF7 Styler module in Divi and pick your form. You can come back to the dashboard anytime to change settings.', 'cf7-styler-for-divi')}
				</p>
			</div>
			<div className="dcs-finish-actions">
				<button type="button" className="dcs-finish-btn dcs-finish-btn-primary" onClick={() => go(cf7Url)}>
					{__('Go to Contact Form 7', 'cf7-styler-for-divi')}
				</button>
				<button type="button" className="dcs-finish-btn dcs-finish-btn-secondary" onClick={() => go(createUrl)}>
					{__('Create a page', 'cf7-styler-for-divi')}
				</button>
			</div>
			<p className="dcs-finish-quickwin">
				{__('Quick win:', 'cf7-styler-for-divi')}
			</p>
			<ol className="dcs-finish-steps">
				<li>{__('Add CF7 Styler module in Divi', 'cf7-styler-for-divi')}</li>
				<li>{__('Pick your form and style it', 'cf7-styler-for-divi')}</li>
			</ol>
			<p className="dcs-finish-upsell">
				{__('Want more?', 'cf7-styler-for-divi')}{' '}
				<a href={pricingUrl}>{__('Unlock Pro', 'cf7-styler-for-divi')}</a>
				{__(' for entries, multi-step & more.', 'cf7-styler-for-divi')}
			</p>
		</div>
	);
};

export default StepFinish;
