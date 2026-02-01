import { useState, useEffect } from '@wordpress/element';
import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

import './style.scss';

// Feature definitions with icon keys
const FEATURES = [
	{
		id: 'cf7_module',
		name: __('CF7 Styler Module', 'cf7-styler-for-divi'),
		description: __(
			'Style Contact Form 7 forms with Divi Builder.',
			'cf7-styler-for-divi'
		),
		isPro: false,
		icon: 'module',
	},
	{
		id: 'grid_layout',
		name: __('Grid Layout', 'cf7-styler-for-divi'),
		description: __(
			'Arrange form fields in a responsive grid layout.',
			'cf7-styler-for-divi'
		),
		isPro: false,
		icon: 'grid',
	},
	{
		id: 'multi_column',
		name: __('Multi Column', 'cf7-styler-for-divi'),
		description: __(
			'Advanced multi-column form layouts with custom breakpoints.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'columns',
	},
	{
		id: 'multi_step',
		name: __('Multi Step Forms', 'cf7-styler-for-divi'),
		description: __(
			'Create multi-step forms with progress indicators.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'steps',
	},
	{
		id: 'database_entries',
		name: __('Form Entries (Database Entries)', 'cf7-styler-for-divi'),
		description: __(
			'Save form submissions to database and export to CSV.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'database',
	},
	{
		id: 'star_rating',
		name: __('Star Rating Field', 'cf7-styler-for-divi'),
		description: __(
			'Add star rating fields to collect feedback from customers.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'star',
	},
	{
		id: 'range_slider',
		name: __('Range Slider Field', 'cf7-styler-for-divi'),
		description: __(
			'Add range slider fields for precise value selection.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'slider',
	},
	{
		id: 'separator',
		name: __('Separator Field', 'cf7-styler-for-divi'),
		description: __(
			'Add horizontal divider lines between form sections.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'separator',
	},
	{
		id: 'heading',
		name: __('Heading Field', 'cf7-styler-for-divi'),
		description: __(
			'Add headings (H1–H6) to structure your form content.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'heading',
	},
	{
		id: 'image',
		name: __('Image Field', 'cf7-styler-for-divi'),
		description: __(
			'Insert images into your contact forms.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'image',
	},
	{
		id: 'icon',
		name: __('Icon Field', 'cf7-styler-for-divi'),
		description: __(
			'Add icons to highlight sections or labels.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'icon',
	},
	{
		id: 'calculator',
		name: __('Calculator / Price Estimator', 'cf7-styler-for-divi'),
		description: __(
			'Add live calculations for quotes, pricing, and order totals.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'calculator',
	},
	{
		id: 'conditional',
		name: __('Conditional Logic', 'cf7-styler-for-divi'),
		description: __(
			'Show/hide fields based on user selections.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'conditional',
	},
	{
		id: 'ai_form_generator',
		name: __('AI Form Generator', 'cf7-styler-for-divi'),
		description: __(
			'Generate CF7 forms using AI with natural language prompts.',
			'cf7-styler-for-divi'
		),
		isPro: true,
		icon: 'ai',
	},
];

// Feature icons – simple line icons
const FeatureIconModule = () => (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
			>
				<rect x="3" y="4" width="18" height="16" rx="2" />
				<line x1="7" y1="8" x2="17" y2="8" />
				<line x1="7" y1="12" x2="17" y2="12" />
				<line x1="7" y1="16" x2="12" y2="16" />
			</svg>
);
const FeatureIconGrid = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="3" y="3" width="7" height="7" rx="1" />
		<rect x="14" y="3" width="7" height="7" rx="1" />
		<rect x="3" y="14" width="7" height="7" rx="1" />
		<rect x="14" y="14" width="7" height="7" rx="1" />
	</svg>
);
const FeatureIconColumns = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="6" y1="4" x2="6" y2="20" />
		<line x1="12" y1="4" x2="12" y2="20" />
		<line x1="18" y1="4" x2="18" y2="20" />
	</svg>
);
const FeatureIconSteps = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M4 12h16M4 8h16M4 16h10" />
		<circle cx="18" cy="16" r="2" />
	</svg>
);
const FeatureIconStar = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
	</svg>
);
const FeatureIconDatabase = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<ellipse cx="12" cy="5" rx="9" ry="3" />
		<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
		<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
	</svg>
);
const FeatureIconSlider = () => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="4" y1="12" x2="20" y2="12" />
		<circle cx="8" cy="12" r="2" />
	</svg>
);
const FeatureIconSeparator = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<line x1="2" y1="12" x2="22" y2="12" />
	</svg>
);
const FeatureIconHeading = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M4 12h8M4 6v12M12 6v12M16 8l4-2v12l-4-2" />
	</svg>
);
const FeatureIconImage = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="3" y="3" width="18" height="18" rx="2" />
		<circle cx="8.5" cy="8.5" r="1.5" />
		<path d="M21 15l-5-5L5 21" />
	</svg>
);
const FeatureIconIcon = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="10" />
		<path d="M12 8v4l2 2" />
	</svg>
);
const FeatureIconAI = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 2L2 7l10 5 10-5-10-5z" />
		<path d="M2 17l10 5 10-5" />
		<path d="M2 12l10 5 10-5" />
	</svg>
);
const FeatureIconCalculator = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect x="4" y="2" width="16" height="20" rx="2" />
		<line x1="8" y1="6" x2="16" y2="6" />
		<line x1="8" y1="10" x2="8" y2="10.01" />
		<line x1="12" y1="10" x2="12" y2="10.01" />
		<line x1="16" y1="10" x2="16" y2="10.01" />
		<line x1="8" y1="14" x2="8" y2="14.01" />
		<line x1="12" y1="14" x2="12" y2="14.01" />
		<line x1="16" y1="14" x2="16" y2="14.01" />
		<line x1="8" y1="18" x2="16" y2="18" />
	</svg>
);
const FeatureIconConditional = () => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M16 3h5v5" />
		<path d="M8 3H3v5" />
		<path d="M12 22v-8.5a4 4 0 0 0-4-4H3" />
		<path d="M12 22v-8.5a4 4 0 0 1 4-4h5" />
		<line x1="21" y1="3" x2="16" y2="8" />
		<line x1="3" y1="3" x2="8" y2="8" />
	</svg>
);

const FEATURE_ICONS = {
	module: FeatureIconModule,
	grid: FeatureIconGrid,
	columns: FeatureIconColumns,
	steps: FeatureIconSteps,
	star: FeatureIconStar,
	database: FeatureIconDatabase,
	slider: FeatureIconSlider,
	separator: FeatureIconSeparator,
	heading: FeatureIconHeading,
	image: FeatureIconImage,
	icon: FeatureIconIcon,
	calculator: FeatureIconCalculator,
	conditional: FeatureIconConditional,
	ai: FeatureIconAI,
};

// Docs icon (book)
const DocsIcon = () => (
	<svg
		className="dcs-nav-icon dcs-nav-icon--docs"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		{/* Document / readme – page with text lines */}
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14 2 14 8 20 8" />
		<line x1="8" y1="13" x2="16" y2="13" />
		<line x1="8" y1="17" x2="16" y2="17" />
		<line x1="8" y1="9" x2="12" y2="9" />
	</svg>
);

// Crown icon – Pro / premium (royal golden)
const CrownIcon = ({ className = '' }) => (
	<svg
		className={`dcs-icon-crown ${className}`}
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z" />
	</svg>
);

// Crown for header nav (icon only)
const CrownIconNav = () => (
	<svg
		className="dcs-nav-icon dcs-nav-icon--crown"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z" />
	</svg>
);

