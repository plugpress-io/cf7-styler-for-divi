/**
 * Entries Overview dashboard widget (pro only).
 * Registered via window.cf7mProWidgets.entriesOverview.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { FeatureIconDatabase } from './icons/FeatureIcons';

export function EntriesOverviewWidget({ showEntries, dashboardUrl }) {
	return (
		<div className="cf7m-card cf7m-dashboard-card cf7m-entries-overview">
			<div className="cf7m-dashboard-card__header">
				<h2 className="cf7m-dashboard-card__title">
					{__('Entries Overview', 'cf7-styler-for-divi')}
				</h2>
				{showEntries && (
					<a href={dashboardUrl + '#/entries'} className="cf7m-dashboard-card__action">
						{__('View Entries', 'cf7-styler-for-divi')}
					</a>
				)}
			</div>
			<div className="cf7m-dashboard-card__body">
				<div className="cf7m-entries-overview__empty">
					<span className="cf7m-entries-overview__icon" aria-hidden="true">
						<FeatureIconDatabase />
					</span>
					<p className="cf7m-entries-overview__message">
						{showEntries
							? __('No entries yet', 'cf7-styler-for-divi')
							: __('Enable Database Entries in Modules to start collecting submissions.', 'cf7-styler-for-divi')
						}
					</p>
					{showEntries && (
						<p className="cf7m-entries-overview__hint">
							{__('Form submissions will appear here once visitors submit your forms.', 'cf7-styler-for-divi')}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
