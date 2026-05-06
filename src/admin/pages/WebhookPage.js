/**
 * Webhook – Notion-style: list of URLs, add row, footer actions.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';
import { TrashIcon } from '@heroicons/react/24/outline';
import apiFetch from '@wordpress/api-fetch';

const examplePayload = {
	form_id: 1,
	form_title: 'Contact Us',
	submitted_at: '2026-05-05T10:30:45Z',
	posted_data: {
		name: 'John Doe',
		email: 'john@example.com',
		message: 'This is a test message',
	},
	ip: '192.168.1.1',
	user_agent: 'Mozilla/5.0...',
};

export function WebhookPage() {
	const [urls, setUrls] = useState([]);
	const [savedUrls, setSavedUrls] = useState([]);
	const [newUrl, setNewUrl] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState(null);
	const [testingIndex, setTestingIndex] = useState(null);
	const [showExample, setShowExample] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const data = await apiFetch({ path: '/cf7-styler/v1/settings/webhook' });
				const list = Array.isArray(data.urls) ? data.urls : [];
				setUrls(list);
				setSavedUrls(list);
			} catch (err) {
				setNotice({
					type: 'error',
					message:
						err.message ||
						__('Failed to load webhook settings.', 'cf7-styler-for-divi'),
				});
			} finally {
				setLoading(false);
			}
		})();
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
			showNotice('error', __('Please enter a valid URL.', 'cf7-styler-for-divi'));
			return;
		}
		if (urls.includes(trimmed)) {
			showNotice('error', __('This URL is already in the list.', 'cf7-styler-for-divi'));
			return;
		}
		setUrls([...urls, trimmed]);
		setNewUrl('');
	};

	const removeUrl = (index) => {
		setUrls(urls.filter((_, i) => i !== index));
	};

	const dirty = JSON.stringify(urls) !== JSON.stringify(savedUrls);

	const save = async () => {
		setSaving(true);
		setNotice(null);
		try {
			await apiFetch({
				path: '/cf7-styler/v1/settings/webhook',
				method: 'POST',
				data: { urls },
			});
			setSavedUrls(urls);
			showNotice('success', __('Webhook URLs saved.', 'cf7-styler-for-divi'));
		} catch (err) {
			showNotice('error', err.message || __('Save failed.', 'cf7-styler-for-divi'));
		} finally {
			setSaving(false);
		}
	};

	const testWebhook = async (index) => {
		setTestingIndex(index);
		const url = urls[index];
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					test: true,
					form_id: 'test-form',
					form_title: 'Test Form',
					submitted_at: new Date().toISOString(),
					posted_data: { test_field: 'test_value' },
					ip: '127.0.0.1',
					user_agent: navigator.userAgent,
				}),
			});
			if (response.ok) {
				showNotice('success', __('Test webhook delivered.', 'cf7-styler-for-divi'));
			} else {
				showNotice(
					'error',
					__('Server returned ', 'cf7-styler-for-divi') + response.status
				);
			}
		} catch (err) {
			showNotice(
				'error',
				__('Failed to send test webhook: ', 'cf7-styler-for-divi') +
					(err.message || __('Network error', 'cf7-styler-for-divi'))
			);
		} finally {
			setTestingIndex(null);
		}
	};

	if (loading) {
		return (
			<p className="cf7m-dash-row__desc">
				{__('Loading webhook settings…', 'cf7-styler-for-divi')}
			</p>
		);
	}

	return (
		<div className="cf7m-dash__panel">
			{notice && (
				<div className={`cf7m-dash-notice cf7m-dash-notice--${notice.type}`}>
					<span>{notice.message}</span>
					<button
						type="button"
						className="cf7m-dash-notice__close"
						onClick={() => setNotice(null)}
						aria-label={__('Dismiss', 'cf7-styler-for-divi')}
					>×</button>
				</div>
			)}

			<section className="cf7m-dash-section">
				<h3 className="cf7m-dash-section__title">
					{__('Add a webhook URL', 'cf7-styler-for-divi')}
				</h3>
				<p className="cf7m-dash-section__desc">
					{__('Form submissions will be POSTed to every URL in this list.', 'cf7-styler-for-divi')}
				</p>
				<div className="cf7m-dash-row">
					<div className="cf7m-dash-row__label cf7m-webhook__add">
						<TextControl
							__nextHasNoMarginBottom
							value={newUrl}
							onChange={setNewUrl}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									addUrl();
								}
							}}
							placeholder="https://your-service.com/webhook"
							aria-label={__('Webhook URL', 'cf7-styler-for-divi')}
						/>
					</div>
					<div className="cf7m-dash-row__control">
						<Button variant="secondary" onClick={addUrl}>
							{__('Add URL', 'cf7-styler-for-divi')}
						</Button>
					</div>
				</div>
			</section>

			<section className="cf7m-dash-section">
				<h3 className="cf7m-dash-section__title">
					{__('Active URLs', 'cf7-styler-for-divi')}
				</h3>
				{urls.length === 0 ? (
					<p className="cf7m-dash-section__desc">
						{__('No webhook URLs yet. Add one above to start receiving submissions.', 'cf7-styler-for-divi')}
					</p>
				) : (
					<div>
						{urls.map((url, index) => (
							<div key={index} className="cf7m-dash-row">
								<div className="cf7m-dash-row__label">
									<code className="cf7m-webhook__url" title={url}>{url}</code>
								</div>
								<div className="cf7m-dash-row__control">
									<Button
										variant="tertiary"
										size="small"
										onClick={() => testWebhook(index)}
										disabled={testingIndex === index}
									>
										{testingIndex === index
											? __('Testing…', 'cf7-styler-for-divi')
											: __('Test', 'cf7-styler-for-divi')}
									</Button>
									<Button
										variant="tertiary"
										size="small"
										isDestructive
										onClick={() => removeUrl(index)}
										icon={<TrashIcon className="cf7m-resp__icon" />}
										label={__('Remove', 'cf7-styler-for-divi')}
										showTooltip
									/>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			<div className="cf7m-dash-footer cf7m-dash-footer--split">
				<Button variant="tertiary" onClick={() => setShowExample(!showExample)}>
					{showExample
						? __('Hide example payload', 'cf7-styler-for-divi')
						: __('Show example payload', 'cf7-styler-for-divi')}
				</Button>
				<Button
					variant="primary"
					onClick={save}
					disabled={saving || !dirty}
				>
					{saving
						? __('Saving…', 'cf7-styler-for-divi')
						: __('Save URLs', 'cf7-styler-for-divi')}
				</Button>
			</div>

			{showExample && (
				<section className="cf7m-dash-section">
					<h3 className="cf7m-dash-section__title">
						{__('Example payload', 'cf7-styler-for-divi')}
					</h3>
					<p className="cf7m-dash-section__desc">
						{__('This JSON is POSTed to every webhook URL on form submission.', 'cf7-styler-for-divi')}
					</p>
					<pre className="cf7m-webhook__code">
						{JSON.stringify(examplePayload, null, 2)}
					</pre>
				</section>
			)}
		</div>
	);
}
