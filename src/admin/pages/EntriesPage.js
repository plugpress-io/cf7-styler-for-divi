/**
 * Entries page – Pro dashboard view for form submissions.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export function EntriesPage({ onBack }) {
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(null);
	const [statusFilter, setStatusFilter] = useState('all');
	const [formIdFilter, setFormIdFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedIds, setSelectedIds] = useState([]);
	const restUrl = typeof wp !== 'undefined' && wp.apiFetch ? '/cf7-styler/v1/entries' : '';

	const fetchEntries = () => {
		if (!restUrl) return;
		const params = new URLSearchParams({ per_page: 50, page: 1 });
		if (statusFilter !== 'all') params.set('status', statusFilter);
		if (formIdFilter !== 'all') params.set('form_id', formIdFilter);
		if (searchTerm && searchTerm.trim()) params.set('search', searchTerm.trim());
		setLoading(true);
		apiFetch({ path: `${restUrl}?${params}` })
			.then((r) => setEntries(r.items || []))
			.catch(() => setEntries([]))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchEntries();
	}, [restUrl, statusFilter, formIdFilter, searchTerm]);

	const exportUrl = restUrl
		? `${wp?.apiSettings?.root || ''}${restUrl}/export?per_page=500${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}${formIdFilter !== 'all' ? `&form_id=${formIdFilter}` : ''}${searchTerm && searchTerm.trim() ? `&search=${encodeURIComponent(searchTerm.trim())}` : ''}&_wpnonce=${wp?.apiSettings?.nonce || ''}`
		: '';

	const deleteOne = async (id) => {
		if (!window.confirm(__('Delete this entry?', 'cf7-styler-for-divi'))) return;
		try {
			await apiFetch({ path: `/cf7-styler/v1/entries/${id}`, method: 'DELETE' });
			setEntries((prev) => prev.filter((e) => e.id !== id));
			setSelected(null);
			setSelectedIds((prev) => prev.filter((x) => x !== id));
		} catch (e) {}
	};

	const updateStatus = async (id, status) => {
		try {
			await apiFetch({ path: `/cf7-styler/v1/entries/${id}`, method: 'POST', data: { status } });
			setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
			if (selected?.id === id) setSelected((s) => (s ? { ...s, status } : null));
		} catch (e) {}
	};

	const bulkDelete = async () => {
		if (!selectedIds.length || !window.confirm(__('Delete selected entries?', 'cf7-styler-for-divi'))) return;
		try {
			await apiFetch({ path: '/cf7-styler/v1/entries/bulk-delete', method: 'DELETE', data: { ids: selectedIds } });
			setEntries((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
			setSelectedIds([]);
			setSelected(null);
		} catch (e) {}
	};

	const toggleSelect = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	const toggleSelectAll = () => {
		if (selectedIds.length >= (entries || []).length) setSelectedIds([]);
		else setSelectedIds((entries || []).map((e) => e.id));
	};

	const forms = [...new Map((entries || []).map((e) => [e.form_id, { id: e.form_id, title: e.form_title_with_id || e.form_title }])).values()];

	const rowStyle = { borderBottom: '1px solid var(--dcs-border)' };
	const thStyle = { textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: 'var(--dcs-text-muted)' };
	const tdStyle = { padding: '10px 12px', fontSize: '13px' };
	const statusStyle = (e) => ({
		padding: '2px 8px',
		borderRadius: '4px',
		fontSize: '12px',
		background: e.status === 'new' ? 'rgba(87,51,255,0.1)' : e.status === 'read' ? 'var(--dcs-bg)' : 'rgba(239,68,68,0.1)',
		color: e.status === 'new' ? 'var(--dcs-primary)' : e.status === 'spam' ? 'var(--dcs-danger)' : 'var(--dcs-text-muted)',
	});
	const btnStyle = { marginRight: '6px', padding: '4px 10px', fontSize: '12px' };

	return (
		<div className="dcs-card">
			<div className="dcs-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
				<div>
					<h2 className="dcs-card__title">{__('Form Entries', 'cf7-styler-for-divi')}</h2>
					<p className="dcs-card__desc">{__('View and manage form submissions.', 'cf7-styler-for-divi')}</p>
				</div>
				<div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
					<input type="search" placeholder={__('Search entries…', 'cf7-styler-for-divi')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--dcs-border)', minWidth: '160px' }} />
					{selectedIds.length > 0 && (
						<button type="button" className="dcs-entries-btn dcs-entries-btn--danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={bulkDelete}>
							{__('Delete selected', 'cf7-styler-for-divi')} ({selectedIds.length})
						</button>
					)}
					<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="dcs-entries-filter" style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--dcs-border)' }}>
						<option value="all">{__('All statuses', 'cf7-styler-for-divi')}</option>
						<option value="new">{__('New', 'cf7-styler-for-divi')}</option>
						<option value="read">{__('Read', 'cf7-styler-for-divi')}</option>
						<option value="spam">{__('Spam', 'cf7-styler-for-divi')}</option>
					</select>
					<select value={formIdFilter} onChange={(e) => setFormIdFilter(e.target.value)} className="dcs-entries-filter" style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--dcs-border)' }}>
						<option value="all">{__('All forms', 'cf7-styler-for-divi')}</option>
						{forms.map((f) => (
							<option key={f.id} value={f.id}>{f.title}</option>
						))}
					</select>
					{exportUrl && (
						<a href={exportUrl} className="dcs-admin__nav-link" style={{ padding: '6px 12px', borderRadius: '6px', background: 'var(--dcs-bg)' }}>
							{__('Export CSV', 'cf7-styler-for-divi')}
						</a>
					)}
				</div>
			</div>
			{loading ? (
				<div style={{ padding: '24px', textAlign: 'center', color: 'var(--dcs-text-muted)' }}>{__('Loading...', 'cf7-styler-for-divi')}</div>
			) : !entries.length ? (
				<div style={{ padding: '24px', textAlign: 'center', color: 'var(--dcs-text-muted)' }}>{__('No entries yet.', 'cf7-styler-for-divi')}</div>
			) : (
				<div className="dcs-entries-table-wrap" style={{ overflowX: 'auto' }}>
					<table className="dcs-entries-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={rowStyle}>
								<th style={{ width: '36px', padding: '10px 8px', fontSize: '12px', color: 'var(--dcs-text-muted)' }}>
									<input type="checkbox" checked={entries.length > 0 && selectedIds.length >= entries.length} onChange={toggleSelectAll} aria-label={__('Select all', 'cf7-styler-for-divi')} />
								</th>
								<th style={thStyle}>{__('Form', 'cf7-styler-for-divi')}</th>
								<th style={thStyle}>{__('Status', 'cf7-styler-for-divi')}</th>
								<th style={thStyle}>{__('Date', 'cf7-styler-for-divi')}</th>
								<th style={{ ...thStyle, textAlign: 'right' }}>{__('Actions', 'cf7-styler-for-divi')}</th>
							</tr>
						</thead>
						<tbody>
							{entries.map((e) => (
								<tr key={e.id} style={rowStyle}>
									<td style={{ padding: '10px 8px' }}>
										<input type="checkbox" checked={selectedIds.includes(e.id)} onChange={() => toggleSelect(e.id)} aria-label={__('Select entry', 'cf7-styler-for-divi')} />
									</td>
									<td style={tdStyle}>{e.form_title_with_id || e.form_title}</td>
									<td style={tdStyle}>
										<span className={`dcs-entry-status dcs-entry-status--${e.status}`} style={statusStyle(e)}>{e.status}</span>
									</td>
									<td style={{ ...tdStyle, color: 'var(--dcs-text-muted)' }}>{e.created}</td>
									<td style={{ ...tdStyle, textAlign: 'right' }}>
										<button type="button" className="dcs-entries-btn" style={btnStyle} onClick={() => { setSelected(selected?.id === e.id ? null : e); if (e.status === 'new') updateStatus(e.id, 'read'); }}>{__('View', 'cf7-styler-for-divi')}</button>
										{e.status === 'new' && <button type="button" className="dcs-entries-btn" style={btnStyle} onClick={() => updateStatus(e.id, 'read')}>{__('Mark read', 'cf7-styler-for-divi')}</button>}
										{e.status !== 'spam' && <button type="button" className="dcs-entries-btn" style={btnStyle} onClick={() => updateStatus(e.id, 'spam')}>{__('Spam', 'cf7-styler-for-divi')}</button>}
										<button type="button" className="dcs-entries-btn dcs-entries-btn--danger" style={btnStyle} onClick={() => deleteOne(e.id)}>{__('Delete', 'cf7-styler-for-divi')}</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{selected && selected.id && (
				<div className="dcs-entries-modal" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelected(null)}>
					<div style={{ background: '#fff', borderRadius: '12px', maxWidth: '560px', width: '100%', maxHeight: '80vh', overflow: 'auto', padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} onClick={(ev) => ev.stopPropagation()}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
							<h3 style={{ margin: 0 }}>{__('Entry', 'cf7-styler-for-divi')} #{selected.id}</h3>
							<button type="button" onClick={() => setSelected(null)} style={{ padding: '4px 8px' }}>{__('Close', 'cf7-styler-for-divi')}</button>
						</div>
						<p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--dcs-text-muted)' }}>{selected.form_title} · {selected.created}</p>
						<pre style={{ margin: 0, padding: '12px', background: 'var(--dcs-bg)', borderRadius: '8px', fontSize: '12px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>{JSON.stringify(selected.data || {}, null, 2)}</pre>
					</div>
				</div>
			)}
		</div>
	);
}
