/**
 * Settings app shell: header, dashboard overview, settings tabs, toast, modals.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { RebrandModal } from './components/RebrandModal';
import { SettingsPage } from './pages/SettingsPage';

export function SettingsApp() {
	const [features, setFeatures] = useState({
		cf7_module: true,
		bricks_module: true,
		elementor_module: true,
		gutenberg_module: true,
		grid_layout: true,
		multi_column: true,
		multi_step: true,
		star_rating: true,
		database_entries: true,
		range_slider: true,
	});
	const [isPro, setIsPro] = useState(
		typeof dcsCF7Styler !== 'undefined' && !!dcsCF7Styler.is_pro,
	);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState(null);
	const [dashboardStats, setDashboardStats] = useState({
		total_entries: 0,
		new_today: 0,
		total_forms: 0,
		enabled_features: 0,
	});
	const [dashboardStatsLoading, setDashboardStatsLoading] = useState(true);
	const [rebrandDismissed, setRebrandDismissed] = useState(false);

	useEffect(() => {
		loadFeatures();
	}, []);

	useEffect(() => {
		setDashboardStatsLoading(true);
		apiFetch({ path: '/cf7-styler/v1/dashboard-stats' })
			.then((data) => setDashboardStats(data))
			.catch(() =>
				setDashboardStats({
					total_entries: 0,
					new_today: 0,
					total_forms: 0,
					enabled_features: 0,
				}),
			)
			.finally(() => setDashboardStatsLoading(false));
	}, []);

	const loadFeatures = async () => {
		try {
			const response = await apiFetch({
				path: '/cf7-styler/v1/settings/features',
			});
			setFeatures(response.features);
			setIsPro(response.is_pro);
		} catch (error) {
			console.error('Error loading features:', error);
		} finally {
			setLoading(false);
		}
	};

	const persistFeatures = async (newFeatures) => {
		setFeatures(newFeatures);
		setSaving(true);
		try {
			await apiFetch({
				path: '/cf7-styler/v1/settings/features',
				method: 'POST',
				data: { features: newFeatures },
			});
			setToast({
				message: __('Settings saved', 'cf7-styler-for-divi'),
				type: 'success',
			});
		} catch (error) {
			console.error('Error saving features:', error);
			setFeatures(features);
			setToast({
				message: __('Error saving settings', 'cf7-styler-for-divi'),
				type: 'error',
			});
		} finally {
			setSaving(false);
		}
	};

	const handleToggle = (featureId, enabled) =>
		persistFeatures({ ...features, [featureId]: enabled });

	const handleBulkToggle = (updates) =>
		persistFeatures({ ...features, ...updates });

	const showV3Banner =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.show_v3_banner;
	const showResponses = isPro && !!features.database_entries;
	const responsesUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.responses_url
			? dcsCF7Styler.responses_url
			: 'admin.php?page=cf7-mate-responses';
	const dashUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dash_url
			? dcsCF7Styler.dash_url
			: 'admin.php?page=cf7-mate-dash';
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url
			? dcsCF7Styler.pricing_url
			: '';
	const promoCode =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.promo_code
			? dcsCF7Styler.promo_code
			: '';
	const promoText =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.promo_text
			? dcsCF7Styler.promo_text
			: '';

	if (loading) {
		return (
			<>
				<Header isPro={false} />
				<div className="cf7m-loading">
					{__('Loading...', 'cf7-styler-for-divi')}
				</div>
			</>
		);
	}

	return (
		<>
			<Header isPro={isPro} />
			<SettingsPage
				features={features}
				isPro={isPro}
				onToggle={handleToggle}
				onBulkToggle={handleBulkToggle}
				saving={saving}
				showV3Banner={showV3Banner}
				rebrandDismissed={rebrandDismissed}
				stats={dashboardStats}
				statsLoading={dashboardStatsLoading}
				showResponses={showResponses}
				responsesUrl={responsesUrl}
				dashUrl={dashUrl}
				pricingUrl={pricingUrl}
				promoCode={promoCode}
				promoText={promoText}
			/>
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
			{showV3Banner && !rebrandDismissed && (
				<RebrandModal onDismiss={() => setRebrandDismissed(true)} />
			)}
		</>
	);
}
