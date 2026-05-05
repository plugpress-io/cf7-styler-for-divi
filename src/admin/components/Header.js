/**
 * Admin header with navigation
 * Uses @wordpress/components (Flex, FlexItem) and Heroicons
 * Keyboard accessible with Escape to close dropdowns
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { Flex, FlexItem } from '@wordpress/components';
import {
	HomeIcon,
	DocumentDuplicateIcon,
	CogIcon,
} from '@heroicons/react/24/outline';
import CF7MateLogo from '../../components/CF7MateLogo';

export function Header({ isPro, showEntries, currentView }) {

	const entriesOnlyPage =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	const cf7AdminUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.cf7_admin_url
			? dcsCF7Styler.cf7_admin_url
			: 'admin.php?page=wpcf7';
	const version =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.version
			? dcsCF7Styler.version
			: '3.0.0';
	const dashboardUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dashboard_url
			? dcsCF7Styler.dashboard_url
			: 'admin.php?page=cf7-mate';

	const isDashboard = currentView === 'dashboard';
	const isSettings = currentView === 'settings';
	const isEntries = currentView === 'entries';


	const NavLink = ({ href, icon: Icon, label, active = false }) => (
		<a
			href={href}
			className={`cf7m-nav__link ${active ? 'active' : ''}`}
			title={label}
		>
			{Icon && <Icon className="cf7m-nav__icon" aria-hidden="true" />}
			<span>{label}</span>
		</a>
	);


	return (
		<header className="cf7m-admin__header">
			<Flex className="cf7m-admin__header-left">
				<FlexItem className="cf7m-admin__logo">
					<CF7MateLogo width={36} height={36} />
				</FlexItem>

				<nav className="cf7m-nav" role="navigation" aria-label={__('Main navigation', 'cf7-styler-for-divi')}>
					{entriesOnlyPage && isEntries ? (
						<NavLink
							href={cf7AdminUrl}
							icon={DocumentDuplicateIcon}
							label={__('Contact Form 7', 'cf7-styler-for-divi')}
						/>
					) : (
						<>
							{/* Overview */}
							<NavLink
								href={dashboardUrl}
								icon={HomeIcon}
								label={__('Overview', 'cf7-styler-for-divi')}
								active={isDashboard}
							/>

							{/* Settings */}
							<NavLink
								href={`${dashboardUrl}#/settings`}
								icon={CogIcon}
								label={__('Settings', 'cf7-styler-for-divi')}
								active={isSettings}
							/>

							{/* Form Entries (if pro) */}
							{showEntries && !entriesOnlyPage && (
								<NavLink
									href={`${dashboardUrl}#/entries`}
									icon={DocumentDuplicateIcon}
									label={__('Entries', 'cf7-styler-for-divi')}
									active={isEntries}
								/>
							)}
						</>
					)}
				</nav>
			</Flex>

			{/* Version info (right side) */}
			<div className="cf7m-header__version">
				v{version}
			</div>
		</header>
	);
}
