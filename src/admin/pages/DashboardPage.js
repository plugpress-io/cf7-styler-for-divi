/**
 * Dashboard page: stats, quick actions, free vs pro comparison.
 *
 * @package CF7_Mate
 */

import { V3Banner } from '../components/V3Banner';
import { DashboardView } from '../components/DashboardView';
import { FreeVsProTable } from '../components/FreeVsProTable';

export function DashboardPage({ stats, loading, showEntries, modulesUrl, dashboardUrl, showV3Banner, rebrandDismissed, isPro }) {
	return (
		<>
			{showV3Banner && rebrandDismissed && <V3Banner />}
			<DashboardView stats={stats} loading={loading} showEntries={showEntries} modulesUrl={modulesUrl} dashboardUrl={dashboardUrl} />
			{!isPro && <FreeVsProTable />}
		</>
	);
}
