# Multi-Step Forms — `[cf7m-step]`

> **Feature tier:** Pro
> **Since:** 3.0.0
> **Location:** `includes/pro/features/multi-steps/module.php`
> **Assets:** `assets/pro/css/cf7m-pro-forms.css`, `assets/pro/js/cf7m-multi-steps.js`

---

## Overview

The multi-step feature splits a Contact Form 7 form into wizard-style steps with a progress indicator and Previous/Next navigation. Users fill in one step at a time.

---

## Basic Usage

Wrap each section of your CF7 form in `[cf7m-step]...[/cf7m-step]` tags:

```
[cf7m-step title:"Your info"]
<label for="your-name">Your name</label>
[text* your-name]

<label for="your-email">Email address</label>
[email* your-email]
[/cf7m-step]

[cf7m-step title:"Your message"]
<label for="your-message">Message</label>
[textarea* your-message]

[submit "Send"]
[/cf7m-step]
```

- Each `[cf7m-step]` becomes a separate page in the form
- Previous / Next buttons are generated automatically
- Place `[submit]` inside the **last** step
- The first step is shown by default; all others are hidden

---

## Attributes

| Attribute | Placed on | Required | Default | Description |
|-----------|-----------|----------|---------|-------------|
| `title` | Any step | No | `"Step N"` | Label for the step (used in connected style labels and `data-title` attribute) |
| `style` | **First step only** | No | `"circles"` | Progress indicator design — see styles below |

### Attribute syntax

Use the CF7 Mate shortcode format — `key:"quoted value"` or `key:value`:

```
[cf7m-step style:"connected" title:"Account info"]
```

---

## Progress Indicator Styles

### 1. Circles (default)

Simple numbered circles. Active = blue, completed = green, upcoming = gray.

```
[cf7m-step title:"Step 1"]
...
[/cf7m-step]
```

No `style` attribute needed — this is the default.

**HTML output:**
```html
<div class="cf7m-steps-progress">
  <span class="cf7m-progress-step active" data-step="1">1</span>
  <span class="cf7m-progress-step" data-step="2">2</span>
  <span class="cf7m-progress-step" data-step="3">3</span>
</div>
```

**CSS classes:**
- `.cf7m-progress-step` — base circle
- `.cf7m-progress-step.active` — current step (blue `#3044D7`)
- `.cf7m-progress-step.completed` — past step (green `#10b981`)

---

### 2. Progress Bar

Horizontal fill bar with a "Step X/N" label below.

```
[cf7m-step style:"progress-bar" title:"Account"]
...
[/cf7m-step]
```

**HTML output:**
```html
<div class="cf7m-steps-progress cf7m-progress--bar">
  <div class="cf7m-progress-bar-track">
    <div class="cf7m-progress-bar-fill" style="width:25%"></div>
  </div>
  <div class="cf7m-progress-bar-label">Step 1/4</div>
</div>
```

**CSS classes:**
- `.cf7m-progress--bar` — modifier on the progress container
- `.cf7m-progress-bar-track` — full-width gray track (6px height)
- `.cf7m-progress-bar-fill` — dark fill bar, width animated via JS
- `.cf7m-progress-bar-label` — "Step X/N" text below the bar

**JS behaviour:** On navigation, the fill width updates to `(currentStep / totalSteps * 100)%` and the label text updates.

---

### 3. Connected (Circles with Labels)

Numbered circles connected by horizontal lines. Each circle shows its step title label.

```
[cf7m-step style:"connected" title:"Your info"]
...
[/cf7m-step]

[cf7m-step title:"Details"]
...
[/cf7m-step]

[cf7m-step title:"Confirm"]
...
[/cf7m-step]
```

