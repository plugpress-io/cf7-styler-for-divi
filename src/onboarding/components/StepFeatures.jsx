import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DISCOUNT_CODE = 'NEW2026';

const FEATURES = [
	{ id: 'cf7_module', name: __('CF7 Styler Module', 'cf7-styler-for-divi'), short: __('Style forms in Divi', 'cf7-styler-for-divi'), isPro: false },
	{ id: 'grid_layout', name: __('Grid Layout', 'cf7-styler-for-divi'), short: __('Responsive form grid', 'cf7-styler-for-divi'), isPro: false },
	{ id: 'multi_column', name: __('Multi Column', 'cf7-styler-for-divi'), short: __('Advanced columns', 'cf7-styler-for-divi'), isPro: true },
	{ id: 'multi_step', name: __('Multi Step Forms', 'cf7-styler-for-divi'), short: __('Step-by-step forms', 'cf7-styler-for-divi'), isPro: true },
	{ id: 'database_entries', name: __('Form Entries', 'cf7-styler-for-divi'), short: __('Save submissions', 'cf7-styler-for-divi'), isPro: true },
	{ id: 'star_rating', name: __('Star Rating Field', 'cf7-styler-for-divi'), short: __('Star rating field', 'cf7-styler-for-divi'), isPro: true },
	{ id: 'range_slider', name: __('Range Slider Field', 'cf7-styler-for-divi'), short: __('Slider field', 'cf7-styler-for-divi'), isPro: true },
];

const StepFeatures = ({ onFeaturesChange }) => {
	const [copied, setCopied] = useState(false);
	const [isPro, setIsPro] = useState(false);
	const [featureStates, setFeatureStates] = useState(() => {
		const o = {};
		FEATURES.forEach((f) => { o[f.id] = true; });
		return o;
	});

	useEffect(() => {
		if (typeof dcsOnboarding !== 'undefined' && dcsOnboarding.is_pro) {
			setIsPro(true);
		}
	}, []);

	const handleToggle = (featureId) => {
		const feature = FEATURES.find((f) => f.id === featureId);
		if (feature?.isPro && !isPro) return;
		setFeatureStates((prev) => {
			const next = { ...prev, [featureId]: !prev[featureId] };
			if (onFeaturesChange) onFeaturesChange(next);
			return next;
		});
	};

	const copyCode = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			});
		}
	};

	const pricingUrl = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.pricing_url
		? dcsOnboarding.pricing_url
		: '/wp-admin/admin.php?page=cf7-mate-pricing';

	const freeFeatures = FEATURES.filter((f) => !f.isPro);
	const proFeatures = FEATURES.filter((f) => f.isPro);

	return (
		<div className="dcs-onboarding-step dcs-step-features">
			<div className="dcs-step-header">
				<span className="dcs-step-label">{__('Step 2 of 4', 'cf7-styler-for-divi')}</span>
				<h2 className="dcs-onboarding-title">
					{__('Choose features', 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-onboarding-description">
					{__('Pick what you need now. You can turn features on or off anytime in the dashboard.', 'cf7-styler-for-divi')}
				</p>
			</div>

			<div className="dcs-features-list">
				{freeFeatures.map((f) => (
					<div key={f.id} className="dcs-feature-item">
						<div className="dcs-feature-info">
							<span className="dcs-feature-title">{f.name}</span>
							<span className="dcs-feature-short">{f.short}</span>
						</div>
						<label className="dcs-toggle">
							<input
								type="checkbox"
								checked={featureStates[f.id]}
								onChange={() => handleToggle(f.id)}
							/>
							<span className="dcs-toggle-slider" />
						</label>
					</div>
				))}

				<div className="dcs-features-divider">
					<span>{__('Pro', 'cf7-styler-for-divi')}</span>
				</div>

				{proFeatures.map((f) => (
					<div key={f.id} className={`dcs-feature-item ${!isPro ? 'dcs-feature-locked' : ''}`}>
						<div className="dcs-feature-info">
							<span className="dcs-feature-title">
								{f.name}
								{!isPro && <span className="dcs-pro-badge">Pro</span>}
							</span>
							<span className="dcs-feature-short">{f.short}</span>
						</div>
						{!isPro ? (
							<span className="dcs-feature-locked-icon" aria-hidden="true">
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<rect x="3" y="11" width="18" height="11" rx="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</span>
						) : (
							<label className="dcs-toggle">
								<input
									type="checkbox"
									checked={featureStates[f.id]}
									onChange={() => handleToggle(f.id)}
								/>
								<span className="dcs-toggle-slider" />
							</label>
						)}
					</div>
				))}
			</div>

			{!isPro && (
				<div className="dcs-pro-upsell">
					<p className="dcs-pro-upsell-text">
						{__('Unlock Pro', 'cf7-styler-for-divi')}{' '}
						<span className="dcs-pro-upsell-desc">{__('Entries, multi-step, star rating & more.', 'cf7-styler-for-divi')}</span>
					</p>
					<div className="dcs-pro-upsell-actions">
						<button type="button" onClick={copyCode} className="dcs-discount-tag" title={__('Copy code', 'cf7-styler-for-divi')}>
							{DISCOUNT_CODE} {__('(50% off)', 'cf7-styler-for-divi')}
							{copied && <span className="dcs-copied">{__('Copied!', 'cf7-styler-for-divi')}</span>}
						</button>
						<a href={pricingUrl} className="dcs-upsell-btn">
							{__('Upgrade', 'cf7-styler-for-divi')}
						</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default StepFeatures;
