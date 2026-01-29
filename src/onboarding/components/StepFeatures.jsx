/**
 * Step Features Component - Feature Selection with Toggles
 * Synced with admin dashboard features (cf7m_features option)
 *
 * @since 3.0.0
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DISCOUNT_CODE = 'VIP50';

// Feature definitions - must match admin/index.js and rest-api.php
const FEATURES = [
	{
		id: 'cf7_module',
		name: __('CF7 Styler Module', 'cf7-styler-for-divi'),
		description: __('Style Contact Form 7 forms with Divi Builder.', 'cf7-styler-for-divi'),
		isPro: false,
	},
	{
		id: 'grid_layout',
		name: __('Grid Layout', 'cf7-styler-for-divi'),
		description: __('Arrange form fields in a responsive grid layout.', 'cf7-styler-for-divi'),
		isPro: false,
	},
	{
		id: 'multi_column',
		name: __('Multi Column', 'cf7-styler-for-divi'),
		description: __('Advanced multi-column form layouts.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'multi_step',
		name: __('Multi Step Forms', 'cf7-styler-for-divi'),
		description: __('Create multi-step forms with progress indicators.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'database_entries',
		name: __('Form Entries', 'cf7-styler-for-divi'),
		description: __('Save form submissions to database.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'star_rating',
		name: __('Star Rating Field', 'cf7-styler-for-divi'),
		description: __('Add star rating fields to collect feedback.', 'cf7-styler-for-divi'),
		isPro: true,
	},
	{
		id: 'range_slider',
		name: __('Range Slider Field', 'cf7-styler-for-divi'),
		description: __('Add range slider fields for value selection.', 'cf7-styler-for-divi'),
		isPro: true,
	},
];

const StepFeatures = ({ onFeaturesChange }) => {
	const [copied, setCopied] = useState(false);
	const [isPro, setIsPro] = useState(false);
	const [featureStates, setFeatureStates] = useState(() => {
		const initial = {};
		FEATURES.forEach((f) => {
			initial[f.id] = true; // All enabled by default
		});
		return initial;
	});

	useEffect(() => {
		// Check if Pro is installed
		if (typeof dcsOnboarding !== 'undefined' && dcsOnboarding.is_pro) {
			setIsPro(true);
		}
	}, []);

	const handleToggle = (featureId, isPro) => {
		const feature = FEATURES.find(f => f.id === featureId);
		
		// Pro features can't be toggled in free version
		if (feature?.isPro && !isPro) {
			return;
		}
		
		setFeatureStates((prev) => {
			const newState = { ...prev, [featureId]: !prev[featureId] };
			if (onFeaturesChange) {
				onFeaturesChange(newState);
			}
			return newState;
		});
	};

	const handleCopyCode = () => {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			});
		}
	};

	const handleUpgrade = () => {
		const pricingUrl = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.pricing_url 
			? dcsOnboarding.pricing_url 
			: '/wp-admin/admin.php?page=cf7-mate-pricing';
		window.location.href = pricingUrl;
	};

	const freeFeatures = FEATURES.filter(f => !f.isPro);
	const proFeatures = FEATURES.filter(f => f.isPro);

	const FeatureItem = ({ feature }) => {
		const isProLocked = feature.isPro && !isPro;
		
		return (
			<div className={`dcs-feature-item ${isProLocked ? 'dcs-feature-locked' : ''}`}>
				<div className="dcs-feature-info">
					<div className="dcs-feature-header">
						<h4 className="dcs-feature-title">
							{feature.name}
							{feature.isPro && (
								<span className="dcs-pro-badge">{__('Pro', 'cf7-styler-for-divi')}</span>
							)}
						</h4>
					</div>
					<p className="dcs-feature-description">{feature.description}</p>
				</div>
				<div className="dcs-feature-toggle">
					{isProLocked ? (
						<span className="dcs-feature-locked-icon">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
								<path d="M7 11V7a5 5 0 0 1 10 0v4" />
							</svg>
						</span>
					) : (
						<label className="dcs-toggle">
							<input
								type="checkbox"
								checked={featureStates[feature.id]}
								onChange={() => handleToggle(feature.id, isPro)}
							/>
							<span className="dcs-toggle-slider"></span>
						</label>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="dcs-onboarding-step dcs-step-features">
			<div className="dcs-step-header">
				<span className="dcs-step-label">{__('Step 2 of 4', 'cf7-styler-for-divi')}</span>
				<h2 className="dcs-onboarding-title">
					{__('Which features would you like to enable?', 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-onboarding-description">
					{__('Toggle features on or off. You can change these anytime in Settings.', 'cf7-styler-for-divi')}
				</p>
			</div>

			<div className="dcs-features-list">
				{freeFeatures.map((feature) => (
					<FeatureItem key={feature.id} feature={feature} />
				))}

				<div className="dcs-features-divider">
					<span>{__('Pro Features', 'cf7-styler-for-divi')}</span>
				</div>

				{proFeatures.map((feature) => (
					<FeatureItem key={feature.id} feature={feature} />
				))}
			</div>

			{!isPro && (
				<div className="dcs-pro-upsell-banner">
					<div className="dcs-upsell-content">
						<div className="dcs-upsell-text">
							<strong>{__('Get 50% Off Pro', 'cf7-styler-for-divi')}</strong>
							<span>
								{__('Use code', 'cf7-styler-for-divi')}{' '}
								<code className="dcs-discount-code" onClick={handleCopyCode} title={__('Click to copy', 'cf7-styler-for-divi')}>
									{DISCOUNT_CODE}
								</code>
								{copied && <span className="dcs-copied">{__('Copied!', 'cf7-styler-for-divi')}</span>}
							</span>
						</div>
					</div>
					<button type="button" onClick={handleUpgrade} className="dcs-upsell-btn">
						{__('Upgrade Now', 'cf7-styler-for-divi')}
					</button>
				</div>
			)}
		</div>
	);
};

export default StepFeatures;
