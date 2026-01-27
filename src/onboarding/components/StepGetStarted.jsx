/**
 * Step Get Started Component - Simple Upsell
 *
 * @since 3.0.0
 */

import React, { useState, useEffect } from 'react';

const StepGetStarted = () => {
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => {
    // Get discount code from localized script
    if (typeof dcsOnboarding !== 'undefined' && dcsOnboarding.discount_code) {
      setDiscountCode(dcsOnboarding.discount_code);
    } else {
      // Generate discount code based on current month
      const monthNames = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      setDiscountCode(monthNames[currentMonth] + currentYear);
    }
  }, []);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(discountCode).then(() => {
        // Show feedback
        const button = document.querySelector('.dcs-copy-code');
        if (button) {
          const originalHTML = button.innerHTML;
          button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 3L6 10l-3-3" strokeLinecap="round" strokeLinejoin="round"/></svg>';
          setTimeout(() => {
            button.innerHTML = originalHTML;
          }, 2000);
        }
      });
    }
  };

  return (
    <div className="dcs-onboarding-step">
      <div className="dcs-onboarding-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h2 className="dcs-onboarding-title">You're All Set!</h2>
      <p className="dcs-onboarding-description">
        Start styling your Contact Form 7 forms with Divi Builder. Need help?
        Check out our documentation for detailed guides and tutorials.
      </p>

      {/* Simple Upsell */}
      <div className="dcs-onboarding-upsell">
        <h3 className="dcs-upsell-title">Upgrade to Pro</h3>
        <p className="dcs-upsell-description">
          Unlock advanced features and take your forms to the next level.
        </p>
        <div className="dcs-discount-code-wrapper">
          <p className="dcs-discount-label">Use code at checkout:</p>
          <div className="dcs-discount-code">
            <code id="dcs-discount-code">{discountCode}</code>
            <button
              className="dcs-copy-code"
              onClick={handleCopyCode}
              aria-label="Copy code"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="5"
                  y="5"
                  width="9"
                  height="9"
                  rx="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <a
          href={`https://divipeople.com/divi-cf7-styler/?checkout=true&discount=${discountCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="dcs-upsell-button"
        >
          Get Pro Version
        </a>
      </div>

      <div className="dcs-onboarding-links">
        <a
          href={dcsOnboarding.create_page_url || '/wp-admin/post-new.php?post_type=page'}
          className="dcs-onboarding-link"
        >
          Create New Page
        </a>
        <a
          href="https://divipeople.com/divi-cf7-styler/"
          target="_blank"
          rel="noopener noreferrer"
          className="dcs-onboarding-link dcs-onboarding-link-secondary"
        >
          View Documentation
        </a>
      </div>
    </div>
  );
};

export default StepGetStarted;
