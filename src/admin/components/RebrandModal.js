/**
 * Rebrand popup – full-screen modal after plugin update.
 *
 * @package CF7_Mate
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
		<div className="dcs-rebrand-overlay" role="dialog" aria-modal="true" aria-label={__('CF7 Mate welcome', 'cf7-styler-for-divi')} onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}>
			<div className="dcs-rebrand-modal" onClick={(e) => e.stopPropagation()}>
				<button type="button" className="dcs-rebrand-modal__close" onClick={handleDismiss} aria-label={__('Close', 'cf7-styler-for-divi')}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<div className="dcs-rebrand-modal__header">
					<svg className="dcs-rebrand-modal__logo" width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0_cf7m_rebrand)">
							<path fillRule="evenodd" clipRule="evenodd" d="M21.9927 15.7109C24.0728 15.711 25.7588 17.3972 25.7589 19.4771C25.7589 21.557 24.0728 23.2433 21.9927 23.2433C19.9127 23.2433 18.2266 21.557 18.2266 19.4771C18.2266 17.3971 19.9127 15.7109 21.9927 15.7109ZM21.9927 17.0919C21.7154 17.0919 21.4906 17.3167 21.4906 17.5941V18.9749H20.1096C19.8323 18.975 19.6075 19.1998 19.6074 19.4771C19.6074 19.7545 19.8323 19.9793 20.1096 19.9793H21.4906V21.3602C21.4906 21.6375 21.7154 21.8624 21.9927 21.8624C22.2701 21.8623 22.4949 21.6375 22.4949 21.3602V19.9793H23.8758C24.1531 19.9793 24.378 19.7545 24.378 19.4771C24.378 19.1998 24.1531 18.9749 23.8758 18.9749H22.4949V17.5941C22.4949 17.3167 22.2701 17.0919 21.9927 17.0919Z" fill="#5733FF" />
							<path fillRule="evenodd" clipRule="evenodd" d="M38.4 0C43.7019 0 48 4.29806 48 9.6V38.4C48 43.7019 43.7019 48 38.4 48H9.6C4.29806 48 0 43.7019 0 38.4V9.6C0 4.29806 4.29806 2.35646e-07 9.6 0H38.4ZM12.2481 10.944C8.06128 10.9441 4.66725 14.9909 4.66725 19.9828V28.0172C4.66725 33.0091 8.06128 37.056 12.2481 37.056H23.1983C27.3852 37.056 30.7792 33.0091 30.7792 28.0172V19.9828C30.7792 14.9909 27.3852 10.944 23.1983 10.944H12.2481ZM38.0604 10.944C35.1485 10.944 32.7878 13.8667 32.7878 17.472V30.528C32.7878 34.1333 35.1485 37.056 38.0604 37.056C40.9724 37.056 43.3332 34.1334 43.3332 30.528V17.472C43.3332 13.8667 40.9724 10.944 38.0604 10.944Z" fill="#5733FF" />
						</g>
						<defs>
							<clipPath id="clip0_cf7m_rebrand">
								<rect width="48" height="48" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</div>
				<div className="dcs-rebrand-modal__body">
					<span className="dcs-rebrand-modal__eyebrow">{__('Introducing', 'cf7-styler-for-divi')}</span>
					<h1 className="dcs-rebrand-modal__title">CF7 Mate</h1>
					<p className="dcs-rebrand-modal__tagline">{__('Your complete Contact Form 7 companion for Divi', 'cf7-styler-for-divi')}</p>
					<div className="dcs-rebrand-modal__divider"><span>{__("What's new", 'cf7-styler-for-divi')}</span></div>
					<ul className="dcs-rebrand-modal__list">
						<li>{__('Same plugin, new name — CF7 Styler is now CF7 Mate', 'cf7-styler-for-divi')}</li>
						<li>{__('All settings preserved — your forms work exactly the same', 'cf7-styler-for-divi')}</li>
						<li>{__('More features in pro — entries, ratings, multi-step & more', 'cf7-styler-for-divi')}</li>
					</ul>
					<button type="button" className="dcs-rebrand-modal__cta" onClick={handleDismiss} disabled={dismissing}>
						{dismissing ? __('…', 'cf7-styler-for-divi') : __('Got it', 'cf7-styler-for-divi')}
					</button>
				</div>
			</div>
		</div>
	);
}
