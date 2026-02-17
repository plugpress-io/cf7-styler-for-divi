# CF7 Styler for Divi - Module Matrix

> **Last Updated:** 2026-01-28

## Summary Counts (Family-Based)

| Metric | Count |
|--------|-------|
| **Total Module Families** | 3 |
| Hybrid (D4 + D5) | 1 |
| Divi4-only | 2 |
| Divi5-only | 0 |
| Migratable | 0 |
| **Child Items** | 0 |

All modules are standalone (no parent/child relationships).

## Module Family Table

| Family | Role | Slug/Name | Divi4 | Divi5 | conversion-outline | Notes |
|--------|------|-----------|-------|-------|-------------------|-------|
| **CF7 Styler** | Standalone | `dvppl_cf7_styler` / `cf7-styler-for-divi/cf7-styler` | ✅ Y | ✅ Y | ✅ Y | **Hybrid** - Static module, styles Contact Form 7 |
| **Fluent Forms Styler** | Standalone | `tfs_fluent_forms_styler` | ✅ Y | ❌ N | ❌ N | **D4-only** - Static module, styles Fluent Forms |
| **Gravity Forms Styler** | Standalone | `tfs_gravity_forms_styler` | ✅ Y | ❌ N | ❌ N | **D4-only** - Static module, styles Gravity Forms |

## Detailed File Paths

### CF7 Styler (Hybrid) ✅

| Component | Path |
|-----------|------|
| **Divi 4 PHP** | `includes/lite/builders/divi4/CF7Styler/CF7Styler.php` |
| **Divi 4 VB JSX** | `src/divi4/cf7/cf7.jsx` |
| **Divi 4 Styles** | `src/divi4/cf7/style.scss` |
| **Divi 5 PHP** | `includes/lite/builders/divi5/CF7Styler/CF7Styler.php` |
| **Divi 5 module.json** | `src/divi5/modules/cf7-styler/module.json` |
| **Divi 5 Built JSON** | `modules-json/cf7-styler/module.json` |
| **Divi 5 VB JSX** | `src/divi5/modules/cf7-styler/edit.jsx` |
| **Divi 5 Styles** | `src/divi5/modules/cf7-styler/styles.jsx` |
| **conversion-outline** | `src/divi5/modules/cf7-styler/conversion-outline.js` |
| **Icon** | `src/divi5/icons/cf7-styler/index.jsx` |

### Fluent Forms Styler (D4-only) ❌

| Component | Path |
|-----------|------|
| **Divi 4 PHP** | `includes/lite/builders/divi4/FluentForms/FluentForms.php` |
| **Divi 4 VB JSX** | `src/divi4/ff/ff.jsx` |
| **Divi 4 Styles** | `src/divi4/ff/style.scss` |
| **Divi 5 PHP** | — |
| **Divi 5 module.json** | — |
| **conversion-outline** | — |

### Gravity Forms Styler (D4-only) ❌

| Component | Path |
|-----------|------|
| **Divi 4 PHP** | `includes/lite/builders/divi4/GravityForms/GravityForms.php` |
| **Divi 4 VB JSX** | `src/divi4/gf/gf.jsx` |
| **Divi 4 Styles** | `src/divi4/gf/style.scss` |
| **Divi 5 PHP** | — |
| **Divi 5 module.json** | — |
| **conversion-outline** | — |

## D5 Module Implementation Details

### CF7 Styler - Complete File List

| File | Status | Purpose |
|------|--------|---------|
| `module.json` | ✅ | Module metadata, attributes, settings schema |
| `index.js` | ✅ | Module registration entry point |
| `edit.jsx` | ✅ | VB React component |
| `styles.jsx` | ✅ | Style components |
| `module-classnames.js` | ✅ | Dynamic classnames |
| `module.scss` | ✅ | Module styles |
| `placeholder-content.js` | ✅ | Default content for new instances |
| `settings-content.js` | ✅ | Content tab settings |
| `settings-design.js` | ✅ | Design tab settings |
| `conversion-outline.js` | ✅ | D4 → D5 attribute mapping |
| `design-presets.json` | ✅ | Design presets (Classic, Box, Typeform, etc.); used by styles + PHP |
| `callbacks/index.js` | ✅ | Visibility callbacks |
| `callbacks/is-visible-fields/index.js` | ✅ | Field visibility logic |

### PHP Architecture Note

The D5 PHP implementation uses a **simplified pattern** (single class with `render_callback`) rather than the trait-based pattern from `references/*`. This is functional but differs from canonical ET examples. It also outputs **scoped per-module CSS** inside `render_callback()` to mirror D4 dynamic styling for migrated controls while avoiding cross-module style bleed.

```
includes/lite/builders/divi5/CF7Styler/CF7Styler.php
├── implements DependencyInterface
├── load() - Registers module with ModuleRegistration
└── render_callback() - Returns HTML output
```

## Build Configuration

| File | Purpose |
|------|---------|
| `webpack.config.js` | D4 builder bundle → `dist/js/builder4.js` |
| `webpack.divi5.config.js` | D5 VB bundle → `dist/js/bundle.js` |
| `package.json` | npm scripts for `build:divi4`, `build:divi5`, `start` |

## WP Integration Points

| Hook | File | Purpose |
|------|------|---------|
| `wp_enqueue_scripts` | `includes/assets.php` | D4 frontend styles |
| `et_builder_api_ready` | `src/divi4/index.js` | D4 VB module registration |
| `divi_module_library_modules_dependency_tree` | `includes/lite/builders/divi5/loader.php` | D5 module registration |
| `divi_visual_builder_assets_before_enqueue_scripts` | `includes/assets.php` | D5 VB assets |

## Free vs Pro Features (CF7 Mate)

| Feature | Tier | Loader / Path |
|---------|------|----------------|
| Star Rating, Range Slider, Separator, Image, Icon | **Free** | `includes/lite/loader.php`, `includes/lite/features/` |
| Multi Column, Multi Step, Entries, Phone Number, Heading, Calculator, Conditional, AI Form Generator, Presets | **Pro** | `includes/pro/loader.php`, `includes/pro/features/` |

Assets for free (lite) features: `assets/lite/js/`, `assets/lite/css/cf7m-lite-forms.css`.

## Notes

- All 3 modules are **standalone** (no parent/child relationships)
- CF7 Styler has **full D5 implementation** with conversion outline
- Fluent Forms and Gravity Forms share similar structure - can reuse CF7 patterns
- D4 modules share common dependencies in `src/divi4/dependencies/`
- Base class at `includes/lite/builders/divi4/Base/Base.php` provides shared D4 functionality

---

*Updated: 2026-01-28 - Corrected D4 slugs and added complete file paths*
