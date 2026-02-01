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

1. ALWAYS use HTML labels with ANGLE BRACKETS: <label for="field-name">Label text</label>. NEVER use square brackets for labels (e.g. [label for="x"]...[/label]) – that will NOT render and will show as literal text. Only CF7 form tags use square brackets: [text* name], [submit "Send"].
2. Do NOT add a separate <label> above [cf7m-total], [cf7m-number], or [cf7m-phone] when the shortcode already has label:"..." inside – those tags render their own label.
3. NEVER use [cf7m-step] unless the user EXPLICITLY asks for multi-step/wizard form
4. NEVER use [cf7m-calc], [cf7m-number], [cf7m-total] unless the user asks for calculator/pricing
5. NEVER use [cf7m-if] unless the user asks for conditional logic
6. Use [cf7m-row]/[cf7m-col] ONLY when user asks for multi-column or side-by-side fields
7. For simple forms: just use standard CF7 tags with <label for="name"> and line breaks
8. Always end with [submit "Submit"] (or appropriate button text)
9. Keep forms simple by default. Do NOT over-engineer.

When the user provides an image (form design, screenshot, or mockup): analyze the image and generate valid CF7 form code that matches the layout and fields shown. Output only the form code. Use the same rules above. For labels use HTML <label for="field-name">Text</label> (angle brackets), never [label] (square brackets). One label per field – do not repeat the same label twice. For "Contact number" or "Phone" use exactly: [cf7m-phone phone default:US label:"Contact number"] (no separate <label> above it – the shortcode renders label and field).

═══════════════════════════════════════════════════════════════════════════════
MARKUP & LABELS - AVOID UNCANNY TITLES
═══════════════════════════════════════════════════════════════════════════════

- Use sentence case for labels: "Your name", "Email address", "Phone number". NOT "Your Name" or "EMAIL ADDRESS".
- Do NOT add <h1>, <h2>, <h3>, or <p class="title"> inside the form. No headings. Only <label> and form tags.
- Keep labels short and natural: "Message" not "Please Enter Your Message Below".
- Do NOT use ALL CAPS or Title Case For Every Word. Normal sentence case only.

═══════════════════════════════════════════════════════════════════════════════
CF7 STANDARD TAGS (use these for most forms)
═══════════════════════════════════════════════════════════════════════════════

Text fields:
[text* your-name placeholder "Your name"]
[email* your-email placeholder "Email address"]
[tel your-phone placeholder "Phone number"]
[url your-website placeholder "Website URL"]
[date your-date]

Text area:
[textarea your-message placeholder "Your message"]

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
SHORTCODE SYNTAX (easy handle) - Attribute pattern: key:value or key:"quoted value"
═══════════════════════════════════════════════════════════════════════════════

CF7 standard: [tag* name placeholder "Text"]
CF7 Mate (use quoted value for spaces):
  [cf7m-row gap:20]
  [cf7m-col width:50] ... [/cf7m-col]
  [cf7m-number qty label:"Quantity" min:0 max:100 value:1 step:1]
  [cf7m-calc id:total formula:"qty * price"]
  [cf7m-total id:total format:currency prefix:"$" decimals:2 label:"Total"]
  [cf7m-phone phone default:US label:"Phone number" description:"Enter with country code."]
  [cf7m-star rating max:5]
  [cf7m-range amount min:0 max:100 step:1 default:50]
  [cf7m-presets style="modern"] ... [/cf7m-presets]

Always close: [/cf7m-col], [/cf7m-row], [/cf7m-presets], [/cf7m-step], [/acceptance].

═══════════════════════════════════════════════════════════════════════════════
FORM MARKUP PATTERN (required for every field)
═══════════════════════════════════════════════════════════════════════════════

One field = one label + one form tag. Use HTML <label> with angle brackets only. Never [label] – that does not render.

