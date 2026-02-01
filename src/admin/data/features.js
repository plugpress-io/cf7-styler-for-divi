/**
 * Feature definitions for Modules page and Free vs Pro table.
 *
 * @package CF7_Mate
 */

import { __ } from '@wordpress/i18n';

export const FEATURES = [
	{ id: 'cf7_module', name: __('CF7 Styler Module', 'cf7-styler-for-divi'), description: __('Style Contact Form 7 forms with Divi Builder.', 'cf7-styler-for-divi'), isPro: false, icon: 'module' },
	{ id: 'grid_layout', name: __('Grid Layout', 'cf7-styler-for-divi'), description: __('Arrange form fields in a responsive grid layout.', 'cf7-styler-for-divi'), isPro: false, icon: 'grid' },
	{ id: 'multi_column', name: __('Multi Column', 'cf7-styler-for-divi'), description: __('Advanced multi-column form layouts with custom breakpoints.', 'cf7-styler-for-divi'), isPro: true, icon: 'columns' },
	{ id: 'multi_step', name: __('Multi Step Forms', 'cf7-styler-for-divi'), description: __('Create multi-step forms with progress indicators.', 'cf7-styler-for-divi'), isPro: true, icon: 'steps' },
	{ id: 'database_entries', name: __('Form Entries (Database Entries)', 'cf7-styler-for-divi'), description: __('Save form submissions to database and export to CSV.', 'cf7-styler-for-divi'), isPro: true, icon: 'database' },
	{ id: 'star_rating', name: __('Star Rating Field', 'cf7-styler-for-divi'), description: __('Add star rating fields to collect feedback from customers.', 'cf7-styler-for-divi'), isPro: true, icon: 'star' },
	{ id: 'range_slider', name: __('Range Slider Field', 'cf7-styler-for-divi'), description: __('Add range slider fields for precise value selection.', 'cf7-styler-for-divi'), isPro: true, icon: 'slider' },
	{ id: 'phone_number', name: __('Phone Number Field', 'cf7-styler-for-divi'), description: __('Phone input with country prefix, searchable country selector and flags.', 'cf7-styler-for-divi'), isPro: true, icon: 'phone' },
	{ id: 'separator', name: __('Separator Field', 'cf7-styler-for-divi'), description: __('Add horizontal divider lines between form sections.', 'cf7-styler-for-divi'), isPro: true, icon: 'separator' },
	{ id: 'heading', name: __('Heading Field', 'cf7-styler-for-divi'), description: __('Add headings (H1–H6) to structure your form content.', 'cf7-styler-for-divi'), isPro: true, icon: 'heading' },
	{ id: 'image', name: __('Image Field', 'cf7-styler-for-divi'), description: __('Insert images into your contact forms.', 'cf7-styler-for-divi'), isPro: true, icon: 'image' },
	{ id: 'icon', name: __('Icon Field', 'cf7-styler-for-divi'), description: __('Add icons to highlight sections or labels.', 'cf7-styler-for-divi'), isPro: true, icon: 'icon' },
	{ id: 'calculator', name: __('Calculator / Price Estimator', 'cf7-styler-for-divi'), description: __('Add live calculations for quotes, pricing, and order totals.', 'cf7-styler-for-divi'), isPro: true, icon: 'calculator' },
	{ id: 'conditional', name: __('Conditional Logic', 'cf7-styler-for-divi'), description: __('Show/hide fields based on user selections.', 'cf7-styler-for-divi'), isPro: true, icon: 'conditional' },
	{ id: 'ai_form_generator', name: __('AI Form Generator', 'cf7-styler-for-divi'), description: __('Generate CF7 forms using AI with natural language prompts.', 'cf7-styler-for-divi'), isPro: true, icon: 'ai' },
];
