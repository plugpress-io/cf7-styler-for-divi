/**
 * Main admin app shell: header, hash routing, pages, toast, modals.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import { getViewFromHash } from './utils/routing';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { V3Banner } from './components/V3Banner';
import { RebrandModal } from './components/RebrandModal';
import { DashboardPage } from './pages/DashboardPage';
import { ModulesPage } from './pages/ModulesPage';
import { AISettingsPage } from './pages/AISettingsPage';
import { EntriesPage } from './pages/EntriesPage';

export function App() {
	const [features, setFeatures] = useState({
		cf7_module: true,
		grid_layout: true,
		multi_column: true,
		multi_step: true,
		star_rating: true,
		database_entries: true,
		range_slider: true,
	});
	const [isPro, setIsPro] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState(null);
	const getInitialRoute = () => {
		if (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.currentPage === 'features') return { view: 'features', entryId: null };
		if (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.currentPage === 'ai-settings') return { view: 'ai-settings', entryId: null };
		return getViewFromHash();
	};
	const [route, setRoute] = useState(getInitialRoute);
	const currentView = route.view;
	const entriesEntryId = route.entryId;
	const [dashboardStats, setDashboardStats] = useState({ total_entries: 0, new_today: 0, total_forms: 0, enabled_features: 0 });
	const [dashboardStatsLoading, setDashboardStatsLoading] = useState(true);
	const [rebrandDismissed, setRebrandDismissed] = useState(false);

	useEffect(() => {
		const onHashChange = () => setRoute(getViewFromHash());
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);

	useEffect(() => {
		loadFeatures();
	}, []);

	useEffect(() => {
		if (route.view === 'dashboard') {
			setDashboardStatsLoading(true);
			apiFetch({ path: '/cf7-styler/v1/dashboard-stats' })
				.then((data) => setDashboardStats(data))
				.catch(() => setDashboardStats({ total_entries: 0, new_today: 0, total_forms: 0, enabled_features: 0 }))
				.finally(() => setDashboardStatsLoading(false));
		}
	}, [route.view]);

	const loadFeatures = async () => {
		try {
			const response = await apiFetch({ path: '/cf7-styler/v1/settings/features' });
			setFeatures(response.features);
			setIsPro(response.is_pro);
		} catch (error) {
			console.error('Error loading features:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleToggle = async (featureId, enabled) => {
		const newFeatures = { ...features, [featureId]: enabled };
		setFeatures(newFeatures);
		setSaving(true);
		try {
			await apiFetch({ path: '/cf7-styler/v1/settings/features', method: 'POST', data: { features: newFeatures } });
			setToast({ message: __('Settings saved', 'cf7-styler-for-divi'), type: 'success' });
		} catch (error) {
			console.error('Error saving features:', error);
			setFeatures(features);
			setToast({ message: __('Error saving settings', 'cf7-styler-for-divi'), type: 'error' });
		} finally {
			setSaving(false);
		}
	};

	const showV3Banner = typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.show_v3_banner;
	const showEntries = isPro && !!features.database_entries;
	const entriesOnlyPage = typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	const cf7AdminUrl = typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.cf7_admin_url ? dcsCF7Styler.cf7_admin_url : 'admin.php?page=wpcf7';
	const dashboardUrl = typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dashboard_url ? dcsCF7Styler.dashboard_url : 'admin.php?page=cf7-mate-dashboard';
	const modulesUrl = `${dashboardUrl}#/features`;

	const handleNavigate = (view) => {
		if (view === 'entries') window.location.hash = '#/entries';
		else window.location.hash = '#/';
	};

	if (loading) {
		return (
			<div className="dcs-admin-wrapper">
				<Header isPro={false} />
				<div className="dcs-admin">
					<div className="dcs-admin__content">
						<div className="dcs-loading">{__('Loading...', 'cf7-styler-for-divi')}</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="dcs-admin-wrapper">
			<Header isPro={isPro} showEntries={showEntries} currentView={currentView} />
			<div className={`dcs-admin ${currentView === 'entries' ? 'dcs-admin--entries-full' : ''}`}>
				<div className="dcs-admin__content">
					{currentView === 'entries' ? (
						showEntries ? (
							<EntriesPage
								entryId={entriesEntryId}
								onBack={entriesOnlyPage ? () => { window.location.href = cf7AdminUrl; } : () => handleNavigate('dashboard')}
							/>
						) : (
							<div className="dcs-card">
								<p className="dcs-card__desc">{__('Enable Database Entries in Features to view form submissions.', 'cf7-styler-for-divi')}</p>
							</div>
						)
					) : currentView === 'features' ? (
						<ModulesPage features={features} isPro={isPro} onToggle={handleToggle} saving={saving} showV3Banner={showV3Banner} rebrandDismissed={rebrandDismissed} />
					) : currentView === 'ai-settings' ? (
						<AISettingsPage />
					) : (
						<DashboardPage stats={dashboardStats} loading={dashboardStatsLoading} showEntries={showEntries} modulesUrl={modulesUrl} dashboardUrl={dashboardUrl} showV3Banner={showV3Banner} rebrandDismissed={rebrandDismissed} isPro={isPro} />
					)}
				</div>
			</div>
			{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
			{showV3Banner && !rebrandDismissed && <RebrandModal onDismiss={() => setRebrandDismissed(true)} />}
		</div>
	);
}
