/**
 * Compact "enable feature" card shown at the top of a feature's settings page.
 * Same visual style as the Features list cards.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { Toggle } from './Toggle';

export function FeatureEnableCard({
	featureId,
	title,
	desc,
	features,
	isPro,
	onToggle,
	saving,
	requiresPro = true,
}) {
	const enabled = !!(features && features[featureId]);
	const locked = requiresPro && !isPro;
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url
			? dcsCF7Styler.pricing_url
			: '';

	return (
		<article className="cf7m-feat-card cf7m-feat-card--inline">
			<header className="cf7m-feat-card__head">
				<h3 className="cf7m-feat-card__title">{title}</h3>
				{requiresPro && !isPro && (
					<span className="cf7m-feature__tag cf7m-feature__tag--pro">Pro</span>
				)}
			</header>
			<div className="cf7m-feat-card__body">
				{locked ? (
					<a
						href={pricingUrl || '#'}
						target={pricingUrl ? '_blank' : undefined}
						rel={pricingUrl ? 'noopener noreferrer' : undefined}
						className="cf7m-feat-card__upgrade"
					>
						{__('Upgrade', 'cf7-styler-for-divi')}
					</a>
				) : (
					<Toggle
						checked={enabled}
						onChange={(v) => onToggle(featureId, v)}
						disabled={!!saving}
					/>
				)}
				<p className="cf7m-feat-card__desc">{desc}</p>
			</div>
		</article>
	);
}
