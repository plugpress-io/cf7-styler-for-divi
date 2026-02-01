/**
 * Dashboard page: stats, quick actions, plugins, free vs pro, support.
 *
 * @package CF7_Mate
 */

import { V3Banner } from '../components/V3Banner';
import { DashboardView } from '../components/DashboardView';
import { PluginsYouMightLike } from '../components/PluginsYouMightLike';
import { FreeVsProTable } from '../components/FreeVsProTable';
import { SupportSection } from '../components/SupportSection';

export function DashboardPage({ stats, loading, showEntries, modulesUrl, dashboardUrl, showV3Banner, rebrandDismissed, isPro }) {
	return (
		<>
			{showV3Banner && rebrandDismissed && <V3Banner />}
			<DashboardView stats={stats} loading={loading} showEntries={showEntries} modulesUrl={modulesUrl} dashboardUrl={dashboardUrl} />
			<PluginsYouMightLike />
			{!isPro && <FreeVsProTable />}
			<SupportSection />
		</>
	);
}
