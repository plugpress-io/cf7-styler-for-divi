# CF7 Styler for Divi - Module Matrix

> **Last Updated:** 2026-01-28

## Module Inventory

| Module | D4 Shortcode | D5 Name | Status | D5 Source | PHP Module |
|--------|--------------|---------|--------|-----------|------------|
| CF7 Styler | `dvppl_cf7_styler` | `cf7-styler-for-divi/cf7-styler` | ✅ D5 Complete | `src/divi5/modules/cf7-styler/` | `includes/modules/CF7Styler/` |
| Fluent Forms | `dvppl_ff_styler` | — | ❌ D4 Only | — | `includes/modules/divi-4/FluentForms/` |
| Gravity Forms | `dvppl_gf_styler` | — | ❌ D4 Only | — | `includes/modules/divi-4/GravityForms/` |

## D5 Module Files - CF7 Styler

| File | Status | Path |
|------|--------|------|
| module.json | ✅ | `src/divi5/modules/cf7-styler/module.json` |
| index.js | ✅ | `src/divi5/modules/cf7-styler/index.js` |
| edit.jsx | ✅ | `src/divi5/modules/cf7-styler/edit.jsx` |
| styles.jsx | ✅ | `src/divi5/modules/cf7-styler/styles.jsx` |
| module-classnames.js | ✅ | `src/divi5/modules/cf7-styler/module-classnames.js` |
| conversion-outline.js | ✅ | `src/divi5/modules/cf7-styler/conversion-outline.js` |
| placeholder-content.js | ✅ | `src/divi5/modules/cf7-styler/placeholder-content.js` |
| settings-content.js | ✅ | `src/divi5/modules/cf7-styler/settings-content.js` |
| settings-design.js | ✅ | `src/divi5/modules/cf7-styler/settings-design.js` |
| module.scss | ✅ | `src/divi5/modules/cf7-styler/module.scss` |
| callbacks/ | ✅ | `src/divi5/modules/cf7-styler/callbacks/` |

## PHP Structure

| Trait | Status | Path |
|-------|--------|------|
| ModuleClassnamesTrait | ⚠️ Missing | — |
| ModuleStylesTrait | ⚠️ Missing | — |
| ModuleScriptDataTrait | ⚠️ Missing | — |
| RenderCallbackTrait | ⚠️ Missing | — |

**Note:** PHP traits may be in alternate location or using different pattern. Verify implementation.

## Features by Module

### CF7 Styler Features (D5)

- Form selection dropdown
- Form header (title + icon/image)
- Field styling (height, padding, background, spacing)
- Label styling
- Radio/checkbox custom styles
- Submit button styling
- Success/error message styling

### Fluent Forms (D4 Only)

- Similar feature set to CF7
- Fluent Forms plugin integration

### Gravity Forms (D4 Only)

- Similar feature set to CF7
- Gravity Forms plugin integration

## Build Configuration

| File | Purpose |
|------|---------|
| `webpack.config.js` | D4 builder bundle |
| `webpack.divi5.config.js` | D5 VB bundle |

## Notes

- CF7 Styler D5 module has comprehensive settings across 8 design groups
- D4 modules for FluentForms and GravityForms need full D5 conversion
- Common Base class at `includes/modules/divi-4/Base/Base.php` could inform shared patterns
