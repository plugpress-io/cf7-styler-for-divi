/**
 * Responses app shell: header + Responses page (or upsell when not Pro / disabled).
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

function getEntryIdFromHash() {
	const hash = (window.location.hash || '').replace(/^#\/?/, '');
	const m = hash.match(/^(?:responses|entries)\/(\d+)$/);
	return m ? parseInt(m[1], 10) : null;
}

export function ResponsesApp() {
	const [features, setFeatures] = useState({ database_entries: true });
	const [isPro, setIsPro] = useState(
		typeof dcsCF7Styler !== 'undefined' && !!dcsCF7Styler.is_pro,
	);
	const [loading, setLoading] = useState(true);
	const [entryId, setEntryId] = useState(getEntryIdFromHash());

	useEffect(() => {
		const onHashChange = () => setEntryId(getEntryIdFromHash());
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);

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

	const dashUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dash_url
			? dcsCF7Styler.dash_url
			: 'admin.php?page=cf7-mate';

	const ResponsesPage = getProPage('responses');
	const showResponses = isPro && !!features.database_entries;

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
				{ResponsesPage && showResponses ? (
					<ResponsesPage
						entryId={entryId}
						onBack={() => {
							window.location.href = dashUrl;
						}}
					/>
				) : ResponsesPage && isPro && !features.database_entries ? (
					<p className="cf7m-dash-row__desc">
						{__('Enable Responses in Settings to view form submissions.', 'cf7-styler-for-divi')}
					</p>
				) : (
					<UpsellPlaceholder feature="responses" />
				)}
			</div>
		</div>
	);
}
