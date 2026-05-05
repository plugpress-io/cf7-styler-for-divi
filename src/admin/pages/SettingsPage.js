/**
 * Settings Page: Unified settings with 4 tabs (Modules, Webhook, License, AI Provider)
 * Uses @wordpress/components TabPanel for tab interface
 *
 * @package CF7_Mate
 */

import { TabPanel, Heading, Flex } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { V3Banner } from '../components/V3Banner';
import { FeaturesSection } from '../components/FeaturesSection';
import { WebhookPage } from './WebhookPage';

const getProPage = (name) => window.cf7mProPages && window.cf7mProPages[name];

export function SettingsPage({
	features,
	isPro,
	onToggle,
	saving,
	showV3Banner,
	rebrandDismissed,
}) {
	const tabs = [
		{
			name: 'modules',
			title: __('Modules', 'cf7-styler-for-divi'),
			className: 'cf7m-settings-tab',
		},
		{
			name: 'webhook',
			title: __('Webhook', 'cf7-styler-for-divi'),
			className: 'cf7m-settings-tab',
		},
	];

	// Add License tab for pro only
	if (isPro) {
		tabs.push({
			name: 'license',
			title: __('License', 'cf7-styler-for-divi'),
			className: 'cf7m-settings-tab',
		});
	}

	// Add AI Provider tab for pro only
	if (isPro) {
		tabs.push({
			name: 'ai-provider',
			title: __('AI Provider', 'cf7-styler-for-divi'),
			className: 'cf7m-settings-tab',
		});
	}

	return (
		<div className="cf7m-settings-page">
			{showV3Banner && !rebrandDismissed && <V3Banner />}

			<div className="cf7m-section">
				<Heading level={1} className="cf7m-section__title">
					{__('Settings', 'cf7-styler-for-divi')}
				</Heading>
				<p className="cf7m-section__subtitle">
					{__('Configure modules, webhooks, license, and AI settings for CF7 Mate Pro.', 'cf7-styler-for-divi')}
				</p>
			</div>

			<div className="cf7m-card">
				<TabPanel
					tabs={tabs}
					initialTabName="modules"
					className="cf7m-tab-panel"
				>
					{(tab) => (
						<div className="cf7m-settings-tab__content">
							{tab.name === 'modules' && (
								<FeaturesSection
									features={features}
									isPro={isPro}
									onToggle={onToggle}
									saving={saving}
								/>
							)}

							{tab.name === 'webhook' && (
								<WebhookPage />
							)}

							{tab.name === 'license' && isPro && (
								<LicenseTab />
							)}

							{tab.name === 'ai-provider' && isPro && (
								<AIProviderTab />
							)}
						</div>
					)}
				</TabPanel>
			</div>
		</div>
	);
}

// License Tab Content
function LicenseTab() {
	const LicensePage = getProPage('license');

	if (LicensePage) {
		return <LicensePage />;
	}

	return (
		<div className="cf7m-section">
			<p className="text-muted">
				{__('License management is available in the Pro version.', 'cf7-styler-for-divi')}
			</p>
		</div>
	);
}

// AI Provider Tab Content
function AIProviderTab() {
	const AISettingsPage = getProPage('ai-settings');

	if (AISettingsPage) {
		return <AISettingsPage />;
	}

	return (
		<div className="cf7m-section">
			<p className="text-muted">
				{__('AI Provider settings are available in the Pro version.', 'cf7-styler-for-divi')}
			</p>
		</div>
	);
}
