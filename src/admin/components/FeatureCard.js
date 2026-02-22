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

	// Only show pro/golden styling when user does not have pro (locked pro feature).
	const showProStyle = feature.isPro && !isPro;

	return (
		<div className={`cf7m-feature ${showProStyle ? 'cf7m-feature--pro' : ''} ${isProLocked ? 'cf7m-feature--locked' : ''}`}>
			<div className="cf7m-feature__icon" aria-hidden="true">
				<IconComponent />
			</div>
			<div className="cf7m-feature__name-wrap">
				<span className="cf7m-feature__name">
					{feature.name}
					{feature.isPro && !isPro && (
						<span className="cf7m-feature__badge" aria-label={__('Pro', 'cf7-styler-for-divi')}>
							<CrownIcon />
						</span>
					)}
				</span>
				<p className="cf7m-feature__desc">{feature.description}</p>
			</div>
			<div className="cf7m-feature__toggle">
				{isProLocked ? (
					<button type="button" onClick={handleUpgrade} className="cf7m-feature__upgrade">
						{__('Learn more', 'cf7-styler-for-divi')}
					</button>
				) : (
					<Toggle checked={enabled} onChange={(val) => onToggle(feature.id, val)} disabled={saving} />
				)}
			</div>
		</div>
	);
}
