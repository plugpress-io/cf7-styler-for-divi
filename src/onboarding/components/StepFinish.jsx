/**
 * Step Finish Component - Setup Complete
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const StepFinish = ({ onComplete }) => {
	const cf7AdminUrl = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.cf7_admin_url 
		? dcsOnboarding.cf7_admin_url 
		: '/wp-admin/admin.php?page=wpcf7';

	const createPageUrl = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.create_page_url 
		? dcsOnboarding.create_page_url 
		: '/wp-admin/post-new.php?post_type=page';

	const handleGoToCF7 = () => {
		if (onComplete) {
			onComplete();
		}
		window.location.href = cf7AdminUrl;
	};

	const handleCreatePage = () => {
		if (onComplete) {
			onComplete();
		}
		window.location.href = createPageUrl;
	};

	return (
		<div className="dcs-onboarding-step dcs-step-finish">
			<div className="dcs-step-header">
				<span className="dcs-step-label">{__('Step 4 of 4', 'cf7-styler-for-divi')}</span>
				<div className="dcs-finish-icon">
					<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
						<polyline points="22 4 12 14.01 9 11.01" />
					</svg>
				</div>
				<h2 className="dcs-onboarding-title">
					{__('You\'re all set!', 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-onboarding-description">
					{__('CF7 Mate is ready to use. Start styling your forms with Divi Builder.', 'cf7-styler-for-divi')}
				</p>
			</div>

			<div className="dcs-finish-content">
				<div className="dcs-finish-actions">
					<button 
						className="dcs-finish-btn dcs-finish-btn-primary"
						onClick={handleGoToCF7}
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" y1="13" x2="8" y2="13" />
							<line x1="16" y1="17" x2="8" y2="17" />
							<polyline points="10 9 9 9 8 9" />
						</svg>
						{__('Go to Contact Form 7', 'cf7-styler-for-divi')}
					</button>
					<button 
						className="dcs-finish-btn dcs-finish-btn-secondary"
						onClick={handleCreatePage}
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M12 5v14M5 12h14" />
						</svg>
						{__('Create a New Page', 'cf7-styler-for-divi')}
					</button>
				</div>

				<div className="dcs-finish-quickstart">
					<h4>{__('Quick Start Guide', 'cf7-styler-for-divi')}</h4>
					<ol>
						<li>{__('Create or edit a page with Divi Builder', 'cf7-styler-for-divi')}</li>
						<li>{__('Add the CF7 Styler module', 'cf7-styler-for-divi')}</li>
						<li>{__('Select your Contact Form 7 form', 'cf7-styler-for-divi')}</li>
						<li>{__('Customize the styling!', 'cf7-styler-for-divi')}</li>
					</ol>
				</div>
			</div>
		</div>
	);
};

export default StepFinish;
