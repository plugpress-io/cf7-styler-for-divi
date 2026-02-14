import { __ } from '@wordpress/i18n';
import { FeatureIconDatabase } from './icons/FeatureIcons';
import { LockIcon } from './icons/NavIcons';
import { EntriesOverviewPreview } from './EntriesOverviewPreview';
import { HeroIllustration } from './HeroIllustration';
import { HeroSection } from './HeroSection';

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

	return (
		<div className="cf7m-dashboard-layout">
			<HeroSection
				ariaLabel={__('Welcome', 'cf7-styler-for-divi')}
				title={__('CF7 Mate for Contact Form 7', 'cf7-styler-for-divi')}
				description={__('Style forms, add fields, save entries, and use AI — no code.', 'cf7-styler-for-divi')}
				media={<HeroIllustration />}
			/>

			<div className="cf7m-dashboard-main">
					<div
						className={`cf7m-card cf7m-dashboard-card cf7m-entries-overview ${!showEntries ? 'cf7m-entries-overview--locked' : ''}`}
					>
						<div className="cf7m-dashboard-card__header">
							<h2 className="cf7m-dashboard-card__title">
								{__('Entries Overview', 'cf7-styler-for-divi')}
							</h2>
							{showEntries && (
								<a href={dashboardUrl + '#/entries'} className="cf7m-dashboard-card__action">
									{__('View Entries', 'cf7-styler-for-divi')}
								</a>
							)}
						</div>
						<div className="cf7m-dashboard-card__body">
							{showEntries ? (
								<div className="cf7m-entries-overview__empty">
									<span className="cf7m-entries-overview__icon" aria-hidden="true">
										<FeatureIconDatabase />
									</span>
									<p className="cf7m-entries-overview__message">
										{__('No entries yet', 'cf7-styler-for-divi')}
									</p>
									<p className="cf7m-entries-overview__hint">
										{__('Form submissions will appear here when you enable Database Entries in Modules.', 'cf7-styler-for-divi')}
									</p>
								</div>
							) : (
								<>
									<div className="cf7m-entries-overview__preview-wrap">
										<EntriesOverviewPreview />
									</div>
									<a
										href={dashboardUrl + '#/free-vs-pro'}
										className="cf7m-entries-overview__lock-overlay"
										aria-label={__(
											'Pro feature — Upgrade to unlock',
											'cf7-styler-for-divi'
										)}
									>
										<span className="cf7m-entries-overview__lock-overlay-icon">
											<LockIcon />
										</span>
										<span className="cf7m-entries-overview__lock-overlay-cta">
											{__(
												'Upgrade — Free vs Pro',
												'cf7-styler-for-divi'
											)}
										</span>
									</a>
								</>
							)}
						</div>
					</div>
				</div>
		</div>
	);
}
