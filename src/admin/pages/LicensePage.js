/**
 * License (Pro) – Notion-style status row + key row + footer.
 *
 * @package CF7_Mate
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, TextControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

export default function LicensePage() {
	const [licenseData, setLicenseData] = useState(
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.license
			? dcsCF7Styler.license
			: {}
	);
	const [keyInput, setKeyInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [notice, setNotice] = useState(null);

	useEffect(() => {
		if (notice && notice.type === 'success') {
			const t = setTimeout(() => setNotice(null), 3000);
			return () => clearTimeout(t);
		}
	}, [notice]);

	const isValid = !!licenseData?.is_valid;
	const status = licenseData?.status || 'inactive';
	const expiresAt = licenseData?.expires_at;
	const maskedKey = licenseData?.masked_key;
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

	const formatDate = (dateString) => {
		if (!dateString) return '—';
		try {
			return new Date(dateString).toLocaleDateString();
		} catch {
			return dateString;
		}
	};

	const handleActivate = async (e) => {
		if (e && e.preventDefault) e.preventDefault();
		if (!keyInput.trim()) {
			setNotice({ type: 'error', message: __('Please enter a license key.', 'cf7-styler-for-divi') });
			return;
		}
		setLoading(true);
		try {
			const response = await apiFetch({
				path: '/cf7-styler/v1/license/activate',
				method: 'POST',
				data: { license_key: keyInput },
			});
			if (response.success) {
				setLicenseData(response.license);
				setKeyInput('');
				setNotice({ type: 'success', message: __('License activated.', 'cf7-styler-for-divi') });
			}
		} catch (err) {
			setNotice({
				type: 'error',
				message: err?.message || __('Failed to activate license.', 'cf7-styler-for-divi'),
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeactivate = async () => {
		if (!window.confirm(__('Deactivate this license on this site?', 'cf7-styler-for-divi'))) return;
		setLoading(true);
		try {
			const response = await apiFetch({
				path: '/cf7-styler/v1/license/deactivate',
				method: 'POST',
			});
			if (response.success) {
				setLicenseData({});
				setNotice({ type: 'success', message: __('License deactivated.', 'cf7-styler-for-divi') });
			}
		} catch (err) {
			setNotice({
				type: 'error',
				message: err?.message || __('Failed to deactivate license.', 'cf7-styler-for-divi'),
			});
		} finally {
			setLoading(false);
		}
	};

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
						<h4 className="cf7m-dash-row__title">{__('Status', 'cf7-styler-for-divi')}</h4>
						<p className="cf7m-dash-row__desc">
							{isValid
								? __('Your license is active on this site.', 'cf7-styler-for-divi')
								: __('Activate a license to receive updates and support.', 'cf7-styler-for-divi')}
						</p>
					</div>
					<div className="cf7m-dash-row__control">
						<span className={`cf7m-resp-pill cf7m-resp-pill--${statusKey}`}>
							{statusLabel}
						</span>
					</div>
				</div>

				<div className="cf7m-dash-row">
					<div className="cf7m-dash-row__label">
						<h4 className="cf7m-dash-row__title">{__('License key', 'cf7-styler-for-divi')}</h4>
						<p className="cf7m-dash-row__desc">
							{isValid
								? __('Your key is registered to this site.', 'cf7-styler-for-divi')
								: (
									<>
										{__('Enter the key from your purchase email or ', 'cf7-styler-for-divi')}
										<a
											href="https://app.lemonsqueezy.com/my-orders"
											target="_blank"
											rel="noopener noreferrer"
											className="cf7m-dash-link"
										>
											{__('Lemon Squeezy orders', 'cf7-styler-for-divi')}
										</a>
										{__('.', 'cf7-styler-for-divi')}
									</>
								)}
						</p>
					</div>
					<div className="cf7m-dash-row__control cf7m-ai__key">
						{isValid ? (
							<code className="cf7m-dash-key">{maskedKey || '••••-••••-••••-••••'}</code>
						) : (
							<TextControl
								__nextHasNoMarginBottom
								value={keyInput}
								onChange={setKeyInput}
								placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
								onKeyDown={(e) => e.key === 'Enter' && handleActivate(e)}
								aria-label={__('License key', 'cf7-styler-for-divi')}
							/>
						)}
					</div>
				</div>

				{isValid && (
					<div className="cf7m-dash-row">
						<div className="cf7m-dash-row__label">
							<h4 className="cf7m-dash-row__title">{__('Expires', 'cf7-styler-for-divi')}</h4>
							<p className="cf7m-dash-row__desc">
								{__('Renewal keeps you on the latest plugin updates.', 'cf7-styler-for-divi')}
							</p>
						</div>
						<div className="cf7m-dash-row__control">
							<span className="cf7m-dash-row__desc">{formatDate(expiresAt)}</span>
						</div>
					</div>
				)}
			</section>

			<div className="cf7m-dash-footer cf7m-dash-footer--split">
				{!isValid && pricingUrl ? (
					<a
						href={pricingUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="cf7m-dash-link"
					>
						{__('Get a license', 'cf7-styler-for-divi')}
					</a>
				) : (
					<span />
				)}
				{isValid ? (
					<Button variant="secondary" isDestructive onClick={handleDeactivate} disabled={loading}>
						{loading
							? __('Deactivating…', 'cf7-styler-for-divi')
							: __('Deactivate license', 'cf7-styler-for-divi')}
					</Button>
				) : (
					<Button variant="primary" onClick={handleActivate} disabled={loading}>
						{loading
							? __('Activating…', 'cf7-styler-for-divi')
							: __('Activate license', 'cf7-styler-for-divi')}
					</Button>
				)}
			</div>
		</div>
	);
}
