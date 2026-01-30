/**
 * Onboarding Modal - Full Screen Component (UserFeedback Style)
 * Closeable via X button, overlay click, or Escape key.
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import StepWelcome from './StepWelcome';
import StepFeatures from './StepFeatures';
import StepHelp from './StepHelp';
import StepFinish from './StepFinish';

const TOTAL_STEPS = 4;

const OnboardingModal = ({
	currentStep,
	onClose,
	onSkip,
	onNext,
	onPrev,
	onComplete,
	featureSettings,
	onFeatureToggle,
}) => {
	// Escape key closes the modal
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				onSkip();
			}
		};
		window.addEventListener('keydown', handleEscape);
		return () => window.removeEventListener('keydown', handleEscape);
	}, [onSkip]);

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <StepWelcome />;
			case 2:
				return <StepFeatures onFeaturesChange={onFeatureToggle} />;
			case 3:
				return <StepHelp />;
			case 4:
				return <StepFinish onComplete={onComplete} />;
			default:
				return <StepWelcome />;
		}
	};

	const getNextButtonText = () => {
		switch (currentStep) {
			case 1:
				return __('Let\'s Get Started', 'cf7-styler-for-divi');
			case 4:
				return __('Finish', 'cf7-styler-for-divi');
			default:
				return __('Next', 'cf7-styler-for-divi');
		}
	};

	const version = typeof dcsOnboarding !== 'undefined' && dcsOnboarding.version
		? dcsOnboarding.version
		: '3.0.0';

	return (
		<div
			className="dcs-onboarding-overlay"
			role="dialog"
			aria-modal="true"
			aria-label={__('CF7 Mate onboarding', 'cf7-styler-for-divi')}
			onClick={(e) => {
				if (e.target === e.currentTarget) onSkip();
			}}
		>
			{/* Header – logo left, progress center, Exit right */}
			<div className="dcs-onboarding-header" onClick={(e) => e.stopPropagation()}>
				<div className="dcs-onboarding-header-inner">
					<div className="dcs-onboarding-logo">
						<svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clipPath="url(#clip0_cf7m_onboarding)">
								<path fillRule="evenodd" clipRule="evenodd" d="M21.9927 15.7109C24.0728 15.711 25.7588 17.3972 25.7589 19.4771C25.7589 21.557 24.0728 23.2433 21.9927 23.2433C19.9127 23.2433 18.2266 21.557 18.2266 19.4771C18.2266 17.3971 19.9127 15.7109 21.9927 15.7109ZM21.9927 17.0919C21.7154 17.0919 21.4906 17.3167 21.4906 17.5941V18.9749H20.1096C19.8323 18.975 19.6075 19.1998 19.6074 19.4771C19.6074 19.7545 19.8323 19.9793 20.1096 19.9793H21.4906V21.3602C21.4906 21.6375 21.7154 21.8624 21.9927 21.8624C22.2701 21.8623 22.4949 21.6375 22.4949 21.3602V19.9793H23.8758C24.1531 19.9793 24.378 19.7545 24.378 19.4771C24.378 19.1998 24.1531 18.9749 23.8758 18.9749H22.4949V17.5941C22.4949 17.3167 22.2701 17.0919 21.9927 17.0919Z" fill="#5733FF" />
								<path fillRule="evenodd" clipRule="evenodd" d="M38.4 0C43.7019 0 48 4.29806 48 9.6V38.4C48 43.7019 43.7019 48 38.4 48H9.6C4.29806 48 0 43.7019 0 38.4V9.6C0 4.29806 4.29806 2.35646e-07 9.6 0H38.4ZM12.2481 10.944C8.06128 10.9441 4.66725 14.9909 4.66725 19.9828V28.0172C4.66725 33.0091 8.06128 37.056 12.2481 37.056H23.1983C27.3852 37.056 30.7792 33.0091 30.7792 28.0172V19.9828C30.7792 14.9909 27.3852 10.944 23.1983 10.944H12.2481ZM38.0604 10.944C35.1485 10.944 32.7878 13.8667 32.7878 17.472V30.528C32.7878 34.1333 35.1485 37.056 38.0604 37.056C40.9724 37.056 43.3332 34.1334 43.3332 30.528V17.472C43.3332 13.8667 40.9724 10.944 38.0604 10.944Z" fill="#5733FF" />
							</g>
							<defs>
								<clipPath id="clip0_cf7m_onboarding">
									<rect width="48" height="48" fill="white" />
								</clipPath>
							</defs>
						</svg>
						<span className="dcs-onboarding-logo-text" style={{ fontWeight: 700 }}>{__('CF7 Mate', 'cf7-styler-for-divi')}</span>
					</div>
					<div className="dcs-onboarding-progress-wrap">
						<div className="dcs-progress-bar">
							{[1, 2, 3, 4].map((step, index) => (
								<div key={step} className="dcs-progress-step">
									<div
										className={`dcs-progress-dot ${
											step < currentStep ? 'completed' : step === currentStep ? 'active' : ''
										}`}
									>
										{step < currentStep ? (
											<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
												<polyline points="20 6 9 17 4 12" />
											</svg>
										) : (
											<span className="dcs-progress-num">{step}</span>
										)}
									</div>
									{index < TOTAL_STEPS - 1 && (
										<div className={`dcs-progress-line ${step < currentStep ? 'completed' : ''}`} />
									)}
								</div>
							))}
						</div>
					</div>
					<button
						type="button"
						className="dcs-exit-setup"
						onClick={onSkip}
						aria-label={__('Exit Guided Setup', 'cf7-styler-for-divi')}
					>
						<span className="dcs-exit-setup-text">{__('Exit Guided Setup', 'cf7-styler-for-divi')}</span>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
			</div>

			{/* Centered card – SureFORMS style */}
			<div className="dcs-onboarding-content-wrap" onClick={(e) => e.stopPropagation()}>
				<div className="dcs-onboarding-card" role="region" aria-label={__('Setup step', 'cf7-styler-for-divi')}>
					<div className="dcs-onboarding-content">{renderStep()}</div>
					<div className="dcs-onboarding-footer">
						{currentStep > 1 && currentStep < 4 && (
							<button className="dcs-onboarding-btn dcs-onboarding-btn-back" onClick={onPrev}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<polyline points="15 18 9 12 15 6" />
								</svg>
								{__('Back', 'cf7-styler-for-divi')}
							</button>
						)}
						<div className="dcs-onboarding-footer-right">
							{currentStep < 4 && (
								<>
									<button
										type="button"
										className="dcs-onboarding-skip"
										onClick={onSkip}
										aria-label={__('Skip onboarding', 'cf7-styler-for-divi')}
									>
										{__('Skip for now', 'cf7-styler-for-divi')}
									</button>
									<button className="dcs-onboarding-btn dcs-onboarding-btn-primary" onClick={onNext}>
										{getNextButtonText()}
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<polyline points="9 18 15 12 9 6" />
										</svg>
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingModal;
