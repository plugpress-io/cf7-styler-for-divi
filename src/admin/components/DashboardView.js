/**
 * Dashboard page: stats cards + quick actions.
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

	if (loading) {
		return (
			<div className="dcs-card">
				<div className="dcs-card__header">
					<p className="dcs-card__desc">{__('Loading…', 'cf7-styler-for-divi')}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="dcs-dashboard-stats">
				<div className="dcs-stat-card">
					<span className="dcs-stat-card__icon dcs-stat-card__icon--entries" aria-hidden="true"><FeatureIconDatabase /></span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">{__('Total Entries', 'cf7-styler-for-divi')}</span>
						<span className="dcs-stat-card__value">{stats.total_entries}</span>
					</div>
				</div>
				<div className="dcs-stat-card">
					<span className="dcs-stat-card__icon dcs-stat-card__icon--today" aria-hidden="true"><FeatureIconStar /></span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">{__('New Today', 'cf7-styler-for-divi')}</span>
						<span className="dcs-stat-card__value">{stats.new_today}</span>
					</div>
				</div>
				<div className="dcs-stat-card">
					<span className="dcs-stat-card__icon dcs-stat-card__icon--forms" aria-hidden="true"><FeatureIconModule /></span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">{__('Total Forms', 'cf7-styler-for-divi')}</span>
						<span className="dcs-stat-card__value">{stats.total_forms}</span>
					</div>
				</div>
				<div className="dcs-stat-card">
					<span className="dcs-stat-card__icon dcs-stat-card__icon--features" aria-hidden="true"><FeatureIconGrid /></span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">{__('Active Modules', 'cf7-styler-for-divi')}</span>
						<span className="dcs-stat-card__value">{stats.enabled_features}</span>
					</div>
				</div>
			</div>
			<div className="dcs-card dcs-quick-actions">
				<div className="dcs-card__header">
					<h2 className="dcs-card__title">{__('Quick Actions', 'cf7-styler-for-divi')}</h2>
				</div>
				<div className="dcs-quick-actions__grid">
					{showEntries && (
						<a href={dashboardUrl + '#/entries'} className="dcs-quick-action">
							<span className="dcs-quick-action__icon"><FeatureIconDatabase /></span>
							<div className="dcs-quick-action__text">
								<span className="dcs-quick-action__title">{__('View Entries', 'cf7-styler-for-divi')}</span>
								<span className="dcs-quick-action__desc">{__('Manage form submissions', 'cf7-styler-for-divi')}</span>
							</div>
						</a>
					)}
					<a href={(cf7AdminUrl && cf7AdminUrl.replace('page=wpcf7', 'page=wpcf7-new')) || 'admin.php?page=wpcf7-new'} className="dcs-quick-action" target="_blank" rel="noopener noreferrer">
						<span className="dcs-quick-action__icon"><FeatureIconModule /></span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">{__('Create Form', 'cf7-styler-for-divi')}</span>
							<span className="dcs-quick-action__desc">{__('Add new contact form', 'cf7-styler-for-divi')}</span>
						</div>
					</a>
					<a href={cf7AdminUrl} className="dcs-quick-action" target="_blank" rel="noopener noreferrer">
						<span className="dcs-quick-action__icon"><FeatureIconColumns /></span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">{__('Manage Forms', 'cf7-styler-for-divi')}</span>
							<span className="dcs-quick-action__desc">{__('Edit existing forms', 'cf7-styler-for-divi')}</span>
						</div>
					</a>
					<a href={modulesUrl} className="dcs-quick-action">
						<span className="dcs-quick-action__icon"><FeatureIconGrid /></span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">{__('Manage Modules', 'cf7-styler-for-divi')}</span>
							<span className="dcs-quick-action__desc">{__('Enable or disable modules', 'cf7-styler-for-divi')}</span>
						</div>
					</a>
					<a href={dashboardUrl + '#/ai-settings'} className="dcs-quick-action">
						<span className="dcs-quick-action__icon"><FeatureIconAI /></span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">{__('AI Provider', 'cf7-styler-for-divi')}</span>
							<span className="dcs-quick-action__desc">{__('Configure AI form generator', 'cf7-styler-for-divi')}</span>
						</div>
					</a>
				</div>
			</div>
		</>
	);
}
