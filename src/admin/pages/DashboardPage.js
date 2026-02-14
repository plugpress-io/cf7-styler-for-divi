/**
 * Dashboard page: stats, quick actions, free vs pro comparison.
 *
 * @package CF7_Mate
 */

import { V3Banner } from '../components/V3Banner';
import { DashboardView } from '../components/DashboardView';

export function DashboardPage({ stats, loading, showEntries, modulesUrl, dashboardUrl, pricingUrl, promoCode, promoText, showV3Banner, rebrandDismissed, isPro }) {
	return (
		<>
			{showV3Banner && rebrandDismissed && <V3Banner />}
			<DashboardView
				stats={stats}
				loading={loading}
				showEntries={showEntries}
				isPro={isPro}
				modulesUrl={modulesUrl}
				dashboardUrl={dashboardUrl}
			/>
		</>
	);
}
