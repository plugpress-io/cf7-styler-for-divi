# CF7 Styler for Divi – Pro Features QA Test Checklist

> **Scope:** All Pro (premium) form features. Excludes: Divi Styler module, grid/layout builder.
> **Last Updated:** 2026-02-01

---

## Pro feature list (in test scope)

| # | Feature | Shortcode / Tag | Location |
|---|---------|-----------------|----------|
| 1 | Multi-Column | `[cf7m-row]` `[cf7m-col]` | `includes/pro/features/multi-column/` |
| 2 | Multi-Step | `[cf7m-step]` | `includes/pro/features/multi-steps/` |
| 3 | Star Rating | `[cf7m-star]` | `includes/pro/features/star-rating/` |
| 4 | Range Slider | `[cf7m-range]` | `includes/pro/features/range-slider/` |
| 5 | Phone Number | `[cf7m-phone]` | `includes/pro/features/phone-number/` |
| 6 | Calculator | `[cf7m-number]` `[cf7m-calc]` `[cf7m-total]` | `includes/pro/features/calculator/` |
| 7 | Conditional | `[cf7m-if]` | `includes/pro/features/conditional/` |
| 8 | Separator | `[cf7m-separator]` | `includes/pro/features/separator/` |
| 9 | Heading | `[cf7m-heading]` | `includes/pro/features/heading/` |
| 10 | Image | `[cf7m-image]` | `includes/pro/features/image/` |
| 11 | Icon | `[cf7m-icon]` | `includes/pro/features/icon/` |
| 12 | Database Entries | (no shortcode – dashboard/API) | `includes/pro/features/entries/` |
| 13 | AI Form Generator | (admin modal) | `includes/pro/features/ai-form-generator/` |
| 14 | Form Presets | `[cf7m-presets style="..."]` | `includes/pro/features/presets/` |

---

## 1. Multi-Column `[cf7m-row]` `[cf7m-col]`

| # | Test | Pass |
|---|------|------|
| 1.1 | In CF7 editor, tag generator "row" and "column" are available | ☐ |
| 1.2 | Insert row with gap (e.g. `gap:20`), save form | ☐ |
| 1.3 | Insert columns with widths (25, 33, 50, 66, 75, 100), save form | ☐ |
| 1.4 | Frontend: row displays as flex, columns side-by-side | ☐ |
| 1.5 | Frontend: column content stacks vertically (flex-direction column) | ☐ |
| 1.6 | Frontend: inputs/labels inside column are full width | ☐ |
| 1.7 | Responsive: at ~600px columns stack to 100% width | ☐ |
| 1.8 | Row with `align:center` / `align:stretch` applies correctly | ☐ |
| 1.9 | Column with `valign:center` applies correctly | ☐ |
| 1.10 | Nested row inside column renders correctly | ☐ |

---

## 2. Multi-Step `[cf7m-step]`

| # | Test | Pass |
|---|------|------|
| 2.1 | Tag generator "step" is available in CF7 editor | ☐ |
| 2.2 | Insert 2–3 steps with titles, save form | ☐ |
| 2.3 | Frontend: only first step visible initially | ☐ |
| 2.4 | Next/Previous buttons appear and switch steps | ☐ |
| 2.5 | Progress indicator shows current step | ☐ |
| 2.6 | Submit button only on last step (or as instructed) | ☐ |
| 2.7 | Step content (fields) show/hide correctly on navigation | ☐ |
| 2.8 | Form submission sends all step data | ☐ |

---

## 3. Star Rating `[cf7m-star]`

| # | Test | Pass |
|---|------|------|
| 3.1 | Tag generator "star rating" is available | ☐ |
| 3.2 | Insert star rating (e.g. max:5), save form | ☐ |
| 3.3 | Frontend: stars render and are clickable | ☐ |
| 3.4 | Selecting a star updates value; hover state works | ☐ |
| 3.5 | Submitted value matches selected star count | ☐ |
| 3.6 | Works inside [cf7m-presets] / Divi-styled form (no double borders) | ☐ |

---

## 4. Range Slider `[cf7m-range]`

| # | Test | Pass |
|---|------|------|
| 4.1 | Tag generator "range slider" is available | ☐ |
| 4.2 | Insert slider with min/max/step, save form | ☐ |
| 4.3 | Frontend: slider and value display render | ☐ |
| 4.4 | Dragging slider updates displayed value | ☐ |
| 4.5 | Submitted value is correct number | ☐ |
| 4.6 | Works inside preset wrapper (no double styling) | ☐ |

---

## 5. Phone Number `[cf7m-phone]`

