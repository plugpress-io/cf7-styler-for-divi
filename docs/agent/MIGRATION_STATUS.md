# CF7 Styler for Divi - Migration Status

> **Last Updated:** 2026-01-28

## Summary (Family-Based)

| Metric | Count |
|--------|-------|
| **Total Module Families** | 3 |
| Hybrid (D4 + D5) | 1 |
| Divi4-only | 2 |
| Divi5-only | 0 |
| Migratable | 0 |
| **Migration Progress** | 33% (1/3 families) |
| **Child Items** | 0 |

## Status by Bucket

| Bucket | Family Count | Families |
|--------|--------------|----------|
| ✅ Hybrid | 1 | CF7 Styler |
| ❌ Divi4-only | 2 | Fluent Forms Styler, Gravity Forms Styler |
| 🔷 Divi5-only | 0 | — |
| 🔄 Migratable | 0 | — |

## Next Best Module Family to Migrate

### 1. **Fluent Forms Styler** ⭐ RECOMMENDED FIRST

| Aspect | Details |
|--------|---------|
| **Why** | Closest to CF7 Styler; same form-styling concept |
| **D4 PHP** | `includes/modules/divi-4/FluentForms/FluentForms.php` (~600 lines) |
| **D4 VB JSX** | `src/divi4/ff/ff.jsx` |
| **Reference** | Mirror `src/divi5/modules/cf7-styler/` structure |
| **Effort** | Medium - ~70% code can be adapted from CF7 Styler |
| **Dependency** | Requires Fluent Forms plugin for testing |

### 2. Gravity Forms Styler

| Aspect | Details |
|--------|---------|
| **Why** | Same pattern as Fluent Forms |
| **D4 PHP** | `includes/modules/divi-4/GravityForms/GravityForms.php` (~710 lines) |
| **D4 VB JSX** | `src/divi4/gf/gf.jsx` |
| **Reference** | Mirror CF7 Styler + Fluent Forms patterns |
| **Effort** | Medium - reuse FF patterns |
| **Dependency** | Requires Gravity Forms plugin (paid) for testing |

### 3. — (no third candidate)

## Highest Risk Module Families

| Rank | Family | Risk | Mitigation |
|------|--------|------|------------|
| 1 | **Gravity Forms** | Paid plugin dependency | Use free Gravity Forms trial or mock data |
| 2 | **Fluent Forms** | Form API differences from CF7 | Review FF API docs, test edge cases |
| 3 | **CF7 Styler** | Low - already complete | Verify conversion testing |

## Detailed Family Status

### CF7 Styler ✅ HYBRID

| Aspect | Status |
|--------|--------|
| D4 Implementation | ✅ Complete |
| D5 VB Component | ✅ Complete |
| D5 PHP Rendering | ✅ Complete (simplified pattern + scoped CSS parity) |
| conversion-outline | ✅ Present with 70+ mappings |
| Testing | ⚠️ Needs D4→D5 conversion verification |

**Key Files:**
- D5 module.json: `src/divi5/modules/cf7-styler/module.json`
- D5 PHP: `includes/modules/CF7Styler/CF7Styler.php`

**Notes (2026-01-28):**
- D5 `render_callback()` now renders **header icon/image markup** (parity with D4).
- D5 `render_callback()` now outputs **per-module scoped CSS** to apply migrated design controls
  (header/background/padding, field spacing/padding/colors, radio/checkbox styles, message styles)
  in both **frontend** and **live preview** without leaking styles across multiple module instances.

### Fluent Forms Styler ❌ D4-ONLY

| Aspect | Status |
|--------|--------|
| D4 Implementation | ✅ Complete |
| D5 VB Component | ❌ Not started |
| D5 PHP Rendering | ❌ Not started |
| conversion-outline | ❌ Not started |
| Blocker | Needs full D5 implementation |

**Key Files:**
- D4 PHP: `includes/modules/divi-4/FluentForms/FluentForms.php`
- D4 VB: `src/divi4/ff/ff.jsx`

### Gravity Forms Styler ❌ D4-ONLY

| Aspect | Status |
|--------|--------|
| D4 Implementation | ✅ Complete |
| D5 VB Component | ❌ Not started |
| D5 PHP Rendering | ❌ Not started |
| conversion-outline | ❌ Not started |
| Blocker | Needs full D5 implementation |

**Key Files:**
- D4 PHP: `includes/modules/divi-4/GravityForms/GravityForms.php`
- D4 VB: `src/divi4/gf/gf.jsx`

## Migration Notes

### Shared Patterns Across All 3 Families

All form styler modules share:
- Form selection dropdown (dynamic options from WP)
- Field styling (height, padding, background, colors)
- Label/placeholder styling
- Radio/checkbox custom styling
- Submit button styling
- Success/error message styling

### Technical Considerations

1. **Form fetching functions differ:**
   - CF7: `WPCF7_ContactForm::find()`
   - FF: `wpFluent()->table('fluentform_forms')`
   - GF: `\RGFormsModel::get_forms()`

2. **CSS selectors differ** per form plugin structure

3. **D5 PHP can use simplified pattern** (single class) vs traits

### Recommended Migration Approach

1. Copy CF7 Styler D5 structure as template
2. Update module.json with FF/GF-specific settings
3. Adapt PHP render_callback for FF/GF shortcode
4. Update conversion-outline.js with D4 attribute mappings
5. Test with actual FF/GF forms

## Action Items

- [ ] Verify CF7 Styler D4→D5 conversion with saved layouts
- [ ] Create D5 module structure for Fluent Forms
- [ ] Create D5 module structure for Gravity Forms
- [ ] Update `includes/modules/Modules.php` to load FF/GF D5 modules
- [ ] Consider shared form styling components for DRY code

---

*Updated: 2026-01-28 - Family-based counts, corrected D4 slugs, added migration details*