EXCEPTION – Do NOT add a separate <label> when the tag already has label:"..." inside it. These shortcodes render their own label: [cf7m-number ... label:"Quantity"], [cf7m-total ... label:"Total"], [cf7m-phone ... label:"Phone"]. Output ONLY the shortcode, no <label> above it.

Pattern (standard fields):
<label for="field-name">Label text</label>
[text* field-name]

Pattern (shortcode with built-in label – no <label> above):
[cf7m-total id:monthly-payment format:currency prefix:"$" decimals:2 label:"Monthly payment"]

The "for" value MUST exactly match the CF7 tag name (e.g. for="your-name" with [text* your-name]). Labels: sentence case, short. Do NOT add headings, titles, or extra <p> wrappers inside the form – only <label> and CF7 tags.

Example (simple form):
<label for="your-name">Your name</label>
[text* your-name]

<label for="your-email">Email address</label>
[email* your-email]

<label for="your-message">Message</label>
[textarea* your-message]

[submit "Send"]

═══════════════════════════════════════════════════════════════════════════════
MULTI-COLUMN LAYOUT (only when requested)
═══════════════════════════════════════════════════════════════════════════════

Use ONLY when user wants fields side-by-side or mentions "columns":

[cf7m-row gap:20]
[cf7m-col width:50]
<label for="first-name">First name</label>
[text* first-name]
[/cf7m-col]
[cf7m-col width:50]
<label for="last-name">Last name</label>
[text* last-name]
[/cf7m-col]
[/cf7m-row]

Column widths: 25, 33, 50, 66, 75, 100. ALWAYS close [/cf7m-col] and [/cf7m-row]. Use for="field-name" on labels.

═══════════════════════════════════════════════════════════════════════════════
FORM DESIGN – always use presets for styled forms
═══════════════════════════════════════════════════════════════════════════════

For contact, newsletter, feedback, booking, reservation, event, quote, job, lead, registration, survey, review, order, volunteer, complaint: ALWAYS wrap the entire form in [cf7m-presets style="NAME"]...[/cf7m-presets]. Presets provide spacing, borders, labels, placeholders, and button styles – no custom CSS needed.

Available styles (use one for the whole form):

- sky: light blue inputs, sky/air feel – good for friendly contact forms
- classic: gray borders, traditional – good for business
- box: card with padding and shadow – good for focused forms
- minimal: underline-only inputs, clean – good for newsletters
- dark: dark background, light text – good for modern sites
- modern: light gray fields, cyan accent – default for contact/beautiful forms
- rounded: large border radius, soft – good for friendly/creative

Rules: Wrap the FULL form (from first label to [submit]). Use HTML <label for="field-name"> only. Sentence case. No headings or extra wrappers inside the form.

EXAMPLE:
[cf7m-presets style="modern"]
<label for="your-name">Your name</label>
[text* your-name]

<label for="your-email">Email address</label>
[email* your-email]

<label for="your-message">Message</label>
[textarea* your-message]

[submit "Send"]
[/cf7m-presets]

Calculators: optional [cf7m-presets style="minimal"] or [cf7m-presets style="classic"] around the form; use [cf7m-number], [cf7m-calc], [cf7m-total] and [cf7m-button] for the trigger.

═══════════════════════════════════════════════════════════════════════════════
PHONE NUMBER (when user asks for phone with country/code)
═══════════════════════════════════════════════════════════════════════════════

Use [cf7m-phone] for phone with country prefix. Label and description go inside the shortcode:

[cf7m-phone phone default:US label:"Phone number" description:"Enter your phone for urgent contact."]

Optional: default:GB, placeholder:"...". Required: [cf7m-phone* ...]. Do NOT add a separate <label>; the shortcode renders label and description.

═══════════════════════════════════════════════════════════════════════════════
STAR RATING (only when user mentions "star" or "rating 1-5")
═══════════════════════════════════════════════════════════════════════════════

<label for="rating">Your rating</label>
[cf7m-star rating max:5]

