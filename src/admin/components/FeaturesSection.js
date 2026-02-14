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
	const showAllInOne = isPro;

	return (
		<div className="cf7m-modules-page">
			<div className="cf7m-card cf7m-modules-card">
				<div className="cf7m-modules-card__header">
					<h2 className="cf7m-modules-card__title">{__('Modules', 'cf7-styler-for-divi')}</h2>
					<p className="cf7m-modules-card__desc">{__('Turn modules on or off. Changes apply immediately.', 'cf7-styler-for-divi')}</p>
				</div>
				<div className="cf7m-modules-card__body">
					{showAllInOne ? (
						<section className="cf7m-features-group" aria-label={__('Modules', 'cf7-styler-for-divi')}>
							<ul className="cf7m-features-list">
								{FEATURES.map((feature) => (
									<li key={feature.id}>
										<FeatureCard feature={feature} enabled={features[feature.id]} isPro={isPro} onToggle={onToggle} saving={saving} />
									</li>
								))}
							</ul>
						</section>
					) : (
						<>
							{freeFeatures.length > 0 && (
								<section className="cf7m-features-group" aria-labelledby="cf7m-modules-free-heading">
									<h3 id="cf7m-modules-free-heading" className="cf7m-features-group__title">{__('Free', 'cf7-styler-for-divi')}</h3>
									<ul className="cf7m-features-list">
										{freeFeatures.map((feature) => (
											<li key={feature.id}>
												<FeatureCard feature={feature} enabled={features[feature.id]} isPro={isPro} onToggle={onToggle} saving={saving} />
											</li>
										))}
									</ul>
								</section>
							)}
							{proFeatures.length > 0 && (
								<section className="cf7m-features-group cf7m-features-group--pro" aria-labelledby="cf7m-modules-pro-heading">
									<h3 id="cf7m-modules-pro-heading" className="cf7m-features-group__title">{__('Pro', 'cf7-styler-for-divi')}</h3>
									<ul className="cf7m-features-list">
										{proFeatures.map((feature) => (
											<li key={feature.id}>
												<FeatureCard feature={feature} enabled={features[feature.id]} isPro={isPro} onToggle={onToggle} saving={saving} />
											</li>
										))}
									</ul>
								</section>
							)}
						</>
					)}
				</div>
				<div className="cf7m-modules-card__footer">
					<HowToSection />
				</div>
			</div>
		</div>
	);
}
