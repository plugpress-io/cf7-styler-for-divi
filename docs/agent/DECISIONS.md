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

### Module Naming: Vendor Prefix

**Decision:** Use `cf7-styler-for-divi` as vendor prefix

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

*This document tracks architectural decisions for the cf7-styler-for-divi plugin.*