═══════════════════════════════════════════════════════════════════════════════
CALCULATOR FORMS (only when user explicitly asks for calculator/pricing)
═══════════════════════════════════════════════════════════════════════════════

Use shortcodes in this order. Easy handle: id and formula reference field names.

1. Number inputs – use label:"..." inside the shortcode. Do NOT add <label> above – the shortcode renders it.
[cf7m-number qty label:"Quantity" value:1 min:0 max:100 step:1]
[cf7m-number price label:"Unit price" value:10 min:0 step:0.01 prefix:"$"]

2. Calculation – hidden; id must match the [cf7m-total] id. Formula uses field names:
[cf7m-calc id:total formula:"qty * price"]

3. Summary/Total display – use label:"..." inside the shortcode. Do NOT add <label for="..."> above – [cf7m-total] renders its own label.
[cf7m-total id:total format:currency prefix:"$" decimals:2 label:"Total"]

Full example (quote calculator) – no <label> above [cf7m-number] or [cf7m-total]; they have label:"..." inside:
[cf7m-number qty label:"Quantity" value:1 min:1 max:999 step:1]
[cf7m-number price label:"Price per item" value:0 min:0 step:0.01 prefix:"$"]
[cf7m-calc id:total formula:"qty * price"]
[cf7m-total id:total format:currency prefix:"$" decimals:2 label:"Total"]
[submit "Get quote"]

═══════════════════════════════════════════════════════════════════════════════
DECISION GUIDE - What to use based on request
═══════════════════════════════════════════════════════════════════════════════

"contact form" → Wrap in [cf7m-presets style="modern"] or style="sky". Name, email, subject, message, submit. Sentence case labels.
"newsletter" → Wrap in [cf7m-presets style="minimal"]. Email, acceptance checkbox, submit.
"feedback" → Wrap in [cf7m-presets style="modern"]. Name, email, rating (radio or stars), comments, submit.
"booking" / "appointment" → name, email, [cf7m-phone] for phone, date, time, message, submit.
"quote/pricing/calculator" → [cf7m-number] with label:", [cf7m-calc], [cf7m-total] with label:" for summary; use [cf7m-button "Calculate"] to trigger calculation (do not use [submit] for calc-only forms).
"columns/side by side" → [cf7m-row] and [cf7m-col].
"multi-step/wizard" → [cf7m-step].
"show/hide" → [cf7m-if].
"phone with country" → [cf7m-phone ... label:"..." description:"..."].
"style/preset/theme" → Wrap in [cf7m-presets style="X"]...[/cf7m-presets]. Pick style or "modern".

DEFAULT: Simple form. Sentence case labels. No headings inside form. When in doubt, keep it simple.

═══════════════════════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════════════════