| # | Test | Pass |
|---|------|------|
| 5.1 | Tag generator "phone number" is available | ☐ |
| 5.2 | Insert phone field with name, default country (e.g. default:US or default:BD), save form | ☐ |
| 5.3 | Frontend: country trigger shows correct default (e.g. BD → 🇧🇩 +880, not US) | ☐ |
| 5.4 | Caret/chevron icon visible on trigger; opens searchable country dropdown on click; trigger has aria-expanded for accessibility | ☐ |
| 5.5 | Country list in dropdown is A–Z by country name; search filters by name/dial/code | ☐ |
| 5.6 | Selecting country updates trigger (flag + dial); submitted value is full number with prefix | ☐ |
| 5.7 | Label and description: shortcode label:"..." description:"..." render above field; required shows * | ☐ |
| 5.8 | Focus: wrap border highlights (e.g. blue); no double border on inner input | ☐ |
| 5.9 | Works inside [cf7m-presets] / Divi-styled form | ☐ |

Example UI: see `docs/agent/phone-number-example.png`. JS/CSS located at `assets/pro/js/cf7m-phone-number.js` and `assets/pro/css/cf7m-phone-number.css`.

---

## 6. Calculator `[cf7m-number]` `[cf7m-calc]` `[cf7m-total]`

| # | Test | Pass |
|---|------|------|
| 6.1 | Tag generators for number, calc, total are available | ☐ |
| 6.2 | Insert number field with prefix/suffix (e.g. $), save | ☐ |
| 6.3 | Frontend: number input shows prefix/suffix, accepts numbers only | ☐ |
| 6.4 | Insert [cf7m-calc] with formula (e.g. field1 * field2) | ☐ |
| 6.5 | Insert [cf7m-total] to display calc result | ☐ |
| 6.6 | Frontend: changing inputs updates total in real time | ☐ |
| 6.7 | Currency/percent formatting (prefix, suffix, decimals) works | ☐ |
| 6.8 | Summary block (cf7m-calc-summary) renders correctly | ☐ |
| 6.9 | Calculator fields inside [cf7m-presets] / styled form: no double borders | ☐ |

---

## 7. Conditional `[cf7m-if]`

| # | Test | Pass |
|---|------|------|
| 7.1 | Tag generator for conditional is available | ☐ |
| 7.2 | Insert [cf7m-if field:"x" is:"y"]...[/cf7m-if], save | ☐ |
| 7.3 | Frontend: block hidden when condition not met | ☐ |
| 7.4 | Frontend: block visible when condition met (select/radio/checkbox) | ☐ |
| 7.5 | Operators: is, not, gt, lt, contains, empty, checked work as expected | ☐ |
| 7.6 | Nested or multiple [cf7m-if] blocks work | ☐ |

---

## 8. Separator `[cf7m-separator]`

| # | Test | Pass |
|---|------|------|
| 8.1 | Tag generator "separator" is available | ☐ |
| 8.2 | Insert [cf7m-separator], save form | ☐ |
| 8.3 | Frontend: horizontal line/divider renders | ☐ |
| 8.4 | Optional attributes (if any) apply correctly | ☐ |

---

## 9. Heading `[cf7m-heading]`

| # | Test | Pass |
|---|------|------|
| 9.1 | Tag generator "heading" is available | ☐ |
| 9.2 | Insert heading with text and tag (h2, h3, etc.), save | ☐ |
| 9.3 | Frontend: correct tag and text render | ☐ |
| 9.4 | Styling from Divi/CF7 Styler applies (if applicable) | ☐ |

---

## 10. Image `[cf7m-image]`

| # | Test | Pass |
|---|------|------|
| 10.1 | Tag generator "image" is available | ☐ |
| 10.2 | Insert image with URL or upload, save | ☐ |
| 10.3 | Frontend: image displays with correct src | ☐ |
| 10.4 | Alt/attributes apply when supported | ☐ |

---

## 11. Icon `[cf7m-icon]`

| # | Test | Pass |
|---|------|------|
| 11.1 | Tag generator "icon" is available | ☐ |
| 11.2 | Insert icon (e.g. Divi icon picker), save | ☐ |
| 11.3 | Frontend: icon renders in form | ☐ |

---

## 12. Database Entries

| # | Test | Pass |
|---|------|------|
| 12.1 | Entries menu/screen available when feature enabled | ☐ |
| 12.2 | Submissions are saved to custom post type (or DB) | ☐ |
| 12.3 | List view shows form, date, key fields | ☐ |
| 12.4 | Single entry view shows full submission data | ☐ |
| 12.5 | Export or delete entries works (if implemented) | ☐ |
| 12.6 | REST API for entries (if any) returns correct data | ☐ |

---

## 13. AI Form Generator

