/**
 * Modules page: grouped feature toggles (Free / Pro) + resources footer.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { FEATURES } from '../data/features';
import { FeatureCard } from './FeatureCard';
import { HowToSection } from './HowToSection';

export function FeaturesSection({ features, isPro, onToggle, saving }) {
	const freeFeatures = FEATURES.filter((f) => !f.isPro);
	const proFeatures = FEATURES.filter((f) => f.isPro);

	return (
		<div className="dcs-modules-page">
			<div className="dcs-card dcs-modules-card">
				<div className="dcs-modules-card__header">
					<h2 className="dcs-modules-card__title">{__('Modules', 'cf7-styler-for-divi')}</h2>
					<p className="dcs-modules-card__desc">{__('Turn modules on or off. Changes apply immediately.', 'cf7-styler-for-divi')}</p>
				</div>
				<div className="dcs-modules-card__body">
					{freeFeatures.length > 0 && (
						<section className="dcs-features-group" aria-labelledby="dcs-modules-free-heading">
							<h3 id="dcs-modules-free-heading" className="dcs-features-group__title">{__('Free', 'cf7-styler-for-divi')}</h3>
							<ul className="dcs-features-list">
								{freeFeatures.map((feature) => (
									<li key={feature.id}>
										<FeatureCard feature={feature} enabled={features[feature.id]} isPro={isPro} onToggle={onToggle} saving={saving} />
									</li>
								))}
							</ul>
						</section>
					)}
					{proFeatures.length > 0 && (
						<section className="dcs-features-group dcs-features-group--pro" aria-labelledby="dcs-modules-pro-heading">
							<h3 id="dcs-modules-pro-heading" className="dcs-features-group__title">{__('Pro', 'cf7-styler-for-divi')}</h3>
							<ul className="dcs-features-list">
								{proFeatures.map((feature) => (
									<li key={feature.id}>
										<FeatureCard feature={feature} enabled={features[feature.id]} isPro={isPro} onToggle={onToggle} saving={saving} />
									</li>
								))}
							</ul>
						</section>
					)}
				</div>
				<div className="dcs-modules-card__footer">
					<HowToSection />
				</div>
			</div>
		</div>
	);
}
