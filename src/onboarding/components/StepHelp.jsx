/**
 * Step Help – support at key points (SaaS: contextual help, never feel stuck)
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const RESOURCES = [
	{
		id: 'docs',
		title: __('Documentation', 'cf7-styler-for-divi'),
		desc: __('Guides and how-tos', 'cf7-styler-for-divi'),
		url: 'https://cf7mate.com/docs',
	},
	{
		id: 'support',
		title: __('Support', 'cf7-styler-for-divi'),
		desc: __('Get help when you need it', 'cf7-styler-for-divi'),
		url: 'https://cf7mate.com/docs',
	},
	{
		id: 'pricing',
		title: __('Pro & Pricing', 'cf7-styler-for-divi'),
		desc: __('Upgrade and compare plans', 'cf7-styler-for-divi'),
		url: 'https://cf7mate.com/pricing',
	},
];

const StepHelp = () => (
	<div className="cf7m-onboarding-step cf7m-step-help">
		<div className="cf7m-step-header">
			<span className="cf7m-step-label">{__('Step 3 of 4', 'cf7-styler-for-divi')}</span>
			<h2 className="cf7m-onboarding-title">
				{__('Need help?', 'cf7-styler-for-divi')}
			</h2>
			<p className="cf7m-onboarding-description">
				{__('We’re here if you get stuck. Docs and support are one click away.', 'cf7-styler-for-divi')}
			</p>
		</div>
		<div className="cf7m-help-list">
			{RESOURCES.map((r) => (
				<a
					key={r.id}
					href={r.url}
					target="_blank"
					rel="noopener noreferrer"
					className="cf7m-help-item"
				>
					<div className="cf7m-help-item-text">
						<span className="cf7m-help-item-title">{r.title}</span>
						<span className="cf7m-help-item-desc">{r.desc}</span>
					</div>
					<svg className="cf7m-help-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="5" y1="12" x2="19" y2="12" />
						<polyline points="12 5 19 12 12 19" />
					</svg>
				</a>
			))}
		</div>
	</div>
);

export default StepHelp;
