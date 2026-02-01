/**
 * AI Provider Settings page (Pro) – configure AI for form generation.
 * Styled with Tailwind CSS utilities.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const AICheckIcon = () => (<svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>);
const AITrashIcon = () => (<svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" /></svg>);
const AILinkIcon = () => (<svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>);

export function AISettingsPage() {
	const providers = (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.aiProviders) || {};
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [testing, setTesting] = useState(false);
	const [notice, setNotice] = useState(null);
	const [settings, setSettings] = useState({
		provider: 'openai',
		openai_key: '',
		openai_model: 'gpt-4o-mini',
		anthropic_key: '',
		anthropic_model: 'claude-sonnet-4-20250514',
		grok_key: '',
		grok_model: 'grok-3-mini',
		kimi_key: '',
		kimi_model: 'moonshot-v1-32k',
	});

	useEffect(() => {
		const load = async () => {
			try {
				const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
				setSettings((prev) => ({ ...prev, ...data }));
			} catch (err) {
				setNotice({ type: 'error', message: err.message || __('Failed to load settings.', 'cf7-styler-for-divi') });
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

	const saveSettings = async () => {
		setSaving(true);
		setNotice(null);
		try {
			await apiFetch({ path: '/cf7-styler/v1/ai-settings', method: 'POST', data: settings });
			showNotice('success', __('Settings saved!', 'cf7-styler-for-divi'));
			const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
			setSettings((prev) => ({ ...prev, ...data }));
		} catch (err) {
			showNotice('error', err.message || __('Save failed.', 'cf7-styler-for-divi'));
		} finally {
			setSaving(false);
		}
	};

	const testConnection = async () => {
		setTesting(true);
		setNotice(null);
		try {
			const result = await apiFetch({ path: '/cf7-styler/v1/ai-settings/test', method: 'POST', data: { provider: settings.provider } });
			showNotice(result.success ? 'success' : 'error', result.message || (result.success ? __('Connection OK.', 'cf7-styler-for-divi') : __('Test failed.', 'cf7-styler-for-divi')));
		} catch (err) {
			showNotice('error', err.message || __('Test failed.', 'cf7-styler-for-divi'));
		} finally {
			setTesting(false);
		}
	};

	const deleteKey = async () => {
		const keyField = `${settings.provider}_key`;
		setSaving(true);
		try {
			await apiFetch({ path: '/cf7-styler/v1/ai-settings', method: 'POST', data: { ...settings, [keyField]: '' } });
			showNotice('success', __('API key removed.', 'cf7-styler-for-divi'));
			const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
			setSettings((prev) => ({ ...prev, ...data }));
		} catch (err) {
			showNotice('error', err.message || __('Failed to remove key.', 'cf7-styler-for-divi'));
		} finally {
			setSaving(false);
		}
	};

	const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

	if (Object.keys(providers).length === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<p className="text-sm text-gray-600">{__('Enable the AI Form Generator module in Modules to configure AI providers.', 'cf7-styler-for-divi')}</p>
			</div>
		);
	}

	const provider = providers[settings.provider] || {};
	const keyField = `${settings.provider}_key`;
	const modelField = `${settings.provider}_model`;
	const isKeySet = settings[`${keyField}_set`];

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-sm text-gray-500">{__('Loading...', 'cf7-styler-for-divi')}</p>
			</div>
		);
	}

	return (
		<>
			{/* Page header */}
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-gray-900">{__('AI Provider Settings', 'cf7-styler-for-divi')}</h2>
				<p className="mt-1 text-sm text-gray-500">{__('Configure AI for form generation in the Contact Form 7 editor.', 'cf7-styler-for-divi')}</p>
			</div>

			{/* Toast notice */}
			{notice && (
				<div className={`mb-4 rounded-md border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
					{notice.message}
				</div>
			)}

			{/* Configuration card */}
			<div className="max-w-2xl">
				<div className="rounded-lg border border-gray-200 bg-white shadow-sm">
					<div className="border-b border-gray-200 px-5 py-4">
						<h3 className="text-base font-semibold text-gray-900">{__('Configuration', 'cf7-styler-for-divi')}</h3>
					</div>
					<div className="space-y-5 p-5">
						{/* AI Provider */}
						<div>
							<label htmlFor="ai-provider" className="mb-2 block text-sm font-medium text-gray-700">
								{__('AI Provider', 'cf7-styler-for-divi')}
							</label>
							<select
								id="ai-provider"
								value={settings.provider}
								onChange={(e) => update('provider', e.target.value)}
								className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							>
								{Object.entries(providers).map(([key, cfg]) => (
									<option key={key} value={key}>{cfg.name}</option>
								))}
							</select>
						</div>

						{/* Model */}
						<div>
							<label htmlFor="ai-model" className="mb-2 block text-sm font-medium text-gray-700">
								{__('Model', 'cf7-styler-for-divi')}
							</label>
							<select
								id="ai-model"
								value={settings[modelField] || ''}
								onChange={(e) => update(modelField, e.target.value)}
								className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							>
								{Object.entries(provider.models || {}).map(([value, label]) => (
									<option key={value} value={value}>{label}</option>
								))}
							</select>
						</div>

						{/* API Key */}
						<div>
							<label htmlFor="ai-key" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
								{__('API Key', 'cf7-styler-for-divi')}
								{isKeySet && (
									<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
										<AICheckIcon /> {__('Configured', 'cf7-styler-for-divi')}
									</span>
								)}
							</label>
							{isKeySet ? (
								<div className="flex items-center gap-3">
									<code className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-600">
										{settings[`${keyField}_masked`] || '••••••••'}
									</code>
									<button
										type="button"
										onClick={deleteKey}
										disabled={saving}
										className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
									>
										<AITrashIcon /> {__('Remove', 'cf7-styler-for-divi')}
									</button>
								</div>
							) : (
								<div className="flex flex-wrap items-center gap-2">
									<input
										id="ai-key"
										type="password"
										value={settings[keyField] || ''}
										onChange={(e) => update(keyField, e.target.value)}
										placeholder={provider.key_placeholder || 'sk-...'}
										className="block min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
									/>
									{provider.key_url && (
										<a
											href={provider.key_url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
										>
											<AILinkIcon /> {__('Get Key', 'cf7-styler-for-divi')}
										</a>
									)}
								</div>
							)}
						</div>

						{/* Actions */}
						<div className="flex flex-wrap gap-2 border-t border-gray-200 pt-4">
							<button
								type="button"
								onClick={saveSettings}
								disabled={saving || (isKeySet && !settings[keyField])}
								className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
							>
								{saving ? __('Saving...', 'cf7-styler-for-divi') : __('Save Settings', 'cf7-styler-for-divi')}
							</button>
							{isKeySet && (
								<button
									type="button"
									onClick={testConnection}
									disabled={testing}
									className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
								>
									{testing ? __('Testing...', 'cf7-styler-for-divi') : __('Test Connection', 'cf7-styler-for-divi')}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
