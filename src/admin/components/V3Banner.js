/**
 * V3.0.0 Welcome banner – name change notice for auto-updated users.
 *
 * @package CF7_Mate
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import CF7MateLogo from '../../components/CF7MateLogo';

export function V3Banner({ onDismiss }) {
	const [dismissed, setDismissed] = useState(false);
	const [dismissing, setDismissing] = useState(false);

	const handleDismiss = () => {
		const ajaxUrl = typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.ajax_url : '';
		const nonce = typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.dismiss_rebrand_nonce : '';
		if (!ajaxUrl || !nonce) {
			setDismissed(true);
			return;
		}
		setDismissing(true);
		const formData = new FormData();
		formData.append('action', 'cf7m_dismiss_rebrand');
		formData.append('nonce', nonce);
		fetch(ajaxUrl, { method: 'POST', body: formData, credentials: 'same-origin' })
			.then(() => {
				setDismissed(true);
				if (onDismiss) onDismiss();
			})
			.catch(() => setDismissing(false))
			.finally(() => setDismissing(false));
	};

	if (dismissed) return null;

	return (
		<div className="cf7m-v3-banner" role="status">
			<div className="cf7m-v3-banner__inner">
				<div className="cf7m-v3-banner__icon" aria-hidden="true">
					<CF7MateLogo width={28} height={28} />
				</div>
				<div className="cf7m-v3-banner__content">
					<p className="cf7m-v3-banner__title">
						{__('Welcome to CF7 Mate', 'cf7-styler-for-divi')} <span className="cf7m-v3-banner__ver">v3.0.0</span>
					</p>
					<p className="cf7m-v3-banner__text">
						{__('Same plugin, new name. We\'ve rebranded from "CF7 Styler for Divi" to CF7 Mate — everything works the same.', 'cf7-styler-for-divi')}
					</p>
				</div>
				<button type="button" className="cf7m-v3-banner__dismiss" onClick={handleDismiss} disabled={dismissing} aria-label={__('Dismiss', 'cf7-styler-for-divi')}>
					{dismissing ? __('…', 'cf7-styler-for-divi') : __('Got it', 'cf7-styler-for-divi')}
				</button>
			</div>
		</div>
	);
}
