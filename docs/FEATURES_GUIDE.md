# CF7 Mate – Features Guide

CF7 Mate (Styler Mate for Contact Form 7) is an all-in-one toolkit for Contact Form 7. It gives you **19 features** in total: **9 free** and **10 Pro**. This guide explains what each feature does, how it works, and how it helps you and your visitors.

---

## Overview

| Type | Count | Purpose |
|------|--------|---------|
| **Free** | 9 | Builder integrations, layout, and extra form fields |
| **Pro** | 10 | Advanced layout, entries, automation, and power-user tools |
| **Total** | **19** | Complete CF7 styling, storage, and integration |

---

## Free Features (9)

### 1. Divi Styler Module

**Purpose:** Place and style Contact Form 7 forms using Divi’s visual builder so forms match your site design.

**How it works:** A native Divi module lets you pick a CF7 form and control its look (colors, spacing, typography, borders, buttons, messages) from the Divi interface. Works in both Divi 4 and Divi 5.

**How it helps:** You get full visual control over CF7 forms without writing CSS. Forms look like part of your Divi-built pages.

---

### 2. Bricks Styler Element

**Purpose:** Style CF7 forms inside Bricks Builder with the same idea as the Divi module.

**How it works:** A Bricks element lets you select a CF7 form and style it (layout, spacing, colors, etc.) from Bricks’ design options.

**How it helps:** Bricks users can design CF7 forms visually and keep everything in one builder.

---

### 3. Elementor Styler Widget

**Purpose:** Style CF7 forms inside Elementor.

**How it works:** An Elementor widget lets you choose a CF7 form and adjust its appearance using Elementor’s styling controls.

**How it helps:** Elementor users get a single place to build pages and style CF7 forms without leaving the editor.

---

### 4. Grid Layout

**Purpose:** Arrange form fields in a responsive grid (e.g. 2–3 columns) instead of a single column.

**How it works:** In the Divi (or other builder) module, you set column count and gap. Fields follow the grid on desktop and stack on smaller screens.

**How it helps:** Forms with many short fields (name, email, phone) look cleaner and use space better; completion feels easier.

---

### 5. Star Rating Field

**Purpose:** Let visitors give a rating (e.g. 1–5 stars) instead of typing—ideal for reviews and feedback.

**How it works:** You add a star rating field in the CF7 form editor via the CF7 Mate tag generator (name, number of stars, optional default). The submitted value is the selected number (e.g. 4 for 4 stars).

**How it helps:** Clear, quick feedback collection; better for mobile and less prone to invalid input.

---

### 6. Range Slider Field

**Purpose:** Let users pick a value on a slider (e.g. budget, quantity, satisfaction level).

**How it works:** You add a range slider in the CF7 form with min, max, step, and optional default. The value is submitted with the form.

**How it helps:** Precise, intuitive input for numeric choices; good for quotes, surveys, and filters.

---

### 7. Separator Field

**Purpose:** Add horizontal divider lines between form sections for clearer structure.

**How it works:** You insert a separator in the form. It’s a visual divider only (no submitted value).

**How it helps:** Long forms are easier to scan; sections (e.g. “Contact” vs “Message”) are clearly separated.

---

### 8. Image Field

**Purpose:** Show images inside the form (e.g. product photo, instruction graphic).

**How it works:** You add an image field in the form and set the image URL or media. It displays in the form and can be styled in the builder.

**How it helps:** Forms can include visuals for context, instructions, or branding without custom HTML.

---

### 9. Icon Field

**Purpose:** Add icons next to labels or sections to highlight or clarify.

**How it works:** You add an icon field and choose the icon. It appears in the form and can be styled in the module.

**How it helps:** Sections and labels are easier to recognize; forms look more polished and professional.

---

## Pro Features (10)

### 10. Multi Column

**Purpose:** Build advanced multi-column form layouts with control over breakpoints (e.g. 3 columns on desktop, 2 on tablet, 1 on mobile).

**How it works:** Pro layout options in the module let you set column counts and when they change by screen size. You get finer control than the free grid.

**How it helps:** Complex forms (e.g. long applications, multi-part surveys) stay readable and organized on all devices.

---

### 11. Multi Step Forms

**Purpose:** Split one long form into several steps (screens) with Next/Back and an optional progress indicator.

**How it works:** You add step tags (e.g. `[step 1]`, `[step 2]`) in the CF7 form. The module shows one step at a time; all data is submitted together at the end. Progress can be styled in the module.

**How it helps:** Long forms feel shorter and less overwhelming; completion rates often improve.

---

### 12. Form Entries (Database Entries)

**Purpose:** Save every CF7 submission to your WordPress database so you can view, search, filter, and export without another plugin.

