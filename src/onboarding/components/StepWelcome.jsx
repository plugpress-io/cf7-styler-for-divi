/**
 * Step Welcome – value early, quick win (SaaS onboarding principles)
 * @see https://www.userflow.com/blog/saas-onboarding-flow-a-complete-guide
 * @see https://www.paddle.com/resources/saas-onboarding
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const StepWelcome = () => {
	// Show product value early; keep it simple and focused (Fogg: Motivation + Ability)
	const highlights = [
		__('Style Contact Form 7 in Divi — no code, just point and click', 'cf7-styler-for-divi'),
		__('Get to your first styled form in under a minute', 'cf7-styler-for-divi'),
		__('Works with your existing forms; change settings anytime', 'cf7-styler-for-divi'),
	];

	return (
		<div className="dcs-onboarding-step dcs-step-welcome">
			<div className="dcs-step-header">
				<span className="dcs-step-label">{__('Step 1 of 4', 'cf7-styler-for-divi')}</span>
				<h2 className="dcs-onboarding-title">
					{__('Welcome to CF7 Mate', 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-onboarding-description">
					{__('A short setup to get you to your first win. Four steps, about a minute.', 'cf7-styler-for-divi')}
				</p>
			</div>
			<ul className="dcs-welcome-list">
				{highlights.map((text, i) => (
					<li key={i}>
						<span className="dcs-check-icon" aria-hidden="true">
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
								<polyline points="20 6 9 17 4 12" />
							</svg>
						</span>
						{text}
					</li>
				))}
			</ul>
		</div>
	);
};

export default StepWelcome;