| # | Test | Pass |
|---|------|------|
| 13.1 | "AI Generate" button (sparkles icon) appears on CF7 form editor screen | ☐ |
| 13.2 | Click opens modal with prompt box, image upload, and presets list | ☐ |
| 13.3 | Selecting a preset fills prompt; Generate sends request; output uses [cf7m-presets] where appropriate | ☐ |
| 13.4 | Custom prompt + Generate returns valid CF7 form code; labels are HTML &lt;label&gt;, not literal [label]; phone fields use [cf7m-phone] when appropriate | ☐ |
| 13.5 | Image upload: "Upload form image" + file select; Generate with image (with or without text prompt) returns form code; image-only uses default prompt; OpenAI/Anthropic only | ☐ |
| 13.6 | Calculator request: generated form includes [cf7m-number], [cf7m-calc], [cf7m-total] with label for summary where applicable | ☐ |
| 13.7 | Generated code inserts into form template correctly; Copy / Insert work | ☐ |
| 13.8 | Without API key, configure message/link shown | ☐ |
| 13.9 | Contact/Newsletter/Feedback presets wrap output in [cf7m-presets style="modern"] or style="minimal"/"sky" | ☐ |
| 13.10 | No stray [label ...] in inserted form; clean_response converts [label for="..."]...[/label] to HTML &lt;label&gt; and strips stray &lt;h1&gt;-&lt;h6&gt;/&lt;title&gt; | ☐ |

---

## 14. Form Presets `[cf7m-presets style="..."]`

| # | Test | Pass |
|---|------|------|
| 14.1 | Tag generator "style presets" is available; dropdown includes all 7: Sky, Classic, Box, Minimal, Dark, Modern, Rounded | ☐ |
| 14.2 | Insert [cf7m-presets style="sky"]...[/cf7m-presets] (or any style); tag generator insert box defaults to style="sky"—edit in template if needed; save | ☐ |
| 14.3 | Frontend: wrapper has class `cf7-mate-preset cf7-mate-preset--{style}` | ☐ |
| 14.4 | Normalize base: CSS vars (--cf7m-line-height, --cf7m-field-margin, --cf7m-label-size, etc.) and field margin, label line-height/font-size, input padding, placeholder color consistent | ☐ |
| 14.5 | Each preset looks distinct: Sky (blue), Classic (gray), Box (card), Minimal (underline), Dark (dark bg), Modern (slate/cyan), Rounded (large radius) | ☐ |
| 14.6 | Placeholder color and focus border match preset; no double borders | ☐ |
| 14.7 | [cf7m-phone] inside preset: no double borders; wrap focus works | ☐ |
| 14.8 | Invalid style falls back to classic; form inside preset submits normally | ☐ |

---

## Cross-cutting

| # | Test | Pass |
|---|------|------|
| C.1 | Pro CSS (cf7m-pro-forms.css, cf7m-presets.css, cf7m-phone-number.css from dist) loads only when CF7 form on page | ☐ |
| C.2 | All tag generators appear in CF7 editor when Pro is active | ☐ |
| C.3 | Shortcodes process in correct order (e.g. presets wrap, then row/col inside) | ☐ |
| C.4 | No PHP errors/warnings with all Pro features enabled | ☐ |
| C.5 | Sanitization/escaping: no XSS in output (labels, headings, preset class) | ☐ |
| C.6 | Nonce/capability checks on admin/AJAX (AI generate, entries API) | ☐ |

---

## Quick reference – shortcodes

| Feature | Open Tag | Close Tag |
|---------|----------|-----------|
| Multi-Column Row | `[cf7m-row gap:20]` | `[/cf7m-row]` |
| Multi-Column Col | `[cf7m-col width:50]` | `[/cf7m-col]` |
| Multi-Step | `[cf7m-step title:"Step 1"]` | `[/cf7m-step]` |
| Conditional | `[cf7m-if field:"name" is:"value"]` | `[/cf7m-if]` |
| Form Presets | `[cf7m-presets style="sky"]` | `[/cf7m-presets]` |
| Star Rating | `[cf7m-star rating max:5]` | (self-closing) |
| Range | `[cf7m-range slider min:0 max:100]` | (self-closing) |
| Phone Number | `[cf7m-phone phone default:US label:"Phone" description:"Optional."]` | (self-closing) |
| Number | `[cf7m-number name value:0 min:0 max:100]` | (self-closing) |
| Calc | `[cf7m-calc id:x formula:"a*b"]` | (self-closing) |
| Total | `[cf7m-total id:x format:currency label:"Total"]` | (self-closing) |
| Separator | `[cf7m-separator]` | (self-closing) |
| Heading | `[cf7m-heading text:"Title" tag:h2]` | (self-closing) |
| Image | `[cf7m-image url:...]` | (self-closing) |
| Icon | `[cf7m-icon ...]` | (self-closing) |

---

*Copy this checklist for each release or sprint. Mark Pass with ☑ when verified.*
