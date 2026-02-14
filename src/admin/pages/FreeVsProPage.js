import { __ } from '@wordpress/i18n';
import { FreeVsProTable } from '../components/FreeVsProTable';

export function FreeVsProPage() {
	return (
		<div className="cf7m-free-vs-pro-page">
			<div className="cf7m-free-vs-pro-page__intro">
				<h1 className="cf7m-free-vs-pro-page__title">
					{__('Free vs Pro', 'cf7-styler-for-divi')}
				</h1>
				<p className="cf7m-free-vs-pro-page__desc">
					{__('Compare features and choose the right plan for you. Hover over the info icon next to each feature to learn more.', 'cf7-styler-for-divi')}
				</p>
			</div>
			<FreeVsProTable />
		</div>
	);
}
