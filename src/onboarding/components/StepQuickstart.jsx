/**
 * Step Quickstart Component
 *
 * @since 3.0.0
 */

import React from 'react';

const StepQuickstart = () => {
  return (
    <div className="dcs-onboarding-step">
      <div className="dcs-onboarding-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <h2 className="dcs-onboarding-title">Quick Start</h2>
      <p className="dcs-onboarding-description">
        Using CF7 Styler is simple:
      </p>
      <ul className="dcs-onboarding-list">
        <li>Create or edit a page with Divi Builder</li>
        <li>Add the CF7 Styler module to your page</li>
        <li>Select your Contact Form 7 form</li>
        <li>Customize the styling using Divi's visual controls</li>
      </ul>
    </div>
  );
};

export default StepQuickstart;
