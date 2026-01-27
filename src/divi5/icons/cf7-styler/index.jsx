import React from 'react';

// Icon data - CF7 Styler icon.
// 16x16 boxed layout, optimized for small/mobile views.
export const name = 'cf7-styler-for-divi/icon';
export const viewBox = '0 0 16 16';
export const component = () => (
  <>
    {/* Outer box */}
    <rect
      x="1.25"
      y="1.25"
      width="13.5"
      height="13.5"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
    />

    {/* Form body */}
    <rect
      x="3"
      y="4"
      width="10"
      height="7"
      rx="0.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
    />

    {/* Form lines */}
    <line x1="4" y1="5.8" x2="11.5" y2="5.8" stroke="currentColor" strokeWidth="0.7" />
    <line x1="4" y1="7.4" x2="10" y2="7.4" stroke="currentColor" strokeWidth="0.7" />

    {/* Submit button */}
    <rect
      x="8.5"
      y="8.6"
      width="3.5"
      height="1.9"
      rx="0.5"
      fill="currentColor"
      opacity="0.85"
    />
  </>
);
