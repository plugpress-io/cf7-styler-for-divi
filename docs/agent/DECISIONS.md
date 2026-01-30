# CF7 Styler for Divi - Decisions Log

> **Created:** 2026-01-28

## Architecture Decisions

### D5 PHP Pattern: Simplified vs Traits

**Decision:** Use simplified single-class pattern (current implementation)

**Context:** The CF7 Styler D5 PHP implementation uses a single class with `render_callback` method rather than the trait-based pattern from `references/d5-extension-example-modules/`.

**Options Considered:**
1. **Trait-based pattern** (like reference modules) - Separate traits for RenderCallback, ModuleStyles, ModuleClassnames, ModuleScriptData
2. **Simplified pattern** (current) - Single class with render_callback method

**Rationale:**
- Form styler modules are relatively simple (render form shortcode + styling)
- No complex style generation pipeline or script data needed
- Reduces boilerplate for this use case
- Matches actual needs of the module

**Trade-offs:**
- ✅ Less code, easier to maintain
- ✅ Faster to implement for similar modules (FF, GF)
- ❌ Doesn't match canonical ET patterns exactly
- ❌ May need refactoring if complex features added later

**Implementation note (2026-01-28):**
- The D5 `render_callback()` outputs **scoped per-module CSS** (via a unique wrapper id) to apply migrated
  design controls in **frontend** + **live preview** while avoiding cross-module style conflicts.

**Status:** APPROVED - Current approach is acceptable for form styler modules

---

### PHP namespace: CF7_Mate

**Decision:** All plugin PHP code uses namespace `CF7_Mate` (and sub-namespaces: `CF7_Mate\Pro`, `CF7_Mate\Features\*`, `CF7_Mate\Modules\*`, `CF7_Mate\API`).

**Rationale:** Aligns with product name "CF7 Mate"; avoids legacy "Divi_CF7_Styler" in code.

---

### Module Naming: Vendor Prefix

**Decision:** Use `cf7-styler-for-divi` as vendor prefix (plugin slug, D5 module names)

**Examples:**
- D5 name: `cf7-styler-for-divi/cf7-styler`
- Icon: `cf7-styler-for-divi/icon`

**Rationale:** Matches plugin slug, provides clear namespace

---

### CSS Class Naming: Dual Prefix Strategy

**Decision:** Support both legacy `dipe-cf7*` and new `dcs-cf7*` prefixes

**Context:** Migration from older `dipe-` prefix to cleaner `dcs-` prefix while maintaining backwards compatibility.

**Implementation:** (from `includes/modules/CF7Styler/CF7Styler.php`)
```php
$container_classes = sprintf(
    'dipe-cf7-container dipe-cf7-button-%1$s dcs-cf7-container dcs-cf7-button-%1$s',
    esc_attr($button_class)
);
```

**Rationale:**
- Existing users have custom CSS targeting `dipe-` classes
- New prefix `dcs-` is cleaner (Divi CF7 Styler)
- Dual classes allow gradual migration

**Trade-offs:**
- ✅ Backwards compatible
- ❌ Larger HTML output
- ❌ Two naming systems to document

**Status:** APPROVED - Maintain dual prefix until major version bump

---

### conversion-outline Format: .js vs .json

**Decision:** Use `.js` format for conversion-outline

**Context:** Divi 5 reference modules use both `.json` (auto-generated) and `.ts` (source) formats.

**Current:** `src/divi5/modules/cf7-styler/conversion-outline.js` as ES module export

**Rationale:**
- Allows comments for documentation
- Can be imported directly in VB bundle
- Doesn't require separate build step for JSON generation

**Trade-offs:**
- ✅ Self-documenting with comments
- ✅ No build complexity
- ❌ Different from some ET reference patterns

---

## Future Considerations

### Shared Form Styler Components

**Status:** TO BE DECIDED

**Question:** Should FF and GF modules share components with CF7 Styler?

**Options:**
1. Copy CF7 patterns independently for each
2. Create shared `src/divi5/shared/form-styler/` components
3. Create base class/traits that all three extend

**Recommendation:** Start with option 1 (copy), refactor to option 2 if significant duplication emerges.

---

### D4 Module Deprecation

**Status:** NOT YET

**Question:** When to deprecate D4 modules?

**Criteria for deprecation:**
- [ ] All 3 modules have D5 implementations
- [ ] D4→D5 conversion tested thoroughly
- [ ] Divi 5 reaches widespread adoption (>50% users?)

**Timeline:** TBD - wait for Divi 5 GA and user migration data

---

### Pro build: cf7-mate-pro/cf7-mate-pro.php

**Decision:** Pro package uses folder `cf7-mate-pro` and main file `cf7-mate-pro.php` (not `cf7-styler.php`).

**Structure:**
- Free: `cf7-styler-for-divi/cf7-styler.php`
- Pro: `cf7-mate-pro/cf7-mate-pro.php` (same codebase; Pro zip excludes `cf7-styler.php`)

**How:**
- Repo contains both `cf7-styler.php` (free entry) and `cf7-mate-pro.php` (Pro entry). Both bootstrap the same plugin; Pro file defines `CF7M_PRO_VERSION`.
- `.distignore` excludes `cf7-mate-pro.php` so the WordPress.org free zip only has the free entry.
- Build Pro zip: `grunt package:pro` → produces `cf7-mate-pro-{version}.zip` with `cf7-mate-pro/cf7-mate-pro.php` and no `cf7-styler.php`.
- Bump version: `grunt bump-version --ver=patch` (or minor/major) updates version in both main files.

---

### Pro features: base class + traits

**Decision:** Pro features use a shared base, abstract form-tag base, and traits for singleton and shortcode atts.

**Structure:**
- `includes/pro/feature-base.php` – abstract base; subclasses implement `init()`.
- `includes/pro/form-tag-feature.php` – extends base; registers CF7 form tag, tag generator, validation, enqueue. Used by Star Rating and Range Slider.
- `includes/pro/Traits/singleton.php` – `instance()` per feature class.
- `includes/pro/Traits/shortcode-atts.php` – `parse_atts()` for step/row/col shortcodes.
- `includes/pro/loader.php` – config-driven: loads bootstrap files, then feature modules by option `cf7m_features`.

**Feature types:**
- Form-tag features (Star_Rating, Range_Slider): extend `CF7_Form_Tag_Feature`, use `Singleton`; implement tag names, render, validate, tag generator UI, enqueue.
- Shortcode features (Multi_Steps, Multi_Column): extend `Pro_Feature_Base`, use `Singleton` + `Shortcode_Atts_Trait`.
- Entries: extends `Pro_Feature_Base`, use `Singleton`; post type, save on submit, admin page, REST.

**Adding a new Pro feature:** add entry to `Premium_Loader::$features`, create `features/<slug>/module.php` extending the appropriate base and using traits.

---

*This document tracks architectural decisions for the cf7-styler-for-divi plugin.*
