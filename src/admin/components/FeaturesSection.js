/**
 * Modules page: grid of feature cards (free + pro).
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { FEATURES } from '../data/features';
import { FeatureCard } from './FeatureCard';

export function FeaturesSection({ features, isPro, onToggle, saving }) {
	const freeFeatures = FEATURES.filter((f) => !f.isPro);
	const proFeatures = FEATURES.filter((f) => f.isPro);

	return (
		<div className="dcs-modules-page">
			<div className="dcs-card dcs-modules-card">
				<div className="dcs-modules-card__header">
					<h2 className="dcs-modules-card__title">{__('Modules', 'cf7-styler-for-divi')}</h2>
					<p className="dcs-modules-card__desc">{__('Enable or disable modules. Changes apply immediately.', 'cf7-styler-for-divi')}</p>
				</div>
				<div className="dcs-features-grid">
					{freeFeatures.map((feature) => (
						<FeatureCard key={feature.id} feature={feature} enabled={features[feature.id]} isPro={isPro} onToggle={onToggle} saving={saving} />
					))}
					{proFeatures.map((feature) => (
						<FeatureCard key={feature.id} feature={feature} enabled={features[feature.id]} isPro={isPro} onToggle={onToggle} saving={saving} />
					))}
				</div>
			</div>
		</div>
	);
}
