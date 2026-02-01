/**
 * Admin app header: logo, nav (Dashboard, Modules, AI Settings, Entries), version, docs, pro.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { DocsIcon, CrownIconNav } from './icons/NavIcons';

export function Header({ isPro, showEntries, currentView }) {
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

	const isDashboard = currentView === 'dashboard';
	const isModules = currentView === 'features';
	const isEntries = currentView === 'entries';
	const isAiSettings = currentView === 'ai-settings';

	return (
		<header className="dcs-admin__header">
			<div className="dcs-admin__header-left">
				<div className="dcs-admin__logo">
					<svg
						width="36"
						height="36"
						viewBox="0 0 48 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clipPath="url(#clip0_cf7m_header)">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M21.9927 15.7109C24.0728 15.711 25.7588 17.3972 25.7589 19.4771C25.7589 21.557 24.0728 23.2433 21.9927 23.2433C19.9127 23.2433 18.2266 21.557 18.2266 19.4771C18.2266 17.3971 19.9127 15.7109 21.9927 15.7109ZM21.9927 17.0919C21.7154 17.0919 21.4906 17.3167 21.4906 17.5941V18.9749H20.1096C19.8323 18.975 19.6075 19.1998 19.6074 19.4771C19.6074 19.7545 19.8323 19.9793 20.1096 19.9793H21.4906V21.3602C21.4906 21.6375 21.7154 21.8624 21.9927 21.8624C22.2701 21.8623 22.4949 21.6375 22.4949 21.3602V19.9793H23.8758C24.1531 19.9793 24.378 19.7545 24.378 19.4771C24.378 19.1998 24.1531 18.9749 23.8758 18.9749H22.4949V17.5941C22.4949 17.3167 22.2701 17.0919 21.9927 17.0919Z"
								fill="#5733FF"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M38.4 0C43.7019 0 48 4.29806 48 9.6V38.4C48 43.7019 43.7019 48 38.4 48H9.6C4.29806 48 0 43.7019 0 38.4V9.6C0 4.29806 4.29806 2.35646e-07 9.6 0H38.4ZM12.2481 10.944C8.06128 10.9441 4.66725 14.9909 4.66725 19.9828V28.0172C4.66725 33.0091 8.06128 37.056 12.2481 37.056H23.1983C27.3852 37.056 30.7792 33.0091 30.7792 28.0172V19.9828C30.7792 14.9909 27.3852 10.944 23.1983 10.944H12.2481ZM38.0604 10.944C35.1485 10.944 32.7878 13.8667 32.7878 17.472V30.528C32.7878 34.1333 35.1485 37.056 38.0604 37.056C40.9724 37.056 43.3332 34.1334 43.3332 30.528V17.472C43.3332 13.8667 40.9724 10.944 38.0604 10.944Z"
								fill="#5733FF"
							/>
						</g>
						<defs>
							<clipPath id="clip0_cf7m_header">
								<rect width="48" height="48" fill="white" />
							</clipPath>
						</defs>
					</svg>
					<h1
						className="dcs-admin__title"
						style={{ fontWeight: 700 }}
					>
						{__('CF7 Mate', 'cf7-styler-for-divi')}
					</h1>
				</div>
				<nav className="dcs-admin__nav">
					{entriesOnlyPage && isEntries ? (
						<a
							href={cf7AdminUrl}
							className="dcs-admin__nav-link"
							aria-label={__(
								'Back to Contact Form 7',
								'cf7-styler-for-divi'
							)}
						>
							<span className="dcs-admin__nav-text">
								{__('Contact Form 7', 'cf7-styler-for-divi')}
							</span>
						</a>
					) : (
						<>
							<a
								href={dashboardUrl + '#/'}
								className={`dcs-admin__nav-link ${isDashboard ? 'dcs-admin__nav-link--active' : ''}`}
								aria-label={__(
									'Dashboard',
									'cf7-styler-for-divi'
								)}
							>
								<span className="dcs-admin__nav-text">
									{__('Dashboard', 'cf7-styler-for-divi')}
								</span>
							</a>
							<a
								href={modulesUrl}
								className={`dcs-admin__nav-link ${isModules ? 'dcs-admin__nav-link--active' : ''}`}
								aria-label={__(
									'Modules',
									'cf7-styler-for-divi'
								)}
							>
								<span className="dcs-admin__nav-text">
									{__('Modules', 'cf7-styler-for-divi')}
								</span>
							</a>
							{showEntries && !entriesOnlyPage && (
								<a
									href={entriesUrl}
									className={`dcs-admin__nav-link ${isEntries ? 'dcs-admin__nav-link--active' : ''}`}
									aria-label={__(
										'Form Entries',
										'cf7-styler-for-divi'
									)}
								>
									<span className="dcs-admin__nav-text">
										{__('Entries', 'cf7-styler-for-divi')}
									</span>
								</a>
							)}
							{isPro && !entriesOnlyPage && (
								<a
									href={dashboardUrl + '#/ai-settings'}
									className={`dcs-admin__nav-link ${isAiSettings ? 'dcs-admin__nav-link--active' : ''}`}
									aria-label={__(
										'AI Settings',
										'cf7-styler-for-divi'
									)}
								>
									<span className="dcs-admin__nav-text">
										{__(
											'AI Settings',
											'cf7-styler-for-divi'
										)}
									</span>
								</a>
							)}
						</>
					)}
				</nav>
			</div>
			<div className="dcs-admin__header-right">
				<span className="dcs-admin__version-right" aria-hidden="true">
					v{version}
				</span>
				<a
					href="https://divipeople.com/docs/cf7-mate/"
					target="_blank"
					rel="noopener noreferrer"
					className="dcs-admin__nav-link dcs-admin__nav-link--docs"
					aria-label={__('Documentation', 'cf7-styler-for-divi')}
				>
					<DocsIcon />
				</a>
				{!isPro && (
					<a
						href={pricingUrl}
						className="dcs-admin__nav-link dcs-admin__nav-link--pro"
						aria-label={__('Upgrade to Pro', 'cf7-styler-for-divi')}
					>
						<CrownIconNav />
					</a>
				)}
			</div>
		</header>
	);
}
