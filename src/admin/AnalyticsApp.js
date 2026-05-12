/**
 * Analytics app shell: header + Analytics page (or upsell when not Pro / disabled).
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

import { Header } from './components/Header';
import { UpsellPlaceholder } from './components/UpsellPlaceholder';

const getProPage = (name) => window.cf7mProPages && window.cf7mProPages[name];

export function AnalyticsApp() {
	const [features, setFeatures] = useState({ analytics: true });
	const [isPro, setIsPro] = useState(
		typeof dcsCF7Styler !== 'undefined' && !!dcsCF7Styler.is_pro,
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
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
		})();
	}, []);

	const AnalyticsPageComp = getProPage('analytics');
	const showAnalytics = isPro && !!features.analytics;

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
			<div className="cf7m-responses">
				{AnalyticsPageComp && showAnalytics ? (
					<AnalyticsPageComp />
				) : AnalyticsPageComp && isPro && !features.analytics ? (
					<div className="cf7m-resp">
						<p className="cf7m-resp__count">
							{__('Enable Analytics in Features to track form performance.', 'cf7-styler-for-divi')}
						</p>
					</div>
				) : (
					<UpsellPlaceholder feature="analytics" />
				)}
			</div>
		</div>
	);
}
