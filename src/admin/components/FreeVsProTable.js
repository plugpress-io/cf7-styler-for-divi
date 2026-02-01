/**
 * Free vs Pro comparison table – only show when Pro is not active.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { FEATURES } from '../data/features';

export function FreeVsProTable() {
	const pricingUrl = typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.pricing_url : '/wp-admin/admin.php?page=cf7-mate-pricing';

	return (
		<div className="dcs-compare-card">
			<div className="dcs-compare-card__header">
				<h2 className="dcs-compare-card__title">{__('Free vs Pro', 'cf7-styler-for-divi')}</h2>
				<p className="dcs-compare-card__desc">{__('Compare features and unlock more with Pro.', 'cf7-styler-for-divi')}</p>
			</div>
			<div className="dcs-compare-table-wrap">
				<table className="dcs-compare-table" role="presentation">
					<thead>
						<tr>
							<th className="dcs-compare-table__feature">{__('Feature', 'cf7-styler-for-divi')}</th>
							<th className="dcs-compare-table__plan">{__('Free', 'cf7-styler-for-divi')}</th>
							<th className="dcs-compare-table__plan dcs-compare-table__plan--pro">{__('Pro', 'cf7-styler-for-divi')}</th>
						</tr>
					</thead>
					<tbody>
						{FEATURES.map((f) => (
							<tr key={f.id}>
								<td className="dcs-compare-table__feature">{f.name}</td>
								<td className="dcs-compare-table__plan">
									{f.isPro ? <span className="dcs-compare-table__no" aria-hidden="true">—</span> : <span className="dcs-compare-table__yes" aria-hidden="true">✓</span>}
								</td>
								<td className="dcs-compare-table__plan dcs-compare-table__plan--pro">
									<span className="dcs-compare-table__yes" aria-hidden="true">✓</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="dcs-compare-card__footer">
				<a href={pricingUrl} target="_blank" rel="noopener noreferrer" className="dcs-compare-card__cta">
					{__('Upgrade to Pro', 'cf7-styler-for-divi')}
				</a>
			</div>
		</div>
	);
}
