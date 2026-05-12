# CF7 Mate Pro — Feature Reference

Complete reference for every feature in CF7 Mate Pro: what it does, how it works, and where to configure it.

---

## Table of Contents

1. [Form Responses](#1-form-responses)
2. [Form Analytics](#2-form-analytics)
3. [Webhooks](#3-webhooks)
4. [Conditional Logic](#4-conditional-logic)
5. [Multi-Step Forms](#5-multi-step-forms)
6. [Multi-Column Layout](#6-multi-column-layout)
7. [Form Scheduling](#7-form-scheduling)
8. [Email Routing](#8-email-routing)
9. [Save & Continue](#9-save--continue)
10. [AI Form Generator](#10-ai-form-generator)
11. [Style Presets](#11-style-presets)
12. [Advanced Fields](#12-advanced-fields)
13. [Page Builder Integrations](#13-page-builder-integrations)

---

## 1. Form Responses

Save every form submission to the WordPress database and review them in the CF7 Mate dashboard.

### How it works

When a visitor submits a CF7 form, the submission is stored as a custom post type (`cf7m_entry`) with all field values, metadata (IP, user agent, timestamp), and a status (`new`, `read`, `trash`). A dedicated Responses admin page lets you browse, filter, search, and export submissions.

### What you can do

- **Browse submissions** — table view with form filter, status filter, and keyword search
- **View a single entry** — full field data, submission info (IP, browser, device, date), and status
- **Change status** — mark as read, move to trash, restore from trash, delete permanently
- **Bulk actions** — select multiple entries to trash or delete
- **Export to CSV** — download filtered results
- **Print / Save as PDF** — browser print view for a single entry

### Where to configure

- **Dashboard → Responses** — the main submissions inbox
- **Dashboard → Settings → Features** — enable/disable the Responses module

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cf7-styler/v1/entries` | List entries (supports `status`, `form_id`, `search`, `per_page`, `page`) |
| `GET` | `/cf7-styler/v1/entries/{id}` | Get a single entry |
| `POST` | `/cf7-styler/v1/entries/{id}` | Update entry status |
| `DELETE` | `/cf7-styler/v1/entries/{id}` | Permanently delete |
| `DELETE` | `/cf7-styler/v1/entries/bulk-delete` | Permanently delete multiple |
| `GET` | `/cf7-styler/v1/entries/export` | Download CSV |
| `GET` | `/cf7-styler/v1/entries/{id}/print` | HTML print view |

---

## 2. Form Analytics

Track how many times each form is viewed, how many submissions it receives, and what the conversion rate is.

### How it works

A lightweight frontend script fires a `POST` request to the analytics API each time a page containing a CF7 form loads. This increments a view counter stored in the WordPress options table (one option key per form: `cf7m_views_{form_id}`). Submission counts are pulled from the Responses database in real time. Conversion rate is calculated as `submissions / views × 100`.

### Metrics tracked per form

| Metric | Description |
|--------|-------------|
| Views | Total page loads containing the form |
| Submissions | Non-trashed, non-spam entries in the given date range |
| Conversion rate | `(submissions / views) × 100` |
| Last submission | Date of the most recent submission |

### Where to configure

- **Dashboard → Analytics** — table showing all forms with their stats
- **Date range selector** — filter stats to last 30 days, 7 days, or all time
- **Dashboard → Settings → Features** — enable/disable the Analytics module

### Notes

- View tracking is nonce-verified to reduce spam counts
- View counts are global (not scoped to date range); submission counts respect the selected date filter
- The module only loads when the Pro license is active

---

## 3. Webhooks

Forward every form submission to any external URL in real time — Zapier, Make, Slack, Google Sheets, or your own endpoint.

### How it works

After a form is submitted and CF7 validates it, CF7 Mate fires a non-blocking HTTP `POST` to each configured webhook URL. The payload is JSON and includes the form ID, title, timestamp, all field values, and client IP/user agent.

### Payload structure

```json
{
  "form_id": 42,
  "form_title": "Contact Form",
  "submitted_at": "2026-05-12T10:30:00+00:00",
  "posted_data": {
    "your-name": "Jane Smith",
    "your-email": "jane@example.com",
    "your-message": "Hello!"
  },
  "ip": "203.0.113.1",
  "user_agent": "Mozilla/5.0 ..."
}
```

### HTTP details

- **Method:** `POST`
- **Content-Type:** `application/json`
- **Timeout:** 15 seconds
- **Mode:** Non-blocking (request fires and moves on; does not delay form submission)
- **Custom header:** `X-CF7-Mate-Webhook: 1`

### Where to configure

- **Dashboard → Settings → Webhook** — add one or more destination URLs
- Each URL receives every submission from every form

### Notes

- Multiple URLs supported; all receive the same payload
- Failed deliveries are not retried (fire-and-forget)
- Webhook fires even if the "Form Responses" module is disabled

---

## 4. Conditional Logic

Show or hide form fields dynamically based on what the user has entered or selected.

### How it works

Wrap any fields inside a `[cf7m-if]` shortcode. The wrapper is rendered as a `<div>` with data attributes that the frontend JS reads to evaluate the condition. Fields inside hidden wrappers are not validated by CF7 (they are effectively removed from the form).

### Shortcode syntax

```
[cf7m-if field:"department" is:"Sales"]
  [text your-manager "Manager's name"]
[/cf7m-if]
```

### Supported operators

| Operator | Meaning |
|----------|---------|
| `is` | Field value equals |
| `not` | Field value does not equal |
| `contains` | Field value contains substring |
| `gt` | Numeric greater than |
| `lt` | Numeric less than |
| `gte` | Numeric greater than or equal |
| `lte` | Numeric less than or equal |
| `empty` | Field is empty |
| `checked` | Checkbox is checked |
| `any` | Value matches any in a comma-separated list |

### Multiple conditions

Use `and:` or `or:` to combine conditions:

```
[cf7m-if field:"role" is:"admin" and:field:"region" is:"EMEA"]
  [text budget-code]
[/cf7m-if]
```

### Where to configure

- Directly in the **CF7 form editor** using the tag generator
- **Dashboard → Settings → Features** — enable/disable the Conditional Logic module

---

## 5. Multi-Step Forms

Split a long form into sequential steps with a progress indicator.

### How it works

Wrap each step's fields inside a `[cf7m-step]` shortcode. CF7 Mate renders each step inside its own container with a progress bar or step indicators at the top. A Next / Previous button pair is injected automatically. The final step retains the CF7 Submit button.

### Shortcode syntax

```
[cf7m-step title="Your Details" style:circles]
  [text your-name "Full name"]
  [email your-email "Email"]
[/cf7m-step]

[cf7m-step title="Your Message"]
  [textarea your-message "Message"]
[/cf7m-step]
```

### Progress bar styles

| Style | Description |
|-------|-------------|
| `circles` | Numbered circle indicators (default) |
| `progress-bar` | Horizontal filled bar |
| `connected` | Circles connected by a line |

The `style` attribute is set on the **first** step only and applies to the entire form.

### Where to configure

- Directly in the **CF7 form editor** using the tag generator
- **Dashboard → Settings → Features** — enable/disable the Multi-Step module

---

## 6. Multi-Column Layout

Place form fields side by side using a column grid layout.

### How it works

Wrap fields inside `[cf7m-row]` and `[cf7m-col]` shortcodes. CF7 Mate converts these to CSS grid/flexbox with configurable gaps and column widths.

### Shortcode syntax

```
[cf7m-row gap:20]
  [cf7m-col width:60]
    [text your-name "Full name"]
  [/cf7m-col]
  [cf7m-col width:40]
    [tel your-phone "Phone"]
  [/cf7m-col]
[/cf7m-row]
```

### Attributes

| Attribute | Where | Description |
|-----------|-------|-------------|
| `gap` | `[cf7m-row]` | Space between columns in pixels (default: 20) |
| `width` | `[cf7m-col]` | Column width as percentage (default: 50) |

### Where to configure

- Directly in the **CF7 form editor** using the tag generator
- **Dashboard → Settings → Features** — enable/disable the Multi-Column module

---

## 7. Form Scheduling

Automatically open and close forms on specific dates and times.

### How it works

Each form has an optional scheduling window defined by an open date, a close date, or both. When a visitor loads the form outside the scheduled window, the form is replaced with a custom closed message. Server-side validation also rejects submissions made outside the window (prevents bypassing via API).

### What you can configure per form

| Setting | Description |
|---------|-------------|
| Enable scheduling | Toggle to activate the schedule for this form |
| Open date | Date/time when the form becomes available (optional) |
| Close date | Date/time when the form stops accepting submissions (optional) |
| Closed message | Custom HTML/text shown when the form is unavailable |

### Behaviour

- **Before open date:** Form is replaced with the closed message
- **Between open and close:** Form renders and accepts submissions normally
- **After close date:** Form is replaced with the closed message
- **No open date set:** Form is available immediately until the close date
- **No close date set:** Form opens on the open date and stays open indefinitely

### Where to configure

- **CF7 editor → Form Scheduling panel** (appears when the module is enabled)
- **Dashboard → Settings → Features** — enable/disable the Form Scheduling module

---

## 8. Email Routing

Send CF7 email notifications to different recipients based on field values submitted in the form.

### How it works

You define a list of routing rules per form. Each rule watches a specific field and, if the condition matches, overrides the default mail recipient(s) with your specified email address(es). Rules are evaluated in order; the first match wins.

### Rule structure

Each rule has four parts:

| Part | Description |
|------|-------------|
| Field | The CF7 field name to evaluate (e.g. `department`) |
| Operator | `is`, `is_not`, or `contains` |
| Value | The value to match against |
| Emails | One or more recipient email addresses |

### Example

Form has a `department` dropdown. Route to different teams:

| Field | Operator | Value | Send to |
|-------|----------|-------|---------|
| `department` | is | `Sales` | `sales@example.com` |
| `department` | is | `Support` | `support@example.com` |
| `department` | is_not | *(anything)* | `info@example.com` |

If no rule matches, CF7's default recipient is used unchanged.

### Where to configure

- **CF7 editor → Email Routing panel** — add/edit/remove routing rules per form
- **Dashboard → Settings → Features** — enable/disable the Email Routing module

---

## 9. Save & Continue

Let users save their partially filled form and come back to finish it later — no account required.

### How it works

When enabled on a form, a **Save progress** button appears alongside the Submit button. Clicking it sends the current field values to a WordPress REST API endpoint, which stores them as a transient keyed by a unique browser token. The token is saved in `localStorage`. The next time the user visits the same page, the JS detects the token, fetches the saved data, and repopulates all fields automatically.

### Behaviour

- **No account needed** — progress is identified by a 32-character token stored in the user's browser
- **Expires after 7 days** — transient data is automatically cleaned up by WordPress
- **Cleared on submit** — once the form is successfully submitted, saved progress is deleted
- **Per-form** — only forms with the checkbox enabled show the Save button

### Where to configure

- **CF7 editor → Save & Continue panel** — checkbox to enable for that specific form
- **Dashboard → Settings → Features** — enable/disable the Save & Continue module globally

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/cf7-styler/v1/partial-save` | Save current field values |
| `GET` | `/cf7-styler/v1/partial-save/{token}` | Retrieve saved values |
| `DELETE` | `/cf7-styler/v1/partial-save/{token}` | Clear saved progress |

---

## 10. AI Form Generator

Generate a complete CF7 form from a plain-English prompt using an AI provider.

### How it works

You describe the form you need in plain English. CF7 Mate sends the description to the configured AI provider (OpenAI or compatible), which returns a ready-to-use CF7 shortcode block. The result is displayed in the admin and can be copied directly into the CF7 form editor.

### Example prompts

- *"A job application form with name, email, phone, position dropdown (Designer, Developer, Manager), resume upload, and a cover letter textarea"*
- *"Simple contact form with name, company, email, and a message field, all required"*
- *"Event registration form for a conference: name, email, dietary requirements (None, Vegetarian, Vegan, Gluten-free), and t-shirt size"*

### Supported AI providers

| Provider | Notes |
|----------|-------|
| OpenAI | GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo |
| Anthropic | Claude 3 models |
| Google | Gemini Pro |
| Custom endpoint | Any OpenAI-compatible API |

### Where to configure

- **Dashboard → Settings → AI Settings** — select provider, enter API key, choose model
- The generator itself is available directly in the **CF7 form editor** via a "Generate with AI" button

### Notes

- Requires a valid API key from the chosen provider
- API keys are stored encrypted in the database
- The feature works independently of the Pro license check (API key is the gate)

---

## 11. Style Presets

Apply a pre-built visual theme to any CF7 form with a single shortcode.

### How it works

Wrap your form fields inside a `[cf7m-presets]` shortcode. CF7 Mate wraps the output in a `<div class="cf7-mate-preset {style}">` container. Each preset is a self-contained CSS file that styles all CF7 inputs, labels, buttons, and error states within that container.

### Available presets

| Preset | Description |
|--------|-------------|
| `sky` | Light blue gradient, rounded inputs |
| `classic` | Traditional bordered form style |
| `box` | Solid box borders with flat design |
| `minimal` | Ultra-clean, borderless style |
| `dark` | Dark background with light text |
| `modern` | Contemporary with accent colours |
| `rounded` | Heavily rounded corners on all elements |

### Shortcode syntax

```
[cf7m-presets style="sky"]
  [text your-name "Name" placeholder "Your name"]
  [email your-email "Email" placeholder "your@email.com"]
  [submit "Send Message"]
[/cf7m-presets]
```

### Where to configure

- Directly in the **CF7 form editor**
- **Dashboard → Settings → Features** — enable/disable Style Presets globally

---

## 12. Advanced Fields

Extra field types you can add to any CF7 form.

### Star Rating

A 1–5 star click-to-rate input.

```
[cf7m-star-rating your-rating "How would you rate us?"]
```

### Range Slider

A draggable numeric slider with configurable min/max/step values.

```
[cf7m-range-slider budget min:100 max:10000 step:100]
```

### Separator

A horizontal divider line to visually group form sections.

```
[cf7m-separator]
```

### Image

An image upload field (single image, with preview).

```
[cf7m-image your-photo "Upload a photo"]
```

### Icon

An icon picker that lets users choose from a preset icon set.

```
[cf7m-icon your-icon "Choose an icon"]
```

### Phone Number *(Pro)*

An international phone input with country code selector and 100+ country dial codes.

```
[cf7m-phone your-phone "Phone number" default:US]
```

| Attribute | Description |
|-----------|-------------|
| `default` | ISO2 country code for the pre-selected country (e.g. `US`, `GB`, `AU`) |

### Heading *(Pro)*

Add section headings (H1–H6) inside a form for visual structure.

```
[cf7m-heading level:2]Contact Details[/cf7m-heading]
```

or self-closing:

```
[cf7m-heading text="Contact Details" tag:h2]
```

### Where to configure

- **Dashboard → Settings → Features → Advanced Fields** — umbrella toggle to enable/disable the group, then individual toggles per field type
- Pro fields (Phone, Heading) require an active Pro license

---

## 13. Page Builder Integrations

Style and embed CF7 forms directly inside your page builder of choice.

### Divi Builder

A native Divi module called **CF7 Styler** appears in the Divi module library. Select any CF7 form, then style it using Divi's design controls (colours, fonts, spacing, borders) without writing CSS.

### Bricks Builder

A Bricks element lets you embed and style CF7 forms inside Bricks layouts with full control over input appearance.

### Elementor

A dedicated Elementor widget for CF7 forms with style controls in the Elementor panel.

### Block Editor (Gutenberg)

A WordPress block that embeds any CF7 form and exposes basic styling options in the block inspector.

### Where to configure

- **Dashboard → Settings → Features → Page Builders** — each integration has its own toggle
- The toggle for a builder only appears if CF7 Mate detects that the builder is installed and active

---

## Feature Availability Summary

| Feature | Free | Pro |
|---------|------|-----|
| Divi, Bricks, Elementor, Block Editor modules | Yes | Yes |
| Star Rating, Range Slider, Separator, Image, Icon | Yes | Yes |
| Multi-Column Layout | — | Yes |
| Multi-Step Forms | — | Yes |
| Conditional Logic | — | Yes |
| Style Presets | — | Yes |
| Form Responses (database) | — | Yes |
| Form Analytics | — | Yes |
| Webhooks | — | Yes |
| Form Scheduling | — | Yes |
| Email Routing | — | Yes |
| Save & Continue | — | Yes |
| AI Form Generator | — | Yes |
| Phone Number field | — | Yes |
| Heading field | — | Yes |
