/**
 * Mate Settings – tabs inside white card, optional free sidebar.
 * Free: content card (left) + upgrade sidebar (right).
 * Pro: content card full-width.
 *
 * @package CF7_Mate
 */

import { useEffect, useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

import { V3Banner } from '../components/V3Banner';
import { FeaturesSection } from '../components/FeaturesSection';
import { AISettingsPage } from './AISettingsPage';
import { getDashTabFromHash } from '../utils/routing';

const cfg = (key, fallback = '') => {
	if (typeof dcsCF7Styler === 'undefined') return fallback;
	return dcsCF7Styler[key] || fallback;
};

const getProPage = (name) => window.cf7mProPages && window.cf7mProPages[name];

export function SettingsPage({
	features,
	isPro,
	onToggle,
	onBulkToggle,
	saving,
	showV3Banner,
	rebrandDismissed,
}) {
	const [active, setActive] = useState(getDashTabFromHash());

	useEffect(() => {
		const onHash = () => setActive(getDashTabFromHash());
		window.addEventListener('hashchange', onHash);
		return () => window.removeEventListener('hashchange', onHash);
	}, []);

	const navItems = useMemo(() => {
		const items = [
			{ id: 'features', label: __('Features', 'cf7-styler-for-divi') },
			{ id: 'tools',    label: __('Tools',    'cf7-styler-for-divi') },
		];
		if (isPro) {
			items.push({ id: 'license', label: __('License', 'cf7-styler-for-divi') });
		}
		return items;
	}, [isPro]);

	const navigate = (id) => {
		const hash = `#/${id}`;
		if (window.location.hash !== hash) {
			window.history.pushState(null, '', hash);
		}
		setActive(id);
	};

	return (
		<>
			{showV3Banner && !rebrandDismissed && <V3Banner />}

			<div className="cf7m-page-layout">
				<div className="cf7m-page-layout__main">
					<div className="cf7m-page-card">
						<nav
							className="cf7m-tab-nav"
							aria-label={__('CF7 Mate sections', 'cf7-styler-for-divi')}
						>
							{navItems.map((item) => {
								const isActive = active === item.id;
								if (item.href) {
									return (
										<a
											key={item.id}
											href={item.href}
											className="cf7m-tab-nav__item"
										>
											{item.label}
										</a>
									);
								}
								return (
									<button
										key={item.id}
										type="button"
										className={`cf7m-tab-nav__item${isActive ? ' is-active' : ''}`}
										onClick={() => navigate(item.id)}
										aria-current={isActive ? 'page' : undefined}
									>
										{item.label}
									</button>
								);
							})}
						</nav>

						<div className="cf7m-tab-content">
							{active === 'features' && (
								<FeaturesSection
									features={features}
									isPro={isPro}
									onToggle={onToggle}
									onBulkToggle={onBulkToggle}
									saving={saving}
								/>
							)}
							{active === 'tools' && (
								<AISettingsPage
									features={features}
									isPro={isPro}
									onToggle={onToggle}
									saving={saving}
								/>
							)}
							{active === 'license' && isPro && <LicenseTab />}
						</div>
					</div>
				</div>

				{!isPro && (
					<aside className="cf7m-page-sidebar">
						<UpgradeCard />
						<ProductsCard />
						<ReviewCard />
					</aside>
				)}
			</div>
		</>
	);
}

// ===== Sidebar cards (free plan only) =====

function UpgradeCard() {
	const pricingUrl = cfg('pricing_url', '');
	if (!pricingUrl) return null;

	return (
		<div className="cf7m-sidebar-card">
			<h3 className="cf7m-sidebar-card__title">
				{__('Upgrade to Pro', 'cf7-styler-for-divi')}
			</h3>
			<p className="cf7m-sidebar-card__body">
				{__('Unlock form responses, webhooks, AI generator, analytics, conditional logic, and more.', 'cf7-styler-for-divi')}
			</p>
			<a
				href={pricingUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="cf7m-sidebar-card__cta"
			>
				{__('Get CF7 Mate Pro', 'cf7-styler-for-divi')}
				<ArrowUpRightIcon aria-hidden="true" />
			</a>
		</div>
	);
}

function ProductsCard() {
	const products = [
		{
			name: 'Divi Carousel',
			desc: __('Beautiful carousel module for Divi', 'cf7-styler-for-divi'),
			url: 'https://wordpress.org/plugins/divi-carousel/',
		},
		{
			name: 'Divi Instagram Feed',
			desc: __('Display Instagram feed in Divi', 'cf7-styler-for-divi'),
			url: 'https://wordpress.org/plugins/divi-instagram-feed/',
		},
	];

	return (
		<div className="cf7m-sidebar-card">
			<h3 className="cf7m-sidebar-card__title">
				{__('Our WordPress products', 'cf7-styler-for-divi')}
			</h3>
			<p className="cf7m-sidebar-card__body">
				{__('Like this plugin? Check out our other products:', 'cf7-styler-for-divi')}
			</p>
			<div className="cf7m-sidebar-card__products">
				{products.map(({ name, desc, url }) => (
					<a
						key={name}
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="cf7m-sidebar-card__product-link"
					>
						<span className="cf7m-sidebar-card__product-name">{name}</span>
						<span className="cf7m-sidebar-card__product-desc">{desc}</span>
					</a>
				))}
			</div>
		</div>
	);
}

function ReviewCard() {
	const reviewUrl = cfg(
		'review_url',
		'https://wordpress.org/support/plugin/cf7-mate/reviews/#new-post'
	);

	return (
		<div className="cf7m-sidebar-card">
			<h3 className="cf7m-sidebar-card__title">
				{__('Write a review for CF7 Mate', 'cf7-styler-for-divi')}
			</h3>
			<p className="cf7m-sidebar-card__body">
				{__(
					'If you like CF7 Mate, please write a review on WordPress.org to help us spread the word. We really appreciate that!',
					'cf7-styler-for-divi'
				)}
			</p>
			<a
				href={reviewUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="cf7m-sidebar-card__link"
			>
				{__('Write a review', 'cf7-styler-for-divi')}
				<ArrowUpRightIcon aria-hidden="true" />
			</a>
		</div>
	);
}

function LicenseTab() {
	const LicensePage = getProPage('license');
	if (LicensePage) return <LicensePage />;
	return (
		<div className="cf7m-dash__upsell">
			<p>{__('License management is available in CF7 Mate Pro.', 'cf7-styler-for-divi')}</p>
		</div>
	);
}
