/**
 * AI Settings (Pro) – Notion-style rows for provider, model, key + footer actions.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, SelectControl, TextControl } from '@wordpress/components';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import apiFetch from '@wordpress/api-fetch';

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
		(async () => {
			try {
				const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
				setSettings((prev) => ({ ...prev, ...data }));
			} catch (err) {
				setNotice({
					type: 'error',
					message: err.message || __('Failed to load settings.', 'cf7-styler-for-divi'),
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

	const reload = async () => {
		const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
		setSettings((prev) => ({ ...prev, ...data }));
	};

	const saveSettings = async () => {
		setSaving(true);
		setNotice(null);
		try {
			await apiFetch({
				path: '/cf7-styler/v1/ai-settings',
				method: 'POST',
				data: settings,
			});
			showNotice('success', __('Settings saved.', 'cf7-styler-for-divi'));
			await reload();
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
			const result = await apiFetch({
				path: '/cf7-styler/v1/ai-settings/test',
				method: 'POST',
				data: { provider: settings.provider },
			});
			showNotice(
				result.success ? 'success' : 'error',
				result.message ||
					(result.success
						? __('Connection OK.', 'cf7-styler-for-divi')
						: __('Test failed.', 'cf7-styler-for-divi'))
			);
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
			await apiFetch({
				path: '/cf7-styler/v1/ai-settings',
				method: 'POST',
				data: { ...settings, [keyField]: '' },
			});
			showNotice('success', __('API key removed.', 'cf7-styler-for-divi'));
			await reload();
		} catch (err) {
			showNotice('error', err.message || __('Failed to remove key.', 'cf7-styler-for-divi'));
		} finally {
			setSaving(false);
		}
	};

	const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

	if (Object.keys(providers).length === 0) {
		return (
			<p className="cf7m-dash-row__desc">
				{__('Enable the AI Form Generator module in Features to configure AI providers.', 'cf7-styler-for-divi')}
			</p>
		);
	}

	if (loading) {
		return (
			<p className="cf7m-dash-row__desc">
				{__('Loading…', 'cf7-styler-for-divi')}
			</p>
		);
	}

	const provider = providers[settings.provider] || {};
	const keyField = `${settings.provider}_key`;
	const modelField = `${settings.provider}_model`;
	const isKeySet = !!settings[`${keyField}_set`];
	const maskedKey = settings[`${keyField}_masked`] || '••••••••';

	const providerOptions = Object.entries(providers).map(([key, cfg]) => ({
		label: cfg.name,
		value: key,
	}));

	const modelOptions = Object.entries(provider.models || {}).map(
		([value, label]) => ({ label, value })
	);

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
				<div className="cf7m-dash-row">
					<div className="cf7m-dash-row__label">
						<h4 className="cf7m-dash-row__title">
							{__('Provider', 'cf7-styler-for-divi')}
						</h4>
						<p className="cf7m-dash-row__desc">
							{__('Choose which AI service to use for form generation.', 'cf7-styler-for-divi')}
						</p>
					</div>
					<div className="cf7m-dash-row__control">
						<SelectControl
							__nextHasNoMarginBottom
							value={settings.provider}
							options={providerOptions}
							onChange={(v) => update('provider', v)}
						/>
					</div>
				</div>

				<div className="cf7m-dash-row">
					<div className="cf7m-dash-row__label">
						<h4 className="cf7m-dash-row__title">
							{__('Model', 'cf7-styler-for-divi')}
						</h4>
						<p className="cf7m-dash-row__desc">
							{__('Pick a specific model from the selected provider.', 'cf7-styler-for-divi')}
						</p>
					</div>
					<div className="cf7m-dash-row__control">
						<SelectControl
							__nextHasNoMarginBottom
							value={settings[modelField] || ''}
							options={modelOptions}
							onChange={(v) => update(modelField, v)}
						/>
					</div>
				</div>

				<div className="cf7m-dash-row">
					<div className="cf7m-dash-row__label">
						<h4 className="cf7m-dash-row__title">
							{__('API key', 'cf7-styler-for-divi')}
							{isKeySet && (
								<span className="cf7m-feature__badge cf7m-feature__badge--ok">
									{__('Set', 'cf7-styler-for-divi')}
								</span>
							)}
						</h4>
						<p className="cf7m-dash-row__desc">
							{provider.key_url ? (
								<a
									href={provider.key_url}
									target="_blank"
									rel="noopener noreferrer"
									className="cf7m-dash-link"
								>
									{__('Get an API key', 'cf7-styler-for-divi')}
									<ArrowUpRightIcon className="cf7m-resp__icon" aria-hidden="true" />
								</a>
							) : (
								__('Paste your API key from the provider dashboard.', 'cf7-styler-for-divi')
							)}
						</p>
					</div>
					<div className="cf7m-dash-row__control cf7m-ai__key">
						{isKeySet ? (
							<>
								<code className="cf7m-dash-key">{maskedKey}</code>
								<Button variant="tertiary" onClick={deleteKey} isDestructive>
									{__('Remove', 'cf7-styler-for-divi')}
								</Button>
							</>
						) : (
							<TextControl
								__nextHasNoMarginBottom
								type="password"
								value={settings[keyField] || ''}
								onChange={(v) => update(keyField, v)}
								placeholder={provider.key_placeholder || 'sk-...'}
								aria-label={__('API key', 'cf7-styler-for-divi')}
							/>
						)}
					</div>
				</div>
			</section>

			<div className="cf7m-dash-footer">
				{isKeySet && (
					<Button
						variant="tertiary"
						onClick={testConnection}
						disabled={testing}
					>
						{testing
							? __('Testing…', 'cf7-styler-for-divi')
							: __('Test connection', 'cf7-styler-for-divi')}
					</Button>
				)}
				<Button
					variant="primary"
					onClick={saveSettings}
					disabled={saving}
				>
					{saving
						? __('Saving…', 'cf7-styler-for-divi')
						: __('Save settings', 'cf7-styler-for-divi')}
				</Button>
			</div>
		</div>
	);
}
