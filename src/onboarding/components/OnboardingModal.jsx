/**
 * Onboarding Modal - Full Screen Component (UserFeedback Style)
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';
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
				return __('Start', 'cf7-styler-for-divi');
			case 2:
				return __('Next Step: Help', 'cf7-styler-for-divi');
			case 3:
				return __('Next Step: Finish', 'cf7-styler-for-divi');
			case 4:
				return __('Complete Setup', 'cf7-styler-for-divi');
			default:
				return __('Next', 'cf7-styler-for-divi');
		}
	};

	return (
		<div className="dcs-onboarding-overlay">
			{/* Header */}
			<div className="dcs-onboarding-header">
				<button
					className="dcs-exit-setup"
					onClick={onSkip}
					aria-label={__('Exit Setup', 'cf7-styler-for-divi')}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
					{__('Exit Setup', 'cf7-styler-for-divi')}
				</button>

				{/* Logo */}
				<div className="dcs-onboarding-logo">
					<svg width="28" height="28" viewBox="0 0 32 32" fill="none">
						<rect width="32" height="32" rx="6" fill="#5733ff" />
						<path d="M8 11h16M8 16h12M8 21h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
					</svg>
					<span>{__('CF7 Mate', 'cf7-styler-for-divi')}</span>
				</div>

				{/* Progress Bar */}
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
								) : null}
							</div>
							{index < TOTAL_STEPS - 1 && (
								<div
									className={`dcs-progress-line ${step < currentStep ? 'completed' : ''}`}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className="dcs-onboarding-main">
				<div className="dcs-onboarding-card">
					<div className="dcs-onboarding-content">{renderStep()}</div>

					{/* Footer Navigation */}
					<div className="dcs-onboarding-footer">
						{currentStep > 1 && currentStep < 4 && (
							<button
								className="dcs-onboarding-btn dcs-onboarding-btn-back"
								onClick={onPrev}
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<polyline points="15 18 9 12 15 6" />
								</svg>
								{__('Back', 'cf7-styler-for-divi')}
							</button>
						)}
						
						{currentStep < 4 && (
							<button
								className="dcs-onboarding-btn dcs-onboarding-btn-primary"
								onClick={onNext}
							>
								{getNextButtonText()}
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<polyline points="9 18 15 12 9 6" />
								</svg>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingModal;
