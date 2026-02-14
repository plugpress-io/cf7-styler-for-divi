/**
 * Quick links card for Pro users: entries, forms, modules, AI settings.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

export function QuickLinksBox({ dashboardUrl, modulesUrl, cf7AdminUrl, showEntries }) {
	const items = [
		...(showEntries ? [{ href: dashboardUrl + '#/entries', label: __('View Entries', 'cf7-styler-for-divi') }] : []),
		{ href: cf7AdminUrl, label: __('Manage Forms', 'cf7-styler-for-divi'), external: true },
		{ href: modulesUrl, label: __('Modules', 'cf7-styler-for-divi') },
		{ href: dashboardUrl + '#/ai-settings', label: __('AI Settings', 'cf7-styler-for-divi') },
	];

	return (
		<div className="cf7m-card cf7m-quick-access">
			<h3 className="cf7m-quick-access__title">{__('Quick Links', 'cf7-styler-for-divi')}</h3>
			<nav className="cf7m-quick-access__nav" aria-label={__('Quick links', 'cf7-styler-for-divi')}>
				{items.map((item) => (
					<a
						key={item.label}
						href={item.href}
						className={`cf7m-quick-access__link ${item.primary ? 'cf7m-quick-access__link--primary' : ''}`}
						{...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
					>
						<span className="cf7m-quick-access__label">{item.label}</span>
					</a>
				))}
			</nav>
		</div>
	);
}
