import { __ } from '@wordpress/i18n';
import { HeroIllustration } from './HeroIllustration';
import { HeroSection } from './HeroSection';

const getProWidget = (name) => window.cf7mProWidgets && window.cf7mProWidgets[name];

export function DashboardView({
	stats,
	loading,
	showEntries,
	dashboardUrl,
}) {

	if (loading) {
		return (
			<div className="cf7m-dashboard-layout">
				<div className="cf7m-card cf7m-dashboard-card">
					<div className="cf7m-dashboard-card__body">
						<p className="cf7m-dashboard-card__muted">
							{__('Loading…', 'cf7-styler-for-divi')}
						</p>
					</div>
				</div>
			</div>
		);
	}

	const EntriesOverview = getProWidget('entriesOverview');

	return (
		<div className="cf7m-dashboard-layout">
			<HeroSection
				ariaLabel={__('Welcome', 'cf7-styler-for-divi')}
				title={__('CF7 Mate for Contact Form 7', 'cf7-styler-for-divi')}
				description={__('Style forms, add fields, save entries, and use AI — no code.', 'cf7-styler-for-divi')}
				media={<HeroIllustration />}
			/>

			<div className="cf7m-dashboard-main">
				{EntriesOverview && (
					<EntriesOverview
						showEntries={showEntries}
						dashboardUrl={dashboardUrl}
						stats={stats}
					/>
				)}
			</div>
		</div>
	);
}
