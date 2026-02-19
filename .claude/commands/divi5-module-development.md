---
name: divi5-module-development
description: "Divi 5 module development — build new D5 modules from scratch or convert existing Divi 4 modules to D5. Use this skill whenever the user mentions: building a Divi 5 module, creating a D5 extension, converting/migrating/porting a Divi 4 module to Divi 5, module.json, conversion-outline, ModuleContainer, RenderCallbackTrait, edit.jsx, styles.jsx, or any Divi 5 module development concepts. Also trigger when the user wants to add a new module to an existing Divi plugin, or needs help with Divi 5 module architecture. Trigger broadly — if Divi modules are involved, use this skill."
---

# Divi 5 Module Development

## Overview

This skill covers two workflows for Divi 5 module development:

1. **Build from scratch** — Create a brand-new D5 module plugin with no D4 predecessor
2. **Convert from D4** — Migrate an existing Divi 4 module plugin to D5 architecture

A D5 module has two halves: a **React/JS Visual Builder side** (module.json, edit.jsx, styles.jsx, etc.) and a **PHP server side** (trait-based class with RenderCallback, ModuleStyles, etc.), connected by a shared `module.json` schema.

## Decision: Which Workflow?

**Building from scratch?** → Jump to "Workflow A: Build from Scratch"
**Converting a D4 plugin?** → Jump to "Workflow B: Convert from D4"

Both workflows share the same core module creation steps (Phase 2 for plugin structure, and the 13-step module creation process). The difference is the starting point — scratch starts from requirements, conversion starts from an existing D4 codebase.

## Before You Start

**Read the reference materials.** Before writing any code, read the relevant reference docs bundled with this skill:

```
references/d5-module-anatomy.md       — File-by-file breakdown of a D5 module
references/module-json-cheatsheet.md  — module.json schema quick reference
references/conversion-outline-guide.md — How to write D4→D5 attribute mappings
references/d5-plugin-bootstrap.md     — Plugin setup, webpack, registration
```

Also study the reference plugins:

```
references/ref-plugins/d5-extension-example-modules/  — Official ET example (has D4 + D5 side by side)
references/ref-plugins/d5-example-core-modules/        — Core module examples (Button, Blurb, Accordion, etc.)
```

Find the closest core module to your use case and mirror its patterns. A text+image module? Look at Blurb. A CTA? Look at Button + CTA. Parent/child? Look at Accordion. A form? Look at Contact Form.

---

## Workflow A: Build from Scratch

Use this when creating a new D5 module with no existing D4 version.

### A1: Define the Module

Before writing code, clearly define:

1. **What does this module do?** — Describe its purpose in one sentence.
2. **What content does the user configure?** — List every piece of user-editable content (title, description, image, URL, etc.). Each becomes an attribute in module.json.
3. **What design options does it need?** — Fonts, colors, spacing, borders, backgrounds? These become decoration settings.
4. **What's the HTML output?** — Sketch the frontend HTML structure. This drives both edit.jsx and RenderCallbackTrait.php — they must produce identical markup.
5. **Does it need frontend JS?** — Carousels, lightboxes, animations, API calls? Plan the script data pipeline.
6. **Is it parent/child?** — Tabs, accordions, sliders with items? Parent/child modules must be designed together.
7. **Find the closest reference module** — Look through `references/ref-plugins/d5-example-core-modules/` and find a module with similar characteristics. This will be your template.

### A2: Set Up the Plugin

Follow "Plugin Structure" below to create the directory layout, webpack config, package.json, and plugin bootstrap. For a scratch build, you won't have any D4 code, so the structure is cleaner:

```
plugin-name/
├── plugin-name.php              # Main plugin file
├── composer.json                # PSR-4 autoloading
├── package.json                 # Build dependencies
├── webpack.config.js            # Webpack config
├── tsconfig.json                # TypeScript config (optional)
├── src/divi5/                   # VB source (React/JS)
│   ├── index.js
│   ├── module-icons.js
│   ├── icons/
│   └── modules/
│       └── module-name/         # Each module gets a folder
├── includes/modules/            # PHP server side
│   ├── Modules.php
│   └── ModuleName/
├── modules-json/                # Built (webpack output)
├── scripts/                     # Built (webpack output)
└── styles/                      # Built (webpack output)
```

