/**
 * Plugin header — logo left, nav links right.
 * Supports white label (Agency plan): custom name, logo, and link overrides.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { RocketLaunchIcon, BookOpenIcon, UserGroupIcon, LifebuoyIcon } from '@heroicons/react/24/outline';
import CF7MateLogo from '../../components/CF7MateLogo';

const cfg = (key, fallback = '') => {
	if (typeof dcsCF7Styler === 'undefined') return fallback;
	return dcsCF7Styler[key] || fallback;
};

export function Header({ isPro }) {
	const dashUrl    = cfg('dash_url', 'admin.php?page=cf7-mate');
	const pricingUrl = cfg('pricing_url', '');
	const docsUrl    = cfg('docs_url', '');
	const communityUrl = cfg('community_url', '');
	const supportUrl = cfg('support_url', '');

	// White label (Agency plan): PHP blanks out community_url/pricing_url/docs_url/support_url
	// when WL is enabled, so the links array naturally hides them.
	const wl     = (typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.white_label) || {};
	const wlOn   = !!wl.enabled;
	const wlName = wlOn && wl.plugin_name ? wl.plugin_name : 'CF7 Mate';
	const wlLogo = wlOn && wl.logo_url    ? wl.logo_url    : null;

	const links = [
		docsUrl    && { icon: BookOpenIcon,   label: __('Docs',      'cf7-styler-for-divi'), href: docsUrl },
		communityUrl && { icon: UserGroupIcon, label: __('Community', 'cf7-styler-for-divi'), href: communityUrl },
		supportUrl && { icon: LifebuoyIcon,   label: __('Support',   'cf7-styler-for-divi'), href: supportUrl },
	].filter(Boolean);

	return (
		<header className="cf7m-header" role="banner">
			<div className="cf7m-header__inner">
				<a href={dashUrl} className="cf7m-header__brand">
					{wlLogo ? (
						<img
							src={wlLogo}
							alt={wlName}
							width={22}
							height={22}
							className="cf7m-header__brand-logo"
						/>
					) : (
						<CF7MateLogo width={22} height={22} />
					)}
					<span className="cf7m-header__brand-name">{wlName}</span>
				</a>

				<nav className="cf7m-header__links" aria-label={__('Plugin links', 'cf7-styler-for-divi')}>
					{!isPro && !wlOn && pricingUrl && (
						<a
							href={pricingUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="cf7m-header__upgrade"
						>
							<RocketLaunchIcon aria-hidden="true" />
							{__('Upgrade to Pro', 'cf7-styler-for-divi')}
						</a>
					)}
					{links.map(({ icon: Icon, label, href }) => (
						<a
							key={label}
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							className="cf7m-header__link"
						>
							<Icon aria-hidden="true" />
							{label}
						</a>
					))}
				</nav>
			</div>
		</header>
	);
}
