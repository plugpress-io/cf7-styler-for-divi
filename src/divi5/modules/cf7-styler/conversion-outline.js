/**
 * CF7 Styler for Divi - Conversion Outline.
 *
 * Maps Divi 4 shortcode attributes to Divi 5 attribute structure.
 *
 * @since 3.0.0
 */

export const conversionOutline = {
	// General settings
	cf7: 'cf7.advanced.formId',
	use_form_header: 'cf7.advanced.useFormHeader',
	form_header_title: 'cf7.advanced.formHeaderTitle',
	form_header_text: 'cf7.advanced.formHeaderText',
	use_icon: 'cf7.advanced.useIcon',
	header_img: 'cf7.advanced.headerImage',
	header_icon: 'cf7.advanced.headerIcon',

	// Form header styling (cf7.advanced.* matches module.json attrNames)
	form_header_bg: 'cf7.advanced.formHeaderBg',
	form_header_padding: 'cf7.advanced.formHeaderPadding',
	form_header_bottom: 'cf7.advanced.formHeaderBottom',
	form_header_img_bg: 'cf7.advanced.formHeaderImgBg',
	form_header_icon_color: 'cf7.advanced.formHeaderIconColor',

	// Form container
	form_bg: 'cf7.advanced.formBg',
	form_padding: 'cf7.advanced.formPadding',

	// Button settings
	use_form_button_fullwidth: 'cf7.advanced.useFormButtonFullwidth',
	button_alignment: 'cf7.advanced.buttonAlignment',

	// Form fields
	form_field_height: 'cf7.advanced.formFieldHeight',
	form_field_padding: 'cf7.advanced.formFieldPadding',
	form_background_color: 'cf7.advanced.formBackgroundColor',
	form_field_active_color: 'cf7.advanced.formFieldActiveColor',
	form_field_spacing: 'cf7.advanced.formFieldSpacing',

	// Form text styling
	form_label_spacing: 'cf7.advanced.formLabelSpacing',

	// Radio & Checkbox
	cr_custom_styles: 'cf7.advanced.crCustomStyles',
	cr_size: 'cf7.advanced.crSize',
	cr_background_color: 'cf7.advanced.crBackgroundColor',
	cr_selected_color: 'cf7.advanced.crSelectedColor',
	cr_border_color: 'cf7.advanced.crBorderColor',
	cr_border_size: 'cf7.advanced.crBorderSize',
	cr_label_color: 'cf7.advanced.crLabelColor',

	// Messages
	cf7_message_padding: 'cf7.advanced.cf7MessagePadding',
	cf7_message_margin_top: 'cf7.advanced.cf7MessageMarginTop',
	cf7_message_alignment: 'cf7.advanced.cf7MessageAlignment',
	cf7_message_color: 'cf7.advanced.cf7MessageColor',
	cf7_message_bg_color: 'cf7.advanced.cf7MessageBgColor',
	cf7_border_highlight_color: 'cf7.advanced.cf7BorderHighlightColor',

	// Success messages
	cf7_success_message_color: 'cf7.advanced.cf7SuccessMessageColor',
	cf7_success_message_bg_color: 'cf7.advanced.cf7SuccessMessageBgColor',
	cf7_success_border_color: 'cf7.advanced.cf7SuccessBorderColor',

	// Error messages
	cf7_error_message_color: 'cf7.advanced.cf7ErrorMessageColor',
	cf7_error_message_bg_color: 'cf7.advanced.cf7ErrorMessageBgColor',
	cf7_error_border_color: 'cf7.advanced.cf7ErrorBorderColor',

	// Fonts (mapped to decoration.font)
	title_font: 'cf7.decoration.font',
	text_font: 'cf7.decoration.font',
	form_field_font: 'cf7.decoration.font',
	labels_font: 'cf7.decoration.font',
	placeholder_font: 'cf7.decoration.font',

	// Advanced module settings
	advanced: {
		admin_label: 'module.meta.adminLabel',
		animation: 'module.decoration.animation',
		background: 'module.decoration.background',
		borders: 'module.decoration.border',
		box_shadow: 'module.decoration.boxShadow',
		disabled_on: 'module.decoration.disabledOn',
		filters: 'module.decoration.filters',
		height: 'module.decoration.sizing',
		link_options: 'module.advanced.link',
		margin_padding: 'module.decoration.spacing',
		max_width: 'module.decoration.sizing',
		module: 'module.advanced.htmlAttributes',
		overflow: 'module.decoration.overflow',
		position_fields: 'module.decoration.position',
		scroll: 'module.decoration.scroll',
		sticky: 'module.decoration.sticky',
		transform: 'module.decoration.transform',
		transition: 'module.decoration.transition',
		z_index: 'module.decoration.zIndex',
	},
};