See `references/d5-plugin-bootstrap.md` for all the boilerplate files.

### A3: Create the Module

Follow "Creating a D5 Module (Step by Step)" below. For a scratch build:
- Skip the conversion-outline.js (no D4 shortcode to map from) — or set `"d4Shortcode": ""` in module.json
- Design your module.json attributes from the requirements rather than mapping from D4 fields
- Design your HTML structure fresh rather than matching an existing render() method

### A4: Build & Test

Follow "Build & Verify" below.

---

## Workflow B: Convert from D4

Use this when migrating an existing Divi 4 module plugin to D5.

### B1: Audit the D4 Plugin

Before writing any D5 code, fully understand the existing D4 plugin:

1. **Inventory all modules** — List every PHP class extending `ET_Builder_Module`. Note each module's slug, fields, advanced_fields, custom_css_fields, and render output.

2. **Map the module relationships** — Identify parent/child modules (check `child_slug`, `child_item_text` in init). Standalone modules convert independently; parent/child pairs must convert together.

3. **Catalog the fields** — For each module, extract:
   - All fields from `get_fields()` with their types and toggle_slugs
   - All `advanced_fields` (fonts, background, borders, margin_padding, etc.)
   - All `custom_css_fields`
   - Any computed fields or conditional logic

4. **Understand the render output** — Read the `render()` method. Note the HTML structure, CSS classes, and any dynamic data (API calls, database queries, shortcode processing).

5. **Identify frontend assets** — Note JS libraries (slick, isotope, magnific-popup, etc.), enqueued styles, and any AJAX endpoints.

6. **Find the closest reference module** — Match each D4 module to a similar core D5 module in `references/ref-plugins/d5-example-core-modules/`.

### B2: Set Up D5 Plugin Structure

The D5 side lives alongside the existing D4 code — the plugin supports both simultaneously. Add the D5 directories and config files to the existing plugin. See "Plugin Structure" below.

### B3: Convert Each Module

Follow "Creating a D5 Module (Step by Step)" below. For conversions:
- Set `"d4Shortcode"` in module.json to the D4 slug (this enables automatic layout migration)
- Map D4 fields to D5 attributes using the mapping table in Step 1
- Match the HTML structure from D4's `render()` method in both edit.jsx and RenderCallbackTrait.php
- Create conversion-outline.js to map every D4 attribute to its D5 path

### B4: Build & Test

Follow "Build & Verify" below. Additionally test D4→D5 conversion by loading saved D4 layouts.

---

## Plugin Structure

**Target directory structure for a D5 module plugin:**

```
plugin-name/
├── plugin-name.php              # Main file (add D5 hooks)
├── composer.json                # PSR-4 autoloading for D5 namespace
├── package.json                 # D5 build dependencies
├── webpack.config.js            # D5 webpack config
├── tsconfig.json                # TypeScript config
│
├── src/                         # D5 Visual Builder source (JS/TS/React)
│   └── divi5/
│       ├── index.js             # Entry: registers all D5 modules
│       ├── module-icons.js      # Icon registrations
│       ├── icons/
│       │   └── module-name/
│       │       └── index.jsx    # SVG icon component
│       └── modules/
│           └── module-name/     # One folder per module
│               ├── module.json
│               ├── index.js
│               ├── edit.jsx
│               ├── styles.jsx
│               ├── module-classnames.js
│               ├── module-script-data.jsx
│               ├── custom-css.js
│               ├── placeholder-content.js
│               ├── conversion-outline.js   # Only needed for D4→D5 conversion
│               └── module.scss
│
├── includes/modules/            # D5 PHP modules
│   ├── Modules.php              # D5 module loader
│   └── ModuleName/
│       ├── ModuleName.php       # Main class (DependencyInterface)
│       └── ModuleNameTrait/
│           ├── RenderCallbackTrait.php
│           ├── ModuleStylesTrait.php
│           ├── ModuleClassnamesTrait.php
│           ├── ModuleScriptDataTrait.php
│           └── CustomCssTrait.php
│
├── modules-json/                # Built JSON (webpack output)
│   └── module-name/
│       └── module.json
│
├── scripts/                     # Built JS (webpack output)
│   └── bundle.js
│
└── styles/                      # Built CSS (webpack output)
    ├── bundle.css
    └── vb-bundle.css
```

