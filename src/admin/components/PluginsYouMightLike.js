/**
 * Plugins you might like – grid of suggestion cards.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

const PLUGINS_SUGGESTIONS = [
	{ name: __('Divi Carousel Pro', 'cf7-styler-for-divi'), description: __('Create stunning image, video & post carousels in Divi.', 'cf7-styler-for-divi'), url: 'https://divipeople.com/divi-carousel-pro/' },
	{ name: __('Divi Blog Pro', 'cf7-styler-for-divi'), description: __('Advanced blog layouts and post grids for Divi theme.', 'cf7-styler-for-divi'), url: 'https://divipeople.com/divi-blog-pro/' },
	{ name: __('Divi Social Plus', 'cf7-styler-for-divi'), description: __('Display social feeds and share buttons beautifully in Divi.', 'cf7-styler-for-divi'), url: 'https://divipeople.com/divi-social-plus/' },
];

export function PluginsYouMightLike() {
	return (
		<div className="dcs-plugins">
			<div className="dcs-plugins__header">
				<h2 className="dcs-plugins__title">{__('Plugins you might like', 'cf7-styler-for-divi')}</h2>
			</div>
			<div className="dcs-plugins__grid">
				{PLUGINS_SUGGESTIONS.map((plugin, index) => (
					<a key={index} href={plugin.url} target="_blank" rel="noopener noreferrer" className="dcs-plugin-card">
						<h3 className="dcs-plugin-card__name">{plugin.name}</h3>
						<p className="dcs-plugin-card__desc">{plugin.description}</p>
						<span className="dcs-plugin-card__btn">{__('Read more', 'cf7-styler-for-divi')}</span>
					</a>
				))}
			</div>
		</div>
	);
}
