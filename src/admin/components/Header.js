/**
 * Admin app header: logo, nav (Dashboard, Modules, AI Settings, Entries), version, docs, pro.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { DocsIcon, CrownIconNav } from './icons/NavIcons';
import CF7MateLogo from '../../components/CF7MateLogo';

export function Header({ isPro, showEntries, showWebhook, currentView }) {
	const entriesOnlyPage =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	const cf7AdminUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.cf7_admin_url
			? dcsCF7Styler.cf7_admin_url
			: 'admin.php?page=wpcf7';
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined'
			? dcsCF7Styler.pricing_url
			: '/wp-admin/admin.php?page=cf7-mate-pricing';
	const accountUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.fs_account_url
			? dcsCF7Styler.fs_account_url
			: '';
	const version =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.version
			? dcsCF7Styler.version
			: '3.0.0';
	const dashboardUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dashboard_url
			? dcsCF7Styler.dashboard_url
			: 'admin.php?page=cf7-mate-dashboard';
	const modulesUrl = `${dashboardUrl}#/features`;
	const entriesUrl = `${dashboardUrl}#/entries`;
	const webhookUrl = `${dashboardUrl}#/webhook`;

	const isDashboard = currentView === 'dashboard';
	const isModules = currentView === 'features';
	const isEntries = currentView === 'entries';
	const isAiSettings = currentView === 'ai-settings';
	const isWebhook = currentView === 'webhook';
	const isFreeVsPro = currentView === 'free-vs-pro';
	const freeVsProUrl = `${dashboardUrl}#/free-vs-pro`;

	return (
		<header className="cf7m-admin__header">
			<div className="cf7m-admin__header-left">
				<div className="cf7m-admin__logo">
					<CF7MateLogo width={36} height={36} />
				</div>
				<nav className="cf7m-admin__nav">
					{entriesOnlyPage && isEntries ? (
						<a
							href={cf7AdminUrl}
							className="cf7m-admin__nav-link"
							aria-label={__(
								'Back to Contact Form 7',
								'cf7-styler-for-divi'
							)}
						>
							<span className="cf7m-admin__nav-text">
								{__('Contact Form 7', 'cf7-styler-for-divi')}
							</span>
						</a>
					) : (
						<>
							<a
								href={dashboardUrl + '#/'}
								className={`cf7m-admin__nav-link ${isDashboard ? 'cf7m-admin__nav-link--active' : ''}`}
								aria-label={__(
									'Dashboard',
									'cf7-styler-for-divi'
								)}
							>
								<span className="cf7m-admin__nav-text">
									{__('Dashboard', 'cf7-styler-for-divi')}
								</span>
							</a>
							<a
								href={modulesUrl}
								className={`cf7m-admin__nav-link ${isModules ? 'cf7m-admin__nav-link--active' : ''}`}
								aria-label={__(
									'Modules',
									'cf7-styler-for-divi'
								)}
							>
								<span className="cf7m-admin__nav-text">
									{__('Modules', 'cf7-styler-for-divi')}
								</span>
							</a>
							{!isPro && !entriesOnlyPage && (
								<a
									href={freeVsProUrl}
									className={`cf7m-admin__nav-link ${isFreeVsPro ? 'cf7m-admin__nav-link--active' : ''}`}
									aria-label={__('Free vs Pro', 'cf7-styler-for-divi')}
								>
									<span className="cf7m-admin__nav-text">
										{__('Free vs Pro', 'cf7-styler-for-divi')}
									</span>
								</a>
							)}
							{showEntries && !entriesOnlyPage && (
								<a
									href={entriesUrl}
									className={`cf7m-admin__nav-link ${isEntries ? 'cf7m-admin__nav-link--active' : ''}`}
									aria-label={__(
										'Form Entries',
										'cf7-styler-for-divi'
									)}
								>
									<span className="cf7m-admin__nav-text">
										{__('Entries', 'cf7-styler-for-divi')}
									</span>
								</a>
							)}
							{isPro && !entriesOnlyPage && (
								<a
									href={dashboardUrl + '#/ai-settings'}
									className={`cf7m-admin__nav-link ${isAiSettings ? 'cf7m-admin__nav-link--active' : ''}`}
									aria-label={__(
										'AI Settings',
										'cf7-styler-for-divi'
									)}
								>
									<span className="cf7m-admin__nav-text">
										{__(
											'AI Settings',
											'cf7-styler-for-divi'
										)}
									</span>
								</a>
							)}
							{showWebhook && !entriesOnlyPage && (
								<a
									href={webhookUrl}
									className={`cf7m-admin__nav-link ${isWebhook ? 'cf7m-admin__nav-link--active' : ''}`}
									aria-label={__('Webhook', 'cf7-styler-for-divi')}
								>
									<span className="cf7m-admin__nav-text">
										{__('Webhook', 'cf7-styler-for-divi')}
									</span>
								</a>
							)}
						</>
					)}
				</nav>
			</div>
			<div className="cf7m-admin__header-right">
				<span className="cf7m-admin__version-right" aria-hidden="true">
					v{version}
				</span>
				<a
					href="https://cf7mate.com/docs"
					target="_blank"
					rel="noopener noreferrer"
					className="cf7m-admin__nav-link cf7m-admin__nav-link--docs"
					aria-label={__('Documentation', 'cf7-styler-for-divi')}
				>
					<DocsIcon />
				</a>
				{isPro ? (
					accountUrl ? (
						<a
							href={accountUrl}
							className="cf7m-admin__nav-link cf7m-admin__nav-link--account"
							aria-label={__('Account', 'cf7-styler-for-divi')}
						>
							<span className="cf7m-admin__nav-text">
								{__('Account', 'cf7-styler-for-divi')}
							</span>
						</a>
					) : null
				) : (
					<a
						href={pricingUrl}
						className="cf7m-admin__nav-link cf7m-admin__nav-link--pro"
						aria-label={__('Upgrade to Pro', 'cf7-styler-for-divi')}
					>
						<CrownIconNav />
					</a>
				)}
			</div>
		</header>
	);
}