For all boilerplate files (webpack.config.js, package.json, tsconfig.json, composer.json, plugin bootstrap PHP), see `references/d5-plugin-bootstrap.md`.

---

## Creating a D5 Module (Step by Step)

These 13 steps apply to both scratch builds and D4 conversions. The difference is where the information comes from — requirements (scratch) or existing D4 code (conversion).

### Step 1: module.json — The Foundation

This is the single source of truth. It defines the module identity, all attributes, settings panels, and custom CSS fields.

**For conversions, map D4 concepts to D5 module.json:**

| D4 Concept | D5 module.json Location |
|---|---|
| `$this->slug` | `"d4Shortcode"` value |
| Module name | `"name": "vendor/module-name"` |
| `$this->name` | `"title"` |
| Each field from `get_fields()` | An attribute object in `"attributes"` |
| `advanced_fields['fonts']` | Decoration font settings on the relevant attribute |
| `advanced_fields['background']` | `module.decoration.background` |
| `advanced_fields['margin_padding']` | `module.decoration.spacing` |
| `advanced_fields['borders']` | Decoration border on relevant attribute |
| `advanced_fields['box_shadow']` | Decoration boxShadow on relevant attribute |
| `advanced_fields['filters']` | `module.decoration.filters` |
| `advanced_fields['text']` | `module.advanced.text` |
| `custom_css_fields` | `"customCssFields"` |
| Toggle groups | `"settings.groups"` |

**For scratch builds, design attributes from requirements:**

Each piece of user-editable content becomes a top-level attribute. Think of attributes as the "things" in your module — a title is an attribute, an image is an attribute, a button is an attribute, etc.

**Key rules for module.json (both workflows):**
- Every renderable piece of content (title, content, image, button) becomes its own top-level attribute with `innerContent` settings
- Style-only concerns (backgrounds, spacing) live under `decoration` within the relevant attribute
- The `module` attribute always exists — it represents the module wrapper itself
- Use `{{selector}}` for the module's unique order class selector
- Set `elementType` for renderable elements: `"heading"`, `"richText"`, `"imageLink"`, `"button"`, `"plainText"`

See `references/module-json-cheatsheet.md` for the full schema and field component types.

### Step 2: index.js — Module Registration

```javascript
import metadata from './module.json';
import { ModuleNameEdit } from './edit';
import { placeholderContent } from './placeholder-content';
import './module.scss';

export const moduleName = {
  metadata,
  placeholderContent,
  renderers: {
    edit: ModuleNameEdit,
  },
};
```

### Step 3: edit.jsx — Visual Builder Component

Use `ModuleContainer` from `@divi/module` and render elements via `elements.render()`.

```jsx
import { ModuleContainer } from '@divi/module';
import { ModuleStyles } from './styles';
import { moduleClassnames } from './module-classnames';
import { ModuleScriptData } from './module-script-data';

export const ModuleNameEdit = (props) => {
  const { attrs, elements, id, name } = props;

  return (
    <ModuleContainer
      attrs={attrs}
      elements={elements}
      id={id}
      name={name}
      stylesComponent={ModuleStyles}
      classnamesFunction={moduleClassnames}
      scriptDataComponent={ModuleScriptData}
    >
      {elements.styleComponents({ attrName: 'module' })}
      <div className="module_inner">
        {elements.render({ attrName: 'title' })}
        {elements.render({ attrName: 'content' })}
      </div>
    </ModuleContainer>
  );
};
```