**HTML output:**
```html
<div class="cf7m-steps-progress cf7m-progress--connected">
  <div class="cf7m-progress-item active" data-step="1">
    <span class="cf7m-progress-step">1</span>
    <span class="cf7m-progress-label">Your info</span>
  </div>
  <div class="cf7m-progress-connector"></div>
  <div class="cf7m-progress-item" data-step="2">
    <span class="cf7m-progress-step">2</span>
    <span class="cf7m-progress-label">Details</span>
  </div>
  <div class="cf7m-progress-connector"></div>
  <div class="cf7m-progress-item" data-step="3">
    <span class="cf7m-progress-step">3</span>
    <span class="cf7m-progress-label">Confirm</span>
  </div>
</div>
```

**CSS classes:**
- `.cf7m-progress--connected` — modifier on the progress container
- `.cf7m-progress-item` — wraps circle + label
- `.cf7m-progress-item.active` — current step (filled black circle, bold label)
- `.cf7m-progress-item.completed` — past step (filled black circle)
- `.cf7m-progress-connector` — horizontal line between items
- `.cf7m-progress-connector.completed` — dark line (between completed steps)
- `.cf7m-progress-label` — step title text beside the circle

**Responsive:** On screens below 600px, labels are hidden and only circles + lines remain.

---

## Full Examples

### Multi-step contact form with connected progress

```
[cf7m-step style:"connected" title:"Your info"]
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

<label for="your-email">Email address</label>
[email* your-email]
[/cf7m-step]

[cf7m-step title:"Details"]
<label for="subject">Subject</label>
[select subject "General" "Support" "Sales"]

<label for="your-message">Message</label>
[textarea* your-message]
[/cf7m-step]

[cf7m-step title:"Review"]
<label for="your-file">Attachment (optional)</label>
[file your-file limit:5mb]

[acceptance your-terms] I agree to the terms [/acceptance]

[submit "Send message"]
[/cf7m-step]
```

### Multi-step with progress bar and preset styling

```
[cf7m-presets style="modern"]
[cf7m-step style:"progress-bar" title:"Account"]
<label for="username">Username</label>
[text* username]

<label for="email">Email</label>
[email* email]
[/cf7m-step]

[cf7m-step title:"Profile"]
<label for="bio">About you</label>
[textarea bio]

<label for="website">Website</label>
[url website]
[/cf7m-step]

[cf7m-step title:"Finish"]
[acceptance terms] I agree to the terms [/acceptance]

[submit "Create account"]
[/cf7m-step]
[/cf7m-presets]
```

### Simple circles (default style)

```
[cf7m-step title:"Step 1"]
<label for="your-name">Your name</label>
[text* your-name]
[/cf7m-step]

[cf7m-step title:"Step 2"]
<label for="your-message">Message</label>
[textarea* your-message]

[submit "Send"]
[/cf7m-step]
```

---

## Combining with Other Features

| Feature | Works inside steps? | Notes |
|---------|-------------------|-------|
| `[cf7m-row]` / `[cf7m-col]` | Yes | Multi-column layout within a step |
| `[cf7m-presets]` | Yes (wrap outside) | Wrap entire form including all steps |
| `[cf7m-number]` / `[cf7m-calc]` / `[cf7m-total]` | Yes | Calculator fields work per-step |
| `[cf7m-if]` | Yes | Conditional logic inside a step |
| `[cf7m-star]` | Yes | Star rating inside a step |
| `[cf7m-phone]` | Yes | Phone field inside a step |
| Standard CF7 tags | Yes | All CF7 tags work normally inside steps |

---

## Architecture

### PHP — `Multi_Steps::process_shortcodes()`

Hooks into `wpcf7_form_elements` filter at priority 20:

1. Regex matches all `[cf7m-step ...]...[/cf7m-step]` blocks
2. Collects `title` and `style` attributes (style from first step only)
3. Replaces each block with `<div class="cf7m-step" data-step="N" data-title="...">`
4. Builds progress HTML via `build_progress_html()` based on style
5. Wraps everything in `<div class="cf7m-multistep-form" data-total-steps="N" data-progress-style="...">`
6. Appends navigation buttons (Previous/Next)

### JavaScript — `cf7m-multi-steps.js`

