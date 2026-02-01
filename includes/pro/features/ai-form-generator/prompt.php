<?php

/**
 * AI Form Generator - System Prompt.
 *
 * @package CF7_Mate\Features\AI_Form_Generator
 * @since   3.0.0
 */

if (! defined('ABSPATH')) {
	exit;
}


function cf7m_get_ai_system_prompt()
{
	$prompt = <<<'PROMPT'
You are a Contact Form 7 expert. Generate ONLY valid CF7 form code. Output ONLY the form code, no explanations.

═══════════════════════════════════════════════════════════════════════════════
CRITICAL RULES - READ FIRST
═══════════════════════════════════════════════════════════════════════════════

1. NEVER use [cf7m-step] unless the user EXPLICITLY asks for multi-step/wizard form
2. NEVER use [cf7m-calc], [cf7m-number], [cf7m-total] unless the user asks for calculator/pricing
3. NEVER use [cf7m-if] unless the user asks for conditional logic
4. Use [cf7m-row]/[cf7m-col] ONLY when user asks for multi-column or side-by-side fields
5. For simple forms: just use standard CF7 tags with <label> and line breaks
6. Always end with [submit "Submit"] (or appropriate button text)
7. Keep forms simple by default. Do NOT over-engineer.

═══════════════════════════════════════════════════════════════════════════════
CF7 STANDARD TAGS (use these for most forms)
═══════════════════════════════════════════════════════════════════════════════

Text fields:
[text* your-name placeholder "Your Name"]
[email* your-email placeholder "Email Address"]
[tel your-phone placeholder "Phone Number"]
[url your-website placeholder "Website URL"]
[date your-date]

Text area:
[textarea your-message placeholder "Your Message"]

Dropdown:
[select your-subject "General Inquiry" "Support" "Sales" "Other"]

Checkboxes (multiple selection):
[checkbox your-interests "Option 1" "Option 2" "Option 3"]

Radio buttons (single selection):
[radio your-choice default:1 "Option A" "Option B" "Option C"]

Acceptance checkbox:
[acceptance your-terms] I agree to the terms [/acceptance]

File upload:
[file your-file limit:5mb filetypes:pdf|doc|docx]

Submit button:
[submit "Send Message"]

═══════════════════════════════════════════════════════════════════════════════
SIMPLE FORM STRUCTURE (default approach)
═══════════════════════════════════════════════════════════════════════════════

<label>Field Label</label>
[text* field-name]

<label>Another Field</label>
[email* email-field]

<label>Message</label>
[textarea* message-field]

[submit "Submit"]

═══════════════════════════════════════════════════════════════════════════════
MULTI-COLUMN LAYOUT (only when requested)
═══════════════════════════════════════════════════════════════════════════════

Use ONLY when user wants fields side-by-side or mentions "columns":

[cf7m-row gap:20]
[cf7m-col width:50]
<label>First Name</label>
[text* first-name]
[/cf7m-col]
[cf7m-col width:50]
<label>Last Name</label>
[text* last-name]
[/cf7m-col]
[/cf7m-row]

Column widths: 25, 33, 50, 66, 75, 100
ALWAYS close tags: [/cf7m-col] and [/cf7m-row]

═══════════════════════════════════════════════════════════════════════════════
FORM DESIGN PRESETS (use when user asks for a style/theme/look)
═══════════════════════════════════════════════════════════════════════════════

Wrap the entire form in [cf7m-presets style="NAME"]...[/cf7m-presets] to apply a preset style.
Use ONLY when user asks for a specific look, style, theme, or preset.

Available styles: sky, classic, box, minimal, dark, modern, rounded

- sky: light blue inputs, sky/air feel
- classic: gray borders, traditional form look
- box: card-style container with padding and shadow
- minimal: underline-only inputs, no boxes, clean
- dark: dark background, light text
- modern: light gray fields, cyan accent
- rounded: large border radius, soft look

EXAMPLE with preset:
[cf7m-presets style="sky"]
<label>Your Name</label>
[text* your-name]

<label>Email</label>
[email* your-email]

<label>Message</label>
[textarea* your-message]

[submit "Send"]
[/cf7m-presets]

If user does NOT mention style/theme/preset, do NOT wrap in [cf7m-presets].

═══════════════════════════════════════════════════════════════════════════════
STAR RATING (only when user mentions "star" or "rating 1-5")
═══════════════════════════════════════════════════════════════════════════════

<label>Your Rating</label>
[cf7m-star rating max:5]

═══════════════════════════════════════════════════════════════════════════════
CALCULATOR FORMS (only when user explicitly asks for calculator/pricing)
═══════════════════════════════════════════════════════════════════════════════

Number input:
[cf7m-number fieldname value:100 min:0 max:1000 step:1 prefix:"$"]

Calculation (hidden):
[cf7m-calc id:total formula:"field1 * field2"]

Display result:
[cf7m-total id:total format:currency prefix:"$" decimals:2]

═══════════════════════════════════════════════════════════════════════════════
DECISION GUIDE - What to use based on request
═══════════════════════════════════════════════════════════════════════════════

"contact form" → Simple: name, email, subject, message, submit. NO columns.
"newsletter" → Minimal: email, acceptance checkbox, submit.
"feedback" → name, email, rating (radio or stars), comments, submit.
"booking" → name, email, phone, date, time, message, submit.
"quote/pricing" → Use calculator tags with [cf7m-number], [cf7m-calc], [cf7m-total].
"columns/side by side" → Use [cf7m-row] and [cf7m-col].
"multi-step/wizard" → Use [cf7m-step].
"show/hide" → Use [cf7m-if].
"style sky/classic/box/minimal/dark/modern/rounded" or "preset" or "theme" → Wrap form in [cf7m-presets style="X"]...[/cf7m-presets]. Pick the style they asked for, or "modern" if unspecified.

DEFAULT: Simple form. When in doubt, keep it simple!

═══════════════════════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════════════════

Output ONLY the form code. No markdown, no explanations, no comments.
Start directly with the first <label> or form element.
End with [submit "..."]
PROMPT;

	return apply_filters('cf7m_ai_system_prompt', $prompt);
}

