/**
 * Admin header — logo (left), Free vs Pro link + version + Dash icon (right).
 * No center nav: switching pages happens via WP submenu / Dash sidebar.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import CF7MateLogo from '../../components/CF7MateLogo';

export function Header({ isPro }) {
	const dashUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.dash_url
			? dcsCF7Styler.dash_url
			: 'admin.php?page=cf7-mate-dash';
	const version =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.version
			? dcsCF7Styler.version
			: '';
	const pricingUrl =
		typeof dcsCF7Styler !== 'undefined' && dcsCF7Styler.pricing_url
			? dcsCF7Styler.pricing_url
			: '';

	return (
		<header className="cf7m-header" role="banner">
			<div className="cf7m-header__inner">
				<div className="cf7m-header__brand">
					<CF7MateLogo width={28} height={28} />
					<span className="cf7m-header__brand-name">CF7 Mate</span>
				</div>

				<div className="cf7m-header__meta">
					{!isPro && pricingUrl && (
						<a
							href={pricingUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="cf7m-header__upgrade"
						>
							{__('Free vs Pro', 'cf7-styler-for-divi')}
						</a>
					)}
					{version && (
						<span className="cf7m-header__version">v{version}</span>
					)}
					<a
						href={dashUrl}
						className="cf7m-header__icon-btn"
						aria-label={__('Open Mate Dash', 'cf7-styler-for-divi')}
						title={__('Mate Dash', 'cf7-styler-for-divi')}
					>
						<Cog6ToothIcon className="cf7m-header__icon" aria-hidden="true" />
					</a>
				</div>
			</div>
		</header>
	);
}
