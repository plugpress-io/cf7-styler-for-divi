/**
 * Entries page – Pro dashboard: list (full-width, component UI) + single entry view.
 *
 * @package CF7_Mate
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

function getFirstFieldValue(entry) {
	const data = entry?.data && typeof entry.data === 'object' ? entry.data : {};
	const firstKey = Object.keys(data)[0];
	return firstKey != null ? String(data[firstKey] ?? '').slice(0, 80) : '—';
}

function parseUserAgent(ua) {
	if (!ua || typeof ua !== 'string') return { browser: '—', device: '—' };
	const u = ua.toLowerCase();
	let browser = '—';
	if (u.includes('chrome') && !u.includes('edg')) browser = 'Chrome';
	else if (u.includes('firefox')) browser = 'Firefox';
	else if (u.includes('safari') && !u.includes('chrome')) browser = 'Safari';
	else if (u.includes('edg')) browser = 'Edge';
	let device = '—';
	if (u.includes('mobile') || u.includes('android') || u.includes('iphone')) device = 'Mobile';
	else if (u.includes('ipad') || u.includes('tablet')) device = 'Tablet';
	else if (u.includes('mac') || u.includes('apple')) device = 'Apple';
	else if (u.includes('win')) device = 'Windows';
	return { browser, device };
}

export function EntriesPage({ entryId, onBack }) {
	const [entries, setEntries] = useState([]);
	const [total, setTotal] = useState(0);
	const [pages, setPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [loading, setLoading] = useState(true);
	const [singleEntry, setSingleEntry] = useState(null);
	const [singleLoading, setSingleLoading] = useState(false);
	const [statusFilter, setStatusFilter] = useState('all');
	const [formIdFilter, setFormIdFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedIds, setSelectedIds] = useState([]);
	const restBase = '/cf7-styler/v1/entries';

	const fetchEntries = useCallback(() => {
		const params = new URLSearchParams({ per_page: perPage, page: currentPage });
		if (statusFilter !== 'all') params.set('status', statusFilter);
		if (formIdFilter !== 'all') params.set('form_id', formIdFilter);
		if (searchTerm.trim()) params.set('search', searchTerm.trim());
		setLoading(true);
		apiFetch({ path: `${restBase}?${params}` })
			.then((r) => {
				setEntries(r.items || []);
				setTotal(r.total ?? 0);
				setPages(r.pages ?? 1);
			})
			.catch(() => {
				setEntries([]);
				setTotal(0);
				setPages(0);
			})
			.finally(() => setLoading(false));
	}, [perPage, currentPage, statusFilter, formIdFilter, searchTerm]);

	useEffect(() => {
		if (!entryId) fetchEntries();
	}, [entryId, fetchEntries]);

	useEffect(() => {
		if (entryId) {
			setSingleLoading(true);
			apiFetch({ path: `${restBase}/${entryId}` })
				.then((r) => {
					setSingleEntry(r);
					if (r?.status === 'new') {
						apiFetch({ path: `${restBase}/${r.id}`, method: 'POST', data: { status: 'read' } }).then(() =>
							setSingleEntry((s) => (s ? { ...s, status: 'read' } : null))
						);
					}
				})
				.catch(() => setSingleEntry(null))
				.finally(() => setSingleLoading(false));
		} else {
			setSingleEntry(null);
		}
	}, [entryId]);

	const exportUrl =
		typeof wp !== 'undefined' && wp.apiSettings?.root
			? `${wp.apiSettings.root}${restBase}/export?per_page=500${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}${formIdFilter !== 'all' ? `&form_id=${formIdFilter}` : ''}${searchTerm.trim() ? `&search=${encodeURIComponent(searchTerm.trim())}` : ''}&_wpnonce=${wp?.apiSettings?.nonce || ''}`
			: '';

	const moveToTrash = async (id) => {
		const msg = __('Move to trash? You can restore it later from the Trash filter.', 'cf7-styler-for-divi');
		if (!window.confirm(msg)) return;
		try {
			await apiFetch({ path: `${restBase}/${id}`, method: 'POST', data: { status: 'trash' } });
			setEntries((prev) => prev.filter((e) => e.id !== id));
			if (singleEntry?.id === id) setSingleEntry((s) => (s ? { ...s, status: 'trash' } : null));
			setSelectedIds((prev) => prev.filter((x) => x !== id));
			if (entryId === id) window.location.hash = '#/entries';
		} catch (e) {}
	};

	const deletePermanently = async (id) => {
		const msg = __('Permanently delete this entry? It will never be recovered.', 'cf7-styler-for-divi');
		if (!window.confirm(msg)) return;
		try {
			await apiFetch({ path: `${restBase}/${id}`, method: 'DELETE' });
			setEntries((prev) => prev.filter((e) => e.id !== id));
			setSingleEntry(null);
			setSelectedIds((prev) => prev.filter((x) => x !== id));
			if (entryId === id) window.location.hash = '#/entries';
		} catch (e) {}
	};

	const updateStatus = async (id, status) => {
		try {
			await apiFetch({ path: `${restBase}/${id}`, method: 'POST', data: { status } });
			setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
			if (singleEntry?.id === id) setSingleEntry((s) => (s ? { ...s, status } : null));
		} catch (e) {}
	};

	const bulkMoveToTrash = async () => {
		const msg = __('Move selected entries to trash? You can restore them later from the Trash filter.', 'cf7-styler-for-divi');
		if (!selectedIds.length || !window.confirm(msg)) return;
		try {
			for (const id of selectedIds) {
				await apiFetch({ path: `${restBase}/${id}`, method: 'POST', data: { status: 'trash' } });
			}
			setEntries((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
			setSelectedIds([]);
		} catch (e) {}
	};

	const bulkDeletePermanently = async () => {
		const msg = __('Permanently delete selected entries? They will never be recovered.', 'cf7-styler-for-divi');
		if (!selectedIds.length || !window.confirm(msg)) return;
		try {
			await apiFetch({ path: `${restBase}/bulk-delete`, method: 'DELETE', data: { ids: selectedIds } });
			setEntries((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
			setSelectedIds([]);
			setSingleEntry(null);
		} catch (e) {}
	};

	const toggleSelect = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	const toggleSelectAll = () => {
		if (selectedIds.length >= (entries || []).length) setSelectedIds([]);
		else setSelectedIds((entries || []).map((e) => e.id));
	};

	const forms = [...new Map((entries || []).map((e) => [e.form_id, { id: e.form_id, title: e.form_title_with_id || e.form_title }])).values()];

	// Single entry view
	if (entryId) {
		return (
			<div className="cf7m-entries-page cf7m-entries-single">
				<nav className="cf7m-entries-breadcrumb" aria-label={__('Breadcrumb', 'cf7-styler-for-divi')}>
					<a href="#/entries" className="cf7m-entries-breadcrumb__link">{__('Entries', 'cf7-styler-for-divi')}</a>
					<span className="cf7m-entries-breadcrumb__sep" aria-hidden="true">/</span>
					<span className="cf7m-entries-breadcrumb__current">{__('Entry', 'cf7-styler-for-divi')} #{entryId}</span>
				</nav>
				{singleLoading ? (
					<div className="cf7m-entries-card"><p className="cf7m-entries-empty">{__('Loading…', 'cf7-styler-for-divi')}</p></div>
				) : !singleEntry ? (
					<div className="cf7m-entries-card"><p className="cf7m-entries-empty">{__('Entry not found.', 'cf7-styler-for-divi')}</p></div>
				) : (
					<div className="cf7m-entries-single__grid">
						<div className="cf7m-entries-single__main">
							<div className="cf7m-entries-card cf7m-entry-card">
								<div className="cf7m-entry-card__header">
									<h2 className="cf7m-entry-card__title">{__('Entry Data', 'cf7-styler-for-divi')}</h2>
								</div>
								<div className="cf7m-entry-card__body">
									{Object.entries(singleEntry.data || {}).map(([key, value]) => (
										<div key={key} className="cf7m-entry-data-row">
											<span className="cf7m-entry-data-row__label">{key}</span>
											<span className="cf7m-entry-data-row__value">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
										</div>
									))}
									{(!singleEntry.data || Object.keys(singleEntry.data).length === 0) && (
										<p className="cf7m-entries-empty">{__('No field data.', 'cf7-styler-for-divi')}</p>
									)}
								</div>
							</div>
							<div className="cf7m-entries-card cf7m-entry-card">
								<div className="cf7m-entry-card__header">
									<h2 className="cf7m-entry-card__title">{__('Submission Info', 'cf7-styler-for-divi')}</h2>
								</div>
								<div className="cf7m-entry-card__body">
									{(() => {
										const { browser, device } = parseUserAgent(singleEntry.user_agent);
										return (
											<>
												<div className="cf7m-entry-data-row">
													<span className="cf7m-entry-data-row__label">{__('Entry', 'cf7-styler-for-divi')}</span>
													<span className="cf7m-entry-data-row__value">#{singleEntry.id}</span>
												</div>
												<div className="cf7m-entry-data-row">
													<span className="cf7m-entry-data-row__label">{__('Form Name', 'cf7-styler-for-divi')}</span>
													<span className="cf7m-entry-data-row__value">{singleEntry.form_title || '—'}</span>
												</div>
												<div className="cf7m-entry-data-row">
													<span className="cf7m-entry-data-row__label">{__('User IP', 'cf7-styler-for-divi')}</span>
													<span className="cf7m-entry-data-row__value">{singleEntry.ip || '—'}</span>
												</div>
												<div className="cf7m-entry-data-row">
													<span className="cf7m-entry-data-row__label">{__('Browser', 'cf7-styler-for-divi')}</span>
													<span className="cf7m-entry-data-row__value">{browser}</span>
												</div>
												<div className="cf7m-entry-data-row">
													<span className="cf7m-entry-data-row__label">{__('Device', 'cf7-styler-for-divi')}</span>
													<span className="cf7m-entry-data-row__value">{device}</span>
												</div>
												<div className="cf7m-entry-data-row">
													<span className="cf7m-entry-data-row__label">{__('Date', 'cf7-styler-for-divi')}</span>
													<span className="cf7m-entry-data-row__value">{singleEntry.created || '—'}</span>
												</div>
												<div className="cf7m-entry-data-row">
													<span className="cf7m-entry-data-row__label">{__('Status', 'cf7-styler-for-divi')}</span>
													<span className="cf7m-entry-data-row__value">
														<span className={`cf7m-entry-status-badge cf7m-entry-status-badge--${singleEntry.status}`}>{singleEntry.status === 'trash' ? __('Trash', 'cf7-styler-for-divi') : singleEntry.status}</span>
													</span>
												</div>
											</>
										);
									})()}
								</div>
							</div>
						</div>
						<aside className="cf7m-entries-single__sidebar">
							<div className="cf7m-entries-card cf7m-entry-card">
								<div className="cf7m-entry-card__header">
									<h2 className="cf7m-entry-card__title">{__('Notes', 'cf7-styler-for-divi')}</h2>
									<button type="button" className="cf7m-entry-card__action" disabled aria-hidden="true">+ {__('Add Note', 'cf7-styler-for-divi')}</button>
								</div>
								<div className="cf7m-entry-card__body">
									<p className="cf7m-entries-muted">{__('Internal notes for this entry (coming soon).', 'cf7-styler-for-divi')}</p>
								</div>
							</div>
							<div className="cf7m-entries-single__actions">
								<a href="#/entries" className="cf7m-entries-btn cf7m-entries-btn--secondary">{__('← Back to list', 'cf7-styler-for-divi')}</a>
								{singleEntry.status === 'trash' ? (
									<>
										<button type="button" className="cf7m-entries-btn cf7m-entries-btn--secondary" onClick={() => updateStatus(singleEntry.id, 'read')}>{__('Restore', 'cf7-styler-for-divi')}</button>
										<button type="button" className="cf7m-entries-btn cf7m-entries-btn--danger" onClick={() => deletePermanently(singleEntry.id)}>{__('Delete permanently', 'cf7-styler-for-divi')}</button>
									</>
								) : (
									<button type="button" className="cf7m-entries-btn cf7m-entries-btn--secondary" onClick={() => moveToTrash(singleEntry.id)}>{__('Move to trash', 'cf7-styler-for-divi')}</button>
								)}
							</div>
						</aside>
					</div>
				)}
			</div>
		);
	}

	// List view
	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
				{/* Header: title + filters (shadcn-style) */}
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
					<h1 className="text-lg font-semibold text-gray-900">{__('All Form Entries', 'cf7-styler-for-divi')}</h1>
					<div className="flex flex-wrap items-center gap-2">
						<select
							value={statusFilter}
							onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
							className="h-9 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 min-w-[110px]"
							aria-label={__('Filter by status', 'cf7-styler-for-divi')}
						>
							<option value="all">{__('Status', 'cf7-styler-for-divi')}</option>
							<option value="new">{__('New', 'cf7-styler-for-divi')}</option>
							<option value="read">{__('Read', 'cf7-styler-for-divi')}</option>
							<option value="trash">{__('Trash', 'cf7-styler-for-divi')}</option>
						</select>
						<select
							value={formIdFilter}
							onChange={(e) => { setFormIdFilter(e.target.value); setCurrentPage(1); }}
							className="h-9 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 min-w-[120px] max-w-[180px]"
							aria-label={__('Filter by form', 'cf7-styler-for-divi')}
						>
							<option value="all">{__('All Forms', 'cf7-styler-for-divi')}</option>
							{forms.map((f) => (
								<option key={f.id} value={f.id}>{f.title}</option>
							))}
						</select>
						<div className="relative min-w-[180px] max-w-[220px]">
							<svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
							<input
								type="search"
								placeholder={__('Search entries…', 'cf7-styler-for-divi')}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="h-9 w-full rounded-md border border-gray-200 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
								aria-label={__('Search entries', 'cf7-styler-for-divi')}
							/>
						</div>
						{selectedIds.length > 0 && (
							statusFilter === 'trash' ? (
								<button type="button" className="inline-flex h-9 items-center rounded-md border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100" onClick={bulkDeletePermanently}>
									{__('Delete permanently', 'cf7-styler-for-divi')} ({selectedIds.length})
								</button>
							) : (
								<button type="button" className="inline-flex h-9 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100" onClick={bulkMoveToTrash}>
									{__('Move to trash', 'cf7-styler-for-divi')} ({selectedIds.length})
								</button>
							)
						)}
						{exportUrl && (
							<a href={exportUrl} className="inline-flex h-9 items-center rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
								{__('Export CSV', 'cf7-styler-for-divi')}
							</a>
						)}
					</div>
				</div>
				{loading ? (
					<div className="flex items-center justify-center py-16 text-sm text-gray-500">
						<span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-violet-500" aria-hidden="true" />
						<span className="ml-2">{__('Loading…', 'cf7-styler-for-divi')}</span>
					</div>
				) : !entries.length ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<p className="mt-3 text-sm font-medium text-gray-900">{__('No entries yet', 'cf7-styler-for-divi')}</p>
						<p className="mt-1 text-sm text-gray-500">{__('Form submissions will appear here.', 'cf7-styler-for-divi')}</p>
					</div>
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="w-full caption-bottom text-sm">
								<thead>
									<tr className="border-b border-gray-200 bg-gray-50/80 transition-colors hover:bg-gray-50/50">
										<th className="h-11 w-12 px-4 text-left align-middle">
											<input
												type="checkbox"
												checked={entries.length > 0 && selectedIds.length >= entries.length}
												onChange={toggleSelectAll}
												className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
												aria-label={__('Select all', 'cf7-styler-for-divi')}
											/>
										</th>
										<th className="h-11 px-4 text-left align-middle font-medium text-gray-500">{__('Entry ID', 'cf7-styler-for-divi')}</th>
										<th className="h-11 px-4 text-left align-middle font-medium text-gray-500">{__('Form Name', 'cf7-styler-for-divi')}</th>
										<th className="h-11 px-4 text-left align-middle font-medium text-gray-500">{__('Status', 'cf7-styler-for-divi')}</th>
										<th className="h-11 px-4 text-left align-middle font-medium text-gray-500">{__('First Field', 'cf7-styler-for-divi')}</th>
										<th className="h-11 px-4 text-left align-middle font-medium text-gray-500">{__('Date & Time', 'cf7-styler-for-divi')}</th>
										<th className="h-11 px-4 text-right align-middle font-medium text-gray-500">{__('Actions', 'cf7-styler-for-divi')}</th>
									</tr>
								</thead>
								<tbody>
									{entries.map((e) => (
										<tr key={e.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50/50 last:border-0">
											<td className="p-4 align-middle">
												<input
													type="checkbox"
													checked={selectedIds.includes(e.id)}
													onChange={() => toggleSelect(e.id)}
													className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
													aria-label={__('Select entry', 'cf7-styler-for-divi')}
												/>
											</td>
											<td className="p-4 align-middle">
												<a href={`#/entries/${e.id}`} className="font-medium text-violet-600 hover:underline">
													Entry #{e.id}
												</a>
											</td>
											<td className="p-4 align-middle text-gray-900">{e.form_title_with_id || e.form_title}</td>
											<td className="p-4 align-middle">
												<span
													className={
														e.status === 'new'
															? 'inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700'
															: e.status === 'trash'
																? 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600'
																: 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600'
													}
												>
													{e.status === 'trash' ? __('Trash', 'cf7-styler-for-divi') : e.status}
												</span>
											</td>
											<td className="max-w-[200px] truncate p-4 align-middle text-gray-500">{getFirstFieldValue(e)}</td>
											<td className="whitespace-nowrap p-4 align-middle text-gray-500">{e.created}</td>
											<td className="p-4 align-middle text-right">
												<div className="inline-flex items-center gap-0.5">
													{e.status !== 'trash' && (
														<a
															href={`#/entries/${e.id}`}
															className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
															title={__('View', 'cf7-styler-for-divi')}
															aria-label={__('View', 'cf7-styler-for-divi')}
														>
															<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
														</a>
													)}
													{e.status === 'trash' ? (
														<>
															<button
																type="button"
																className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
																onClick={() => updateStatus(e.id, 'read')}
																title={__('Restore', 'cf7-styler-for-divi')}
																aria-label={__('Restore', 'cf7-styler-for-divi')}
															>
																<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 10h10a4 4 0 0 1 4 4v2M3 10l4-4m-4 4l4 4"/><path d="M21 14v2a4 4 0 0 1-4 4H3"/></svg>
															</button>
															<button
																type="button"
																className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
																onClick={() => deletePermanently(e.id)}
																title={__('Delete permanently', 'cf7-styler-for-divi')}
																aria-label={__('Delete permanently', 'cf7-styler-for-divi')}
															>
																<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
															</button>
														</>
													) : (
														<button
															type="button"
															className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
															onClick={() => moveToTrash(e.id)}
															title={__('Move to trash', 'cf7-styler-for-divi')}
															aria-label={__('Move to trash', 'cf7-styler-for-divi')}
														>
															<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
														</button>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-600">
							<div className="flex items-center gap-3">
								<span>
									{__('Page', 'cf7-styler-for-divi')} {currentPage} {__('of', 'cf7-styler-for-divi')} {pages || 1}
								</span>
								<select
									value={perPage}
									onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
									className="h-8 rounded-md border border-gray-200 bg-white px-2 text-gray-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
									aria-label={__('Per page', 'cf7-styler-for-divi')}
								>
									{[10, 25, 50].map((n) => (
										<option key={n} value={n}>{n}</option>
									))}
								</select>
							</div>
							<div className="flex items-center gap-1">
								<button
									type="button"
									disabled={currentPage <= 1}
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border border-gray-200 bg-white px-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
									aria-label={__('Previous page', 'cf7-styler-for-divi')}
								>
									←
								</button>
								<span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md bg-violet-600 px-2 text-sm font-medium text-white" aria-current="page">
									{currentPage}
								</span>
								<button
									type="button"
									disabled={currentPage >= (pages || 1)}
									onClick={() => setCurrentPage((p) => Math.min(pages || 1, p + 1))}
									className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border border-gray-200 bg-white px-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
									aria-label={__('Next page', 'cf7-styler-for-divi')}
								>
									→
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
