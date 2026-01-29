/**
 * CF7 Mate Onboarding - Main Component
 *
 * @since 3.0.0
 */

import { useState, useEffect, render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import OnboardingModal from './components/OnboardingModal';
import StepRebrand from './components/StepRebrand';
import './onboarding.scss';

const TOTAL_STEPS = 4;

const Onboarding = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [currentStep, setCurrentStep] = useState(1);
	const [featureSettings, setFeatureSettings] = useState({});
	const [showRebrand, setShowRebrand] = useState(false);
	const [rebrandSeen, setRebrandSeen] = useState(true);
	const [onboardingCompleted, setOnboardingCompleted] = useState(false);

	useEffect(() => {
		// Check initial state from localized data
		const rebrandAlreadySeen = dcsOnboarding.rebrand_seen === true || dcsOnboarding.rebrand_seen === '1';
		const alreadyCompleted = dcsOnboarding.onboarding_completed === true || dcsOnboarding.onboarding_completed === '1';
		
		setRebrandSeen(rebrandAlreadySeen);
		setOnboardingCompleted(alreadyCompleted);

		// Check if onboarding should be shown
		fetch(dcsOnboarding.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'cf7m_check_onboarding_status',
				nonce: dcsOnboarding.nonce,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					// Show rebrand screen first if not seen
					if (!rebrandAlreadySeen) {
						setShowRebrand(true);
						setIsVisible(true);
					} else if (data.data.should_show) {
						// Normal onboarding flow
						setIsVisible(true);
						setCurrentStep(data.data.current_step || 1);
					}
				}
			})
			.catch((error) => {
				console.error('Error checking onboarding status:', error);
			});
	}, []);

	const handleRebrandContinue = () => {
		// Mark rebrand as seen
		fetch(dcsOnboarding.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'cf7m_dismiss_rebrand',
				nonce: dcsOnboarding.nonce,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					setRebrandSeen(true);
					setShowRebrand(false);
					
					// If onboarding was already completed, close everything
					// Otherwise, continue to normal onboarding
					if (onboardingCompleted) {
						setIsVisible(false);
					}
				}
			})
			.catch((error) => {
				console.error('Error dismissing rebrand:', error);
			});
	};

	const handleClose = () => {
		if (showRebrand) {
			handleRebrandContinue();
		} else {
			skipOnboarding();
		}
	};

	const handleSkip = () => {
		skipOnboarding();
	};

	const skipOnboarding = () => {
		fetch(dcsOnboarding.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'cf7m_skip_onboarding',
				nonce: dcsOnboarding.nonce,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					setIsVisible(false);
				}
			})
			.catch((error) => {
				console.error('Error skipping onboarding:', error);
			});
	};

	const handleNext = () => {
		if (currentStep < TOTAL_STEPS) {
			const nextStep = currentStep + 1;
			updateStep(nextStep);
		} else {
			completeOnboarding();
		}
	};

	const handlePrev = () => {
		if (currentStep > 1) {
			const prevStep = currentStep - 1;
			updateStep(prevStep);
		}
	};

	const updateStep = (step) => {
		fetch(dcsOnboarding.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'cf7m_next_onboarding_step',
				nonce: dcsOnboarding.nonce,
				step: step,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					setCurrentStep(step);
				}
			})
			.catch((error) => {
				console.error('Error updating step:', error);
			});
	};

	const completeOnboarding = () => {
		fetch(dcsOnboarding.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'cf7m_complete_onboarding',
				nonce: dcsOnboarding.nonce,
				features: JSON.stringify(featureSettings),
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					setIsVisible(false);
				}
			})
			.catch((error) => {
				console.error('Error completing onboarding:', error);
			});
	};

	const handleFeatureToggle = (newSettings) => {
		setFeatureSettings(newSettings);
	};

	if (!isVisible) {
		return null;
	}

	// Show rebrand screen if not seen yet
	if (showRebrand) {
		return <StepRebrand onContinue={handleRebrandContinue} />;
	}

	return (
		<OnboardingModal
			currentStep={currentStep}
			onClose={handleClose}
			onSkip={handleSkip}
			onNext={handleNext}
			onPrev={handlePrev}
			onComplete={completeOnboarding}
			featureSettings={featureSettings}
			onFeatureToggle={handleFeatureToggle}
		/>
	);
};

domReady(() => {
	const container = document.getElementById('dcs-onboarding-root');
	if (container) {
		render(<Onboarding />, container);
	}
});
