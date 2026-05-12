/**
 * License – single white card backed by Lemon Squeezy.
 * Surfaces product, customer, activations, expiry, key, and site name.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import apiFetch from '@wordpress/api-fetch';
import { Toggle } from '../components/Toggle';

const REST = {
	activate: '/cf7-styler/v1/license/activate',
	deactivate: '/cf7-styler/v1/license/deactivate',
	validate: '/cf7-styler/v1/license/validate',
};

export default function LicensePage() {
	const initialLicense =
		(typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.license) || {};

	const [license, setLicense] = useState(initialLicense);
	const [keyInput, setKeyInput] = useState('');
	const [busy, setBusy] = useState(null);
	const [notice, setNotice] = useState(null);

	useEffect(() => {
		if (notice && notice.type === 'success') {
			const t = setTimeout(() => setNotice(null), 3500);
			return () => clearTimeout(t);
		}
	}, [notice]);

	const isAgency = !!license?.is_agency;
	const isValid = !!license?.is_valid;
	const status = license?.status || 'inactive';
	const expiresAt = license?.expires_at || '';
	const maskedKey = license?.masked_key || '';
	const productName = license?.product_name || '';
	const variantName = license?.variant_name || '';
	const customerName = license?.customer_name || '';
	const customerEmail = license?.customer_email || '';
	const activationLimit = license?.activation_limit;
	const activationUsage = license?.activation_usage;
	const createdAt = license?.created_at || '';
	const instanceName = license?.instance_name || '';
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url
			? dcsCF7Styler.pricing_url
			: '';

	const statusKey = isValid ? 'new' : status === 'expired' ? 'trash' : 'read';
	const statusLabel = isValid
		? __('Active', 'cf7-styler-for-divi')
		: status === 'expired'
		? __('Expired', 'cf7-styler-for-divi')
		: __('Inactive', 'cf7-styler-for-divi');

	const formatDate = (s) => {
		if (!s) return '—';
		try {
			return new Date(s).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		} catch {
			return s;
		}
	};

	const daysUntilExpiry = (() => {
		if (!expiresAt) return null;
		const ms = new Date(expiresAt).getTime() - Date.now();
		if (Number.isNaN(ms)) return null;
		return Math.ceil(ms / 86400000);
	})();

	const showNotice = (type, message) => setNotice({ type, message });

	const handleActivate = async (e) => {
		if (e && e.preventDefault) e.preventDefault();
		const key = keyInput.trim();
		if (!key) {
			showNotice('error', __('Please enter a license key.', 'cf7-styler-for-divi'));
			return;
		}
		setBusy('activate');
		try {
			const res = await apiFetch({
				path: REST.activate,
				method: 'POST',
				data: { license_key: key },
			});
			if (res?.success || res?.activated) {
				setLicense({ ...res, is_valid: true, has_key: true });
				setKeyInput('');
				showNotice('success', __('License activated.', 'cf7-styler-for-divi'));
			} else {
				showNotice('error', __('Activation failed.', 'cf7-styler-for-divi'));
			}
		} catch (err) {
			showNotice(
				'error',
				err?.message || __('Activation failed.', 'cf7-styler-for-divi')
			);
		} finally {
			setBusy(null);
		}
	};

	const handleDeactivate = async () => {
		if (!window.confirm(__('Deactivate this license on this site?', 'cf7-styler-for-divi'))) return;
		setBusy('deactivate');
		try {
			const res = await apiFetch({ path: REST.deactivate, method: 'POST' });
			if (res?.success) {
				setLicense({});
				showNotice('success', __('License deactivated.', 'cf7-styler-for-divi'));
			}
		} catch (err) {
			showNotice(
				'error',
				err?.message || __('Failed to deactivate.', 'cf7-styler-for-divi')
			);
		} finally {
			setBusy(null);
		}
	};

	const handleValidate = async () => {
		setBusy('validate');
		try {
			const res = await apiFetch({ path: REST.validate, method: 'POST' });
			if (res?.success) {
				setLicense({ ...res });
				showNotice(
					res.is_valid ? 'success' : 'error',
					res.is_valid
						? __('License is valid.', 'cf7-styler-for-divi')
						: __('License is no longer valid.', 'cf7-styler-for-divi')
				);
			}
		} catch (err) {
			showNotice(
				'error',
				err?.message || __('Validation failed.', 'cf7-styler-for-divi')
			);
		} finally {
			setBusy(null);
		}
	};

	const planLine = [productName, variantName].filter(Boolean).join(' · ');
	const activationLine =
		activationLimit > 0
			? __('%1$d of %2$d sites', 'cf7-styler-for-divi')
				.replace('%1$d', activationUsage ?? 0)
				.replace('%2$d', activationLimit)
			: activationUsage > 0
				? __('%d sites', 'cf7-styler-for-divi').replace('%d', activationUsage)
				: '';

	let expiryLine = formatDate(expiresAt);
	if (isValid && daysUntilExpiry !== null && daysUntilExpiry >= 0) {
		expiryLine += ' · ' + __('in %d days', 'cf7-styler-for-divi').replace(
			'%d',
			daysUntilExpiry
		);
	}

	return (
		<div className="cf7m-page-stack">
			{isAgency && <WhiteLabelForm />}
			<div className="cf7m-card">
				<div className="cf7m-card__header">
					<div className="cf7m-card__header-main">
						<h2 className="cf7m-card__title">{__('License', 'cf7-styler-for-divi')}</h2>
						<p className="cf7m-card__subtitle">
							{isValid
								? __('Verified — you\'ll receive updates and premium support.', 'cf7-styler-for-divi')
								: __('Activate a license to receive plugin updates and premium support.', 'cf7-styler-for-divi')}
						</p>
					</div>
					<span className={`cf7m-resp-pill cf7m-resp-pill--${statusKey}`}>
						{statusLabel}
					</span>
				</div>

				<div className="cf7m-card__body">
					{notice && (
						<div className={`cf7m-pg__notice cf7m-pg__notice--${notice.type}`}>
							{notice.message}
							<button type="button" onClick={() => setNotice(null)} aria-label={__('Dismiss', 'cf7-styler-for-divi')}>×</button>
						</div>
					)}

					{daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 30 && isValid && (
						<div className="cf7m-pg__notice cf7m-pg__notice--error">
							{daysUntilExpiry === 0
								? __('Your license expires today.', 'cf7-styler-for-divi')
								: __('Your license renews in %d day(s).', 'cf7-styler-for-divi').replace('%d', daysUntilExpiry)}
						</div>
					)}

					{isValid ? (
						<dl className="cf7m-license__grid">
							{planLine && (
								<DetailRow label={__('Plan', 'cf7-styler-for-divi')}>
									<span className="cf7m-license__strong">{planLine}</span>
								</DetailRow>
							)}
							{(customerName || customerEmail) && (
								<DetailRow label={__('Customer', 'cf7-styler-for-divi')}>
									{customerName && <span>{customerName}</span>}
									{customerEmail && <span className="cf7m-license__muted">{customerEmail}</span>}
								</DetailRow>
							)}
							{activationLine && (
								<DetailRow label={__('Activations', 'cf7-styler-for-divi')}>
									<span>{activationLine}</span>
									{activationLimit > 0 && <ActivationBar used={activationUsage || 0} limit={activationLimit} />}
								</DetailRow>
							)}
							<DetailRow label={__('Expires', 'cf7-styler-for-divi')}>
								<span>{expiryLine}</span>
							</DetailRow>
							{createdAt && (
								<DetailRow label={__('Activated', 'cf7-styler-for-divi')}>
									<span className="cf7m-license__muted">{formatDate(createdAt)}</span>
								</DetailRow>
							)}
							{instanceName && (
								<DetailRow label={__('Site', 'cf7-styler-for-divi')}>
									<span className="cf7m-license__muted">{instanceName}</span>
								</DetailRow>
							)}
							<DetailRow label={__('Key', 'cf7-styler-for-divi')}>
								<code className="cf7m-dash-key">{maskedKey || '••••-••••-••••-••••'}</code>
							</DetailRow>
						</dl>
					) : (
						<div className="cf7m-pg__fields">
							<div className="cf7m-pg__field">
								<label className="cf7m-pg__field-label" htmlFor="cf7m-license-key">
									{__('License key', 'cf7-styler-for-divi')}
								</label>
								<div className="cf7m-pg__field-control">
									<TextControl
										__nextHasNoMarginBottom
										id="cf7m-license-key"
										value={keyInput}
										onChange={setKeyInput}
										placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
										onKeyDown={(e) => e.key === 'Enter' && handleActivate(e)}
									/>
									<a
										href="https://app.lemonsqueezy.com/my-orders"
										target="_blank"
										rel="noopener noreferrer"
										className="cf7m-pg__link"
									>
										{__('Find your key in Lemon Squeezy orders', 'cf7-styler-for-divi')}
										<ArrowUpRightIcon aria-hidden="true" />
									</a>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="cf7m-card__footer">
					{isValid ? (
						<Button variant="tertiary" onClick={handleValidate} disabled={busy === 'validate'}>
							{busy === 'validate' ? __('Checking…', 'cf7-styler-for-divi') : __('Validate now', 'cf7-styler-for-divi')}
						</Button>
					) : pricingUrl ? (
						<a href={pricingUrl} target="_blank" rel="noopener noreferrer" className="cf7m-pg__link">
							{__('Get a license', 'cf7-styler-for-divi')}
							<ArrowUpRightIcon aria-hidden="true" />
						</a>
					) : <span />}

					{isValid ? (
						<Button variant="secondary" isDestructive onClick={handleDeactivate} disabled={busy === 'deactivate'}>
							{busy === 'deactivate' ? __('Deactivating…', 'cf7-styler-for-divi') : __('Deactivate', 'cf7-styler-for-divi')}
						</Button>
					) : (
						<Button variant="primary" onClick={handleActivate} disabled={busy === 'activate'}>
							{busy === 'activate' ? __('Activating…', 'cf7-styler-for-divi') : __('Activate license', 'cf7-styler-for-divi')}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function DetailRow({ label, children }) {
	return (
		<div className="cf7m-license__row">
			<dt className="cf7m-license__label">{label}</dt>
			<dd className="cf7m-license__value">{children}</dd>
		</div>
	);
}

function ActivationBar({ used, limit }) {
	const pct = Math.max(
		0,
		Math.min(100, Math.round((used / Math.max(1, limit)) * 100))
	);
	const tone = pct >= 100 ? 'full' : pct >= 80 ? 'warn' : 'ok';
	return (
		<span className={`cf7m-license__bar cf7m-license__bar--${tone}`}>
			<span style={{ width: `${pct}%` }} />
		</span>
	);
}

function WhiteLabelForm() {
	const WL_PATH = '/cf7-styler/v1/settings/white-label';

	const [settings, setSettings] = useState({
		enabled:     false,
		plugin_name: '',
		logo_url:    '',
		docs_url:    '',
		support_url: '',
	});
	const [loaded, setLoaded]   = useState(false);
	const [saving, setSaving]   = useState(false);
	const [notice, setNotice]   = useState(null);

	useEffect(() => {
		apiFetch({ path: WL_PATH })
			.then((data) => {
				setSettings({
					enabled:     !!data.enabled,
					plugin_name: data.plugin_name || '',
					logo_url:    data.logo_url    || '',
					docs_url:    data.docs_url    || '',
					support_url: data.support_url || '',
				});
			})
			.catch(() => {})
			.finally(() => setLoaded(true));
	}, []);

	const set = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		setNotice(null);
		try {
			await apiFetch({ path: WL_PATH, method: 'POST', data: settings });
			setNotice({ type: 'success', message: __('White label settings saved.', 'cf7-styler-for-divi') });
		} catch (err) {
			setNotice({ type: 'error', message: err?.message || __('Could not save settings.', 'cf7-styler-for-divi') });
		} finally {
			setSaving(false);
		}
	};

	if (!loaded) return null;

	return (
		<div className="cf7m-card">
			<div className="cf7m-card__header">
				<div className="cf7m-card__header-main">
					<h2 className="cf7m-card__title">{__('White Label', 'cf7-styler-for-divi')}</h2>
					<p className="cf7m-card__subtitle">
						{__('Customise how the plugin appears on client sites.', 'cf7-styler-for-divi')}
					</p>
				</div>
			</div>

			<form onSubmit={handleSave}>
				<div className="cf7m-card__body">
					{notice && (
						<div className={`cf7m-pg__notice cf7m-pg__notice--${notice.type}`}>
							{notice.message}
							<button
								type="button"
								onClick={() => setNotice(null)}
								aria-label={__('Dismiss', 'cf7-styler-for-divi')}
							>×</button>
						</div>
					)}

					<div className="cf7m-wl-enable-row">
						<label className="cf7m-wl-enable-label" htmlFor="wl-enabled">
							{__('Enable white label', 'cf7-styler-for-divi')}
						</label>
						<Toggle
							id="wl-enabled"
							checked={settings.enabled}
							onChange={(v) => set('enabled', v)}
						/>
					</div>

					{settings.enabled && (
						<div className="cf7m-pg__fields">
							<div className="cf7m-pg__field">
								<label className="cf7m-pg__field-label" htmlFor="wl-plugin-name">
									{__('Plugin name', 'cf7-styler-for-divi')}
								</label>
								<div className="cf7m-pg__field-control">
									<TextControl
										__nextHasNoMarginBottom
										id="wl-plugin-name"
										value={settings.plugin_name}
										onChange={(v) => set('plugin_name', v)}
										placeholder={__('My Forms Plugin', 'cf7-styler-for-divi')}
									/>
								</div>
							</div>

							<div className="cf7m-pg__field">
								<label className="cf7m-pg__field-label" htmlFor="wl-logo-url">
									{__('Logo URL', 'cf7-styler-for-divi')}
								</label>
								<div className="cf7m-pg__field-control">
									<TextControl
										__nextHasNoMarginBottom
										id="wl-logo-url"
										type="url"
										value={settings.logo_url}
										onChange={(v) => set('logo_url', v)}
										placeholder="https://example.com/logo.png"
									/>
									<span className="cf7m-pg__field-hint">
										{__('22×22 px recommended. Leave blank to keep the default logo.', 'cf7-styler-for-divi')}
									</span>
								</div>
							</div>

							<div className="cf7m-pg__field">
								<label className="cf7m-pg__field-label" htmlFor="wl-docs-url">
									{__('Docs URL', 'cf7-styler-for-divi')}
								</label>
								<div className="cf7m-pg__field-control">
									<TextControl
										__nextHasNoMarginBottom
										id="wl-docs-url"
										type="url"
										value={settings.docs_url}
										onChange={(v) => set('docs_url', v)}
										placeholder={__('Leave blank to hide the Docs link', 'cf7-styler-for-divi')}
									/>
								</div>
							</div>

							<div className="cf7m-pg__field">
								<label className="cf7m-pg__field-label" htmlFor="wl-support-url">
									{__('Support URL', 'cf7-styler-for-divi')}
								</label>
								<div className="cf7m-pg__field-control">
									<TextControl
										__nextHasNoMarginBottom
										id="wl-support-url"
										type="url"
										value={settings.support_url}
										onChange={(v) => set('support_url', v)}
										placeholder={__('Leave blank to hide the Support link', 'cf7-styler-for-divi')}
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="cf7m-card__footer">
					<span />
					<Button variant="primary" type="submit" disabled={saving}>
						{saving ? __('Saving…', 'cf7-styler-for-divi') : __('Save', 'cf7-styler-for-divi')}
					</Button>
				</div>
			</form>
		</div>
	);
}
