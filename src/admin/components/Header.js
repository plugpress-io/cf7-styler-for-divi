/**
 * Admin header with navigation
 * Uses @wordpress/components (Flex, FlexItem) and Heroicons
 * Keyboard accessible with Escape to close dropdowns
 *
 * @package CF7_Mate
 */

import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Flex, FlexItem } from '@wordpress/components';
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
	const dataDropdownRef = useRef(null);
	const accountDropdownRef = useRef(null);

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

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dataDropdownRef.current && !dataDropdownRef.current.contains(event.target)) {
				setDataOpen(false);
			}
			if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
				setAccountOpen(false);
			}
		};

		if (dataOpen || accountOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [dataOpen, accountOpen]);

	// Close dropdowns when pressing Escape
	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				setDataOpen(false);
				setAccountOpen(false);
			}
		};

		if (dataOpen || accountOpen) {
			document.addEventListener('keydown', handleEscape);
			return () => document.removeEventListener('keydown', handleEscape);
		}
	}, [dataOpen, accountOpen]);

	const toggleDropdown = (dropdownName) => {
		if (dropdownName === 'data') {
			setDataOpen(!dataOpen);
			if (accountOpen) setAccountOpen(false);
		} else if (dropdownName === 'account') {
			setAccountOpen(!accountOpen);
			if (dataOpen) setDataOpen(false);
		}
	};

	const closeAllDropdowns = () => {
		setDataOpen(false);
		setAccountOpen(false);
	};

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

	const DropdownButton = ({ label, open, dropdownName, children }) => (
		<div
			className="cf7m-nav__dropdown"
			ref={dropdownName === 'data' ? dataDropdownRef : accountDropdownRef}
		>
			<button
				onClick={() => toggleDropdown(dropdownName)}
				className={`cf7m-nav__dropdown-trigger ${
					open || (dropdownName === 'data' && (isEntries || isWebhook)) || (dropdownName === 'account' && isLicense)
						? 'active'
						: ''
				}`}
				aria-expanded={open}
				aria-haspopup="menu"
				title={label}
			>
				<span>{label}</span>
				<ChevronDownIcon className="cf7m-nav__dropdown-icon" aria-hidden="true" />
			</button>
			{open && (
				<div className="cf7m-nav__dropdown-menu" role="menu">
					{children}
				</div>
			)}
		</div>
	);

	const DropdownItem = ({ href, icon: Icon, label, active = false, onClick }) => (
		<a
			href={href}
			className={`cf7m-nav__dropdown-item ${active ? 'active' : ''}`}
			role="menuitem"
			onClick={(e) => {
				onClick?.();
				closeAllDropdowns();
			}}
		>
			{Icon && <Icon className="cf7m-nav__dropdown-item-icon" aria-hidden="true" />}
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
									dropdownName="data"
								>
									{showEntries && (
										<DropdownItem
											href={`${dashboardUrl}#/entries`}
											icon={DocumentDuplicateIcon}
											label={__('Form Entries', 'cf7-styler-for-divi')}
											active={isEntries}
										/>
									)}
									{showWebhook && (
										<DropdownItem
											href={`${dashboardUrl}#/webhook`}
											icon={WebhookIcon}
											label={__('Webhook', 'cf7-styler-for-divi')}
											active={isWebhook}
										/>
									)}
								</DropdownButton>
							)}

							{/* Account Dropdown (Pro only) */}
							{isPro && !entriesOnlyPage && (
								<DropdownButton
									label={__('Account', 'cf7-styler-for-divi')}
									open={accountOpen}
									dropdownName="account"
								>
									<DropdownItem
										href={`${dashboardUrl}#/license`}
										icon={CogIcon}
										label={__('License', 'cf7-styler-for-divi')}
										active={isLicense}
									/>
								</DropdownButton>
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
