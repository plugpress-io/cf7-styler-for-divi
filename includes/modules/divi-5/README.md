# Divi 5 Contact Form 7 Styler Module

This module provides a Divi 5 compatible version of the Contact Form 7 Styler module, allowing you to style Contact Form 7 forms within the Divi 5 Visual Builder.

## Features

- Dynamically lists available Contact Form 7 forms
- Full compatibility with Divi 5 Visual Builder
- Live preview of form styling
- Extensive styling options for form fields, labels, and buttons
- Form header customization
- Responsive design support

## Installation

1. Make sure you have Divi 5 and Contact Form 7 installed and activated
2. Install and activate the CF7 Styler for Divi plugin
3. The plugin will automatically detect if you're using Divi 5 and load the appropriate module

## Usage

1. Create a new page or edit an existing page with Divi Builder
2. Add a new module and search for "CF7 Styler"
3. Select a Contact Form 7 form from the dropdown
4. Customize the form styling using the module settings
5. Save and publish your page

## Development

This module follows Divi 5's architecture and development practices:

- Uses React components for the Visual Builder
- Implements REST API endpoints for dynamic content
- Follows the composition-based architecture
- Uses hierarchical attribute structure
- Maintains backward compatibility with Divi 4

### Building the Module

To build the Visual Builder component:

```bash
cd includes/modules/divi-5/visual-builder
npm install
npm run build
```

## Compatibility

- Requires WordPress 5.0+
- Requires Divi 5.0+
- Requires Contact Form 7 5.0+
