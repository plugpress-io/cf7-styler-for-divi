/**
 * Dashboard: overview stats + quick links in one card.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import {
	FeatureIconDatabase,
	FeatureIconStar,
	FeatureIconModule,
	FeatureIconGrid,
	FeatureIconColumns,
	FeatureIconAI,
} from './icons/FeatureIcons';

export function DashboardView({ stats, loading, showEntries, modulesUrl, dashboardUrl }) {
	const cf7AdminUrl = typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.cf7_admin_url ? dcsCF7Styler.cf7_admin_url : 'admin.php?page=wpcf7';
	const cf7NewUrl = (cf7AdminUrl && cf7AdminUrl.replace('page=wpcf7', 'page=wpcf7-new')) || 'admin.php?page=wpcf7-new';

	if (loading) {
		return (
			<div className="dcs-card dcs-dashboard-card">
				<div className="dcs-dashboard-card__body">
					<p className="dcs-dashboard-card__muted">{__('Loading…', 'cf7-styler-for-divi')}</p>
				</div>
			</div>
		);
	}

	const quickLinks = [
		...(showEntries ? [{ href: dashboardUrl + '#/entries', label: __('View Entries', 'cf7-styler-for-divi') }] : []),
		{ href: cf7NewUrl, label: __('Create Form', 'cf7-styler-for-divi'), external: true },
		{ href: cf7AdminUrl, label: __('Manage Forms', 'cf7-styler-for-divi'), external: true },
		{ href: modulesUrl, label: __('Modules', 'cf7-styler-for-divi') },
		{ href: dashboardUrl + '#/ai-settings', label: __('AI Settings', 'cf7-styler-for-divi') },
	];

	return (
		<div className="dcs-card dcs-dashboard-card">
			<div className="dcs-dashboard-card__body">
				<div className="dcs-dashboard-stats" role="group" aria-label={__('Overview', 'cf7-styler-for-divi')}>
					<div className="dcs-stat">
						<span className="dcs-stat__icon dcs-stat__icon--muted" aria-hidden="true"><FeatureIconDatabase /></span>
						<div className="dcs-stat__content">
							<span className="dcs-stat__value">{stats.total_entries}</span>
							<span className="dcs-stat__label">{__('Entries', 'cf7-styler-for-divi')}</span>
						</div>
					</div>
					<div className="dcs-stat">
						<span className="dcs-stat__icon dcs-stat__icon--muted" aria-hidden="true"><FeatureIconStar /></span>
						<div className="dcs-stat__content">
							<span className="dcs-stat__value">{stats.new_today}</span>
							<span className="dcs-stat__label">{__('New today', 'cf7-styler-for-divi')}</span>
						</div>
					</div>
					<div className="dcs-stat">
						<span className="dcs-stat__icon dcs-stat__icon--muted" aria-hidden="true"><FeatureIconModule /></span>
						<div className="dcs-stat__content">
							<span className="dcs-stat__value">{stats.total_forms}</span>
							<span className="dcs-stat__label">{__('Forms', 'cf7-styler-for-divi')}</span>
						</div>
					</div>
					<div className="dcs-stat">
						<span className="dcs-stat__icon dcs-stat__icon--muted" aria-hidden="true"><FeatureIconGrid /></span>
						<div className="dcs-stat__content">
							<span className="dcs-stat__value">{stats.enabled_features}</span>
							<span className="dcs-stat__label">{__('Active modules', 'cf7-styler-for-divi')}</span>
						</div>
					</div>
				</div>
				<nav className="dcs-dashboard-quick" aria-label={__('Quick actions', 'cf7-styler-for-divi')}>
					{quickLinks.map((link, i) => (
						<span key={link.label}>
							{i > 0 && <span className="dcs-dashboard-quick__sep" aria-hidden="true">·</span>}
							<a
								href={link.href}
								className="dcs-dashboard-quick__link"
								{...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
							>
								{link.label}
							</a>
						</span>
					))}
				</nav>
			</div>
		</div>
	);
}
