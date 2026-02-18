/**
 * Step Features – Choose features (Step 2 of 4).
 * Free: CF7 Styler, Grid Layout. Pro: Form entries, Multi-step, AI form generator, Conditional logic.
 *
 * @package CF7_Mate
 * @since 3.0.0
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DISCOUNT_CODE = 'NEW2026';

const FREE_FEATURES = [
	{ id: 'cf7_module',       name: __('Divi Styler Module',      'cf7-styler-for-divi'), short: __('Style CF7 forms with Divi Builder',        'cf7-styler-for-divi') },
	{ id: 'bricks_module',    name: __('Bricks Styler Element',   'cf7-styler-for-divi'), short: __('Style CF7 forms with Bricks Builder',       'cf7-styler-for-divi') },
	{ id: 'elementor_module', name: __('Elementor Styler Widget', 'cf7-styler-for-divi'), short: __('Style CF7 forms with Elementor',            'cf7-styler-for-divi') },
	{ id: 'gutenberg_module', name: __('Gutenberg Styler Block',  'cf7-styler-for-divi'), short: __('Style CF7 forms with the Block Editor',     'cf7-styler-for-divi') },
	{ id: 'grid_layout',      name: __('Grid Layout',             'cf7-styler-for-divi'), short: __('Arrange fields in a responsive grid',       'cf7-styler-for-divi') },
];

const PRO_FEATURES = [
	{ id: 'database_entries', name: __('Form Entries', 'cf7-styler-for-divi'), short: __('Save and manage submissions', 'cf7-styler-for-divi') },
	{ id: 'multi_step', name: __('Multi-step Forms', 'cf7-styler-for-divi'), short: __('Step-by-step forms with progress', 'cf7-styler-for-divi') },
	{ id: 'ai_form_generator', name: __('AI Form Generator', 'cf7-styler-for-divi'), short: __('Generate forms with natural language', 'cf7-styler-for-divi') },
	{ id: 'conditional', name: __('Conditional Logic', 'cf7-styler-for-divi'), short: __('Show/hide fields by user choices', 'cf7-styler-for-divi') },
];

const StepFeatures = ({ onFeaturesChange }) => {
	const [copied, setCopied] = useState(false);
	const [isPro, setIsPro] = useState(false);
	const allIds = [...FREE_FEATURES.map((f) => f.id), ...PRO_FEATURES.map((f) => f.id)];
	const [featureStates, setFeatureStates] = useState(() => {
		const o = {};
		allIds.forEach((id) => { o[id] = true; });
		return o;
	});

	useEffect(() => {
		if (typeof dcsOnboarding !== 'undefined' && dcsOnboarding.is_pro) {
			setIsPro(true);
		}
	}, []);

	const handleToggle = (featureId) => {
		const isProFeature = PRO_FEATURES.some((f) => f.id === featureId);
		if (isProFeature && !isPro) return;
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

	return (
		<div className="cf7m-onboarding-step cf7m-step-features">
			<div className="cf7m-step-features__header">
				<span className="cf7m-step-label">{__('Step 2 of 4', 'cf7-styler-for-divi')}</span>
				<h2 className="cf7m-onboarding-title">{__('Choose features', 'cf7-styler-for-divi')}</h2>
				<p className="cf7m-step-features__sub">{__('Toggle on or off. Change anytime in the dashboard.', 'cf7-styler-for-divi')}</p>
			</div>

			<div className="cf7m-features-list">
				{FREE_FEATURES.map((f) => (
					<div key={f.id} className="cf7m-feature-item">
						<div className="cf7m-feature-info">
							<span className="cf7m-feature-title">{f.name}</span>
							<span className="cf7m-feature-short">{f.short}</span>
						</div>
						<label className="cf7m-toggle">
							<input type="checkbox" checked={featureStates[f.id]} onChange={() => handleToggle(f.id)} />
							<span className="cf7m-toggle-slider" />
						</label>
					</div>
				))}

				<div className="cf7m-features-divider">
					<span>{__('Pro', 'cf7-styler-for-divi')}</span>
				</div>

				{PRO_FEATURES.map((f) => (
					<div key={f.id} className={`cf7m-feature-item ${!isPro ? 'cf7m-feature-locked' : ''}`}>
						<div className="cf7m-feature-info">
							<span className="cf7m-feature-title">
								{f.name}
								{!isPro && <span className="cf7m-pro-badge">Pro</span>}
							</span>
							<span className="cf7m-feature-short">{f.short}</span>
						</div>
						{!isPro ? (
							<span className="cf7m-feature-locked-icon" aria-hidden="true">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<rect x="3" y="11" width="18" height="11" rx="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
							</span>
						) : (
							<label className="cf7m-toggle">
								<input type="checkbox" checked={featureStates[f.id]} onChange={() => handleToggle(f.id)} />
								<span className="cf7m-toggle-slider" />
							</label>
						)}
					</div>
				))}
			</div>

			{!isPro && (
				<div className="cf7m-pro-upsell">
					<span className="cf7m-pro-upsell-text">
						{__('Upgrade for more:', 'cf7-styler-for-divi')}{' '}
						<span className="cf7m-pro-upsell-desc">{__('14 modules', 'cf7-styler-for-divi')}</span>
					</span>
					<div className="cf7m-pro-upsell-actions">
						<button type="button" onClick={copyCode} className="cf7m-discount-tag" title={__('Copy code', 'cf7-styler-for-divi')}>
							{DISCOUNT_CODE} {__('(50% off)', 'cf7-styler-for-divi')}
							{copied && <span className="cf7m-copied">{__('Copied!', 'cf7-styler-for-divi')}</span>}
						</button>
						<a href={pricingUrl} className="cf7m-upsell-btn" target="_blank" rel="noopener noreferrer">{__('Upgrade', 'cf7-styler-for-divi')}</a>
					</div>
				</div>
			)}
		</div>
	);
};

export default StepFeatures;
