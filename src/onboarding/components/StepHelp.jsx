/**
 * Step Help Component - Support and Documentation Links
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const StepHelp = () => {
	const resources = [
		{
			id: 'docs',
			icon: (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
				</svg>
			),
			title: __('Documentation', 'cf7-styler-for-divi'),
			description: __('Detailed guides and tutorials to help you get the most out of CF7 Mate.', 'cf7-styler-for-divi'),
			link: 'https://divipeople.com/docs',
			linkText: __('View Docs', 'cf7-styler-for-divi'),
		},
		{
			id: 'support',
			icon: (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<circle cx="12" cy="12" r="10" />
					<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
					<line x1="12" y1="17" x2="12.01" y2="17" />
				</svg>
			),
			title: __('Support', 'cf7-styler-for-divi'),
			description: __('Have questions or need help? Our support team is here for you.', 'cf7-styler-for-divi'),
			link: 'https://divipeople.com/support/',
			linkText: __('Get Support', 'cf7-styler-for-divi'),
		},
		{
			id: 'community',
			icon: (
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			),
			title: __('Community', 'cf7-styler-for-divi'),
			description: __('Join our Facebook community to connect with other users.', 'cf7-styler-for-divi'),
			link: 'https://www.facebook.com/groups/plugpress',
			linkText: __('Join Community', 'cf7-styler-for-divi'),
		},
	];

	return (
		<div className="dcs-onboarding-step dcs-step-help">
			<div className="dcs-step-header">
				<span className="dcs-step-label">{__('Step 3 of 4', 'cf7-styler-for-divi')}</span>
				<h2 className="dcs-onboarding-title">
					{__('Need help getting started?', 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-onboarding-description">
					{__('We\'re here to help you create beautiful forms. Check out these resources.', 'cf7-styler-for-divi')}
				</p>
			</div>

			<div className="dcs-help-resources">
				{resources.map((resource) => (
					<a
						key={resource.id}
						href={resource.link}
						target="_blank"
						rel="noopener noreferrer"
						className="dcs-help-card"
					>
						<div className="dcs-help-icon">{resource.icon}</div>
						<div className="dcs-help-content">
							<h4 className="dcs-help-title">{resource.title}</h4>
							<p className="dcs-help-description">{resource.description}</p>
						</div>
						<div className="dcs-help-arrow">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<line x1="5" y1="12" x2="19" y2="12" />
								<polyline points="12 5 19 12 12 19" />
							</svg>
						</div>
					</a>
				))}
			</div>

			<div className="dcs-help-contact">
				<p>
					{__('Can\'t find what you\'re looking for?', 'cf7-styler-for-divi')}{' '}
					<a href="mailto:developer@divipeople.com">
						{__('Contact us directly', 'cf7-styler-for-divi')}
					</a>
				</p>
			</div>
		</div>
	);
};

export default StepHelp;
