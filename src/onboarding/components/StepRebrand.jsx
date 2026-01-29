/**
 * Step Rebrand Component - Announces the rebrand to CF7 Mate
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';

const StepRebrand = ({ onContinue }) => {
	return (
		<div className="dcs-rebrand-screen">
			<div className="dcs-rebrand-card">
				{/* Decorative gradient header */}
				<div className="dcs-rebrand-header">
					<div className="dcs-rebrand-glow"></div>
					<div className="dcs-rebrand-logo">
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
							<rect width="48" height="48" rx="12" fill="url(#logo-gradient)"/>
							<path d="M14 24C14 18.477 18.477 14 24 14C29.523 14 34 18.477 34 24C34 29.523 29.523 34 24 34" stroke="white" strokeWidth="3" strokeLinecap="round"/>
							<path d="M24 20V28M20 24H28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
							<defs>
								<linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
									<stop stopColor="#5733ff"/>
									<stop offset="1" stopColor="#8b5cf6"/>
								</linearGradient>
							</defs>
						</svg>
					</div>
				</div>

				{/* Content */}
				<div className="dcs-rebrand-body">
					<div className="dcs-rebrand-intro">
						<span className="dcs-rebrand-eyebrow">
							{__('Introducing', 'cf7-styler-for-divi')}
						</span>
						<h1 className="dcs-rebrand-title">CF7 Mate</h1>
						<p className="dcs-rebrand-tagline">
							{__('Your complete Contact Form 7 companion for Divi', 'cf7-styler-for-divi')}
						</p>
					</div>

					<div className="dcs-rebrand-divider">
						<span>{__('What\'s new', 'cf7-styler-for-divi')}</span>
					</div>

					<div className="dcs-rebrand-changes">
						<div className="dcs-rebrand-change">
							<div className="dcs-rebrand-change-icon">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<div className="dcs-rebrand-change-text">
								<strong>{__('Same plugin, new name', 'cf7-styler-for-divi')}</strong>
								<span>{__('CF7 Styler is now CF7 Mate', 'cf7-styler-for-divi')}</span>
							</div>
						</div>

						<div className="dcs-rebrand-change">
							<div className="dcs-rebrand-change-icon">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<div className="dcs-rebrand-change-text">
								<strong>{__('All settings preserved', 'cf7-styler-for-divi')}</strong>
								<span>{__('Your forms work exactly the same', 'cf7-styler-for-divi')}</span>
							</div>
						</div>

						<div className="dcs-rebrand-change">
							<div className="dcs-rebrand-change-icon dcs-rebrand-change-icon--star">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M8 1L10.163 5.279L15 6.001L11.5 9.279L12.326 14L8 11.779L3.674 14L4.5 9.279L1 6.001L5.837 5.279L8 1Z" fill="currentColor"/>
								</svg>
							</div>
							<div className="dcs-rebrand-change-text">
								<strong>{__('More features coming', 'cf7-styler-for-divi')}</strong>
								<span>{__('Entries, ratings, multi-step & more', 'cf7-styler-for-divi')}</span>
							</div>
						</div>
					</div>

					<button 
						type="button" 
						className="dcs-rebrand-cta"
						onClick={onContinue}
					>
						{__('Continue', 'cf7-styler-for-divi')}
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default StepRebrand;