For conversions, the HTML structure inside `ModuleContainer` should match the D4 `render()` output — existing CSS and frontend JS depend on class names and DOM structure.

For scratch builds, design the HTML structure to be clean and semantic, using BEM-style class naming: `{module_slug}__{element}`.

### Step 4: styles.jsx — Style Generation

```jsx
import { StyleContainer, CssStyle } from '@divi/module';
import { cssFields } from './custom-css';

export const ModuleStyles = ({
  attrs, elements, settings, orderClass, mode, state, noStyleTag,
}) => (
  <StyleContainer mode={mode} state={state} noStyleTag={noStyleTag}>
    {elements.style({ attrName: 'module' })}
    {elements.style({ attrName: 'title' })}
    {elements.style({ attrName: 'content' })}
    <CssStyle
      selector={orderClass}
      attr={attrs?.css}
      cssFields={cssFields}
    />
  </StyleContainer>
);
```

Every attribute that has `decoration` settings needs an `elements.style()` call here. The `CssStyle` component at the end handles custom CSS fields.

### Step 5: module-classnames.js

```javascript
import { textOptionsClassnames } from '@divi/module-utils';

export const moduleClassnames = ({ classnamesInstance, attrs }) => {
  classnamesInstance.add(
    textOptionsClassnames(attrs?.module?.advanced?.text)
  );
};
```

### Step 6: module-script-data.jsx

```jsx
import { Fragment } from 'react';

export const ModuleScriptData = ({ elements }) => (
  <Fragment>
    {elements.scriptData({ attrName: 'module' })}
  </Fragment>
);
```

### Step 7: custom-css.js

```javascript
import metadata from './module.json';
import { __ } from '@wordpress/i18n';

const customCssFields = metadata?.customCssFields ?? {};

// Add labels for each custom CSS field
if (customCssFields.mainElement) {
  customCssFields.mainElement.label = __('Main Element', 'plugin-textdomain');
}

export const cssFields = { ...customCssFields };
```

### Step 8: placeholder-content.js

Provide default content for when the module is first dropped into the builder:

```javascript
export const placeholderContent = {
  title: {
    innerContent: {
      desktop: { value: 'Your Title Here' },
    },
  },
  content: {
    innerContent: {
      desktop: { value: '<p>Your content goes here.</p>' },
    },
  },
};
```

### Step 9: conversion-outline.js (D4→D5 conversions only)

This file maps every D4 shortcode attribute to its D5 path, enabling automatic migration of saved layouts. Skip this for scratch builds.

```javascript
export default {
  advanced: {
    admin_label: 'module.meta.adminLabel',
    animation: 'module.decoration.animation',
    background: 'module.decoration.background',
    borders: { default: 'module.decoration.border' },
    box_shadow: { default: 'module.decoration.boxShadow' },
    disabled_on: 'module.decoration.disabledOn',
    filters: { default: 'module.decoration.filters' },
    fonts: {
      header: 'title.decoration.font',
      body: 'content.decoration.bodyFont.body',
    },
    margin_padding: 'module.decoration.spacing',
    max_width: 'module.decoration.sizing',
    overflow: 'module.decoration.overflow',
    scroll: 'module.decoration.scroll',
    transform: 'module.decoration.transform',
    transition: 'module.decoration.transition',
    z_index: 'module.decoration.zIndex',
  },
  css: {
    before: 'css.*.before',
    after: 'css.*.after',
    main_element: 'css.*.mainElement',
  },
  module: {
    // Map each D4 field to its D5 attribute path
    title: 'title.innerContent.*',
    content: 'content.innerContent.*',
    header_level: 'title.decoration.font.font.*.headingLevel',
  },
};
```

See `references/conversion-outline-guide.md` for the full mapping reference.

### Step 10: PHP — Main Module Class

