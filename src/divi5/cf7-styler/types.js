/**
 * Type definitions for the CF7 Styler module
 */

/**
 * @typedef {Object} ContentProps
 * @property {Object} main_content - Main content settings
 * @property {string} main_content.cf7 - Selected form ID
 * @property {string} main_content.use_form_button_fullwidth - Whether to use fullwidth button
 * @property {string} main_content.button_alignment - Button alignment
 * @property {Object} form_header - Form header settings
 * @property {string} form_header.use_form_header - Whether to show form header
 * @property {string} form_header.form_header_title - Header title
 * @property {string} form_header.form_header_text - Header text
 * @property {string} form_header.use_icon - Whether to use icon
 * @property {string} form_header.header_icon - Header icon
 * @property {string} form_header.header_img - Header image URL
 */

/**
 * @typedef {Object} DesignProps
 * @property {Object} form_styling - Form styling settings
 * @property {string} form_styling.form_bg - Form background color
 * @property {string} form_styling.form_padding - Form padding
 * @property {Object} header_styling - Header styling settings
 * @property {string} header_styling.form_header_bg - Form header background color
 * @property {string} header_styling.form_header_bottom - Form header bottom spacing
 * @property {string} header_styling.form_header_img_bg - Header image/icon background color
 * @property {string} header_styling.form_header_icon_color - Header icon color
 */

/**
 * @typedef {Object} AdvancedProps
 * @property {Object} message_styling - Message styling settings
 * @property {string} message_styling.success_message_bg - Success message background color
 * @property {string} message_styling.success_message_text_color - Success message text color
 * @property {string} message_styling.error_message_bg - Error message background color
 * @property {string} message_styling.error_message_text_color - Error message text color
 */

/**
 * @typedef {Object} ModuleProps
 * @property {ContentProps} content - Content settings
 * @property {DesignProps} design - Design settings
 * @property {AdvancedProps} advanced - Advanced settings
 * @property {Function} updateContent - Function to update content settings
 * @property {Function} updateDesign - Function to update design settings
 * @property {Function} updateAdvanced - Function to update advanced settings
 */

export {};
