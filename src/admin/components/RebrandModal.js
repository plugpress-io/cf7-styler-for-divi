/**
 * Rebrand popup – full-screen modal after plugin update.
 *
 * @package CF7_Mate
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	CheckIcon,
	Squares2X2Icon,
	StarIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
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
			Icon: CheckIcon,
			title: __('Same plugin, new name', 'cf7-styler-for-divi'),
			desc: __('CF7 Styler is now CF7 Mate — all your settings are intact.', 'cf7-styler-for-divi'),
		},
		{
			Icon: Squares2X2Icon,
			title: __('Works everywhere', 'cf7-styler-for-divi'),
			desc: __('Divi, Elementor, Bricks, Gutenberg — one plugin for all builders.', 'cf7-styler-for-divi'),
		},
		{
			Icon: StarIcon,
			title: __('More in Pro', 'cf7-styler-for-divi'),
			desc: __('Form responses, multi-step forms, conditional logic & more.', 'cf7-styler-for-divi'),
		},
	];

	return (
		<div className="cf7m-rebrand-overlay" role="dialog" aria-modal="true" aria-label={__('CF7 Mate welcome', 'cf7-styler-for-divi')} onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}>
			<div className="cf7m-rebrand-modal" onClick={(e) => e.stopPropagation()}>

				{/* Header */}
				<div className="cf7m-rebrand-modal__header">
					<button type="button" className="cf7m-rebrand-modal__close" onClick={handleDismiss} aria-label={__('Close', 'cf7-styler-for-divi')}>
						<XMarkIcon className="cf7m-rebrand-modal__close-icon" aria-hidden="true" />
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
						{ITEMS.map(({ Icon, title, desc }, i) => (
							<div key={i} className="cf7m-rebrand-modal__item">
								<span className="cf7m-rebrand-modal__item-icon">
									<Icon className="cf7m-rebrand-modal__item-icon-svg" aria-hidden="true" />
								</span>
								<div className="cf7m-rebrand-modal__item-text">
									<strong>{title}</strong>
									<span>{desc}</span>
								</div>
							</div>
						))}
					</div>
					<button type="button" className="cf7m-rebrand-modal__cta" onClick={handleDismiss} disabled={dismissing}>
						{dismissing ? __('…', 'cf7-styler-for-divi') : __('Got it', 'cf7-styler-for-divi')}
						{!dismissing && (
							<CheckIcon className="cf7m-rebrand-modal__cta-icon" aria-hidden="true" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
