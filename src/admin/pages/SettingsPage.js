/**
 * Mate Dash – Notion-style layout with left sidebar nav + content pane.
 * Sections: Overview, Features, Webhook, AI Settings, License.
 *
 * @package CF7_Mate
 */

import { useEffect, useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	HomeIcon,
	SquaresPlusIcon,
	BoltIcon,
	SparklesIcon,
	KeyIcon,
} from '@heroicons/react/24/outline';

import { V3Banner } from '../components/V3Banner';
import { FeaturesSection } from '../components/FeaturesSection';
import { DashboardView } from '../components/DashboardView';
import { WebhookPage } from './WebhookPage';
import { getDashTabFromHash } from '../utils/routing';

const getProPage = (name) => window.cf7mProPages && window.cf7mProPages[name];

export function SettingsPage({
	features,
	isPro,
	onToggle,
	onBulkToggle,
	saving,
	showV3Banner,
	rebrandDismissed,
	stats,
	statsLoading,
	showResponses,
	responsesUrl,
	dashUrl,
}) {
	const [active, setActive] = useState(getDashTabFromHash());

	useEffect(() => {
		const onHash = () => setActive(getDashTabFromHash());
		window.addEventListener('hashchange', onHash);
		return () => window.removeEventListener('hashchange', onHash);
	}, []);

	const sections = useMemo(() => {
		const items = [
			{
				group: __('General', 'cf7-styler-for-divi'),
				items: [
					{
						id: 'overview',
						label: __('Overview', 'cf7-styler-for-divi'),
						icon: HomeIcon,
					},
					{
						id: 'features',
						label: __('Features', 'cf7-styler-for-divi'),
						icon: SquaresPlusIcon,
					},
				],
			},
			{
				group: __('Integrations', 'cf7-styler-for-divi'),
				items: [
					{
						id: 'webhook',
						label: __('Webhook', 'cf7-styler-for-divi'),
						icon: BoltIcon,
					},
					{
						id: 'ai-settings',
						label: __('AI Settings', 'cf7-styler-for-divi'),
						icon: SparklesIcon,
					},
				],
			},
		];
		if (isPro) {
			items.push({
				group: __('Account', 'cf7-styler-for-divi'),
				items: [
					{
						id: 'license',
						label: __('License', 'cf7-styler-for-divi'),
						icon: KeyIcon,
					},
				],
			});
		}
		return items;
	}, [isPro]);

	const activeMeta = useMemo(() => {
		for (const g of sections) {
			const found = g.items.find((i) => i.id === active);
			if (found) return found;
		}
		return sections[0].items[0];
	}, [active, sections]);

	const navigate = (id) => {
		const hash = id === 'overview' ? '#/' : `#/${id}`;
		if (window.location.hash !== hash) {
			window.history.pushState(null, '', hash);
		}
		setActive(id);
	};

	const sectionDescriptions = {
		overview: __(
			'A snapshot of your CF7 Mate activity, modules, and quick actions.',
			'cf7-styler-for-divi'
		),
		features: __(
			'Turn individual modules and field types on or off.',
			'cf7-styler-for-divi'
		),
		webhook: __(
			'Forward every form submission to external services like Zapier or Make.',
			'cf7-styler-for-divi'
		),
		'ai-settings': __(
			'Connect an AI provider to generate forms from a plain-English prompt.',
			'cf7-styler-for-divi'
		),
		license: __(
			'Manage your CF7 Mate Pro license key and activations.',
			'cf7-styler-for-divi'
		),
	};

	return (
		<div className="cf7m-dash">
			<aside className="cf7m-dash__sidebar" aria-label={__('Mate Dash sections', 'cf7-styler-for-divi')}>
				{sections.map((group) => (
					<div key={group.group} className="cf7m-dash__nav-group">
						<div className="cf7m-dash__nav-label">{group.group}</div>
						{group.items.map((item) => {
							const Icon = item.icon;
							const isActive = active === item.id;
							return (
								<button
									key={item.id}
									type="button"
									className={`cf7m-dash__nav-item${isActive ? ' is-active' : ''}`}
									onClick={() => navigate(item.id)}
									aria-current={isActive ? 'page' : undefined}
								>
									<Icon className="cf7m-dash__nav-icon" aria-hidden="true" />
									<span>{item.label}</span>
								</button>
							);
						})}
					</div>
				))}
			</aside>

			<section className="cf7m-dash__content">
				{showV3Banner && !rebrandDismissed && <V3Banner />}

				<header className="cf7m-dash__head">
					<h1 className="cf7m-dash__title">{activeMeta.label}</h1>
					<p className="cf7m-dash__subtitle">
						{sectionDescriptions[active] || ''}
					</p>
				</header>

				{active === 'overview' && (
					<DashboardView
						stats={stats}
						loading={statsLoading}
						showResponses={showResponses}
						isPro={isPro}
						responsesUrl={responsesUrl}
						dashUrl={dashUrl}
					/>
				)}

				{active === 'features' && (
					<FeaturesSection
						features={features}
						isPro={isPro}
						onToggle={onToggle}
						onBulkToggle={onBulkToggle}
						saving={saving}
					/>
				)}

				{active === 'webhook' && <WebhookPage />}

				{active === 'ai-settings' && (
					isPro ? <AISettingsTab /> : <ProUpsell feature="ai-settings" />
				)}

				{active === 'license' && isPro && <LicenseTab />}
			</section>
		</div>
	);
}

function LicenseTab() {
	const LicensePage = getProPage('license');
	if (LicensePage) return <LicensePage />;
	return <ProUpsell feature="license" />;
}

function AISettingsTab() {
	const AISettingsPage = getProPage('ai-settings');
	if (AISettingsPage) return <AISettingsPage />;
	return <ProUpsell feature="ai-settings" />;
}

function ProUpsell({ feature }) {
	const messages = {
		'ai-settings': __(
			'AI form generation is part of CF7 Mate Pro. Upgrade to connect OpenAI, Claude, Grok, or Kimi.',
			'cf7-styler-for-divi'
		),
		license: __(
			'License management is available in CF7 Mate Pro.',
			'cf7-styler-for-divi'
		),
	};
	return (
		<div className="cf7m-dash__upsell">
			<p>{messages[feature] || messages['ai-settings']}</p>
		</div>
	);
}