// V3.0.0 Welcome banner – name change notice for auto-updated users
const V3Banner = ({ onDismiss }) => {
	const [dismissed, setDismissed] = useState(false);
	const [dismissing, setDismissing] = useState(false);

	const handleDismiss = () => {
		const ajaxUrl =
			typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.ajax_url : '';
		const nonce =
			typeof dcsCF7Styler !== 'undefined'
				? dcsCF7Styler.dismiss_rebrand_nonce
				: '';
		if (!ajaxUrl || !nonce) {
			setDismissed(true);
			return;
		}
		setDismissing(true);
		const formData = new FormData();
		formData.append('action', 'cf7m_dismiss_rebrand');
		formData.append('nonce', nonce);
		fetch(ajaxUrl, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
		})
			.then(() => {
				setDismissed(true);
				if (onDismiss) onDismiss();
			})
			.catch(() => setDismissing(false))
			.finally(() => setDismissing(false));
	};

	if (dismissed) return null;

	return (
		<div className="dcs-v3-banner" role="status">
			<div className="dcs-v3-banner__inner">
				<div className="dcs-v3-banner__icon" aria-hidden="true">
					<svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0_cf7m_banner)">
							<path fillRule="evenodd" clipRule="evenodd" d="M21.9927 15.7109C24.0728 15.711 25.7588 17.3972 25.7589 19.4771C25.7589 21.557 24.0728 23.2433 21.9927 23.2433C19.9127 23.2433 18.2266 21.557 18.2266 19.4771C18.2266 17.3971 19.9127 15.7109 21.9927 15.7109ZM21.9927 17.0919C21.7154 17.0919 21.4906 17.3167 21.4906 17.5941V18.9749H20.1096C19.8323 18.975 19.6075 19.1998 19.6074 19.4771C19.6074 19.7545 19.8323 19.9793 20.1096 19.9793H21.4906V21.3602C21.4906 21.6375 21.7154 21.8624 21.9927 21.8624C22.2701 21.8623 22.4949 21.6375 22.4949 21.3602V19.9793H23.8758C24.1531 19.9793 24.378 19.7545 24.378 19.4771C24.378 19.1998 24.1531 18.9749 23.8758 18.9749H22.4949V17.5941C22.4949 17.3167 22.2701 17.0919 21.9927 17.0919Z" fill="#5733FF" />
							<path fillRule="evenodd" clipRule="evenodd" d="M38.4 0C43.7019 0 48 4.29806 48 9.6V38.4C48 43.7019 43.7019 48 38.4 48H9.6C4.29806 48 0 43.7019 0 38.4V9.6C0 4.29806 4.29806 2.35646e-07 9.6 0H38.4ZM12.2481 10.944C8.06128 10.9441 4.66725 14.9909 4.66725 19.9828V28.0172C4.66725 33.0091 8.06128 37.056 12.2481 37.056H23.1983C27.3852 37.056 30.7792 33.0091 30.7792 28.0172V19.9828C30.7792 14.9909 27.3852 10.944 23.1983 10.944H12.2481ZM38.0604 10.944C35.1485 10.944 32.7878 13.8667 32.7878 17.472V30.528C32.7878 34.1333 35.1485 37.056 38.0604 37.056C40.9724 37.056 43.3332 34.1334 43.3332 30.528V17.472C43.3332 13.8667 40.9724 10.944 38.0604 10.944Z" fill="#5733FF" />
						</g>
						<defs>
							<clipPath id="clip0_cf7m_banner">
								<rect width="48" height="48" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</div>
				<div className="dcs-v3-banner__content">
					<p className="dcs-v3-banner__title">
						{__('Welcome to CF7 Mate', 'cf7-styler-for-divi')}{' '}
						<span className="dcs-v3-banner__ver">v3.0.0</span>
					</p>
					<p className="dcs-v3-banner__text">
						{__(
							'Same plugin, new name. We’ve rebranded from “CF7 Styler for Divi” to CF7 Mate — everything works the same.',
							'cf7-styler-for-divi'
						)}
					</p>
				</div>
				<button
					type="button"
					className="dcs-v3-banner__dismiss"
					onClick={handleDismiss}
					disabled={dismissing}
					aria-label={__('Dismiss', 'cf7-styler-for-divi')}
				>
					{dismissing
						? __('…', 'cf7-styler-for-divi')
						: __('Got it', 'cf7-styler-for-divi')}
				</button>
			</div>
		</div>
	);
};

// Rebrand popup – full-screen modal after plugin update (not part of onboarding)
const RebrandModal = ({ onDismiss }) => {
	const [dismissing, setDismissing] = useState(false);

	const handleDismiss = () => {
		const ajaxUrl =
			typeof dcsCF7Styler !== 'undefined' ? dcsCF7Styler.ajax_url : '';
		const nonce =
			typeof dcsCF7Styler !== 'undefined'
				? dcsCF7Styler.dismiss_rebrand_nonce
				: '';
		if (!ajaxUrl || !nonce) {
			if (onDismiss) onDismiss();
			return;
		}
		setDismissing(true);
		const formData = new FormData();
		formData.append('action', 'cf7m_dismiss_rebrand');
		formData.append('nonce', nonce);
		fetch(ajaxUrl, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
		})
			.then(() => {
				if (onDismiss) onDismiss();
			})
			.catch(() => setDismissing(false))
			.finally(() => setDismissing(false));
	};

	return (
		<div
			className="dcs-rebrand-overlay"
			role="dialog"
			aria-modal="true"
			aria-label={__('CF7 Mate welcome', 'cf7-styler-for-divi')}
			onClick={(e) => {
				if (e.target === e.currentTarget) handleDismiss();
			}}
		>
			<div className="dcs-rebrand-modal" onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					className="dcs-rebrand-modal__close"
					onClick={handleDismiss}
					aria-label={__('Close', 'cf7-styler-for-divi')}
				>
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
					<p className="dcs-rebrand-modal__tagline">
						{__('Your complete Contact Form 7 companion for Divi', 'cf7-styler-for-divi')}
					</p>
					<div className="dcs-rebrand-modal__divider">
						<span>{__('What\'s new', 'cf7-styler-for-divi')}</span>
					</div>
					<ul className="dcs-rebrand-modal__list">
						<li>{__('Same plugin, new name — CF7 Styler is now CF7 Mate', 'cf7-styler-for-divi')}</li>
						<li>{__('All settings preserved — your forms work exactly the same', 'cf7-styler-for-divi')}</li>
						<li>{__('More features in pro — entries, ratings, multi-step & more', 'cf7-styler-for-divi')}</li>
					</ul>
					<button
						type="button"
						className="dcs-rebrand-modal__cta"
						onClick={handleDismiss}
						disabled={dismissing}
					>
						{dismissing ? __('…', 'cf7-styler-for-divi') : __('Got it', 'cf7-styler-for-divi')}
					</button>
				</div>
			</div>
		</div>
	);
};

