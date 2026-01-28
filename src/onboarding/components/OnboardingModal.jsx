/**
 * Onboarding Modal - Full Screen Component
 *
 * @since 3.0.0
 */

import { __ } from '@wordpress/i18n';
import StepWelcome from './StepWelcome';
import StepQuickstart from './StepQuickstart';
import StepGetStarted from './StepGetStarted';

const OnboardingModal = ({
	currentStep,
	onClose,
	onSkip,
	onNext,
	onPrev,
	onComplete,
}) => {
	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <StepWelcome />;
			case 2:
				return <StepQuickstart />;
			case 3:
				return <StepGetStarted />;
			default:
				return <StepWelcome />;
		}
	};

	return (
		<div className="dcs-onboarding-overlay">
			<div className="dcs-onboarding-modal">
				{/* Close Button */}
				<button
					className="dcs-onboarding-close"
					onClick={onClose}
					aria-label={__('Close', 'cf7-styler-for-divi')}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<line x1="5" y1="5" x2="15" y2="15" />
						<line x1="15" y1="5" x2="5" y2="15" />
					</svg>
				</button>

				{/* Content */}
				<div className="dcs-onboarding-content">{renderStep()}</div>

				{/* Footer */}
				<div className="dcs-onboarding-footer">
					{/* Progress Dots */}
					<div className="dcs-onboarding-progress">
						{[1, 2, 3].map((step) => (
							<span
								key={step}
								className={`dcs-progress-dot ${step <= currentStep ? 'active' : ''}`}
							/>
						))}
					</div>

					{/* Actions */}
					<div className="dcs-onboarding-actions">
						{currentStep > 1 && (
							<button
								className="dcs-onboarding-btn dcs-onboarding-btn-secondary"
								onClick={onPrev}
							>
								{__('Previous', 'cf7-styler-for-divi')}
							</button>
						)}
						<div className="dcs-onboarding-actions-right">
							{currentStep < 3 ? (
								<>
									<button
										className="dcs-onboarding-btn dcs-onboarding-btn-skip"
										onClick={onSkip}
									>
										{__('Skip', 'cf7-styler-for-divi')}
									</button>
									<button
										className="dcs-onboarding-btn dcs-onboarding-btn-primary"
										onClick={onNext}
									>
										{__('Next', 'cf7-styler-for-divi')}
									</button>
								</>
							) : (
								<button
									className="dcs-onboarding-btn dcs-onboarding-btn-primary"
									onClick={onComplete}
								>
									{__('Get Started', 'cf7-styler-for-divi')}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingModal;
