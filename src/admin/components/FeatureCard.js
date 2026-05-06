/**
 * Single feature row – name + description on the left, Toggle / upgrade on the right.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { Toggle } from './Toggle';

export function FeatureCard({ feature, enabled, isPro, onToggle, saving }) {
	const isProLocked = feature.isPro && !isPro;
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url
			? dcsCF7Styler.pricing_url
			: '';

	return (
		<div className="cf7m-dash-row">
			<div className="cf7m-dash-row__label">
				<h4 className="cf7m-dash-row__title">
					{feature.name}
					{feature.isPro && !isPro && (
						<span className="cf7m-feature__badge" aria-label={__('Pro', 'cf7-styler-for-divi')}>
							Pro
						</span>
					)}
				</h4>
				<p className="cf7m-dash-row__desc">{feature.description}</p>
			</div>
			<div className="cf7m-dash-row__control">
				{isProLocked ? (
					<a
						href={pricingUrl || '#'}
						target={pricingUrl ? '_blank' : undefined}
						rel={pricingUrl ? 'noopener noreferrer' : undefined}
						className="cf7m-feature__upgrade"
					>
						{__('Upgrade', 'cf7-styler-for-divi')}
					</a>
				) : (
					<Toggle
						checked={!!enabled}
						onChange={(val) => onToggle(feature.id, val)}
						disabled={saving}
					/>
				)}
			</div>
		</div>
	);
}