// Header: Logo | Dashboard, Modules, Entries | Version, Docs icon, Pro icon (if no pro)
const Header = ({ isPro, showEntries, currentView }) => {
	const entriesOnlyPage =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	const cf7AdminUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.cf7_admin_url
			? dcsCF7Styler.cf7_admin_url
			: 'admin.php?page=wpcf7';
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined'
			? dcsCF7Styler.pricing_url
			: '/wp-admin/admin.php?page=cf7-mate-pricing';
	const version =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.version
			? dcsCF7Styler.version
			: '3.0.0';
	const dashboardUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dashboard_url
			? dcsCF7Styler.dashboard_url
			: 'admin.php?page=cf7-mate-dashboard';
	const modulesUrl = `${dashboardUrl}#/features`;
	const entriesUrl = `${dashboardUrl}#/entries`;

	const isDashboard = currentView === 'dashboard';
	const isModules = currentView === 'features';
	const isEntries = currentView === 'entries';
	const isAiSettings = currentView === 'ai-settings';

	return (
		<header className="dcs-admin__header">
			<div className="dcs-admin__header-left">
				<div className="dcs-admin__logo">
					<svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0_cf7m_header)">
							<path fillRule="evenodd" clipRule="evenodd" d="M21.9927 15.7109C24.0728 15.711 25.7588 17.3972 25.7589 19.4771C25.7589 21.557 24.0728 23.2433 21.9927 23.2433C19.9127 23.2433 18.2266 21.557 18.2266 19.4771C18.2266 17.3971 19.9127 15.7109 21.9927 15.7109ZM21.9927 17.0919C21.7154 17.0919 21.4906 17.3167 21.4906 17.5941V18.9749H20.1096C19.8323 18.975 19.6075 19.1998 19.6074 19.4771C19.6074 19.7545 19.8323 19.9793 20.1096 19.9793H21.4906V21.3602C21.4906 21.6375 21.7154 21.8624 21.9927 21.8624C22.2701 21.8623 22.4949 21.6375 22.4949 21.3602V19.9793H23.8758C24.1531 19.9793 24.378 19.7545 24.378 19.4771C24.378 19.1998 24.1531 18.9749 23.8758 18.9749H22.4949V17.5941C22.4949 17.3167 22.2701 17.0919 21.9927 17.0919Z" fill="#5733FF" />
							<path fillRule="evenodd" clipRule="evenodd" d="M38.4 0C43.7019 0 48 4.29806 48 9.6V38.4C48 43.7019 43.7019 48 38.4 48H9.6C4.29806 48 0 43.7019 0 38.4V9.6C0 4.29806 4.29806 2.35646e-07 9.6 0H38.4ZM12.2481 10.944C8.06128 10.9441 4.66725 14.9909 4.66725 19.9828V28.0172C4.66725 33.0091 8.06128 37.056 12.2481 37.056H23.1983C27.3852 37.056 30.7792 33.0091 30.7792 28.0172V19.9828C30.7792 14.9909 27.3852 10.944 23.1983 10.944H12.2481ZM38.0604 10.944C35.1485 10.944 32.7878 13.8667 32.7878 17.472V30.528C32.7878 34.1333 35.1485 37.056 38.0604 37.056C40.9724 37.056 43.3332 34.1334 43.3332 30.528V17.472C43.3332 13.8667 40.9724 10.944 38.0604 10.944Z" fill="#5733FF" />
						</g>
						<defs>
							<clipPath id="clip0_cf7m_header">
								<rect width="48" height="48" fill="white" />
							</clipPath>
						</defs>
					</svg>
					<h1 className="dcs-admin__title" style={{ fontWeight: 700 }}>
						{__('CF7 Mate', 'cf7-styler-for-divi')}
			</h1>
		</div>
		<nav className="dcs-admin__nav">
					{entriesOnlyPage && isEntries ? (
			<a
							href={cf7AdminUrl}
				className="dcs-admin__nav-link"
							aria-label={__(
								'Back to Contact Form 7',
								'cf7-styler-for-divi'
							)}
						>
							<span className="dcs-admin__nav-text">
								{__('Contact Form 7', 'cf7-styler-for-divi')}
							</span>
						</a>
					) : (
						<>
							<a
								href={dashboardUrl + '#/'}
								className={`dcs-admin__nav-link ${isDashboard ? 'dcs-admin__nav-link--active' : ''}`}
								aria-label={__('Dashboard', 'cf7-styler-for-divi')}
							>
								<span className="dcs-admin__nav-text">
									{__('Dashboard', 'cf7-styler-for-divi')}
								</span>
							</a>
							<a
								href={modulesUrl}
								className={`dcs-admin__nav-link ${isModules ? 'dcs-admin__nav-link--active' : ''}`}
								aria-label={__('Modules', 'cf7-styler-for-divi')}
							>
								<span className="dcs-admin__nav-text">
									{__('Modules', 'cf7-styler-for-divi')}
								</span>
							</a>
							{isPro && !entriesOnlyPage && (
								<a
									href={dashboardUrl + '#/ai-settings'}
									className={`dcs-admin__nav-link ${isAiSettings ? 'dcs-admin__nav-link--active' : ''}`}
									aria-label={__('AI Settings', 'cf7-styler-for-divi')}
								>
									<span className="dcs-admin__nav-text">
										{__('AI Settings', 'cf7-styler-for-divi')}
									</span>
								</a>
							)}
							{showEntries && !entriesOnlyPage && (
								<a
									href={entriesUrl}
									className={`dcs-admin__nav-link ${isEntries ? 'dcs-admin__nav-link--active' : ''}`}
									aria-label={__(
										'Form Entries',
										'cf7-styler-for-divi'
									)}
								>
									<span className="dcs-admin__nav-text">
										{__('Entries', 'cf7-styler-for-divi')}
									</span>
								</a>
							)}
						</>
					)}
		</nav>
			</div>
			<div className="dcs-admin__header-right">
				<span className="dcs-admin__version-right" aria-hidden="true">
					v{version}
				</span>
				<a
					href="https://divipeople.com/docs/cf7-mate/"
					target="_blank"
					rel="noopener noreferrer"
					className="dcs-admin__nav-link dcs-admin__nav-link--docs"
					aria-label={__('Documentation', 'cf7-styler-for-divi')}
				>
					<DocsIcon />
				</a>
				{!isPro && (
					<a
						href={pricingUrl}
						className="dcs-admin__nav-link dcs-admin__nav-link--pro"
						aria-label={__('Upgrade to Pro', 'cf7-styler-for-divi')}
					>
						<CrownIconNav />
					</a>
				)}
			</div>
	</header>
);
};

// AI Provider Settings view (Pro) – uses same REST API as legacy ai-settings page.
const AI_PLATFORM_INFO = {
	openai: { company: 'OpenAI', desc: __('Best for general-purpose form generation. Fast, accurate, and cost-effective.', 'cf7-styler-for-divi'), color: '#10a37f' },
	anthropic: { company: 'Anthropic', desc: __('Excellent at structured output and following templates precisely.', 'cf7-styler-for-divi'), color: '#d97706' },
	grok: { company: 'xAI', desc: __('Real-time knowledge AI by xAI. Good balance of speed and quality.', 'cf7-styler-for-divi'), color: '#000000' },
	kimi: { company: 'Moonshot AI', desc: __('Great for multilingual forms. Popular choice for Chinese users.', 'cf7-styler-for-divi'), color: '#6366f1' },
};

const AICheckIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
		<polyline points="20 6 9 17 4 12" />
	</svg>
);
const AITrashIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
	</svg>
);
const AILinkIcon = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
	</svg>
);

