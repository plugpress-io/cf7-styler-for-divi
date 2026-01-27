/**
 * CF7 Styler Onboarding - Main Component
 *
 * @since 3.0.0
 */

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import OnboardingModal from './components/OnboardingModal';
import './onboarding.scss';

const Onboarding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Check if onboarding should be shown
    fetch(dcsOnboarding.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        action: 'dcs_check_onboarding_status',
        nonce: dcsOnboarding.nonce,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.data.should_show) {
          setIsVisible(true);
          setCurrentStep(data.data.current_step || 1);
        }
      })
      .catch((error) => {
        console.error('Error checking onboarding status:', error);
      });
  }, []);

  const handleClose = () => {
    skipOnboarding();
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
        action: 'dcs_skip_onboarding',
        nonce: dcsOnboarding.nonce,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsVisible(false);
          // Reload page to show admin notice
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error skipping onboarding:', error);
      });
  };

  const handleNext = () => {
    if (currentStep < 3) {
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
        action: 'dcs_next_onboarding_step',
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
        action: 'dcs_complete_onboarding',
        nonce: dcsOnboarding.nonce,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsVisible(false);
          // Reload page
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('Error completing onboarding:', error);
      });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <OnboardingModal
      currentStep={currentStep}
      onClose={handleClose}
      onSkip={handleSkip}
      onNext={handleNext}
      onPrev={handlePrev}
      onComplete={completeOnboarding}
    />
  );
};

// Initialize onboarding when DOM is ready
const initOnboarding = () => {
    const container = document.getElementById('dcs-onboarding-root');
    if (container) {
        render(<Onboarding />, container);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnboarding);
} else {
    initOnboarding();
}
