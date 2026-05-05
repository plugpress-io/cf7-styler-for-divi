/**
 * Admin header with navigation
 * Uses Tailwind CSS and Heroicons for clean, simple design
 *
 * @package CF7_Mate
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
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

	const isDashboard = currentView === 'dashboard';
	const isModules = currentView === 'features';
	const isEntries = currentView === 'entries';
	const isWebhook = currentView === 'webhook';
	const isLicense = currentView === 'license';

	const NavLink = ({ href, icon: Icon, label, active = false }) => (
		<a
			href={href}
			className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition-all ${
				active
					? 'text-blue-600 border-b-2 border-blue-600'
					: 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
			}`}
		>
			{Icon && <Icon className="w-5 h-5" />}
			<span>{label}</span>
		</a>
	);

	const DropdownButton = ({ label, open, onClick, children }) => (
		<div className="relative">
			<button
				onClick={onClick}
				className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition-all ${
					open || isEntries || isWebhook || isLicense
						? 'text-blue-600 border-b-2 border-blue-600'
						: 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
				}`}
			>
				<span>{label}</span>
				<ChevronDownIcon
					className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
				/>
			</button>
			{open && (
				<div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
					{children}
				</div>
			)}
		</div>
	);

	return (
		<header className="cf7m-admin__header bg-white border-b border-gray-200">
			<div className="cf7m-admin__header-left">
				<div className="cf7m-admin__logo">
					<CF7MateLogo width={36} height={36} />
				</div>

				<nav className="cf7m-admin__nav flex items-center gap-1">
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
										<a
											href={`${dashboardUrl}#/entries`}
											className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isEntries ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
											onClick={() => setDataOpen(false)}
										>
											<DocumentDuplicateIcon className="w-4 h-4" />
											{__('Form Entries', 'cf7-styler-for-divi')}
										</a>
									)}
									{showWebhook && (
										<a
											href={`${dashboardUrl}#/webhook`}
											className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isWebhook ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
											onClick={() => setDataOpen(false)}
										>
											<WebhookIcon className="w-4 h-4" />
											{__('Webhook', 'cf7-styler-for-divi')}
										</a>
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
									<a
										href={`${dashboardUrl}#/license`}
										className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${isLicense ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
										onClick={() => setAccountOpen(false)}
									>
										<CogIcon className="w-4 h-4" />
										{__('License', 'cf7-styler-for-divi')}
									</a>
								</DropdownButton>
							)}
						</>
					)}
				</nav>
			</div>

			{/* Version info (right side) */}
			<div className="ml-auto text-xs text-gray-500">
				v{version}
			</div>
		</header>
	);
}
