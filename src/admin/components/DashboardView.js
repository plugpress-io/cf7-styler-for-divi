/**
 * Dashboard view – role-specific layouts using @wordpress/components
 * Minimal, Notion-like design with clear information hierarchy
 *
 * @package CF7_Mate
 */

import { Heading, Button, Flex, FlexItem, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	DocumentTextIcon,
	InboxIcon,
	SparklesIcon,
	CheckCircleIcon,
	ArrowRightIcon,
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
			<div className="cf7m-section" style={{ textAlign: 'center', padding: '40px 0' }}>
				<Spinner />
				<p className="text-muted" style={{ marginTop: '16px' }}>
					{__('Loading dashboard…', 'cf7-styler-for-divi')}
				</p>
			</div>
		);
	}

	const EntriesOverview = getProWidget('entriesOverview');

	// Free version: welcome section
	if (!isPro) {
		return (
			<div className="cf7m-section">
				<div className="cf7m-card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
					<Heading level={1} className="cf7m-card__title" style={{ marginBottom: '12px' }}>
						{__('Welcome to CF7 Mate', 'cf7-styler-for-divi')}
					</Heading>
					<p className="cf7m-card__subtitle" style={{ margin: '0 0 24px 0' }}>
						{__('Style Contact Form 7, add custom fields, and unlock powerful pro features.', 'cf7-styler-for-divi')}
					</p>
					<Flex gap={3} direction="column">
						<FlexItem>
							<Button href={modulesUrl} variant="primary" style={{ width: '100%' }}>
								{__('Explore Modules', 'cf7-styler-for-divi')}
							</Button>
						</FlexItem>
						<FlexItem>
							<Button href={dashboardUrl + '#/free-vs-pro'} style={{ width: '100%' }}>
								{__('Compare Free vs Pro', 'cf7-styler-for-divi')}
							</Button>
						</FlexItem>
					</Flex>
				</div>
			</div>
		);
	}

	// Pro version: dashboard with stats and activity
	return (
		<div className="cf7m-dashboard">
			{/* Welcome Section */}
			<div className="cf7m-section">
				<Heading level={1} className="cf7m-section__title">
					{__('Dashboard', 'cf7-styler-for-divi')}
				</Heading>
				<p className="cf7m-section__subtitle">
					{__('Overview of your CF7 Mate Pro activity and settings.', 'cf7-styler-for-divi')}
				</p>
			</div>

			{/* Stats Grid */}
			<div className="cf7m-stats-grid grid grid-cols-2 md:grid-cols-4 gap-lg">
				<StatCard
					icon={DocumentTextIcon}
					color="primary"
					value={stats.total_forms || 0}
					label={__('Forms', 'cf7-styler-for-divi')}
					href={`${dashboardUrl}#/entries`}
					showArrow={showEntries}
				/>

				{showEntries && (
					<>
						<StatCard
							icon={InboxIcon}
							color="success"
							value={stats.total_entries || 0}
							label={__('Submissions', 'cf7-styler-for-divi')}
							href={`${dashboardUrl}#/entries`}
							showArrow={true}
						/>
						<StatCard
							icon={CheckCircleIcon}
							color="warning"
							value={stats.new_today || 0}
							label={__('Today', 'cf7-styler-for-divi')}
							href={`${dashboardUrl}#/entries`}
							showArrow={true}
						/>
					</>
				)}

				<StatCard
					icon={SparklesIcon}
					color="primary"
					value={stats.enabled_features || 0}
					label={__('Modules', 'cf7-styler-for-divi')}
					href={`${dashboardUrl}#/settings`}
					showArrow={true}
				/>
			</div>

			{/* Entries Overview */}
			{EntriesOverview && showEntries && (
				<div className="cf7m-section">
					<EntriesOverview
						showEntries={showEntries}
						dashboardUrl={dashboardUrl}
						stats={stats}
					/>
				</div>
			)}

			{/* Quick Actions */}
			<div className="cf7m-section">
				<Heading level={2} className="cf7m-section__title">
					{__('Quick Actions', 'cf7-styler-for-divi')}
				</Heading>
				<Flex gap={3}>
					<FlexItem>
						<Button href={`${dashboardUrl}#/settings`} variant="primary">
							{__('View Settings', 'cf7-styler-for-divi')}
						</Button>
					</FlexItem>
					<FlexItem>
						<Button href={modulesUrl}>
							{__('Manage Modules', 'cf7-styler-for-divi')}
						</Button>
					</FlexItem>
				</Flex>
			</div>
		</div>
	);
}

// Stat Card Component
function StatCard({ icon: Icon, color, value, label, href, showArrow }) {
	const colorMap = {
		primary: '#3a57fc',
		success: '#10b981',
		warning: '#f59e0b',
		danger: '#ef4444',
	};

	const content = (
		<div className="cf7m-stat-card">
			<div className="cf7m-stat-card__icon" style={{ color: colorMap[color] }}>
				<Icon className="w-6 h-6" aria-hidden="true" />
			</div>
			<div className="cf7m-stat-card__value">{value}</div>
			<div className="cf7m-stat-card__label">{label}</div>
			{showArrow && (
				<div className="cf7m-stat-card__arrow">
					<ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
				</div>
			)}
		</div>
	);

	if (href) {
		return <a href={href} className="cf7m-stat-card-link">{content}</a>;
	}

	return content;
}
