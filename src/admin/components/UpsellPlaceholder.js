/**
 * Upsell placeholder – shown when a free user navigates to a pro-only page.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

const CheckIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

const FEATURE_DATA = {
	entries: {
		title: __('Form Entries', 'cf7-styler-for-divi'),
		desc: __('Save every form submission to your database. View, search, filter, and export entries — never lose a lead again.', 'cf7-styler-for-divi'),
		features: [
			__('Save all submissions to database', 'cf7-styler-for-divi'),
			__('Search, filter & sort entries', 'cf7-styler-for-divi'),
			__('Export entries to CSV', 'cf7-styler-for-divi'),
			__('View individual entry details', 'cf7-styler-for-divi'),
		],
	},
	webhook: {
		title: __('Webhook Integration', 'cf7-styler-for-divi'),
		desc: __('Send form data to external services like Zapier, Make, or any custom URL. Automate your workflow with webhooks.', 'cf7-styler-for-divi'),
		features: [
			__('Connect to Zapier, Make & more', 'cf7-styler-for-divi'),
			__('Send data to any URL on submit', 'cf7-styler-for-divi'),
			__('Multiple webhooks per form', 'cf7-styler-for-divi'),
			__('JSON payload with all fields', 'cf7-styler-for-divi'),
		],
	},
	'ai-settings': {
		title: __('AI Form Generator', 'cf7-styler-for-divi'),
		desc: __('Generate Contact Form 7 forms with AI. Describe your form and get a ready-to-use shortcode in seconds.', 'cf7-styler-for-divi'),
		features: [
			__('Generate forms from a description', 'cf7-styler-for-divi'),
			__('AI-powered field suggestions', 'cf7-styler-for-divi'),
			__('Supports all CF7 field types', 'cf7-styler-for-divi'),
			__('One-click form creation', 'cf7-styler-for-divi'),
		],
	},
};

export function UpsellPlaceholder({ feature }) {
	const data = FEATURE_DATA[feature] || FEATURE_DATA.entries;
	const url = (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url) || 'admin.php?page=cf7-mate-pricing';

	return (
		<div className="cf7m-card cf7m-upsell-card">
			<div className="cf7m-upsell-card__illus" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
					<path d="M7 11V7a5 5 0 0 1 10 0v4" />
				</svg>
			</div>
			<p className="cf7m-upsell-card__discount" role="status">
				{__('Pro Feature', 'cf7-styler-for-divi')}
			</p>
			<h3 className="cf7m-upsell-card__title">{data.title}</h3>
			<p className="cf7m-upsell-card__desc">{data.desc}</p>
			<div className="cf7m-upsell-card__features" role="list" aria-label={__('Feature highlights', 'cf7-styler-for-divi')}>
				<div className="cf7m-upsell-card__features-col">
					{data.features.slice(0, 2).map((label) => (
						<div key={label} className="cf7m-upsell-card__feature" role="listitem">
							<span className="cf7m-upsell-card__check" aria-hidden="true"><CheckIcon /></span>
							{label}
						</div>
					))}
				</div>
				<div className="cf7m-upsell-card__features-col">
					{data.features.slice(2).map((label) => (
						<div key={label} className="cf7m-upsell-card__feature" role="listitem">
							<span className="cf7m-upsell-card__check" aria-hidden="true"><CheckIcon /></span>
							{label}
						</div>
					))}
				</div>
			</div>
			<a href={url} className="cf7m-upsell-card__cta">
				{__('Upgrade to Pro', 'cf7-styler-for-divi')}
			</a>
		</div>
	);
}