Self-executing function that runs on `DOMContentLoaded`:

1. Finds all `.cf7m-multistep-form` elements
2. Reads `data-progress-style` to determine update logic
3. `show(n)` function:
   - **circles**: Toggles `active`/`completed` classes on `.cf7m-progress-step` spans
   - **progress-bar**: Updates `.cf7m-progress-bar-fill` width and `.cf7m-progress-bar-label` text
   - **connected**: Toggles `active`/`completed` on `.cf7m-progress-item` and `.cf7m-progress-connector` elements
4. Previous/Next button click handlers increment/decrement current step
5. Previous button hidden on step 1; Next button hidden on last step

### CSS — `cf7m-pro-forms.css`

All multi-step styles in one file:

| Section | Selectors | Purpose |
|---------|-----------|---------|
| Base | `.cf7m-steps-progress`, `.cf7m-progress-step` | Default circles layout |
| Steps | `.cf7m-step`, `.cf7m-step.active` | Show/hide step content |
| Nav | `.cf7m-steps-nav`, `.cf7m-prev-step`, `.cf7m-next-step` | Navigation buttons |
| Progress bar | `.cf7m-progress--bar`, `.cf7m-progress-bar-*` | Bar style variant |
| Connected | `.cf7m-progress--connected`, `.cf7m-progress-item`, `.cf7m-progress-connector` | Connected style variant |

---

## Wrapper HTML Structure

```
div.cf7m-multistep-form[data-total-steps][data-progress-style]
├── div.cf7m-steps-progress (or .cf7m-progress--bar / .cf7m-progress--connected)
│   └── (progress indicator elements per style)
├── div.cf7m-steps-container
│   ├── div.cf7m-step[data-step="1"][data-title="..."].active
│   ├── div.cf7m-step[data-step="2"][data-title="..."]
│   └── div.cf7m-step[data-step="3"][data-title="..."]
└── div.cf7m-steps-nav
    ├── button.cf7m-prev-step
    └── button.cf7m-next-step
```

---

## CSS Customization

### Override colours via CSS custom properties or direct selectors

**Circles:**
```css
/* Active step circle */
.cf7m-progress-step.active { background: #your-color; }
/* Completed step circle */
.cf7m-progress-step.completed { background: #your-color; }
```

**Progress bar:**
```css
/* Bar fill colour */
.cf7m-progress-bar-fill { background: #your-color; }
/* Track colour */
.cf7m-progress-bar-track { background: #your-color; }
```

**Connected:**
```css
/* Active circle */
.cf7m-progress--connected .cf7m-progress-item.active .cf7m-progress-step { background: #your-color; border-color: #your-color; }
/* Completed connector line */
.cf7m-progress--connected .cf7m-progress-connector.completed { background: #your-color; }
```

**Navigation buttons:**
```css
.cf7m-prev-step, .cf7m-next-step { background: #your-color; }
```

When used inside a CF7 Mate Styler module (Divi/Gutenberg/Elementor/Bricks), nav buttons inherit the submit button colour settings automatically via `build_css()`.

---

## Tag Generator

In the CF7 editor, click the **step** button in the toolbar to insert:

```
[cf7m-step title:"Step 1"]

[/cf7m-step]
```

The generator dialog includes:
- **Step Title** — text field for the step name
- **Progress Style** — dropdown with Circles (default), Progress Bar, Connected with Labels

The style dropdown value is intended for the first step only.

---

## File Reference

| File | Purpose |
|------|---------|
| `includes/pro/features/multi-steps/module.php` | PHP shortcode processing, HTML generation, tag generator, asset enqueue |
| `assets/pro/css/cf7m-pro-forms.css` | All multi-step CSS (circles, progress-bar, connected, nav, responsive) |
| `assets/pro/js/cf7m-multi-steps.js` | Frontend JS — step show/hide, progress updates, navigation |
| `includes/pro/features/ai-form-generator/prompt.php` | AI prompt documentation for multi-step generation |