```php
namespace Vendor\Modules\ModuleName;

use ET\Builder\Framework\DependencyManagement\Interfaces\DependencyInterface;
use ET\Builder\Packages\ModuleLibrary\ModuleRegistration;

class ModuleName implements DependencyInterface {
    use ModuleNameTrait\RenderCallbackTrait;
    use ModuleNameTrait\ModuleClassnamesTrait;
    use ModuleNameTrait\ModuleStylesTrait;
    use ModuleNameTrait\ModuleScriptDataTrait;
    use ModuleNameTrait\CustomCssTrait;

    public function load() {
        $module_json_folder_path = PLUGIN_MODULES_JSON_PATH . 'module-name/';

        add_action('init', function() use ($module_json_folder_path) {
            if (wp_should_load_block_editor_scripts_and_styles()) {
                ModuleRegistration::register_module(
                    $module_json_folder_path,
                    [
                        'render_callback' => [self::class, 'render_callback'],
                    ]
                );
            }
        });
    }
}
```

### Step 11: PHP Traits

**RenderCallbackTrait.php** — Server-side HTML rendering:

```php
use ET\Builder\Packages\Module\Module;

trait RenderCallbackTrait {
    public static function render_callback($attrs, $content, $block, $elements) {
        $title = $elements->render([
            'attrName' => 'title',
        ]);

        $content_output = $elements->render([
            'attrName' => 'content',
        ]);

        return Module::render([
            'attrs'              => $attrs,
            'elements'           => $elements,
            'id'                 => $block->parsed_block['id'],
            'name'               => $block->block_type->name,
            'classnamesFunction' => [self::class, 'module_classnames'],
            'stylesComponent'    => [self::class, 'module_styles'],
            'scriptDataComponent'=> [self::class, 'module_script_data'],
            'children'           => sprintf(
                '<div class="module_inner">%1$s%2$s</div>',
                $title,
                $content_output
            ),
        ]);
    }
}
```

The HTML in `children` must match the `edit.jsx` structure exactly.

**ModuleStylesTrait.php:**

```php
use ET\Builder\Packages\Module\Options\Css\CssStyle;

trait ModuleStylesTrait {
    public static function module_styles($args) {
        $attrs    = $args['attrs'] ?? [];
        $elements = $args['elements'];

        $elements->style([ 'attrName' => 'module' ]);
        $elements->style([ 'attrName' => 'title' ]);
        $elements->style([ 'attrName' => 'content' ]);

        CssStyle::style([
            'selector'  => $args['orderClass'],
            'attr'      => $attrs['css'] ?? [],
            'cssFields' => self::custom_css_fields(),
        ]);
    }
}
```

**ModuleClassnamesTrait.php:**

```php
use ET\Builder\Packages\Module\Options\Text\TextClassnames;

trait ModuleClassnamesTrait {
    public static function module_classnames($args) {
        $classnames_instance = $args['classnamesInstance'];
        $attrs               = $args['attrs'];

        $classnames_instance->add(
            TextClassnames::text_options_classnames(
                $attrs['module']['advanced']['text'] ?? []
            )
        );
    }
}
```

**ModuleScriptDataTrait.php:**

```php
trait ModuleScriptDataTrait {
    public static function module_script_data($args) {
        $elements = $args['elements'];
        $elements->script_data([ 'attrName' => 'module' ]);
    }
}
```

**CustomCssTrait.php:**

```php
trait CustomCssTrait {
    public static function custom_css_fields() {
        $module_metadata = \WP_Block_Type_Registry::get_instance()
            ->get_registered('vendor/module-name');
        return $module_metadata->customCssFields ?? [];
    }
}
```

### Step 12: Register in Modules.php

```php
use Vendor\Modules\ModuleName\ModuleName;

add_action(
    'divi_module_library_modules_dependency_tree',
    function ($dependency_tree) {
        $dependency_tree->add_dependency(new ModuleName());
    }
);
```

