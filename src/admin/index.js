import { useState, useEffect } from '@wordpress/element';
import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

import './style.scss';

// Feature definitions
const FEATURES = [
	{
		id: 'cf7_module',
		name: __('CF7 Styler Module', 'cf7-styler-for-divi'),
		description: __(
			'Style Contact Form 7 forms with Divi Builder.',
			'cf7-styler-for-divi',
		),
		isPro: false,
	},
	{
		id: 'grid_layout',
		name: __('Grid Layout', 'cf7-styler-for-divi'),
		description: __(
			'Arrange form fields in a responsive grid layout.',
			'cf7-styler-for-divi',
		),
		isPro: false,
	},
	{
		id: 'multi_column',
		name: __('Multi Column', 'cf7-styler-for-divi'),
		description: __(
			'Advanced multi-column form layouts with custom breakpoints.',
			'cf7-styler-for-divi',
		),
		isPro: true,
	},
	{
		id: 'multi_step',
		name: __('Multi Step Forms', 'cf7-styler-for-divi'),
		description: __(
			'Create multi-step forms with progress indicators.',
			'cf7-styler-for-divi',
		),
		isPro: true,
	},
	{
		id: 'star_rating',
		name: __('Star Rating', 'cf7-styler-for-divi'),
		description: __(
			'Add star rating fields to collect feedback from customers.',
			'cf7-styler-for-divi',
		),
		isPro: true,
	},
	{
		id: 'database_entries',
		name: __('Database Entries', 'cf7-styler-for-divi'),
		description: __(
			'Save form submissions to database and export to CSV.',
			'cf7-styler-for-divi',
		),
		isPro: true,
	},
	{
		id: 'range_slider',
		name: __('Range Slider', 'cf7-styler-for-divi'),
		description: __(
			'Add range slider fields for precise value selection.',
			'cf7-styler-for-divi',
		),
		isPro: true,
	},
];

// Header Component
const Header = () => (
	<header className="dcs-admin__header">
		<div className="dcs-admin__logo">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<rect x="3" y="4" width="18" height="16" rx="2" />
				<line x1="7" y1="8" x2="17" y2="8" />
				<line x1="7" y1="12" x2="17" y2="12" />
				<line x1="7" y1="16" x2="12" y2="16" />
			</svg>
			<h1 className="dcs-admin__title">
				{__('CF7 Styler for Divi', 'cf7-styler-for-divi')}
			</h1>
		</div>
		<nav className="dcs-admin__nav">
			<a
				href="https://divipeople.com/docs/"
				target="_blank"
				rel="noopener noreferrer"
				className="dcs-admin__nav-link"
			>
				{__('Docs', 'cf7-styler-for-divi')}
			</a>
		</nav>
	</header>
);

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

// Feature Card Component
const FeatureCard = ({ feature, enabled, isPro, onToggle, saving }) => {
	const isProLocked = feature.isPro && !isPro;

	return (
		<div className={`dcs-feature ${isProLocked ? 'dcs-feature--pro' : ''}`}>
			<div className="dcs-feature__info">
				<div className="dcs-feature__header">
					<h3 className="dcs-feature__name">{feature.name}</h3>
					{feature.isPro && (
						<span className="dcs-feature__badge">
							{__('Pro', 'cf7-styler-for-divi')}
						</span>
					)}
				</div>
				<p className="dcs-feature__desc">{feature.description}</p>
			</div>
			<div className="dcs-feature__toggle">
				{isProLocked ? (
					<a
						href="https://divipeople.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="dcs-feature__upgrade"
					>
						{__('Upgrade', 'cf7-styler-for-divi')}
					</a>
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

// Features Section Component
const FeaturesSection = ({ features, isPro, onToggle, saving }) => (
	<div className="dcs-card">
		<div className="dcs-card__header">
			<h2 className="dcs-card__title">
				{__('Features', 'cf7-styler-for-divi')}
			</h2>
			<p className="dcs-card__desc">
				{__(
					'Enable or disable plugin features.',
					'cf7-styler-for-divi',
				)}
			</p>
		</div>
		<div className="dcs-features">
			{FEATURES.map((feature) => (
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
);

// Quick Start Section
const QuickStartSection = () => (
	<div className="dcs-card">
		<div className="dcs-card__header">
			<h2 className="dcs-card__title">
				{__('Quick Start', 'cf7-styler-for-divi')}
			</h2>
		</div>
		<ol className="dcs-quickstart">
			<li>
				{__(
					'Create or edit a page with Divi Builder',
					'cf7-styler-for-divi',
				)}
			</li>
			<li>
				{__(
					'Add the CF7 Styler module to your page',
					'cf7-styler-for-divi',
				)}
			</li>
			<li>
				{__('Select your Contact Form 7 form', 'cf7-styler-for-divi')}
			</li>
			<li>
				{__(
					"Customize the styling using Divi's visual controls",
					'cf7-styler-for-divi',
				)}
			</li>
		</ol>
	</div>
);

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
					'cf7-styler-for-divi',
				)}
			</p>
		</div>
		<a
			href="https://developer.elegantthemes.com/support/"
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

	useEffect(() => {
		loadFeatures();
	}, []);

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
				<Header />
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

	return (
		<div className="dcs-admin-wrapper">
			<Header />
			<div className="dcs-admin">
				<div className="dcs-admin__content">
					<FeaturesSection
						features={features}
						isPro={isPro}
						onToggle={handleToggle}
						saving={saving}
					/>
					<QuickStartSection />
					<SupportSection />
				</div>
			</div>
			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
		</div>
	);
};

domReady(() => {
	const rootElement = document.getElementById('cf7-styler-for-divi-root');
	if (!rootElement) return;
	render(<App />, rootElement);
});
