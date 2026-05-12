/**
 * Settings app shell: header, dashboard overview, settings tabs, toast, modals.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
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
	const [rebrandDismissed, setRebrandDismissed] = useState(false);

	useEffect(() => {
		loadFeatures();
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
		const previous = features;
		// Optimistic update + immediate toast so the UI reacts instantly.
		setFeatures(newFeatures);
		setSaving(true);
		setToast({
			message: __('Saved', 'cf7-styler-for-divi'),
			type: 'success',
		});
		try {
			await apiFetch({
				path: '/cf7-styler/v1/settings/features',
				method: 'POST',
				data: { features: newFeatures },
			});
		} catch (error) {
			console.error('Error saving features:', error);
			setFeatures(previous);
			setToast({
				message: __('Could not save — change reverted', 'cf7-styler-for-divi'),
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
	const responsesUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.responses_url
			? dcsCF7Styler.responses_url
			: 'admin.php?page=cf7-mate-responses';

	if (loading) {
		return (
			<div className="cf7m-wrap">
				<Header isPro={false} />
				<div className="cf7m-resp__loading">
					<Spinner />
					<span>{__('Loading…', 'cf7-styler-for-divi')}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="cf7m-wrap">
			<Header isPro={isPro} />
			<SettingsPage
				features={features}
				isPro={isPro}
				onToggle={handleToggle}
				onBulkToggle={handleBulkToggle}
				saving={saving}
				showV3Banner={showV3Banner}
				rebrandDismissed={rebrandDismissed}
				responsesUrl={responsesUrl}
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
		</div>
	);
}
