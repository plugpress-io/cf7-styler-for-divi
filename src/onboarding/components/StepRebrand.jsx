/**
 * Step Rebrand Component - Announces the rebrand to CF7 Mate
 * Closeable via X button or overlay click.
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';
import CF7MateLogo from '../../components/CF7MateLogo';

const StepRebrand = ({ onContinue, onClose }) => {
	const handleClose = onClose || onContinue;

	return (
		<div
			className="cf7m-rebrand-screen"
			role="dialog"
			aria-modal="true"
			aria-label={__('CF7 Mate welcome', 'cf7-styler-for-divi')}
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					handleClose();
				}
			}}
		>
			<div className="cf7m-rebrand-card" onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					className="cf7m-rebrand-close"
					onClick={handleClose}
					aria-label={__('Close', 'cf7-styler-for-divi')}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				{/* Decorative gradient header */}
				<div className="cf7m-rebrand-header">
					<div className="cf7m-rebrand-glow"></div>
					<div className="cf7m-rebrand-logo">
						<CF7MateLogo width={96} height={96} />
					</div>
				</div>

				{/* Content */}
				<div className="cf7m-rebrand-body">
					<div className="cf7m-rebrand-intro">
						<span className="cf7m-rebrand-eyebrow">
							{__('Introducing', 'cf7-styler-for-divi')}
						</span>
						<h1 className="cf7m-rebrand-title">CF7 Mate</h1>
						<p className="cf7m-rebrand-tagline">
							{__('Your complete Contact Form 7 companion for Divi', 'cf7-styler-for-divi')}
						</p>
					</div>

					<div className="cf7m-rebrand-divider">
						<span>{__('What\'s new', 'cf7-styler-for-divi')}</span>
					</div>

					<div className="cf7m-rebrand-changes">
						<div className="cf7m-rebrand-change">
							<div className="cf7m-rebrand-change-icon">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<div className="cf7m-rebrand-change-text">
								<strong>{__('Same plugin, new name', 'cf7-styler-for-divi')}</strong>
								<span>{__('CF7 Styler is now CF7 Mate', 'cf7-styler-for-divi')}</span>
							</div>
						</div>

						<div className="cf7m-rebrand-change">
							<div className="cf7m-rebrand-change-icon">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>
							<div className="cf7m-rebrand-change-text">
								<strong>{__('All settings preserved', 'cf7-styler-for-divi')}</strong>
								<span>{__('Your forms work exactly the same', 'cf7-styler-for-divi')}</span>
							</div>
						</div>

						<div className="cf7m-rebrand-change">
							<div className="cf7m-rebrand-change-icon cf7m-rebrand-change-icon--star">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M8 1L10.163 5.279L15 6.001L11.5 9.279L12.326 14L8 11.779L3.674 14L4.5 9.279L1 6.001L5.837 5.279L8 1Z" fill="currentColor"/>
								</svg>
							</div>
							<div className="cf7m-rebrand-change-text">
								<strong>{__('More features in pro', 'cf7-styler-for-divi')}</strong>
								<span>{__('Entries, ratings, multi-step & more', 'cf7-styler-for-divi')}</span>
							</div>
						</div>
					</div>

					<button 
						type="button" 
						className="cf7m-rebrand-cta"
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
