/**
 * PricingTable – Free vs Pro two-column comparison.
 * Pro column carries a "Best Value" badge and a subtle primary-tint background.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

const FREE_FEATURES = [
	__('CF7 styling (Divi, Elementor, Bricks, Gutenberg)', 'cf7-styler-for-divi'),
	__('Grid layout', 'cf7-styler-for-divi'),
	__('Star rating field', 'cf7-styler-for-divi'),
	__('Range slider field', 'cf7-styler-for-divi'),
	__('Separator / Image / Icon fields', 'cf7-styler-for-divi'),
];

const PRO_FEATURES = [
	__('Everything in Free', 'cf7-styler-for-divi'),
	__('Multi-step forms', 'cf7-styler-for-divi'),
	__('Multi-column layout', 'cf7-styler-for-divi'),
	__('Form responses & database', 'cf7-styler-for-divi'),
	__('Conditional logic', 'cf7-styler-for-divi'),
	__('Phone number & Heading fields', 'cf7-styler-for-divi'),
	__('Style presets', 'cf7-styler-for-divi'),
	__('Webhook integration', 'cf7-styler-for-divi'),
	__('AI form generator', 'cf7-styler-for-divi'),
];

export function PricingTable() {
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url
			? dcsCF7Styler.pricing_url
			: 'https://cf7mate.com/pricing';

	return (
		<div className="cf7m-pricing">
			{/* Free column */}
			<div className="cf7m-pricing__col">
				<div className="cf7m-pricing__head">
					<span className="cf7m-pricing__plan">
						{__('Free', 'cf7-styler-for-divi')}
					</span>
					<span className="cf7m-pricing__price">
						{__('$0', 'cf7-styler-for-divi')}
					</span>
					<span className="cf7m-pricing__period">
						{__('forever', 'cf7-styler-for-divi')}
					</span>
				</div>
				<ul className="cf7m-pricing__list">
					{FREE_FEATURES.map((f) => (
						<li key={f} className="cf7m-pricing__item">
							<CheckIcon className="cf7m-pricing__check cf7m-pricing__check--yes" aria-hidden="true" />
							{f}
						</li>
					))}
				</ul>
				<div className="cf7m-pricing__foot">
					<span className="cf7m-pricing__current">
						{__('Current plan', 'cf7-styler-for-divi')}
					</span>
				</div>
			</div>

			{/* Pro column – Best Value */}
			<div className="cf7m-pricing__col cf7m-pricing__col--pro">
				<div className="cf7m-pricing__badge">
					{__('Best Value', 'cf7-styler-for-divi')}
				</div>
				<div className="cf7m-pricing__head">
					<span className="cf7m-pricing__plan">
						{__('Pro', 'cf7-styler-for-divi')}
					</span>
					<span className="cf7m-pricing__price">
						{__('$49', 'cf7-styler-for-divi')}
					</span>
					<span className="cf7m-pricing__period">
						{__('/ year', 'cf7-styler-for-divi')}
					</span>
				</div>
				<ul className="cf7m-pricing__list">
					{PRO_FEATURES.map((f, i) => (
						<li key={f} className={`cf7m-pricing__item${i === 0 ? ' cf7m-pricing__item--all' : ''}`}>
							<CheckIcon className="cf7m-pricing__check cf7m-pricing__check--yes" aria-hidden="true" />
							{f}
						</li>
					))}
				</ul>
				<div className="cf7m-pricing__foot">
					<a
						href={pricingUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="cf7m-pricing__cta"
					>
						{__('Get Pro', 'cf7-styler-for-divi')}
					</a>
				</div>
			</div>
		</div>
	);
}