const AISettingsView = () => {
	const providers = (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.aiProviders) || {};
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [testing, setTesting] = useState(false);
	const [notice, setNotice] = useState(null);
	const [settings, setSettings] = useState({
		provider: 'openai',
		openai_key: '',
		openai_model: 'gpt-4o-mini',
		anthropic_key: '',
		anthropic_model: 'claude-sonnet-4-20250514',
		grok_key: '',
		grok_model: 'grok-3-mini',
		kimi_key: '',
		kimi_model: 'moonshot-v1-32k',
	});

	useEffect(() => {
		const load = async () => {
			try {
				const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
				setSettings((prev) => ({ ...prev, ...data }));
			} catch (err) {
				setNotice({ type: 'error', message: err.message || __('Failed to load settings.', 'cf7-styler-for-divi') });
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const showNotice = (type, message) => {
		setNotice({ type, message });
		if (type === 'success') setTimeout(() => setNotice(null), 3000);
	};

	const saveSettings = async () => {
		setSaving(true);
		setNotice(null);
		try {
			await apiFetch({ path: '/cf7-styler/v1/ai-settings', method: 'POST', data: settings });
			showNotice('success', __('Settings saved!', 'cf7-styler-for-divi'));
			const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
			setSettings((prev) => ({ ...prev, ...data }));
		} catch (err) {
			showNotice('error', err.message || __('Save failed.', 'cf7-styler-for-divi'));
		} finally {
			setSaving(false);
		}
	};

	const testConnection = async () => {
		setTesting(true);
		setNotice(null);
		try {
			const result = await apiFetch({
				path: '/cf7-styler/v1/ai-settings/test',
				method: 'POST',
				data: { provider: settings.provider },
			});
			showNotice(result.success ? 'success' : 'error', result.message || (result.success ? __('Connection OK.', 'cf7-styler-for-divi') : __('Test failed.', 'cf7-styler-for-divi')));
		} catch (err) {
			showNotice('error', err.message || __('Test failed.', 'cf7-styler-for-divi'));
		} finally {
			setTesting(false);
		}
	};

	const deleteKey = async () => {
		const keyField = `${settings.provider}_key`;
		setSaving(true);
		try {
			await apiFetch({
				path: '/cf7-styler/v1/ai-settings',
				method: 'POST',
				data: { ...settings, [keyField]: '' },
			});
			showNotice('success', __('API key removed.', 'cf7-styler-for-divi'));
			const data = await apiFetch({ path: '/cf7-styler/v1/ai-settings' });
			setSettings((prev) => ({ ...prev, ...data }));
		} catch (err) {
			showNotice('error', err.message || __('Failed to remove key.', 'cf7-styler-for-divi'));
		} finally {
			setSaving(false);
		}
	};

	const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

	if (Object.keys(providers).length === 0) {
		return (
			<div className="dcs-card">
				<div className="dcs-card__header">
					<p className="dcs-card__desc">
						{__('Enable the AI Form Generator module in Modules to configure AI providers.', 'cf7-styler-for-divi')}
					</p>
				</div>
			</div>
		);
	}

	const provider = providers[settings.provider] || {};
	const info = AI_PLATFORM_INFO[settings.provider] || {};
	const keyField = `${settings.provider}_key`;
	const modelField = `${settings.provider}_model`;
	const isKeySet = settings[`${keyField}_set`];

	if (loading) {
		return (
			<div className="dcs-admin__content">
				<div className="dcs-loading">{__('Loading...', 'cf7-styler-for-divi')}</div>
			</div>
		);
	}

	return (
		<>
			<div className="cf7m-ai__page-header">
				<h2 className="dcs-admin__content-title">{__('AI Provider Settings', 'cf7-styler-for-divi')}</h2>
				<p className="dcs-card__desc">{__('Configure AI for form generation in the Contact Form 7 editor.', 'cf7-styler-for-divi')}</p>
			</div>
			{notice && (
				<div className={`dcs-toast dcs-toast--${notice.type}`}>
					<span>{notice.message}</span>
				</div>
			)}
			<div className="cf7m-ai__grid">
				<div className="dcs-card">
					<div className="dcs-card__header">
						<h2 className="dcs-card__title">{__('Configuration', 'cf7-styler-for-divi')}</h2>
					</div>
					<div className="cf7m-ai__form">
						<div className="cf7m-ai__field">
							<label>{__('AI Provider', 'cf7-styler-for-divi')}</label>
							<select
								value={settings.provider}
								onChange={(e) => update('provider', e.target.value)}
							>
								{Object.entries(providers).map(([key, cfg]) => (
									<option key={key} value={key}>{cfg.name}</option>
								))}
							</select>
						</div>
						<div className="cf7m-ai__field">
							<label>{__('Model', 'cf7-styler-for-divi')}</label>
							<select
								value={settings[modelField] || ''}
								onChange={(e) => update(modelField, e.target.value)}
							>
								{Object.entries(provider.models || {}).map(([value, label]) => (
									<option key={value} value={value}>{label}</option>
								))}
							</select>
						</div>
						<div className="cf7m-ai__field">
							<label>
								{__('API Key', 'cf7-styler-for-divi')}
								{isKeySet && (
									<span className="cf7m-ai__badge">
										<AICheckIcon /> {__('Configured', 'cf7-styler-for-divi')}
									</span>
								)}
							</label>
							{isKeySet ? (
								<div className="cf7m-ai__key-row">
									<code>{settings[`${keyField}_masked`] || '••••••••'}</code>
									<button
										type="button"
										className="button cf7m-ai__btn--danger"
										onClick={deleteKey}
										disabled={saving}
									>
										<AITrashIcon /> {__('Remove', 'cf7-styler-for-divi')}
									</button>
								</div>
							) : (
								<div className="cf7m-ai__key-row">
									<input
										type="password"
										value={settings[keyField] || ''}
										onChange={(e) => update(keyField, e.target.value)}
										placeholder={provider.key_placeholder || 'sk-...'}
									/>
									{provider.key_url && (
										<a
											href={provider.key_url}
											target="_blank"
											rel="noopener noreferrer"
											className="button"
										>
											<AILinkIcon /> {__('Get Key', 'cf7-styler-for-divi')}
										</a>
									)}
								</div>
							)}
						</div>
						<div className="cf7m-ai__actions">
							<button
								type="button"
								className="button button-primary"
								onClick={saveSettings}
								disabled={saving || (isKeySet && !settings[keyField])}
							>
								{saving ? __('Saving...', 'cf7-styler-for-divi') : __('Save Settings', 'cf7-styler-for-divi')}
							</button>
							{isKeySet && (
								<button
									type="button"
									className="button"
									onClick={testConnection}
									disabled={testing}
								>
									{testing ? __('Testing...', 'cf7-styler-for-divi') : __('Test Connection', 'cf7-styler-for-divi')}
								</button>
							)}
						</div>
					</div>
				</div>
				<div className="dcs-card cf7m-ai__info-card">
					<div className="cf7m-ai__info-header">
						<div className="cf7m-ai__info-icon" style={{ background: info.color || '#5733ff' }}>
							{(provider.name || 'A').charAt(0)}
						</div>
						<div>
							<h3>{provider.name || 'Provider'}</h3>
							<span className="cf7m-ai__info-company">
								{__('by', 'cf7-styler-for-divi')} {info.company || 'Unknown'}
							</span>
						</div>
					</div>
					<p className="cf7m-ai__info-desc">{info.desc || ''}</p>
					{provider.key_url && (
						<a
							href={provider.key_url}
							target="_blank"
							rel="noopener noreferrer"
							className="cf7m-ai__info-link"
						>
							{__('Get API Key', 'cf7-styler-for-divi')} →
						</a>
					)}
				</div>
			</div>
		</>
	);
};

// Toggle Switch Component
const Toggle = ({ checked, onChange, disabled }) => (
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		disabled={disabled}
		onClick={() => !disabled && onChange(!checked)}
		className={`dcs-toggle ${checked ? 'dcs-toggle--active' : ''} ${disabled ? 'dcs-toggle--disabled' : ''}`}
	>
		<span className="dcs-toggle__track">
			<span className="dcs-toggle__thumb" />
		</span>
	</button>
);

// Feature Card Component – icon + name + description + toggle
const FeatureCard = ({ feature, enabled, isPro, onToggle, saving }) => {
	const isProLocked = feature.isPro && !isPro;
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined'
			? dcsCF7Styler.pricing_url
			: '/wp-admin/admin.php?page=cf7-mate-pricing';
	const IconComponent = FEATURE_ICONS[feature.icon] || FEATURE_ICONS.module;

	const handleUpgrade = () => {
		window.location.href = pricingUrl;
	};

	return (
		<div
			className={`dcs-feature ${feature.isPro ? 'dcs-feature--pro' : ''} ${isProLocked ? 'dcs-feature--locked' : ''}`}
		>
			<div className="dcs-feature__icon" aria-hidden="true">
				<IconComponent />
			</div>
			<div className="dcs-feature__name-wrap">
				<span className="dcs-feature__name">
					{feature.name}
					{feature.isPro && !isPro && (
						<span
							className="dcs-feature__badge"
							aria-label={__('Pro', 'cf7-styler-for-divi')}
						>
							<CrownIcon />
						</span>
					)}
				</span>
				<p className="dcs-feature__desc">{feature.description}</p>
			</div>
			<div className="dcs-feature__toggle">
				{isProLocked ? (
					<button
						type="button"
						onClick={handleUpgrade}
						className="dcs-feature__upgrade"
					>
						{__('Upgrade', 'cf7-styler-for-divi')}
					</button>
				) : (
					<Toggle
						checked={enabled}
						onChange={(val) => onToggle(feature.id, val)}
						disabled={saving}
					/>
				)}
			</div>
		</div>
	);
};

// Features Section Component – one container, simple small cards
const FeaturesSection = ({ features, isPro, onToggle, saving }) => {
	const freeFeatures = FEATURES.filter((f) => !f.isPro);
	const proFeatures = FEATURES.filter((f) => f.isPro);

	return (
		<div className="dcs-modules-page">
			<div className="dcs-card dcs-modules-card">
				<div className="dcs-modules-card__header">
					<h2 className="dcs-modules-card__title">
						{__('Modules', 'cf7-styler-for-divi')}
			</h2>
					<p className="dcs-modules-card__desc">
						{__('Enable or disable modules. Changes apply immediately.', 'cf7-styler-for-divi')}
			</p>
		</div>
				<div className="dcs-features-grid">
					{freeFeatures.map((feature) => (
						<FeatureCard
							key={feature.id}
							feature={feature}
							enabled={features[feature.id]}
							isPro={isPro}
							onToggle={onToggle}
							saving={saving}
						/>
					))}
					{proFeatures.map((feature) => (
				<FeatureCard
					key={feature.id}
					feature={feature}
					enabled={features[feature.id]}
					isPro={isPro}
					onToggle={onToggle}
					saving={saving}
				/>
			))}
				</div>
		</div>
	</div>
);
};

// Dashboard stats and quick links (like lean-forms Dashboard)
const DashboardView = ({
	stats,
	loading,
	showEntries,
	modulesUrl,
	dashboardUrl,
}) => {
	const cf7AdminUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.cf7_admin_url
			? dcsCF7Styler.cf7_admin_url
			: 'admin.php?page=wpcf7';

	if (loading) {
		return (
	<div className="dcs-card">
				<div className="dcs-card__header">
					<p className="dcs-card__desc">
						{__('Loading…', 'cf7-styler-for-divi')}
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="dcs-dashboard-stats">
				<div className="dcs-stat-card">
					<span
						className="dcs-stat-card__icon dcs-stat-card__icon--entries"
						aria-hidden="true"
					>
						<FeatureIconDatabase />
					</span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">
							{__('Total Entries', 'cf7-styler-for-divi')}
						</span>
						<span className="dcs-stat-card__value">
							{stats.total_entries}
						</span>
					</div>
				</div>
				<div className="dcs-stat-card">
					<span
						className="dcs-stat-card__icon dcs-stat-card__icon--today"
						aria-hidden="true"
					>
						<FeatureIconStar />
					</span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">
							{__('New Today', 'cf7-styler-for-divi')}
						</span>
						<span className="dcs-stat-card__value">
							{stats.new_today}
						</span>
					</div>
				</div>
				<div className="dcs-stat-card">
					<span
						className="dcs-stat-card__icon dcs-stat-card__icon--forms"
						aria-hidden="true"
					>
						<FeatureIconModule />
					</span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">
							{__('Total Forms', 'cf7-styler-for-divi')}
						</span>
						<span className="dcs-stat-card__value">
							{stats.total_forms}
						</span>
					</div>
				</div>
				<div className="dcs-stat-card">
					<span
						className="dcs-stat-card__icon dcs-stat-card__icon--features"
						aria-hidden="true"
					>
						<FeatureIconGrid />
					</span>
					<div className="dcs-stat-card__content">
						<span className="dcs-stat-card__label">
							{__('Active Modules', 'cf7-styler-for-divi')}
						</span>
						<span className="dcs-stat-card__value">
							{stats.enabled_features}
						</span>
					</div>
				</div>
			</div>

			<div className="dcs-card dcs-quick-actions">
		<div className="dcs-card__header">
			<h2 className="dcs-card__title">
						{__('Quick Actions', 'cf7-styler-for-divi')}
			</h2>
		</div>
				<div className="dcs-quick-actions__grid">
					{showEntries && (
						<a
							href={dashboardUrl + '#/entries'}
							className="dcs-quick-action"
						>
							<span className="dcs-quick-action__icon">
								<FeatureIconDatabase />
							</span>
							<div className="dcs-quick-action__text">
								<span className="dcs-quick-action__title">
									{__('View Entries', 'cf7-styler-for-divi')}
								</span>
								<span className="dcs-quick-action__desc">
									{__(
										'Manage form submissions',
										'cf7-styler-for-divi'
									)}
								</span>
							</div>
						</a>
					)}
					<a
						href={
							(cf7AdminUrl &&
								cf7AdminUrl.replace(
									'page=wpcf7',
									'page=wpcf7-new'
								)) ||
							'admin.php?page=wpcf7-new'
						}
						className="dcs-quick-action"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span className="dcs-quick-action__icon">
							<FeatureIconModule />
						</span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">
								{__('Create Form', 'cf7-styler-for-divi')}
							</span>
							<span className="dcs-quick-action__desc">
								{__(
									'Add new contact form',
									'cf7-styler-for-divi'
								)}
							</span>
						</div>
					</a>
					<a
						href={cf7AdminUrl}
						className="dcs-quick-action"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span className="dcs-quick-action__icon">
							<FeatureIconColumns />
						</span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">
								{__('Manage Forms', 'cf7-styler-for-divi')}
							</span>
							<span className="dcs-quick-action__desc">
								{__(
									'Edit existing forms',
									'cf7-styler-for-divi'
								)}
							</span>
	</div>
					</a>
					<a href={modulesUrl} className="dcs-quick-action">
						<span className="dcs-quick-action__icon">
							<FeatureIconGrid />
						</span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">
								{__('Manage Modules', 'cf7-styler-for-divi')}
							</span>
							<span className="dcs-quick-action__desc">
								{__(
									'Enable or disable modules',
									'cf7-styler-for-divi'
								)}
							</span>
						</div>
					</a>
					<a
						href={dashboardUrl + '#/ai-settings'}
						className="dcs-quick-action"
					>
						<span className="dcs-quick-action__icon">
							<FeatureIconAI />
						</span>
						<div className="dcs-quick-action__text">
							<span className="dcs-quick-action__title">
								{__('AI Provider', 'cf7-styler-for-divi')}
							</span>
							<span className="dcs-quick-action__desc">
								{__(
									'Configure AI form generator',
									'cf7-styler-for-divi'
								)}
							</span>
						</div>
					</a>
				</div>
			</div>
		</>
	);
};

// How To Section - Resources for learning and support
const HowToSection = () => (
	<div className="dcs-howto">
		<div className="dcs-howto__header">
			<h2 className="dcs-howto__title">
				{__('Resources & Support', 'cf7-styler-for-divi')}
			</h2>
			<p className="dcs-howto__desc">
				{__('Everything you need to get started and get help.', 'cf7-styler-for-divi')}
			</p>
		</div>
		<div className="dcs-howto__grid">
			<a
				href="https://divipeople.com/docs/cf7-mate/"
				target="_blank"
				rel="noopener noreferrer"
				className="dcs-howto__card"
			>
				<div className="dcs-howto__icon dcs-howto__icon--docs">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<div className="dcs-howto__content">
					<h3 className="dcs-howto__card-title">{__('Documentation', 'cf7-styler-for-divi')}</h3>
					<p className="dcs-howto__card-desc">{__('Step-by-step guides and feature explanations', 'cf7-styler-for-divi')}</p>
				</div>
				<span className="dcs-howto__arrow">→</span>
			</a>
			<a
				href="https://www.youtube.com/@divipeople"
				target="_blank"
				rel="noopener noreferrer"
				className="dcs-howto__card"
			>
				<div className="dcs-howto__icon dcs-howto__icon--video">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<div className="dcs-howto__content">
					<h3 className="dcs-howto__card-title">{__('Video Tutorials', 'cf7-styler-for-divi')}</h3>
					<p className="dcs-howto__card-desc">{__('Watch how-to videos on our YouTube channel', 'cf7-styler-for-divi')}</p>
				</div>
				<span className="dcs-howto__arrow">→</span>
			</a>
			<a
				href="https://divipeople.com/support/"
				target="_blank"
				rel="noopener noreferrer"
				className="dcs-howto__card"
			>
				<div className="dcs-howto__icon dcs-howto__icon--support">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<div className="dcs-howto__content">
					<h3 className="dcs-howto__card-title">{__('Get Support', 'cf7-styler-for-divi')}</h3>
					<p className="dcs-howto__card-desc">{__('Contact our team for technical assistance', 'cf7-styler-for-divi')}</p>
				</div>
				<span className="dcs-howto__arrow">→</span>
			</a>
		</div>
	</div>
);

// Plugins you might like – same layout as divi-google-reviews (grid of cards, Read more)
const PLUGINS_SUGGESTIONS = [
	{
		name: __('Divi Carousel Pro', 'cf7-styler-for-divi'),
		description: __(
			'Create stunning image, video & post carousels in Divi.',
			'cf7-styler-for-divi'
		),
		url: 'https://divipeople.com/divi-carousel-pro/',
	},
	{
		name: __('Divi Blog Pro', 'cf7-styler-for-divi'),
		description: __(
			'Advanced blog layouts and post grids for Divi theme.',
			'cf7-styler-for-divi'
		),
		url: 'https://divipeople.com/divi-blog-pro/',
	},
	{
		name: __('Divi Social Plus', 'cf7-styler-for-divi'),
		description: __(
			'Display social feeds and share buttons beautifully in Divi.',
			'cf7-styler-for-divi'
		),
		url: 'https://divipeople.com/divi-social-plus/',
	},
];

const PluginsYouMightLike = () => (
	<div className="dcs-plugins">
		<div className="dcs-plugins__header">
			<h2 className="dcs-plugins__title">
				{__('Plugins you might like', 'cf7-styler-for-divi')}
			</h2>
		</div>
		<div className="dcs-plugins__grid">
			{PLUGINS_SUGGESTIONS.map((plugin, index) => (
				<a
					key={index}
					href={plugin.url}
					target="_blank"
					rel="noopener noreferrer"
					className="dcs-plugin-card"
				>
					<h3 className="dcs-plugin-card__name">{plugin.name}</h3>
					<p className="dcs-plugin-card__desc">
						{plugin.description}
					</p>
					<span className="dcs-plugin-card__btn">
						{__('Read more', 'cf7-styler-for-divi')}
					</span>
				</a>
			))}
		</div>
	</div>
);

// Entries page – Pro dashboard view for form submissions (mirrors references/lean-forms Entries.jsx)
const EntriesPage = ({ onBack }) => {
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(null);
	const [statusFilter, setStatusFilter] = useState('all');
	const [formIdFilter, setFormIdFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedIds, setSelectedIds] = useState([]);
	const restUrl =
		typeof wp !== 'undefined' && wp.apiFetch
			? '/cf7-styler/v1/entries'
			: '';

	const fetchEntries = () => {
		if (!restUrl) return;
		const params = new URLSearchParams({ per_page: 50, page: 1 });
		if (statusFilter !== 'all') params.set('status', statusFilter);
		if (formIdFilter !== 'all') params.set('form_id', formIdFilter);
		if (searchTerm && searchTerm.trim())
			params.set('search', searchTerm.trim());
		setLoading(true);
		apiFetch({ path: `${restUrl}?${params}` })
			.then((r) => setEntries(r.items || []))
			.catch(() => setEntries([]))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchEntries();
	}, [restUrl, statusFilter, formIdFilter, searchTerm]);

	const exportUrl = restUrl
		? `${wp?.apiSettings?.root || ''}${restUrl}/export?per_page=500${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}${formIdFilter !== 'all' ? `&form_id=${formIdFilter}` : ''}${searchTerm && searchTerm.trim() ? `&search=${encodeURIComponent(searchTerm.trim())}` : ''}&_wpnonce=${wp?.apiSettings?.nonce || ''}`
		: '';

	const deleteOne = async (id) => {
		if (!window.confirm(__('Delete this entry?', 'cf7-styler-for-divi')))
			return;
		try {
			await apiFetch({
				path: `/cf7-styler/v1/entries/${id}`,
				method: 'DELETE',
			});
			setEntries((prev) => prev.filter((e) => e.id !== id));
			setSelected(null);
			setSelectedIds((prev) => prev.filter((x) => x !== id));
		} catch (e) {
			// ignore
		}
	};

	const updateStatus = async (id, status) => {
		try {
			await apiFetch({
				path: `/cf7-styler/v1/entries/${id}`,
				method: 'POST',
				data: { status },
			});
			setEntries((prev) =>
				prev.map((e) => (e.id === id ? { ...e, status } : e))
			);
			if (selected?.id === id)
				setSelected((s) => (s ? { ...s, status } : null));
		} catch (e) {
			// ignore
		}
	};

	const bulkDelete = async () => {
		if (
			!selectedIds.length ||
			!window.confirm(
				__('Delete selected entries?', 'cf7-styler-for-divi')
			)
		)
			return;
		try {
			await apiFetch({
				path: '/cf7-styler/v1/entries/bulk-delete',
				method: 'DELETE',
				data: { ids: selectedIds },
			});
			setEntries((prev) =>
				prev.filter((e) => !selectedIds.includes(e.id))
			);
			setSelectedIds([]);
			setSelected(null);
		} catch (e) {
			// ignore
		}
	};

	const toggleSelect = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};
	const toggleSelectAll = () => {
		if (selectedIds.length >= (entries || []).length) {
			setSelectedIds([]);
		} else {
			setSelectedIds((entries || []).map((e) => e.id));
		}
	};

	const forms = [
		...new Map(
			(entries || []).map((e) => [
				e.form_id,
				{ id: e.form_id, title: e.form_title_with_id || e.form_title },
			])
		).values(),
	];

	return (
		<div className="dcs-card">
			<div
				className="dcs-card__header"
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '12px',
				}}
			>
				<div>
					<h2 className="dcs-card__title">
						{__('Form Entries', 'cf7-styler-for-divi')}
					</h2>
					<p className="dcs-card__desc">
						{__(
							'View and manage form submissions.',
							'cf7-styler-for-divi'
						)}
					</p>
				</div>
				<div
					style={{
						display: 'flex',
						gap: '8px',
						alignItems: 'center',
						flexWrap: 'wrap',
					}}
				>
					<input
						type="search"
						placeholder={__(
							'Search entries…',
							'cf7-styler-for-divi'
						)}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{
							padding: '6px 10px',
							borderRadius: '6px',
							border: '1px solid var(--dcs-border)',
							minWidth: '160px',
						}}
					/>
					{selectedIds.length > 0 && (
						<button
							type="button"
							className="dcs-entries-btn dcs-entries-btn--danger"
							style={{ padding: '6px 12px', fontSize: '12px' }}
							onClick={bulkDelete}
						>
							{__('Delete selected', 'cf7-styler-for-divi')} (
							{selectedIds.length})
						</button>
					)}
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="dcs-entries-filter"
						style={{
							padding: '6px 10px',
							borderRadius: '6px',
							border: '1px solid var(--dcs-border)',
						}}
					>
						<option value="all">
							{__('All statuses', 'cf7-styler-for-divi')}
						</option>
						<option value="new">
							{__('New', 'cf7-styler-for-divi')}
						</option>
						<option value="read">
							{__('Read', 'cf7-styler-for-divi')}
						</option>
						<option value="spam">
							{__('Spam', 'cf7-styler-for-divi')}
						</option>
					</select>
					<select
						value={formIdFilter}
						onChange={(e) => setFormIdFilter(e.target.value)}
						className="dcs-entries-filter"
						style={{
							padding: '6px 10px',
							borderRadius: '6px',
							border: '1px solid var(--dcs-border)',
						}}
					>
						<option value="all">
							{__('All forms', 'cf7-styler-for-divi')}
						</option>
						{forms.map((f) => (
							<option key={f.id} value={f.id}>
								{f.title}
							</option>
						))}
					</select>
					{exportUrl && (
						<a
							href={exportUrl}
							className="dcs-admin__nav-link"
							style={{
								padding: '6px 12px',
								borderRadius: '6px',
								background: 'var(--dcs-bg)',
							}}
						>
							{__('Export CSV', 'cf7-styler-for-divi')}
						</a>
					)}
				</div>
			</div>
			{loading ? (
				<div
					style={{
						padding: '24px',
						textAlign: 'center',
						color: 'var(--dcs-text-muted)',
					}}
				>
					{__('Loading...', 'cf7-styler-for-divi')}
				</div>
			) : !entries.length ? (
				<div
					style={{
						padding: '24px',
						textAlign: 'center',
						color: 'var(--dcs-text-muted)',
					}}
				>
					{__('No entries yet.', 'cf7-styler-for-divi')}
				</div>
			) : (
				<div
					className="dcs-entries-table-wrap"
					style={{ overflowX: 'auto' }}
				>
					<table
						className="dcs-entries-table"
						style={{ width: '100%', borderCollapse: 'collapse' }}
					>
						<thead>
							<tr
								style={{
									borderBottom: '1px solid var(--dcs-border)',
								}}
							>
								<th
									style={{
										width: '36px',
										padding: '10px 8px',
										fontSize: '12px',
										color: 'var(--dcs-text-muted)',
									}}
								>
									<input
										type="checkbox"
										checked={
											entries.length > 0 &&
											selectedIds.length >= entries.length
										}
										onChange={toggleSelectAll}
										aria-label={__(
											'Select all',
											'cf7-styler-for-divi'
										)}
									/>
								</th>
								<th
									style={{
										textAlign: 'left',
										padding: '10px 12px',
										fontSize: '12px',
										color: 'var(--dcs-text-muted)',
									}}
								>
									{__('Form', 'cf7-styler-for-divi')}
								</th>
								<th
									style={{
										textAlign: 'left',
										padding: '10px 12px',
										fontSize: '12px',
										color: 'var(--dcs-text-muted)',
									}}
								>
									{__('Status', 'cf7-styler-for-divi')}
								</th>
								<th
									style={{
										textAlign: 'left',
										padding: '10px 12px',
										fontSize: '12px',
										color: 'var(--dcs-text-muted)',
									}}
								>
									{__('Date', 'cf7-styler-for-divi')}
								</th>
								<th
									style={{
										textAlign: 'right',
										padding: '10px 12px',
										fontSize: '12px',
										color: 'var(--dcs-text-muted)',
									}}
								>
									{__('Actions', 'cf7-styler-for-divi')}
								</th>
							</tr>
						</thead>
						<tbody>
							{entries.map((e) => (
								<tr
									key={e.id}
									style={{
										borderBottom:
											'1px solid var(--dcs-border)',
									}}
								>
									<td style={{ padding: '10px 8px' }}>
										<input
											type="checkbox"
											checked={selectedIds.includes(e.id)}
											onChange={() => toggleSelect(e.id)}
											aria-label={__(
												'Select entry',
												'cf7-styler-for-divi'
											)}
										/>
									</td>
									<td
										style={{
											padding: '10px 12px',
											fontSize: '13px',
										}}
									>
										{e.form_title_with_id || e.form_title}
									</td>
									<td
										style={{
											padding: '10px 12px',
											fontSize: '13px',
										}}
									>
										<span
											className={`dcs-entry-status dcs-entry-status--${e.status}`}
											style={{
												padding: '2px 8px',
												borderRadius: '4px',
												fontSize: '12px',
												background:
													e.status === 'new'
														? 'rgba(87,51,255,0.1)'
														: e.status === 'read'
															? 'var(--dcs-bg)'
															: 'rgba(239,68,68,0.1)',
												color:
													e.status === 'new'
														? 'var(--dcs-primary)'
														: e.status === 'spam'
															? 'var(--dcs-danger)'
															: 'var(--dcs-text-muted)',
											}}
										>
											{e.status}
										</span>
									</td>
									<td
										style={{
											padding: '10px 12px',
											fontSize: '13px',
											color: 'var(--dcs-text-muted)',
										}}
									>
										{e.created}
									</td>
									<td
										style={{
											padding: '10px 12px',
											textAlign: 'right',
										}}
									>
										<button
											type="button"
											className="dcs-entries-btn"
											style={{
												marginRight: '6px',
												padding: '4px 10px',
												fontSize: '12px',
											}}
											onClick={() => {
												setSelected(
													selected?.id === e.id
														? null
														: e
												);
												if (e.status === 'new')
													updateStatus(e.id, 'read');
											}}
										>
											{__('View', 'cf7-styler-for-divi')}
										</button>
										{e.status === 'new' && (
											<button
												type="button"
												className="dcs-entries-btn"
												style={{
													marginRight: '6px',
													padding: '4px 10px',
													fontSize: '12px',
												}}
												onClick={() =>
													updateStatus(e.id, 'read')
												}
											>
												{__(
													'Mark read',
													'cf7-styler-for-divi'
												)}
											</button>
										)}
										{e.status !== 'spam' && (
											<button
												type="button"
												className="dcs-entries-btn"
												style={{
													marginRight: '6px',
													padding: '4px 10px',
													fontSize: '12px',
												}}
												onClick={() =>
													updateStatus(e.id, 'spam')
												}
											>
												{__(
													'Spam',
													'cf7-styler-for-divi'
												)}
											</button>
										)}
										<button
											type="button"
											className="dcs-entries-btn dcs-entries-btn--danger"
											style={{
												padding: '4px 10px',
												fontSize: '12px',
											}}
											onClick={() => deleteOne(e.id)}
										>
											{__(
												'Delete',
												'cf7-styler-for-divi'
											)}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{selected && selected.id && (
				<div
					className="dcs-entries-modal"
					style={{
						position: 'fixed',
						inset: 0,
						background: 'rgba(0,0,0,0.4)',
						zIndex: 100000,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
					}}
					onClick={() => setSelected(null)}
				>
					<div
						style={{
							background: '#fff',
							borderRadius: '12px',
							maxWidth: '560px',
							width: '100%',
							maxHeight: '80vh',
							overflow: 'auto',
							padding: '20px',
							boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
						}}
						onClick={(ev) => ev.stopPropagation()}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '16px',
							}}
						>
							<h3 style={{ margin: 0 }}>
								{__('Entry', 'cf7-styler-for-divi')} #
								{selected.id}
							</h3>
							<button
								type="button"
								onClick={() => setSelected(null)}
								style={{ padding: '4px 8px' }}
							>
								{__('Close', 'cf7-styler-for-divi')}
							</button>
						</div>
						<p
							style={{
								margin: '0 0 12px',
								fontSize: '13px',
								color: 'var(--dcs-text-muted)',
							}}
						>
							{selected.form_title} · {selected.created}
						</p>
						<pre
							style={{
								margin: 0,
								padding: '12px',
								background: 'var(--dcs-bg)',
								borderRadius: '8px',
								fontSize: '12px',
								overflow: 'auto',
								whiteSpace: 'pre-wrap',
							}}
						>
							{JSON.stringify(selected.data || {}, null, 2)}
						</pre>
					</div>
				</div>
			)}
		</div>
	);
};

// Free vs Pro comparison table – only show when Pro is not active
const FreeVsProTable = () => {
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined'
			? dcsCF7Styler.pricing_url
			: '/wp-admin/admin.php?page=cf7-mate-pricing';

	return (
		<div className="dcs-compare-card">
			<div className="dcs-compare-card__header">
				<h2 className="dcs-compare-card__title">
					{__('Free vs Pro', 'cf7-styler-for-divi')}
				</h2>
				<p className="dcs-compare-card__desc">
					{__('Compare features and unlock more with Pro.', 'cf7-styler-for-divi')}
				</p>
			</div>
			<div className="dcs-compare-table-wrap">
				<table className="dcs-compare-table" role="presentation">
					<thead>
						<tr>
							<th className="dcs-compare-table__feature">{__('Feature', 'cf7-styler-for-divi')}</th>
							<th className="dcs-compare-table__plan">{__('Free', 'cf7-styler-for-divi')}</th>
							<th className="dcs-compare-table__plan dcs-compare-table__plan--pro">{__('Pro', 'cf7-styler-for-divi')}</th>
						</tr>
					</thead>
					<tbody>
						{FEATURES.map((f) => (
							<tr key={f.id}>
								<td className="dcs-compare-table__feature">{f.name}</td>
								<td className="dcs-compare-table__plan">
									{f.isPro ? (
										<span className="dcs-compare-table__no" aria-hidden="true">—</span>
									) : (
										<span className="dcs-compare-table__yes" aria-hidden="true">✓</span>
									)}
								</td>
								<td className="dcs-compare-table__plan dcs-compare-table__plan--pro">
									<span className="dcs-compare-table__yes" aria-hidden="true">✓</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="dcs-compare-card__footer">
				<a
					href={pricingUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="dcs-compare-card__cta"
				>
					{__('Upgrade to Pro', 'cf7-styler-for-divi')}
				</a>
			</div>
		</div>
	);
};

// Support Section
const SupportSection = () => (
	<div className="dcs-support">
		<div className="dcs-support__icon">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			>
				<path
					d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
		<div className="dcs-support__content">
			<h3 className="dcs-support__title">
				{__('Need Help?', 'cf7-styler-for-divi')}
			</h3>
			<p className="dcs-support__desc">
				{__(
					'Check our documentation or contact support for assistance.',
					'cf7-styler-for-divi'
				)}
			</p>
		</div>
		<a
			href="https://divipeople.com/support/"
			target="_blank"
			rel="noopener noreferrer"
			className="dcs-support__btn"
		>
			{__('Get Support', 'cf7-styler-for-divi')}
		</a>
	</div>
);

// Toast notification
const Toast = ({ message, type, onClose }) => {
	useEffect(() => {
		const timer = setTimeout(onClose, 3000);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className={`dcs-toast dcs-toast--${type}`}>
			<span>{message}</span>
		</div>
	);
};

// Hash routing: #/ -> dashboard, #/features -> features, #/entries -> entries, #/ai-settings -> ai-settings.
// When opened from Contact → Entries (entriesOnlyPage), default to entries view.
const getViewFromHash = () => {
	const entriesOnly =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	if (entriesOnly) return 'entries';
	const hash = (window.location.hash || '').replace(/^#\/?/, '');
	if (hash === 'entries') return 'entries';
	if (hash === 'features') return 'features';
	if (hash === 'ai-settings') return 'ai-settings';
	return 'dashboard';
};

// Main App Component
const App = () => {
	const [features, setFeatures] = useState({
		cf7_module: true,
		grid_layout: true,
		multi_column: true,
		multi_step: true,
		star_rating: true,
		database_entries: true,
		range_slider: true,
	});
	const [isPro, setIsPro] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState(null);
	const getInitialView = () => {
		if (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.currentPage === 'features') {
			return 'features';
		}
		if (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.currentPage === 'ai-settings') {
			return 'ai-settings';
		}
		return getViewFromHash();
	};
	const [currentView, setCurrentView] = useState(getInitialView);
	const [dashboardStats, setDashboardStats] = useState({
		total_entries: 0,
		new_today: 0,
		total_forms: 0,
		enabled_features: 0,
	});
	const [dashboardStatsLoading, setDashboardStatsLoading] = useState(true);
	const [rebrandDismissed, setRebrandDismissed] = useState(false);

	useEffect(() => {
		const onHashChange = () => setCurrentView(getViewFromHash());
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);

	useEffect(() => {
		loadFeatures();
	}, []);

	useEffect(() => {
		if (currentView === 'dashboard') {
			setDashboardStatsLoading(true);
			apiFetch({ path: '/cf7-styler/v1/dashboard-stats' })
				.then((data) => setDashboardStats(data))
				.catch(() =>
					setDashboardStats({
						total_entries: 0,
						new_today: 0,
						total_forms: 0,
						enabled_features: 0,
					})
				)
				.finally(() => setDashboardStatsLoading(false));
		}
	}, [currentView]);

	const loadFeatures = async () => {
		try {
			const response = await apiFetch({
				path: '/cf7-styler/v1/settings/features',
			});
			setFeatures(response.features);
			setIsPro(response.is_pro);
		} catch (error) {
			console.error('Error loading features:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleToggle = async (featureId, enabled) => {
		const newFeatures = { ...features, [featureId]: enabled };
		setFeatures(newFeatures);
		setSaving(true);

		try {
			await apiFetch({
				path: '/cf7-styler/v1/settings/features',
				method: 'POST',
				data: { features: newFeatures },
			});
			setToast({
				message: __('Settings saved', 'cf7-styler-for-divi'),
				type: 'success',
			});
		} catch (error) {
			console.error('Error saving features:', error);
			setFeatures(features); // Revert on error
			setToast({
				message: __('Error saving settings', 'cf7-styler-for-divi'),
				type: 'error',
			});
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="dcs-admin-wrapper">
				<Header isPro={false} />
				<div className="dcs-admin">
					<div className="dcs-admin__content">
						<div className="dcs-loading">
							{__('Loading...', 'cf7-styler-for-divi')}
						</div>
					</div>
				</div>
			</div>
		);
	}

	const showV3Banner =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.show_v3_banner;
	const showEntries = isPro && !!features.database_entries;
	const entriesOnlyPage =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.entriesOnlyPage;
	const cf7AdminUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.cf7_admin_url
			? dcsCF7Styler.cf7_admin_url
			: 'admin.php?page=wpcf7';
	const dashboardUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dashboard_url
			? dcsCF7Styler.dashboard_url
			: 'admin.php?page=cf7-mate-dashboard';
	const modulesUrl = `${dashboardUrl}#/features`;

	const handleNavigate = (view) => {
		if (view === 'entries') {
			window.location.hash = '#/entries';
		} else {
			window.location.hash = '#/';
		}
		setCurrentView(view);
	};

	return (
		<div className="dcs-admin-wrapper">
			<Header
				isPro={isPro}
				showEntries={showEntries}
				currentView={currentView}
			/>
			<div className="dcs-admin">
				<div className="dcs-admin__content">
					{currentView === 'entries' ? (
						showEntries ? (
							<EntriesPage
								onBack={
									entriesOnlyPage
										? () => {
												window.location.href =
													cf7AdminUrl;
											}
										: () => handleNavigate('dashboard')
								}
							/>
						) : (
							<div className="dcs-card">
								<p className="dcs-card__desc">
									{__(
										'Enable Database Entries in Features to view form submissions.',
										'cf7-styler-for-divi'
									)}
								</p>
							</div>
						)
					) : currentView === 'features' ? (
						<>
							{showV3Banner && rebrandDismissed && <V3Banner />}
					<FeaturesSection
						features={features}
						isPro={isPro}
						onToggle={handleToggle}
						saving={saving}
					/>
							<HowToSection />
						</>
					) : currentView === 'ai-settings' ? (
						<AISettingsView />
					) : (
						<>
							{showV3Banner && rebrandDismissed && <V3Banner />}
							<DashboardView
								stats={dashboardStats}
								loading={dashboardStatsLoading}
								showEntries={showEntries}
								modulesUrl={modulesUrl}
								dashboardUrl={dashboardUrl}
							/>
							<PluginsYouMightLike />
							{!isPro && <FreeVsProTable />}
					<SupportSection />
						</>
					)}
				</div>
			</div>
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
			{showV3Banner && !rebrandDismissed && (
				<RebrandModal onDismiss={() => setRebrandDismissed(true)} />
			)}
		</div>
	);
};

domReady(() => {
	const rootElement = document.getElementById('cf7-styler-for-divi-root');
	if (!rootElement) return;
	render(<App />, rootElement);
});
