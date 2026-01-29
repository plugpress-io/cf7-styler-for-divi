/**
 * Step Welcome Component - Overview of Features
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const StepWelcome = () => {
	const highlights = [
		{
			id: 'visual_styling',
			text: __('Style Contact Form 7 forms visually with Divi Builder', 'cf7-styler-for-divi'),
		},
		{
			id: 'no_code',
			text: __('No coding required — just point, click, and customize', 'cf7-styler-for-divi'),
		},
		{
			id: 'responsive',
			text: __('Fully responsive forms that look great on any device', 'cf7-styler-for-divi'),
		},
		{
			id: 'integration',
			text: __('Seamless integration with your existing CF7 forms', 'cf7-styler-for-divi'),
		},
	];

	return (
		<div className="dcs-onboarding-step dcs-step-welcome">
			<div className="dcs-step-header">
				<span className="dcs-step-label">{__('Step 1 of 4', 'cf7-styler-for-divi')}</span>
				<h2 className="dcs-onboarding-title">
					{__('Welcome to CF7 Mate!', 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-onboarding-description">
					{__('This quick setup will help you get the most out of CF7 Mate for Divi. It only takes a minute.', 'cf7-styler-for-divi')}
				</p>
			</div>

			<div className="dcs-welcome-content">
				<div className="dcs-welcome-card">
					<h3 className="dcs-welcome-subtitle">
						{__('With CF7 Mate you can:', 'cf7-styler-for-divi')}
					</h3>
					<ul className="dcs-welcome-list">
						{highlights.map((item) => (
							<li key={item.id}>
								<span className="dcs-check-icon">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</span>
								{item.text}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default StepWelcome;
