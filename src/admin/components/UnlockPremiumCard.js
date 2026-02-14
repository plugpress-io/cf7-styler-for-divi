import { __ } from '@wordpress/i18n';
import { CrownIcon } from './icons/NavIcons';

export function UnlockPremiumCard({ pricingUrl, freeVsProUrl, promoCode, promoText }) {
	const priceUrl = pricingUrl || (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url) || 'admin.php?page=cf7-mate-pricing';
	const compareUrl = freeVsProUrl || (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dashboard_url ? dcsCF7Styler.dashboard_url + '#/free-vs-pro' : '#/free-vs-pro');
	const showCode = promoCode && promoCode.trim().length > 0;
	const showPromoText = promoText && promoText.trim().length > 0;

	return (
		<div className="cf7m-card cf7m-unlock-premium-card">
			<div className="cf7m-unlock-premium-card__header">
				<div className="cf7m-unlock-premium-card__icon" aria-hidden="true">
					<CrownIcon />
				</div>
				<div className="cf7m-unlock-premium-card__header-text">
					<h3 className="cf7m-unlock-premium-card__title">{__('CF7 Mate Pro', 'cf7-styler-for-divi')}</h3>
					{showCode && (
						<span className="cf7m-unlock-premium-card__discount" role="status">
							{__('Use code', 'cf7-styler-for-divi')} <code>{promoCode.trim()}</code>
						</span>
					)}
					{showPromoText && (
						<span className="cf7m-unlock-premium-card__promo-text" role="status">
							{promoText}
						</span>
					)}
				</div>
			</div>
			<p className="cf7m-unlock-premium-card__text">
				{__('Extra fields, entries, and AI. Compare free vs Pro when you’re ready.', 'cf7-styler-for-divi')}
			</p>
			<div className="cf7m-unlock-premium-card__actions">
				<a href={priceUrl} className="cf7m-unlock-premium-card__cta" target="_blank" rel="noopener noreferrer">
					{__('Upgrade', 'cf7-styler-for-divi')}
				</a>
				<a href={compareUrl} className="cf7m-unlock-premium-card__link">
					{__('Compare Free vs Pro', 'cf7-styler-for-divi')}
				</a>
			</div>
		</div>
	);
}
