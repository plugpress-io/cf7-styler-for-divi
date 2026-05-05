/**
 * Dashboard view – role-specific layouts
 * Uses Tailwind CSS for styling
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import {
	DocumentTextIcon,
	InboxIcon,
	SparklesIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/outline';

const getProWidget = (name) => window.cf7mProWidgets && window.cf7mProWidgets[name];

export function DashboardView({
	stats,
	loading,
	showEntries,
	isPro,
	dashboardUrl,
	modulesUrl,
}) {

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<p className="text-gray-500 text-sm">
						{__('Loading…', 'cf7-styler-for-divi')}
					</p>
				</div>
			</div>
		);
	}

	const EntriesOverview = getProWidget('entriesOverview');

	// Free version: welcome card with quick actions
	if (!isPro) {
		return (
			<div className="flex justify-center py-12">
				<div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md text-center shadow-sm">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						{__('Welcome to CF7 Mate', 'cf7-styler-for-divi')}
					</h1>
					<p className="text-gray-600 text-sm mb-6">
						{__('Style Contact Form 7, add custom fields, and unlock pro features.', 'cf7-styler-for-divi')}
					</p>
					<div className="flex gap-3">
						<a
							href={modulesUrl}
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
						>
							{__('Explore Features', 'cf7-styler-for-divi')}
						</a>
						<a
							href={dashboardUrl + '#/free-vs-pro'}
							className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
						>
							{__('See What\'s Pro', 'cf7-styler-for-divi')}
						</a>
					</div>
				</div>
			</div>
		);
	}

	// Pro version: dashboard with stats and entries
	return (
		<div className="space-y-6">
			{/* Stats Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
					<DocumentTextIcon className="w-6 h-6 text-blue-600 mb-3" />
					<div className="text-2xl font-bold text-gray-900">{stats.total_forms || 0}</div>
					<div className="text-xs text-gray-600 mt-1">{__('Forms', 'cf7-styler-for-divi')}</div>
				</div>
				{showEntries && (
					<>
						<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
							<InboxIcon className="w-6 h-6 text-green-600 mb-3" />
							<div className="text-2xl font-bold text-gray-900">{stats.total_entries || 0}</div>
							<div className="text-xs text-gray-600 mt-1">{__('Entries', 'cf7-styler-for-divi')}</div>
						</div>
						<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
							<CheckCircleIcon className="w-6 h-6 text-amber-600 mb-3" />
							<div className="text-2xl font-bold text-gray-900">{stats.new_today || 0}</div>
							<div className="text-xs text-gray-600 mt-1">{__('Today', 'cf7-styler-for-divi')}</div>
						</div>
					</>
				)}
				<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
					<SparklesIcon className="w-6 h-6 text-purple-600 mb-3" />
					<div className="text-2xl font-bold text-gray-900">{stats.enabled_features || 0}</div>
					<div className="text-xs text-gray-600 mt-1">{__('Enabled', 'cf7-styler-for-divi')}</div>
				</div>
			</div>

			{/* Entries Overview */}
			{EntriesOverview && showEntries && (
				<div>
					<EntriesOverview
						showEntries={showEntries}
						dashboardUrl={dashboardUrl}
						stats={stats}
					/>
				</div>
			)}
		</div>
	);
}
