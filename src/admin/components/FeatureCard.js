/**
 * Single feature card (icon, name, description, toggle or upgrade).
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { CrownIcon } from './icons/NavIcons';
import { FEATURE_ICONS } from './icons/FeatureIcons';
import { Toggle } from './Toggle';

export function FeatureCard({ feature, enabled, isPro, onToggle, saving }) {
	const isProLocked = feature.isPro && !isPro;
	const pricingUrl = typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.pricing_url : '/wp-admin/admin.php?page=cf7-mate-pricing';
	const IconComponent = FEATURE_ICONS[feature.icon] || FEATURE_ICONS.module;

	const handleUpgrade = () => {
		window.location.href = pricingUrl;
	};

	return (
		<div className={`dcs-feature ${feature.isPro ? 'dcs-feature--pro' : ''} ${isProLocked ? 'dcs-feature--locked' : ''}`}>
			<div className="dcs-feature__icon" aria-hidden="true">
				<IconComponent />
			</div>
			<div className="dcs-feature__name-wrap">
				<span className="dcs-feature__name">
					{feature.name}
					{feature.isPro && !isPro && (
						<span className="dcs-feature__badge" aria-label={__('Pro', 'cf7-styler-for-divi')}>
							<CrownIcon />
						</span>
					)}
				</span>
				<p className="dcs-feature__desc">{feature.description}</p>
			</div>
			<div className="dcs-feature__toggle">
				{isProLocked ? (
					<button type="button" onClick={handleUpgrade} className="dcs-feature__upgrade">
						{__('Upgrade', 'cf7-styler-for-divi')}
					</button>
				) : (
					<Toggle checked={enabled} onChange={(val) => onToggle(feature.id, val)} disabled={saving} />
				)}
			</div>
		</div>
	);
}