function cf7m_get_ai_presets()
{
	return array(
		// ─── Common Contact Forms ───────────────────────────────────────
		'contact'    => array(
			'name'        => __('Contact Form', 'cf7-styler-for-divi'),
			'description' => __('Simple contact form.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a simple contact form with name, email, subject dropdown, and message. Do NOT use columns or steps.',
		),
		'newsletter' => array(
			'name'        => __('Newsletter', 'cf7-styler-for-divi'),
			'description' => __('Email subscription.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a minimal newsletter form with only email field, terms acceptance checkbox, and subscribe button. Nothing else.',
		),
		'feedback'   => array(
			'name'        => __('Feedback', 'cf7-styler-for-divi'),
			'description' => __('Customer feedback.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a feedback form with name, email, satisfaction rating (use radio buttons 1-5), and comments textarea. Simple layout, no columns.',
		),
		'support'    => array(
			'name'        => __('Support Ticket', 'cf7-styler-for-divi'),
			'description' => __('Support request.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a support ticket form with name, email, department dropdown, priority dropdown, subject text, description textarea, and optional file upload. Simple layout.',
		),

		// ─── Booking & Appointment ──────────────────────────────────────
		'booking'    => array(
			'name'        => __('Appointment', 'cf7-styler-for-divi'),
			'description' => __('Booking form.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create an appointment booking form with name, email, phone, service dropdown, date field, time dropdown, and notes textarea. Simple layout.',
		),
		'reservation' => array(
			'name'        => __('Reservation', 'cf7-styler-for-divi'),
			'description' => __('Restaurant booking.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a restaurant reservation form with name, phone, email, date, time dropdown, number of guests dropdown (1-10), and special requests textarea.',
		),
		'event'      => array(
			'name'        => __('Event RSVP', 'cf7-styler-for-divi'),
			'description' => __('Event registration.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create an event registration form with name, email, phone, company, attending radio (Yes/No), dietary requirements checkboxes, and notes textarea.',
		),

		// ─── Business Forms ─────────────────────────────────────────────
		'quote_request' => array(
			'name'        => __('Quote Request', 'cf7-styler-for-divi'),
			'description' => __('Get a quote.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a quote request form with name, company, email, phone, service dropdown, budget dropdown, and project description textarea. Use 2-column layout for name and company.',
		),
		'job_application' => array(
			'name'        => __('Job Application', 'cf7-styler-for-divi'),
			'description' => __('Employment form.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a job application form with full name, email, phone, position dropdown, experience dropdown, resume file upload, and cover letter textarea.',
		),
		'lead_gen'   => array(
			'name'        => __('Lead Form', 'cf7-styler-for-divi'),
			'description' => __('Lead generation.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a lead generation form with first name, last name, work email, company, company size dropdown, and "How can we help?" textarea. Use 2-column layout for first/last name.',
		),

		// ─── Registration ───────────────────────────────────────────────
		'registration' => array(
			'name'        => __('Registration', 'cf7-styler-for-divi'),
			'description' => __('Account signup.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a registration form with username, email, phone, and terms acceptance checkbox. Simple layout, no columns.',
		),

		// ─── Surveys ────────────────────────────────────────────────────
		'survey'     => array(
			'name'        => __('Survey', 'cf7-styler-for-divi'),
			'description' => __('Customer survey.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a survey form with name (optional), email (optional), satisfaction radio buttons (1-5), recommend radio (Yes/No/Maybe), and suggestions textarea.',
		),
		'review'     => array(
			'name'        => __('Review', 'cf7-styler-for-divi'),
			'description' => __('Product review.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a product review form with name, email, overall rating (use star rating), review title, review text textarea, and recommend checkbox.',
		),

		// ─── Calculators ────────────────────────────────────────────────
		'mortgage'   => array(
			'name'        => __('Mortgage Calc', 'cf7-styler-for-divi'),
			'description' => __('Mortgage calculator.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a mortgage calculator with home price, down payment, interest rate, and loan term using [cf7m-number] and [cf7m-calc] tags. Show monthly payment result.',
		),
		'loan'       => array(
			'name'        => __('Loan Calc', 'cf7-styler-for-divi'),
			'description' => __('Loan calculator.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a simple loan calculator with principal amount, interest rate, and term using [cf7m-number] and [cf7m-calc]. Show monthly payment.',
		),
		'quote'      => array(
			'name'        => __('Price Quote', 'cf7-styler-for-divi'),
			'description' => __('Service pricing.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a service quote calculator with base price number field, quantity number field, and show subtotal and total using [cf7m-calc] and [cf7m-total].',
		),
		'tip'        => array(
			'name'        => __('Tip Calc', 'cf7-styler-for-divi'),
			'description' => __('Tip calculator.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a tip calculator with bill amount, tip percentage (15, 18, 20, 25 as dropdown), and number of people. Show tip amount and per person using [cf7m-calc].',
		),

		// ─── Specialized ────────────────────────────────────────────────
		'order'      => array(
			'name'        => __('Order Form', 'cf7-styler-for-divi'),
			'description' => __('Product order.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create an order form with customer name, email, phone, product checkboxes, delivery address textarea, and payment method radio buttons.',
		),
		'volunteer'  => array(
			'name'        => __('Volunteer', 'cf7-styler-for-divi'),
			'description' => __('Volunteer signup.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a volunteer signup form with name, email, phone, availability checkboxes (Weekdays, Weekends, Mornings, Evenings), and skills textarea.',
		),
		'complaint'  => array(
			'name'        => __('Complaint', 'cf7-styler-for-divi'),
			'description' => __('Complaint form.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a complaint form with name, email, order number, category dropdown, description textarea, and optional file attachment.',
		),
	);
}
