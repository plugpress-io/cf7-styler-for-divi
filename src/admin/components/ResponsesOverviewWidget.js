/**
 * Responses Overview dashboard widget (pro only).
 * Registered via window.cf7mProWidgets.responsesOverview.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { FeatureIconDatabase } from './icons/FeatureIcons';

export function ResponsesOverviewWidget({ showResponses, responsesUrl }) {
	return (
		<div className="cf7m-card cf7m-dashboard-card cf7m-responses-overview">
			<div className="cf7m-dashboard-card__header">
				<h2 className="cf7m-dashboard-card__title">
					{__('Responses Overview', 'cf7-styler-for-divi')}
				</h2>
				{showResponses && (
					<a href={responsesUrl} className="cf7m-dashboard-card__action">
						{__('View Responses', 'cf7-styler-for-divi')}
					</a>
				)}
			</div>
			<div className="cf7m-dashboard-card__body">
				<div className="cf7m-responses-overview__empty">
					<span className="cf7m-responses-overview__icon" aria-hidden="true">
						<FeatureIconDatabase />
					</span>
					<p className="cf7m-responses-overview__message">
						{showResponses
							? __('No responses yet', 'cf7-styler-for-divi')
							: __('Enable Database Entries in Modules to start collecting submissions.', 'cf7-styler-for-divi')
						}
					</p>
					{showResponses && (
						<p className="cf7m-responses-overview__hint">
							{__('Form submissions will appear here once visitors submit your forms.', 'cf7-styler-for-divi')}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
