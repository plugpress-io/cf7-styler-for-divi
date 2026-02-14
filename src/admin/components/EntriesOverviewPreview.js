/**
 * Entries Overview Preview – static mock of real Entries UI for locked state.
 * Visible underneath blur overlay with lock icon.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

const MOCK_ROWS = [
	{ id: 1, form: 'Contact Form 7', status: 'new', preview: 'john@example.com', date: '2024-02-01 14:32' },
	{ id: 2, form: 'Newsletter Signup', status: 'read', preview: 'Jane Smith', date: '2024-02-01 12:15' },
	{ id: 3, form: 'Contact Form 7', status: 'read', preview: 'Question about pricing…', date: '2024-01-31 09:45' },
];

export function EntriesOverviewPreview() {
	return (
		<div className="cf7m-entries-overview-preview">
			<div className="cf7m-entries-overview-preview__header">
				<h3 className="cf7m-entries-overview-preview__title">{__('All Form Entries', 'cf7-styler-for-divi')}</h3>
				<div className="cf7m-entries-overview-preview__filters">
					<span className="cf7m-entries-overview-preview__filter" aria-hidden="true" />
					<span className="cf7m-entries-overview-preview__filter" aria-hidden="true" />
					<span className="cf7m-entries-overview-preview__search" aria-hidden="true" />
				</div>
			</div>
			<div className="cf7m-entries-overview-preview__table-wrap">
				<table className="cf7m-entries-overview-preview__table" aria-hidden="true">
					<thead>
						<tr>
							<th className="cf7m-entries-overview-preview__th" aria-hidden="true" />
							<th className="cf7m-entries-overview-preview__th">{__('Entry ID', 'cf7-styler-for-divi')}</th>
							<th className="cf7m-entries-overview-preview__th">{__('Form Name', 'cf7-styler-for-divi')}</th>
							<th className="cf7m-entries-overview-preview__th">{__('Status', 'cf7-styler-for-divi')}</th>
							<th className="cf7m-entries-overview-preview__th">{__('First Field', 'cf7-styler-for-divi')}</th>
							<th className="cf7m-entries-overview-preview__th">{__('Date', 'cf7-styler-for-divi')}</th>
							<th className="cf7m-entries-overview-preview__th cf7m-entries-overview-preview__th--right" aria-hidden="true" />
						</tr>
					</thead>
					<tbody>
						{MOCK_ROWS.map((row) => (
							<tr key={row.id} className="cf7m-entries-overview-preview__row">
								<td className="cf7m-entries-overview-preview__td"><span className="cf7m-entries-overview-preview__checkbox" /></td>
								<td className="cf7m-entries-overview-preview__td">
									<span className="cf7m-entries-overview-preview__id">Entry #{row.id}</span>
								</td>
								<td className="cf7m-entries-overview-preview__td">{row.form}</td>
								<td className="cf7m-entries-overview-preview__td">
									<span className={`cf7m-entries-overview-preview__badge ${row.status === 'new' ? 'cf7m-entries-overview-preview__badge--new' : ''}`}>
										{row.status}
									</span>
								</td>
								<td className="cf7m-entries-overview-preview__td cf7m-entries-overview-preview__td--muted">{row.preview}</td>
								<td className="cf7m-entries-overview-preview__td cf7m-entries-overview-preview__td--muted">{row.date}</td>
								<td className="cf7m-entries-overview-preview__td cf7m-entries-overview-preview__td--right">
									<span className="cf7m-entries-overview-preview__icon" aria-hidden="true" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="cf7m-entries-overview-preview__footer">
				<span>{__('Page', 'cf7-styler-for-divi')} 1 {__('of', 'cf7-styler-for-divi')} 1</span>
				<div className="cf7m-entries-overview-preview__pagination">
					<span className="cf7m-entries-overview-preview__page cf7m-entries-overview-preview__page--active">1</span>
				</div>
			</div>
		</div>
	);
}
