/**
 * Admin header with navigation
 * Uses @wordpress/components (Flex, Button) and Heroicons
 *
 * @package CF7_Mate
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Flex, FlexItem, Button } from '@wordpress/components';
import {
	HomeIcon,
	SparklesIcon,
	DocumentDuplicateIcon,
	WebhookIcon,
	CogIcon,
	ChevronDownIcon,
} from '@heroicons/react/24/outline';
import CF7MateLogo from '../../components/CF7MateLogo';

export function Header({ isPro, showEntries, showWebhook, currentView }) {
	const [dataOpen, setDataOpen] = useState(false);
	const [accountOpen, setAccountOpen] = useState(false);

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
	const isModules = currentView === 'features';
	const isEntries = currentView === 'entries';
	const isWebhook = currentView === 'webhook';
	const isLicense = currentView === 'license';

	const NavLink = ({ href, icon: Icon, label, active = false }) => (
		<a
			href={href}
			className={`cf7m-nav__link ${active ? 'active' : ''}`}
		>
			{Icon && <Icon className="w-5 h-5" style={{ marginRight: '8px' }} />}
			<span>{label}</span>
		</a>
	);

	const DropdownButton = ({ label, open, onClick, children }) => (
		<div className="cf7m-nav__dropdown">
			<button
				onClick={onClick}
				className={`cf7m-nav__dropdown-trigger ${
					open || isEntries || isWebhook || isLicense ? 'active' : ''
				}`}
				aria-expanded={open}
			>
				<span>{label}</span>
				<ChevronDownIcon className="w-4 h-4" />
			</button>
			{open && (
				<div className="cf7m-nav__dropdown-menu" role="menu">
					{children}
				</div>
			)}
		</div>
	);

	const DropdownItem = ({ href, icon: Icon, label, active = false }) => (
		<a
			href={href}
			className={`cf7m-nav__dropdown-item ${active ? 'active' : ''}`}
			role="menuitem"
		>
			{Icon && <Icon className="w-4 h-4" />}
			<span>{label}</span>
		</a>
	);

	return (
		<header className="cf7m-admin__header">
			<Flex className="cf7m-admin__header-left">
				<FlexItem className="cf7m-admin__logo">
					<CF7MateLogo width={36} height={36} />
				</FlexItem>

				<nav className="cf7m-nav">
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

							{/* Modules */}
							<NavLink
								href={`${dashboardUrl}#/features`}
								icon={SparklesIcon}
								label={__('Modules', 'cf7-styler-for-divi')}
								active={isModules}
							/>

							{/* Data Dropdown */}
							{(showEntries || showWebhook) && !entriesOnlyPage && (
								<DropdownButton
									label={__('Data', 'cf7-styler-for-divi')}
									open={dataOpen}
									onClick={() => setDataOpen(!dataOpen)}
								>
									{showEntries && (
										<DropdownItem
											href={`${dashboardUrl}#/entries`}
											icon={DocumentDuplicateIcon}
											label={__('Form Entries', 'cf7-styler-for-divi')}
											active={isEntries}
											onClick={() => setDataOpen(false)}
										/>
									)}
									{showWebhook && (
										<DropdownItem
											href={`${dashboardUrl}#/webhook`}
											icon={WebhookIcon}
											label={__('Webhook', 'cf7-styler-for-divi')}
											active={isWebhook}
											onClick={() => setDataOpen(false)}
										/>
									)}
								</DropdownButton>
							)}

							{/* Account Dropdown (Pro only) */}
							{isPro && !entriesOnlyPage && (
								<DropdownButton
									label={__('Account', 'cf7-styler-for-divi')}
									open={accountOpen}
									onClick={() => setAccountOpen(!accountOpen)}
								>
									<DropdownItem
										href={`${dashboardUrl}#/license`}
										icon={CogIcon}
										label={__('License', 'cf7-styler-for-divi')}
										active={isLicense}
										onClick={() => setAccountOpen(false)}
									/>
								</DropdownButton>
							)}
						</>
					)}
				</nav>
			</Flex>

			{/* Version info (right side) */}
			<div className="text-xs text-muted" style={{ marginLeft: 'auto' }}>
				v{version}
			</div>
		</header>
	);
}
