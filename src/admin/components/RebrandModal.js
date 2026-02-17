/**
 * Rebrand popup – full-screen modal after plugin update.
 *
 * @package CF7_Mate
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import CF7MateLogo from '../../components/CF7MateLogo';

export function RebrandModal({ onDismiss }) {
	const [dismissing, setDismissing] = useState(false);

	const handleDismiss = () => {
		const ajaxUrl = typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.ajax_url : '';
		const nonce = typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.dismiss_rebrand_nonce : '';
		if (!ajaxUrl || !nonce) {
			if (onDismiss) onDismiss();
			return;
		}
		setDismissing(true);
		const formData = new FormData();
		formData.append('action', 'cf7m_dismiss_rebrand');
		formData.append('nonce', nonce);
		fetch(ajaxUrl, { method: 'POST', body: formData, credentials: 'same-origin' })
			.then(() => { if (onDismiss) onDismiss(); })
			.catch(() => setDismissing(false))
			.finally(() => setDismissing(false));
	};

	return (
		<div className="cf7m-rebrand-overlay" role="dialog" aria-modal="true" aria-label={__('CF7 Mate welcome', 'cf7-styler-for-divi')} onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}>
			<div className="cf7m-rebrand-modal" onClick={(e) => e.stopPropagation()}>
				<button type="button" className="cf7m-rebrand-modal__close" onClick={handleDismiss} aria-label={__('Close', 'cf7-styler-for-divi')}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<div className="cf7m-rebrand-modal__header">
					<CF7MateLogo width={64} height={64} className="cf7m-rebrand-modal__logo" />
				</div>
				<div className="cf7m-rebrand-modal__body">
					<span className="cf7m-rebrand-modal__eyebrow">{__('Introducing', 'cf7-styler-for-divi')}</span>
					<h1 className="cf7m-rebrand-modal__title">CF7 Mate</h1>
					<p className="cf7m-rebrand-modal__tagline">{__('Your complete Contact Form 7 companion', 'cf7-styler-for-divi')}</p>
					<div className="cf7m-rebrand-modal__divider"><span>{__("What's new", 'cf7-styler-for-divi')}</span></div>
					<ul className="cf7m-rebrand-modal__list">
						<li>{__('Same plugin, new name — CF7 Styler is now CF7 Mate', 'cf7-styler-for-divi')}</li>
						<li>{__('Now works with Divi, Elementor, Bricks, and more', 'cf7-styler-for-divi')}</li>
						<li>{__('All settings preserved — your forms work exactly the same', 'cf7-styler-for-divi')}</li>
						<li>{__('More features in pro — entries, ratings, multi-step & more', 'cf7-styler-for-divi')}</li>
					</ul>
					<button type="button" className="cf7m-rebrand-modal__cta" onClick={handleDismiss} disabled={dismissing}>
						{dismissing ? __('…', 'cf7-styler-for-divi') : __('Got it', 'cf7-styler-for-divi')}
					</button>
				</div>
			</div>
		</div>
	);
}
