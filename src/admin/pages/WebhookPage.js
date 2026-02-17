/**
 * Webhook settings page (Pro) – add/remove webhook URLs.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

export function WebhookPage() {
	const [urls, setUrls] = useState([]);
	const [newUrl, setNewUrl] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState(null);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await apiFetch({
					path: '/cf7-styler/v1/settings/webhook',
				});
				setUrls(Array.isArray(data.urls) ? data.urls : []);
			} catch (err) {
				setNotice({
					type: 'error',
					message:
						err.message ||
						__(
							'Failed to load webhook settings.',
							'cf7-styler-for-divi',
						),
				});
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const showNotice = (type, message) => {
		setNotice({ type, message });
		if (type === 'success') setTimeout(() => setNotice(null), 3000);
	};

	const addUrl = () => {
		const trimmed = newUrl.trim();
		if (!trimmed) return;
		try {
			new URL(trimmed);
		} catch {
			showNotice(
				'error',
				__('Please enter a valid URL.', 'cf7-styler-for-divi'),
			);
			return;
		}
		if (urls.includes(trimmed)) {
			showNotice(
				'error',
				__('This URL is already in the list.', 'cf7-styler-for-divi'),
			);
			return;
		}
		setUrls([...urls, trimmed]);
		setNewUrl('');
	};

	const removeUrl = (index) => {
		setUrls(urls.filter((_, i) => i !== index));
	};

	const save = async () => {
		setSaving(true);
		setNotice(null);
		try {
			await apiFetch({
				path: '/cf7-styler/v1/settings/webhook',
				method: 'POST',
				data: { urls },
			});
			showNotice(
				'success',
				__('Webhook URLs saved.', 'cf7-styler-for-divi'),
			);
		} catch (err) {
			showNotice(
				'error',
				err.message || __('Save failed.', 'cf7-styler-for-divi'),
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="cf7m-card">
				<p className="cf7m-card__desc">
					{__('Loading...', 'cf7-styler-for-divi')}
				</p>
			</div>
		);
	}

	return (
		<div className="cf7m-card cf7m-webhook-page">
			<h2 className="cf7m-card__title">
				{__('Webhook URLs', 'cf7-styler-for-divi')}
			</h2>
			<p className="cf7m-card__desc">
				{__(
					'Send form submission data instantly to these URLs when a form is submitted. Each submission is sent as a JSON POST with form_id, form_title, submitted_at, posted_data, ip, and user_agent.',
					'cf7-styler-for-divi',
				)}
			</p>
			{notice && (
				<div
					className={`cf7m-webhook-notice cf7m-webhook-notice--${notice.type}`}
					role="alert"
				>
					{notice.message}
				</div>
			)}
			<div className="cf7m-webhook-add">
				<input
					type="url"
					className="cf7m-webhook-input"
					value={newUrl}
					onChange={(e) => setNewUrl(e.target.value)}
					onKeyDown={(e) =>
						e.key === 'Enter' && (e.preventDefault(), addUrl())
					}
					placeholder="https://your-service.com/webhook"
					aria-label={__('Webhook URL', 'cf7-styler-for-divi')}
				/>
				<button
					type="button"
					className="cf7m-btn cf7m-btn--primary"
					onClick={addUrl}
				>
					{__('Add URL', 'cf7-styler-for-divi')}
				</button>
			</div>
			{urls.length > 0 ? (
				<ul className="cf7m-webhook-list">
					{urls.map((url, index) => (
						<li key={index} className="cf7m-webhook-list-item">
							<span className="cf7m-webhook-list-url">{url}</span>
							<button
								type="button"
								className="cf7m-webhook-remove"
								onClick={() => removeUrl(index)}
								aria-label={__(
									'Remove URL',
									'cf7-styler-for-divi',
								)}
							>
								{__('Remove', 'cf7-styler-for-divi')}
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="cf7m-card__desc cf7m-webhook-empty">
					{__(
						'No webhook URLs yet. Add one above to start receiving form submissions.',
						'cf7-styler-for-divi',
					)}
				</p>
			)}
			<div className="cf7m-webhook-actions">
				<button
					type="button"
					className="cf7m-btn cf7m-btn--primary"
					onClick={save}
					disabled={saving}
				>
					{saving
						? __('Saving...', 'cf7-styler-for-divi')
						: __('Save URLs', 'cf7-styler-for-divi')}
				</button>
			</div>
		</div>
	);
}
