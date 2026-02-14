import { __ } from '@wordpress/i18n';

const CheckIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

const SparkIcon = () => (
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M13 2L11 13h2l-2 11 9-8h-2l2-8-9 2z" />
	</svg>
);

const FEATURES_LEFT = [
	__('Multi-step Forms', 'cf7-styler-for-divi'),
	__('Conditional Logic', 'cf7-styler-for-divi'),
	__('Calculator / Price Estimator', 'cf7-styler-for-divi'),
];

const FEATURES_RIGHT = [
	__('Form Entries (Database)', 'cf7-styler-for-divi'),
	__('Star Rating & Range Slider', 'cf7-styler-for-divi'),
	__('AI Form Generator & more…', 'cf7-styler-for-divi'),
];

export function UpsellCard({ pricingUrl }) {
	const url = pricingUrl || (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url) || 'admin.php?page=cf7-mate-pricing';

	return (
		<div className="cf7m-card cf7m-upsell-card">
			<div className="cf7m-upsell-card__illus" aria-hidden="true">
				<SparkIcon />
			</div>
			<p className="cf7m-upsell-card__discount" role="status">
				{__('50% off with code NEW2026', 'cf7-styler-for-divi')}
			</p>
			<p className="cf7m-upsell-card__tagline">
				<span className="cf7m-upsell-card__tagline-icon" aria-hidden="true"><SparkIcon /></span>
				{__('Unlock Premium Features', 'cf7-styler-for-divi')}
			</p>
			<h3 className="cf7m-upsell-card__title">{__('Build Better Forms with CF7 Mate', 'cf7-styler-for-divi')}</h3>
			<p className="cf7m-upsell-card__desc">
				{__('Add advanced fields, multi-column layouts, and smart logic to create forms that engage users and capture better data.', 'cf7-styler-for-divi')}
			</p>
			<div className="cf7m-upsell-card__features" role="list" aria-label={__('Premium features', 'cf7-styler-for-divi')}>
				<div className="cf7m-upsell-card__features-col">
					{FEATURES_LEFT.map((label) => (
						<div key={label} className="cf7m-upsell-card__feature" role="listitem">
							<span className="cf7m-upsell-card__check" aria-hidden="true"><CheckIcon /></span>
							{label}
						</div>
					))}
				</div>
				<div className="cf7m-upsell-card__features-col">
					{FEATURES_RIGHT.map((label) => (
						<div key={label} className="cf7m-upsell-card__feature" role="listitem">
							<span className="cf7m-upsell-card__check" aria-hidden="true"><CheckIcon /></span>
							{label}
						</div>
					))}
				</div>
			</div>
			<a href={url} className="cf7m-upsell-card__cta" target="_blank" rel="noopener noreferrer">
				{__('Upgrade Now', 'cf7-styler-for-divi')}
			</a>
		</div>
	);
}
