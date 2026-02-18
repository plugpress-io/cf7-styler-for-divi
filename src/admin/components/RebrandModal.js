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

	const ITEMS = [
		{
			icon: (
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="20 6 9 17 4 12" />
				</svg>
			),
			title: __('Same plugin, new name', 'cf7-styler-for-divi'),
			desc: __('CF7 Styler is now CF7 Mate — all your settings are intact.', 'cf7-styler-for-divi'),
		},
		{
			icon: (
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
				</svg>
			),
			title: __('Works everywhere', 'cf7-styler-for-divi'),
			desc: __('Divi, Elementor, Bricks, Gutenberg — one plugin for all builders.', 'cf7-styler-for-divi'),
		},
		{
			icon: (
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
				</svg>
			),
			title: __('More in Pro', 'cf7-styler-for-divi'),
			desc: __('Form entries, multi-step forms, conditional logic & more.', 'cf7-styler-for-divi'),
		},
	];

	return (
		<div className="cf7m-rebrand-overlay" role="dialog" aria-modal="true" aria-label={__('CF7 Mate welcome', 'cf7-styler-for-divi')} onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}>
			<div className="cf7m-rebrand-modal" onClick={(e) => e.stopPropagation()}>

				{/* Header */}
				<div className="cf7m-rebrand-modal__header">
					<button type="button" className="cf7m-rebrand-modal__close" onClick={handleDismiss} aria-label={__('Close', 'cf7-styler-for-divi')}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
					<div className="cf7m-rebrand-modal__brand">
						<CF7MateLogo width={44} height={44} className="cf7m-rebrand-modal__logo" />
						<div className="cf7m-rebrand-modal__brand-text">
							<span className="cf7m-rebrand-modal__eyebrow">{__('Introducing', 'cf7-styler-for-divi')}</span>
							<h1 className="cf7m-rebrand-modal__title">CF7 Mate</h1>
						</div>
					</div>
					<p className="cf7m-rebrand-modal__tagline">{__('Your complete Contact Form 7 companion', 'cf7-styler-for-divi')}</p>
				</div>

				{/* Body */}
				<div className="cf7m-rebrand-modal__body">
					<p className="cf7m-rebrand-modal__section-label">{__("What's new", 'cf7-styler-for-divi')}</p>
					<div className="cf7m-rebrand-modal__items">
						{ITEMS.map((item, i) => (
							<div key={i} className="cf7m-rebrand-modal__item">
								<span className="cf7m-rebrand-modal__item-icon">{item.icon}</span>
								<div className="cf7m-rebrand-modal__item-text">
									<strong>{item.title}</strong>
									<span>{item.desc}</span>
								</div>
							</div>
						))}
					</div>
					<button type="button" className="cf7m-rebrand-modal__cta" onClick={handleDismiss} disabled={dismissing}>
						{dismissing ? __('…', 'cf7-styler-for-divi') : __('Got it', 'cf7-styler-for-divi')}
						{!dismissing && (
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
								<polyline points="20 6 9 17 4 12" />
							</svg>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
