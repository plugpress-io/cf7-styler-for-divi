/**
 * Free vs Pro comparison table – only show when Pro is not active.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { FEATURES } from '../data/features';
import { Tooltip } from './ui/Tooltip';
import { InfoIcon } from './icons/NavIcons';

export function FreeVsProTable() {
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined'
			? dcsCF7Styler.pricing_url
			: '/wp-admin/admin.php?page=cf7-mate-pricing';

	return (
		<div className="cf7m-compare-card">
			<div className="cf7m-compare-card__header">
				<h2 className="cf7m-compare-card__title">
					{__('Free vs Pro', 'cf7-styler-for-divi')}
				</h2>
				<p className="cf7m-compare-card__desc">
					{__('What’s included in each plan.', 'cf7-styler-for-divi')}
				</p>
			</div>
			<div className="cf7m-compare-table-wrap">
				<table className="cf7m-compare-table" role="presentation">
					<thead>
						<tr>
							<th className="cf7m-compare-table__feature">
								{__('Feature', 'cf7-styler-for-divi')}
							</th>
							<th className="cf7m-compare-table__plan">
								{__('Free', 'cf7-styler-for-divi')}
							</th>
							<th className="cf7m-compare-table__plan cf7m-compare-table__plan--pro">
								{__('Pro', 'cf7-styler-for-divi')}
							</th>
						</tr>
					</thead>
					<tbody>
						{FEATURES.map((f) => (
							<tr
								key={f.id}
								className={
									f.isPro
										? 'cf7m-compare-table__row--pro'
										: ''
								}
							>
								<td className="cf7m-compare-table__feature">
									<span className="cf7m-compare-table__feature-name">
										{f.name}
									</span>
									<Tooltip content={f.description} side="top">
										<button
											type="button"
											className="cf7m-compare-table__info"
											aria-label={__(
												'More about this feature',
												'cf7-styler-for-divi'
											)}
										>
											<InfoIcon size={14} />
										</button>
									</Tooltip>
								</td>
								<td className="cf7m-compare-table__plan">
									{f.isPro ? (
										<span
											className="cf7m-compare-table__no"
											aria-hidden="true"
										>
											—
										</span>
									) : (
										<span
											className="cf7m-compare-table__yes"
											aria-hidden="true"
										>
											✓
										</span>
									)}
								</td>
								<td className="cf7m-compare-table__plan cf7m-compare-table__plan--pro">
									<span
										className="cf7m-compare-table__yes"
										aria-hidden="true"
									>
										✓
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="cf7m-compare-card__footer">
				<p className="cf7m-compare-card__discount" role="status">
					{__('50% off with code NEW2026', 'cf7-styler-for-divi')}
				</p>
				<a
					href={pricingUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="cf7m-compare-card__cta"
				>
					{__('Upgrade to Pro', 'cf7-styler-for-divi')}
				</a>
			</div>
		</div>
	);
}
