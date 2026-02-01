/**
 * Modules page: feature toggles + resources section.
 *
 * @package CF7_Mate
 */

import { V3Banner } from '../components/V3Banner';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowToSection } from '../components/HowToSection';

export function ModulesPage({ features, isPro, onToggle, saving, showV3Banner, rebrandDismissed }) {
	return (
		<>
			{showV3Banner && rebrandDismissed && <V3Banner />}
			<FeaturesSection features={features} isPro={isPro} onToggle={onToggle} saving={saving} />
			<HowToSection />
		</>
	);
}
