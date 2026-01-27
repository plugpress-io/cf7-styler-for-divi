/**
 * Step Welcome Component
 *
 * @since 3.0.0
 */

import React from 'react';

const StepWelcome = () => {
  return (
    <div className="dcs-onboarding-step">
      <div className="dcs-onboarding-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="7" y1="8" x2="17" y2="8" />
          <line x1="7" y1="12" x2="17" y2="12" />
          <line x1="7" y1="16" x2="12" y2="16" />
        </svg>
      </div>
      <h2 className="dcs-onboarding-title">
        Welcome to CF7 Styler for Divi
      </h2>
      <p className="dcs-onboarding-description">
        Style your Contact Form 7 forms with ease using Divi Builder. Create
        beautiful, responsive forms that match your site design without writing
        any code.
      </p>
    </div>
  );
};

export default StepWelcome;
