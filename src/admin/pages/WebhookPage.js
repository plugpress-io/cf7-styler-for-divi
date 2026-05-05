/**
 * Webhook settings page – add/remove webhook URLs and test
 * Uses Tailwind CSS for styling
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import apiFetch from '@wordpress/api-fetch';

export function WebhookPage() {
	const [urls, setUrls] = useState([]);
	const [newUrl, setNewUrl] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [notice, setNotice] = useState(null);
	const [testingIndex, setTestingIndex] = useState(null);
	const [showExample, setShowExample] = useState(false);

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
				showNotice(
					'success',
					__('Test webhook sent successfully!', 'cf7-styler-for-divi'),
				);
			} else {
				showNotice(
					'error',
					__(`Server returned ${response.status}`, 'cf7-styler-for-divi'),
				);
			}
		} catch (err) {
			showNotice(
				'error',
				__('Failed to send test webhook: ', 'cf7-styler-for-divi') +
					(err.message || __('Network error', 'cf7-styler-for-divi')),
			);
		} finally {
			setTestingIndex(null);
		}
	};

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

	if (loading) {
		return (
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<p className="text-gray-500 text-sm">
					{__('Loading...', 'cf7-styler-for-divi')}
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
			{/* Header */}
			<div className="border-b border-gray-200 px-6 py-4">
				<h2 className="text-xl font-bold text-gray-900">
					{__('Webhook URLs', 'cf7-styler-for-divi')}
				</h2>
				<p className="text-sm text-gray-600 mt-1">
					{__(
						'Send form submission data instantly to these URLs when a form is submitted. Each submission is sent as a JSON POST with form_id, form_title, submitted_at, posted_data, ip, and user_agent.',
						'cf7-styler-for-divi',
					)}
				</p>
			</div>

			{/* Body */}
			<div className="px-6 py-6 space-y-6">
				{/* Notice */}
				{notice && (
					<div
						role="alert"
						className={`p-4 rounded-md text-sm ${
							notice.type === 'success'
								? 'bg-green-50 text-green-800 border border-green-200'
								: 'bg-red-50 text-red-800 border border-red-200'
						}`}
					>
						{notice.message}
					</div>
				)}

				{/* Add URL */}
				<div className="flex gap-2">
					<input
						type="url"
						value={newUrl}
						onChange={(e) => setNewUrl(e.target.value)}
						onKeyDown={(e) =>
							e.key === 'Enter' && (e.preventDefault(), addUrl())
						}
						placeholder="https://your-service.com/webhook"
						aria-label={__('Webhook URL', 'cf7-styler-for-divi')}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<button
						onClick={addUrl}
						className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
					>
						{__('Add URL', 'cf7-styler-for-divi')}
					</button>
				</div>

				{/* URLs List */}
				{urls.length > 0 ? (
					<div className="space-y-2 border-y border-gray-200 py-4">
						{urls.map((url, index) => (
							<div
								key={index}
								className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
							>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-gray-700 truncate" title={url}>
										{url}
									</p>
								</div>
								<div className="flex gap-2 ml-4">
									<button
										onClick={() => testWebhook(index)}
										disabled={testingIndex === index}
										aria-label={__('Test', 'cf7-styler-for-divi')}
										className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
									>
										{testingIndex === index
											? __('Testing...', 'cf7-styler-for-divi')
											: __('Test', 'cf7-styler-for-divi')}
									</button>
									<button
										onClick={() => removeUrl(index)}
										aria-label={__('Remove URL', 'cf7-styler-for-divi')}
										className="p-1 text-gray-500 hover:text-red-600 transition-colors"
									>
										<TrashIcon className="w-5 h-5" />
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8 bg-gray-50 rounded-md">
						<p className="text-gray-500 text-sm">
							{__(
								'No webhook URLs yet. Add one above to start receiving form submissions.',
								'cf7-styler-for-divi',
							)}
						</p>
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-3">
					<button
						onClick={save}
						disabled={saving}
						className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
					>
						{saving
							? __('Saving...', 'cf7-styler-for-divi')
							: __('Save URLs', 'cf7-styler-for-divi')}
					</button>
					<button
						onClick={() => setShowExample(!showExample)}
						className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
					>
						{showExample
							? __('Hide Example', 'cf7-styler-for-divi')
							: __('Show Example', 'cf7-styler-for-divi')}
					</button>
				</div>

				{/* Example Payload */}
				{showExample && (
					<div className="border border-gray-300 rounded-md p-4 bg-gray-50">
						<h3 className="text-sm font-bold text-gray-900 mb-2">
							{__('Example Webhook Payload', 'cf7-styler-for-divi')}
						</h3>
						<p className="text-xs text-gray-600 mb-3">
							{__(
								'This is the JSON data sent to your webhook URL when a form is submitted:',
								'cf7-styler-for-divi',
							)}
						</p>
						<pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-96 font-mono">
							{JSON.stringify(examplePayload, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