**How it works:** Enable the feature in CF7 Mate → Modules. Submissions are stored automatically. In CF7 Mate → Entries you can filter by form/date/status, view each submission, mark as read/spam, delete, and export to CSV.

**How it helps:** One place for all form data; no dependency on email only; easy backup and reporting via CSV.

---

### 13. Phone Number Field

**Purpose:** Collect phone numbers with country prefix, searchable country selector, and optional flags.

**How it works:** You add a phone number field via the CF7 Mate tag generator. Front-end shows country dropdown and validated phone input. Submitted value includes country and number.

**How it helps:** Correct format and country code; better for international contacts and CRM/automation.

---

### 14. Heading Field

**Purpose:** Add H1–H6 headings inside the form to structure content (e.g. “Contact details”, “Your message”).

**How it works:** You insert heading fields and set level and text. They’re output as proper heading tags and can be styled in the module.

**How it helps:** Clear sections and better accessibility; forms are easier to read and navigate.

---

### 15. Calculator / Price Estimator

**Purpose:** Show live calculations (e.g. quote total, order total) based on form field values.

**How it works:** You define formulas that use field values (e.g. quantity × price). The result updates as the user types or selects. The calculated value can be included in the submission.

**How it helps:** Quotes and price estimators feel interactive; users see the result before submitting.

---

### 16. Conditional Logic

**Purpose:** Show or hide fields based on other field values (e.g. show “Company name” only when “Are you a business?” is Yes).

**How it works:** You define rules in the form (e.g. “Show field X when field Y equals Z”). The front-end shows or hides fields as the user changes the controlling field.

**How it helps:** Shorter, relevant forms; less clutter and higher completion rates.

---

### 17. AI Form Generator

**Purpose:** Generate CF7 form markup using natural language (e.g. “Contact form with name, email, phone, and a message”).

**How it works:** You describe the form you want; the AI suggests CF7 tags and structure. You paste or adapt the result into your form.

**How it helps:** Faster form creation; useful for non-technical users and quick iterations.

---

### 18. Presets

**Purpose:** Apply pre-built styling presets to forms with one click (e.g. “Minimal”, “Dark”, “Bordered”).

**How it works:** You choose a preset in the module; it applies a set of design options (colors, spacing, borders, etc.). You can still tweak after applying.

**How it helps:** Consistent, professional looks in seconds; good starting point for new forms.

---

### 19. Webhook

**Purpose:** Send each form submission to one or more external URLs (e.g. Zapier, Make, CRM, your API) as JSON.

**How it works:** Enable Webhook in CF7 Mate → Modules, then add URL(s) in CF7 Mate → Webhook. On each submission, a POST request with JSON (form id, title, time, all fields, IP, user agent) is sent in the background to each URL.

**How it helps:** Automation and integrations without extra plugins; real-time sync to CRMs, spreadsheets, or custom backends.

---

## Quick reference

| # | Feature | Free/Pro | Main benefit |
|---|---------|----------|--------------|
| 1 | Divi Styler Module | Free | Visual form styling in Divi |
| 2 | Bricks Styler Element | Free | Visual form styling in Bricks |
| 3 | Elementor Styler Widget | Free | Visual form styling in Elementor |
| 4 | Grid Layout | Free | Responsive multi-column fields |
| 5 | Star Rating Field | Free | Star ratings for feedback |
| 6 | Range Slider Field | Free | Slider for numeric input |
| 7 | Separator Field | Free | Section dividers |
| 8 | Image Field | Free | Images inside forms |
| 9 | Icon Field | Free | Icons in forms |
| 10 | Multi Column | Pro | Advanced column breakpoints |
| 11 | Multi Step Forms | Pro | Step-by-step long forms |
| 12 | Form Entries | Pro | Save & export submissions |
| 13 | Phone Number Field | Pro | Country + validated phone |
| 14 | Heading Field | Pro | H1–H6 in forms |
| 15 | Calculator | Pro | Live calculations / quotes |
| 16 | Conditional Logic | Pro | Show/hide by other fields |
| 17 | AI Form Generator | Pro | Generate forms from text |
| 18 | Presets | Pro | One-click form styles |
| 19 | Webhook | Pro | Send data to external URLs |

---

## More detail per feature

Short, step-by-step docs for each feature are in the `docs/features/` folder:

- **Free:** `cf7-styler-for-divi.txt`, `bricks-styler-element.txt`, `elementor-styler-widget.txt`, `grid-layout.txt`, `star-rating.txt`, `range-slider.txt`, `separator.txt`, `image-field.txt`, `icon-field.txt`
- **Pro:** `multi-column.txt`, `multi-step-forms.txt`, `form-entries.txt`, `phone-number-field.txt`, `heading-field.txt`, `calculator.txt`, `conditional-logic.txt`, `ai-form-generator.txt`, `presets.txt`, `webhook.txt`

See `docs/features/README.txt` for the full list.
