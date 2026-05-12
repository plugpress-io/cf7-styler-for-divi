/**
 * Analytics page – same card/table design as Responses.
 *
 * @package CF7_Mate
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SelectControl, Spinner } from '@wordpress/components';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import apiFetch from '@wordpress/api-fetch';

const DATE_RANGES = [
	{ label: __( 'Last 7 days',  'cf7-styler-for-divi' ), value: '7'  },
	{ label: __( 'Last 30 days', 'cf7-styler-for-divi' ), value: '30' },
	{ label: __( 'Last 90 days', 'cf7-styler-for-divi' ), value: '90' },
	{ label: __( 'All time',     'cf7-styler-for-divi' ), value: '0'  },
];

const responsesUrl =
	typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.responses_url
		? dcsCF7Styler.responses_url
		: 'admin.php?page=cf7-mate-responses';

export function AnalyticsPage() {
	const [ rows,    setRows    ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ error,   setError   ] = useState( null );
	const [ days,    setDays    ] = useState( '30' );

	const fetchStats = useCallback( () => {
		setLoading( true );
		setError( null );
		const params = days !== '0' ? `?days=${ days }` : '';
		apiFetch( { path: `/cf7-styler/v1/analytics/stats${ params }` } )
			.then( ( data ) => setRows( Array.isArray( data ) ? data : [] ) )
			.catch( ( err ) => setError( err?.message || __( 'Failed to load analytics.', 'cf7-styler-for-divi' ) ) )
			.finally( () => setLoading( false ) );
	}, [ days ] );

	useEffect( () => { fetchStats(); }, [ fetchStats ] );

	const totalViews       = rows.reduce( ( s, r ) => s + ( r.views || 0 ), 0 );
	const totalSubmissions = rows.reduce( ( s, r ) => s + ( r.submissions || 0 ), 0 );

	return (
		<div className="cf7m-resp">

			{/* Page head */}
			<div className="cf7m-resp__head">
				<div className="cf7m-resp__head-titles">
					<h1 className="cf7m-resp__title">
						{ __( 'Analytics', 'cf7-styler-for-divi' ) }
					</h1>
					{ !loading && rows.length > 0 && (
						<span className="cf7m-resp__count">
							{ __( '%d forms', 'cf7-styler-for-divi' ).replace( '%d', rows.length ) }
						</span>
					) }
				</div>
			</div>

			{/* Card */}
			<div className="cf7m-resp__card">

				{/* Toolbar */}
				<div className="cf7m-resp__toolbar">
					<div className="cf7m-resp__filters">
						<SelectControl
							__nextHasNoMarginBottom
							value={ days }
							options={ DATE_RANGES }
							onChange={ ( v ) => setDays( v ) }
							aria-label={ __( 'Date range', 'cf7-styler-for-divi' ) }
						/>
					</div>
				</div>

				{/* Loading */}
				{ loading && (
					<div className="cf7m-resp__loading">
						<Spinner />
						<span>{ __( 'Loading…', 'cf7-styler-for-divi' ) }</span>
					</div>
				) }

				{/* Error */}
				{ !loading && error && (
					<div className="cf7m-resp__empty">
						<p className="cf7m-resp__empty-title">{ error }</p>
					</div>
				) }

				{/* Empty */}
				{ !loading && !error && rows.length === 0 && (
					<div className="cf7m-resp__empty">
						<ChartBarIcon className="cf7m-resp__empty-icon" aria-hidden="true" />
						<p className="cf7m-resp__empty-title">
							{ __( 'No data yet', 'cf7-styler-for-divi' ) }
						</p>
						<p className="cf7m-resp__empty-sub">
							{ __( 'Analytics data will appear once your forms receive views.', 'cf7-styler-for-divi' ) }
						</p>
					</div>
				) }

				{/* Table */}
				{ !loading && !error && rows.length > 0 && (
					<div className="cf7m-resp__table-wrap">
						<table className="cf7m-resp__table">
							<thead>
								<tr>
									<th className="cf7m-resp__th">
										{ __( 'Form', 'cf7-styler-for-divi' ) }
									</th>
									<th className="cf7m-resp__th cf7m-resp__th--num">
										{ __( 'Views', 'cf7-styler-for-divi' ) }
									</th>
									<th className="cf7m-resp__th cf7m-resp__th--num">
										{ __( 'Submissions', 'cf7-styler-for-divi' ) }
									</th>
									<th className="cf7m-resp__th cf7m-resp__th--num">
										{ __( 'Conversion', 'cf7-styler-for-divi' ) }
									</th>
									<th className="cf7m-resp__th cf7m-resp__th--muted">
										{ __( 'Last submission', 'cf7-styler-for-divi' ) }
									</th>
								</tr>
							</thead>
							<tbody>
								{ rows.map( ( row ) => (
									<tr key={ row.form_id } className="cf7m-resp__row">
										<td className="cf7m-resp__td cf7m-resp__td--strong">
											<a
												href={ responsesUrl }
												className="cf7m-resp__id-link"
											>
												{ row.form_title || `#${ row.form_id }` }
											</a>
											<span className="cf7m-resp__td--sub">
												{ __( 'ID', 'cf7-styler-for-divi' ) }{ ' ' }{ row.form_id }
											</span>
										</td>
										<td className="cf7m-resp__td cf7m-resp__td--num">
											{ row.views.toLocaleString() }
										</td>
										<td className="cf7m-resp__td cf7m-resp__td--num">
											{ row.submissions.toLocaleString() }
										</td>
										<td className="cf7m-resp__td cf7m-resp__td--num">
											<span className={
												`cf7m-analytics__rate${
													row.conversion >= 50 ? ' is-high'
													: row.conversion >= 20 ? ' is-mid'
													: ' is-low'
												}`
											}>
												{ row.conversion }%
											</span>
										</td>
										<td className="cf7m-resp__td cf7m-resp__td--muted">
											{ row.last_submission || '—' }
										</td>
									</tr>
								) ) }
							</tbody>
							<tfoot>
								<tr className="cf7m-resp__row cf7m-resp__row--total">
									<td className="cf7m-resp__td cf7m-resp__td--strong">
										{ __( 'Total', 'cf7-styler-for-divi' ) }
									</td>
									<td className="cf7m-resp__td cf7m-resp__td--num">
										{ totalViews.toLocaleString() }
									</td>
									<td className="cf7m-resp__td cf7m-resp__td--num">
										{ totalSubmissions.toLocaleString() }
									</td>
									<td className="cf7m-resp__td cf7m-resp__td--num">
										{ totalViews > 0
											? Math.round( ( totalSubmissions / totalViews ) * 100 ) + '%'
											: '—'
										}
									</td>
									<td className="cf7m-resp__td" />
								</tr>
							</tfoot>
						</table>
					</div>
				) }

			</div>
		</div>
	);
}