Output ONLY the form code. No markdown, no explanations, no comments.
Do NOT output <h1>, <h2>, <h3>, <title>, or any heading. Start with the first <label> or form shortcode.
End with [submit "Button text"].
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
			'prompt'      => 'Create a contact form. Wrap the entire form in [cf7m-presets style="modern"]...[/cf7m-presets]. Fields: name, email, subject dropdown, message. Use HTML <label for="field-name"> only, sentence case. No columns or steps.',
		),
		'newsletter' => array(
			'name'        => __('Newsletter', 'cf7-styler-for-divi'),
			'description' => __('Email subscription.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a newsletter form. Wrap the entire form in [cf7m-presets style="minimal"]...[/cf7m-presets]. Fields: email only, terms acceptance checkbox, subscribe button. Use HTML <label for="field-name"> only, sentence case. Nothing else.',
		),
		'feedback'   => array(
			'name'        => __('Feedback', 'cf7-styler-for-divi'),
			'description' => __('Customer feedback.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a feedback form. Wrap the entire form in [cf7m-presets style="modern"]...[/cf7m-presets]. Fields: name, email, satisfaction rating (radio buttons 1-5), comments textarea. Use HTML <label for="field-name"> only, sentence case. Simple layout, no columns.',
		),
		'support'    => array(
			'name'        => __('Support Ticket', 'cf7-styler-for-divi'),
			'description' => __('Support request.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a support ticket form. Wrap the entire form in [cf7m-presets style="classic"]...[/cf7m-presets]. Fields: name, email, department dropdown, priority dropdown, subject text, description textarea, optional file upload. Use HTML <label for="field-name"> only, sentence case. Simple layout.',
		),

		// ─── Booking & Appointment ──────────────────────────────────────
		'booking'    => array(
			'name'        => __('Appointment', 'cf7-styler-for-divi'),
			'description' => __('Booking form.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create an appointment booking form. Wrap the entire form in [cf7m-presets style="sky"]...[/cf7m-presets]. Fields: name, email, [cf7m-phone] for phone, service dropdown, date field, time dropdown, notes textarea. Use HTML <label for="field-name"> only where needed; [cf7m-phone] has its own label. Sentence case. Simple layout.',
		),
		'reservation' => array(
			'name'        => __('Reservation', 'cf7-styler-for-divi'),
			'description' => __('Restaurant booking.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a restaurant reservation form. Wrap the entire form in [cf7m-presets style="classic"]...[/cf7m-presets]. Fields: name, phone, email, date, time dropdown, number of guests dropdown (1-10), special requests textarea. Use HTML <label for="field-name"> only, sentence case.',
		),
		'event'      => array(
			'name'        => __('Event RSVP', 'cf7-styler-for-divi'),
			'description' => __('Event registration.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create an event registration form. Wrap the entire form in [cf7m-presets style="modern"]...[/cf7m-presets]. Fields: name, email, phone, company, attending radio (Yes/No), dietary requirements checkboxes, notes textarea. Use HTML <label for="field-name"> only, sentence case.',
		),

		// ─── Business Forms ─────────────────────────────────────────────
		'quote_request' => array(
			'name'        => __('Quote Request', 'cf7-styler-for-divi'),
			'description' => __('Get a quote.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a quote request form. Wrap the entire form in [cf7m-presets style="classic"]...[/cf7m-presets]. Fields: name, company, email, phone, service dropdown, budget dropdown, project description textarea. Use [cf7m-row] and [cf7m-col] for 2-column layout for name and company only. Use HTML <label for="field-name"> only, sentence case.',
		),
		'job_application' => array(
			'name'        => __('Job Application', 'cf7-styler-for-divi'),
			'description' => __('Employment form.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a job application form. Wrap the entire form in [cf7m-presets style="classic"]...[/cf7m-presets]. Fields: full name, email, phone, position dropdown, experience dropdown, resume file upload, cover letter textarea. Use HTML <label for="field-name"> only, sentence case.',
		),
		'lead_gen'   => array(
			'name'        => __('Lead Form', 'cf7-styler-for-divi'),
			'description' => __('Lead generation.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a lead generation form. Wrap the entire form in [cf7m-presets style="modern"]...[/cf7m-presets]. Fields: first name, last name, work email, company, company size dropdown, "How can we help?" textarea. Use [cf7m-row] and [cf7m-col] for 2-column layout for first/last name only. Use HTML <label for="field-name"> only, sentence case.',
		),

		// ─── Registration ───────────────────────────────────────────────
		'registration' => array(
			'name'        => __('Registration', 'cf7-styler-for-divi'),
			'description' => __('Account signup.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a registration form. Wrap the entire form in [cf7m-presets style="modern"]...[/cf7m-presets]. Fields: username, email, phone, terms acceptance checkbox. Use HTML <label for="field-name"> only, sentence case. Simple layout, no columns.',
		),

		// ─── Surveys ────────────────────────────────────────────────────
		'survey'     => array(
			'name'        => __('Survey', 'cf7-styler-for-divi'),
			'description' => __('Customer survey.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a survey form. Wrap the entire form in [cf7m-presets style="minimal"]...[/cf7m-presets]. Fields: name (optional), email (optional), satisfaction radio buttons (1-5), recommend radio (Yes/No/Maybe), suggestions textarea. Use HTML <label for="field-name"> only, sentence case.',
		),
		'review'     => array(
			'name'        => __('Review', 'cf7-styler-for-divi'),
			'description' => __('Product review.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a product review form. Wrap the entire form in [cf7m-presets style="modern"]...[/cf7m-presets]. Fields: name, email, overall rating ([cf7m-star] max:5), review title, review text textarea, recommend checkbox. Use HTML <label for="field-name"> only, sentence case.',
		),

		// ─── Calculators ────────────────────────────────────────────────
		'mortgage'   => array(
			'name'        => __('Mortgage Calc', 'cf7-styler-for-divi'),
			'description' => __('Mortgage calculator.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a mortgage calculator. Use [cf7m-number] with label:"..." for home price, down payment, interest rate, loan term; [cf7m-calc] for monthly payment; [cf7m-total] to display result; [cf7m-button "Calculate"] to trigger (no [submit]). Optionally wrap in [cf7m-presets style="minimal"]...[/cf7m-presets].',
		),
		'loan'       => array(
			'name'        => __('Loan Calc', 'cf7-styler-for-divi'),
			'description' => __('Loan calculator.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a simple loan calculator. Use [cf7m-number] with label:"..." for principal, interest rate, term; [cf7m-calc] for monthly payment; [cf7m-total] to display; [cf7m-button "Calculate"] to trigger (no [submit]). Optionally wrap in [cf7m-presets style="minimal"]...[/cf7m-presets].',
		),
		'quote'      => array(
			'name'        => __('Price Quote', 'cf7-styler-for-divi'),
			'description' => __('Service pricing.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a service quote calculator. Use [cf7m-number] with label:"..." for base price and quantity; [cf7m-calc] and [cf7m-total] for subtotal/total; [cf7m-button "Calculate"] to trigger (no [submit]). Optionally wrap in [cf7m-presets style="classic"]...[/cf7m-presets].',
		),
		'tip'        => array(
			'name'        => __('Tip Calc', 'cf7-styler-for-divi'),
			'description' => __('Tip calculator.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a tip calculator. Use [cf7m-number] with label:"..." for bill amount and number of people; dropdown for tip percentage (15, 18, 20, 25); [cf7m-calc] for tip and per person; [cf7m-total] to display; [cf7m-button "Calculate"] to trigger (no [submit]). Optionally wrap in [cf7m-presets style="minimal"]...[/cf7m-presets].',
		),

		// ─── Specialized ────────────────────────────────────────────────
		'order'      => array(
			'name'        => __('Order Form', 'cf7-styler-for-divi'),
			'description' => __('Product order.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create an order form. Wrap the entire form in [cf7m-presets style="classic"]...[/cf7m-presets]. Fields: customer name, email, phone, product checkboxes, delivery address textarea, payment method radio buttons. Use HTML <label for="field-name"> only, sentence case.',
		),
		'volunteer'  => array(
			'name'        => __('Volunteer', 'cf7-styler-for-divi'),
			'description' => __('Volunteer signup.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a volunteer signup form. Wrap the entire form in [cf7m-presets style="modern"]...[/cf7m-presets]. Fields: name, email, phone, availability checkboxes (Weekdays, Weekends, Mornings, Evenings), skills textarea. Use HTML <label for="field-name"> only, sentence case.',
		),
		'complaint'  => array(
			'name'        => __('Complaint', 'cf7-styler-for-divi'),
			'description' => __('Complaint form.', 'cf7-styler-for-divi'),
			'prompt'      => 'Create a complaint form. Wrap the entire form in [cf7m-presets style="classic"]...[/cf7m-presets]. Fields: name, email, order number, category dropdown, description textarea, optional file attachment. Use HTML <label for="field-name"> only, sentence case.',
		),
	);
}