### Step 13: Plugin Bootstrap

Update the main plugin PHP file to:
1. Define constants for JSON and assets paths
2. Load the Composer autoloader
3. Require `Modules.php` for D5 module registration
4. Enqueue D5 VB scripts via `divi_visual_builder_assets_before_enqueue_scripts`
5. Enqueue D5 frontend styles via `wp_enqueue_scripts`

See `references/d5-plugin-bootstrap.md` for the exact code patterns.

---

## Build & Verify

1. Run `npm install` then `npm run build` to compile the D5 assets
2. Verify `modules-json/`, `scripts/`, and `styles/` are populated
3. Activate the plugin in WordPress with Divi 5
4. Open the Visual Builder — module should appear in the insert panel
5. Test: adding the module, changing settings, styling, and frontend rendering
6. For conversions: test D4→D5 conversion by loading a saved D4 layout and verifying attributes migrate

---

## Common Patterns

### Text Fields → Element Attributes

D4 `'type' => 'text'` or `'type' => 'tiny_mce'` fields become element attributes in module.json with `innerContent` settings and an `elementType`. For scratch builds, any user-editable text content follows this same pattern.

### Toggle Fields → Advanced Settings

D4 `'type' => 'yes_no_button'` or any on/off setting becomes a toggle component (`divi/toggle`) within the attribute's `settings.advanced` or `settings.innerContent`.

### Select Fields → Select Components

Dropdown selects use `divi/select` components. The options list goes into the component's `props.options`.

### Image/Upload Fields → imageLink Elements

Image uploads become attributes with `"elementType": "imageLink"` and appropriate innerContent settings.

### Button Fields → Button Elements

Button text + URL + styling become a single `button` attribute with `"elementType": "button"`, containing innerContent for text/URL and decoration for styling.

### Parent/Child Modules

For modules with repeatable child items (tabs, accordions, carousels):
- Both parent and child need separate module definitions
- Parent module.json needs `"childModuleName"` and `"childrenName"` keys
- Child module.json needs `"category": "child-module"`
- Parent edit.jsx uses `ChildModulesContainer` to render children
- Child receives `parentAttrs` prop for shared settings

### Dynamic/API Data

Modules that fetch external data (API calls, database queries):
- Keep data fetching in PHP `RenderCallbackTrait`
- Use `ModuleScriptData` to pass fetched data to the frontend
- In edit.jsx, you may need REST API calls for VB preview

### Modals & Lightboxes

For modules with popups, lightboxes, or overlay content, see `references/modals-playbook.md`.

---

## Troubleshooting

| Problem | Check |
|---|---|
| Module not in VB panel | module.json valid? Registered in index.js and Modules.php? |
| No icon | Registered in module-icons.js? moduleIcon matches? |
| Styles not applying | elements.style() called in styles.jsx for each attr? |
| Fields missing in panel | Group defined in settings.groups? render: true set? |
| D4 conversion fails | d4Shortcode correct? conversion-outline.js mappings right? |
| PHP errors | Trait imports correct? render_callback signature right? |
| Build errors | Check webpack externals match Divi packages |

For detailed troubleshooting, see `references/troubleshooting.md`.

---

## Resources

### references/
- `d5-module-anatomy.md` — Complete file-by-file breakdown
- `module-json-cheatsheet.md` — module.json schema reference
- `conversion-outline-guide.md` — D4→D5 attribute mapping guide
- `d5-plugin-bootstrap.md` — Webpack, package.json, plugin setup
- `troubleshooting.md` — Common issues and fixes
- `modals-playbook.md` — Modals and lightbox patterns
- `ref-plugins/` — Reference plugin source code

### ref-plugins/
- `d5-extension-example-modules/` — Official Elegant Themes example (D4+D5 side by side)
- `d5-example-core-modules/` — Core Divi 5 module implementations (Button, Blurb, Blog, Accordion, CTA, etc.)

When building or converting a module, always find the closest core module example and study it first. The reference plugins are your ground truth.
