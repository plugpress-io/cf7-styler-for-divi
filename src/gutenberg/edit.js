/**
 * CF7 Styler – Gutenberg block editor component.
 *
 * Renders sidebar controls (InspectorControls) and a live preview
 * fetched from the custom REST endpoint (cf7m/v1/render-block).
 *
 * @package CF7_Mate
 */

import { useEffect, useState, useRef } from '@wordpress/element';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	TextareaControl,
	ColorPicker,
	Button,
	Spinner,
	__experimentalBoxControl as BoxControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/* ═══════════════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════════════ */

const FORMS = (window.cf7mGutenbergData && window.cf7mGutenbergData.forms) || [];

const FORM_OPTIONS = [
	{ value: '0', label: __('Select a Contact Form', 'cf7-styler-for-divi') },
	...FORMS,
];

function ColorControl({ label, value, onChange }) {
	return (
		<div className="cf7m-gb-color-control">
			<p className="cf7m-gb-color-label">{label}</p>
			<ColorPicker color={value || ''} onChange={onChange} enableAlpha={false} />
		</div>
	);
}

function boxToAttrs(val, prefix, setAttributes) {
	if (!val) return;
	setAttributes({
		[prefix + 'Top']: val.top || '',
		[prefix + 'Right']: val.right || '',
		[prefix + 'Bottom']: val.bottom || '',
		[prefix + 'Left']: val.left || '',
	});
}

function attrsToBox(attrs, prefix) {
	return {
		top: attrs[prefix + 'Top'] || '',
		right: attrs[prefix + 'Right'] || '',
		bottom: attrs[prefix + 'Bottom'] || '',
		left: attrs[prefix + 'Left'] || '',
	};
}

/* ═══════════════════════════════════════════════════════════════════════════
   Block preview (fetched via REST)
   ═══════════════════════════════════════════════════════════════════════════ */

function BlockPreview({ attributes }) {
	const [html, setHtml] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const timer = useRef(null);
	const attrsRef = useRef(attributes);

	attrsRef.current = attributes;

	useEffect(() => {
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			setLoading(true);
			setError('');
			apiFetch({
				path: '/cf7m/v1/render-block',
				method: 'POST',
				data: { attributes: attrsRef.current },
			})
				.then((res) => {
					setHtml(res && res.rendered ? res.rendered : '');
					setLoading(false);
				})
				.catch((err) => {
					setHtml('');
					setError(err && err.message ? err.message : __('Failed to load preview.', 'cf7-styler-for-divi'));
					setLoading(false);
				});
		}, 400);
		return () => clearTimeout(timer.current);
	}, [JSON.stringify(attributes)]); // eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return (
			<div className="cf7m-gb-loading">
				<Spinner />
				{__('Loading form preview…', 'cf7-styler-for-divi')}
			</div>
		);
	}

	if (error) {
		return (
			<div className="cf7m-gb-error">
				<span className="dashicons dashicons-warning" />
				<p>{error}</p>
			</div>
		);
	}

	if (!html) {
		return null;
	}

	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Inspector panels
   ═══════════════════════════════════════════════════════════════════════════ */

function ContentPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Content', 'cf7-styler-for-divi')} initialOpen>
			<SelectControl
				label={__('Select Form', 'cf7-styler-for-divi')}
				value={String(attributes.formId)}
				options={FORM_OPTIONS}
				onChange={(val) => setAttributes({ formId: parseInt(val, 10) })}
			/>
		</PanelBody>
	);
}

function HeaderPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Form Header', 'cf7-styler-for-divi')} initialOpen={false}>
			<ToggleControl
				label={__('Show Form Header', 'cf7-styler-for-divi')}
				checked={attributes.useFormHeader}
				onChange={(val) => setAttributes({ useFormHeader: val })}
			/>
			{attributes.useFormHeader && (
				<>
					<TextControl
						label={__('Header Title', 'cf7-styler-for-divi')}
						value={attributes.formHeaderTitle}
						onChange={(val) => setAttributes({ formHeaderTitle: val })}
					/>
					<TextareaControl
						label={__('Header Text', 'cf7-styler-for-divi')}
						value={attributes.formHeaderText}
						onChange={(val) => setAttributes({ formHeaderText: val })}
					/>
					<ToggleControl
						label={__('Use Icon', 'cf7-styler-for-divi')}
						checked={attributes.useIcon}
						onChange={(val) => setAttributes({ useIcon: val })}
					/>
					{attributes.useIcon ? (
						<TextControl
							label={__('Icon CSS Class (e.g. fas fa-envelope)', 'cf7-styler-for-divi')}
							value={attributes.headerIconClass}
							onChange={(val) => setAttributes({ headerIconClass: val })}
						/>
					) : (
						<>
							<p>{__('Header Image', 'cf7-styler-for-divi')}</p>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => setAttributes({ headerImageUrl: media.url })}
									allowedTypes={['image']}
									render={({ open }) => (
										<Button variant="secondary" onClick={open} className="cf7m-gb-media-btn">
											{attributes.headerImageUrl
												? __('Change Image', 'cf7-styler-for-divi')
												: __('Choose Image', 'cf7-styler-for-divi')}
										</Button>
									)}
								/>
							</MediaUploadCheck>
							{attributes.headerImageUrl && (
								<Button isLink isDestructive onClick={() => setAttributes({ headerImageUrl: '' })}>
									{__('Remove Image', 'cf7-styler-for-divi')}
								</Button>
							)}
						</>
					)}
					<ColorControl label={__('Header Background', 'cf7-styler-for-divi')} value={attributes.formHeaderBg} onChange={(v) => setAttributes({ formHeaderBg: v })} />
					<BoxControl label={__('Header Padding', 'cf7-styler-for-divi')} values={attrsToBox(attributes, 'formHeaderPadding')} onChange={(v) => boxToAttrs(v, 'formHeaderPadding', setAttributes)} />
					<UnitControl label={__('Bottom Spacing', 'cf7-styler-for-divi')} value={attributes.formHeaderBottomSpacing} onChange={(v) => setAttributes({ formHeaderBottomSpacing: v })} />
					<ColorControl label={__('Image/Icon Background', 'cf7-styler-for-divi')} value={attributes.formHeaderImgBg} onChange={(v) => setAttributes({ formHeaderImgBg: v })} />
					{attributes.useIcon && (
						<ColorControl label={__('Icon Color', 'cf7-styler-for-divi')} value={attributes.formHeaderIconColor} onChange={(v) => setAttributes({ formHeaderIconColor: v })} />
					)}
				</>
			)}
		</PanelBody>
	);
}

function FormCommonPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Form Common', 'cf7-styler-for-divi')} initialOpen={false}>
			<ColorControl label={__('Form Background', 'cf7-styler-for-divi')} value={attributes.formBg} onChange={(v) => setAttributes({ formBg: v })} />
			<BoxControl label={__('Form Padding', 'cf7-styler-for-divi')} values={attrsToBox(attributes, 'formPadding')} onChange={(v) => boxToAttrs(v, 'formPadding', setAttributes)} />
			<UnitControl label={__('Border Radius', 'cf7-styler-for-divi')} value={attributes.formBorderRadius} onChange={(v) => setAttributes({ formBorderRadius: v })} />
			<ToggleControl label={__('Fullwidth Button', 'cf7-styler-for-divi')} checked={attributes.fullwidthButton} onChange={(v) => setAttributes({ fullwidthButton: v })} />
			{!attributes.fullwidthButton && (
				<SelectControl
					label={__('Button Alignment', 'cf7-styler-for-divi')}
					value={attributes.buttonAlignment}
					options={[
						{ value: 'left', label: __('Left', 'cf7-styler-for-divi') },
						{ value: 'center', label: __('Center', 'cf7-styler-for-divi') },
						{ value: 'right', label: __('Right', 'cf7-styler-for-divi') },
					]}
					onChange={(v) => setAttributes({ buttonAlignment: v })}
				/>
			)}
		</PanelBody>
	);
}

function FieldsPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Form Fields', 'cf7-styler-for-divi')} initialOpen={false}>
			<UnitControl label={__('Field Height', 'cf7-styler-for-divi')} value={attributes.fieldHeight} onChange={(v) => setAttributes({ fieldHeight: v })} />
			<BoxControl label={__('Field Padding', 'cf7-styler-for-divi')} values={attrsToBox(attributes, 'fieldPadding')} onChange={(v) => boxToAttrs(v, 'fieldPadding', setAttributes)} />
			<ColorControl label={__('Background Color', 'cf7-styler-for-divi')} value={attributes.fieldBgColor} onChange={(v) => setAttributes({ fieldBgColor: v })} />
			<ColorControl label={__('Text Color', 'cf7-styler-for-divi')} value={attributes.fieldTextColor} onChange={(v) => setAttributes({ fieldTextColor: v })} />
			<ColorControl label={__('Focus Border Color', 'cf7-styler-for-divi')} value={attributes.fieldFocusBorderColor} onChange={(v) => setAttributes({ fieldFocusBorderColor: v })} />
			<UnitControl label={__('Border Width', 'cf7-styler-for-divi')} value={attributes.fieldBorderWidth} onChange={(v) => setAttributes({ fieldBorderWidth: v })} />
			<SelectControl
				label={__('Border Style', 'cf7-styler-for-divi')}
				value={attributes.fieldBorderStyle}
				options={[
					{ value: 'solid', label: 'Solid' },
					{ value: 'dashed', label: 'Dashed' },
					{ value: 'dotted', label: 'Dotted' },
					{ value: 'none', label: 'None' },
				]}
				onChange={(v) => setAttributes({ fieldBorderStyle: v })}
			/>
			<ColorControl label={__('Border Color', 'cf7-styler-for-divi')} value={attributes.fieldBorderColor} onChange={(v) => setAttributes({ fieldBorderColor: v })} />
			<UnitControl label={__('Border Radius', 'cf7-styler-for-divi')} value={attributes.fieldBorderRadius} onChange={(v) => setAttributes({ fieldBorderRadius: v })} />
			<UnitControl label={__('Field Spacing Bottom', 'cf7-styler-for-divi')} value={attributes.fieldSpacing} onChange={(v) => setAttributes({ fieldSpacing: v })} />
		</PanelBody>
	);
}

function LabelsPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Labels', 'cf7-styler-for-divi')} initialOpen={false}>
			<ColorControl label={__('Label Color', 'cf7-styler-for-divi')} value={attributes.labelColor} onChange={(v) => setAttributes({ labelColor: v })} />
			<UnitControl label={__('Label Spacing Bottom', 'cf7-styler-for-divi')} value={attributes.labelSpacing} onChange={(v) => setAttributes({ labelSpacing: v })} />
		</PanelBody>
	);
}

function PlaceholderPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Placeholder', 'cf7-styler-for-divi')} initialOpen={false}>
			<ColorControl label={__('Placeholder Color', 'cf7-styler-for-divi')} value={attributes.placeholderColor} onChange={(v) => setAttributes({ placeholderColor: v })} />
		</PanelBody>
	);
}

function RadioCheckboxPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Radio & Checkbox', 'cf7-styler-for-divi')} initialOpen={false}>
			<ToggleControl label={__('Custom Styles', 'cf7-styler-for-divi')} checked={attributes.crCustomStyles} onChange={(v) => setAttributes({ crCustomStyles: v })} />
			{attributes.crCustomStyles && (
				<>
					<UnitControl label={__('Size', 'cf7-styler-for-divi')} value={attributes.crSize} onChange={(v) => setAttributes({ crSize: v })} />
					<ColorControl label={__('Background Color', 'cf7-styler-for-divi')} value={attributes.crBgColor} onChange={(v) => setAttributes({ crBgColor: v })} />
					<ColorControl label={__('Selected Color', 'cf7-styler-for-divi')} value={attributes.crSelectedColor} onChange={(v) => setAttributes({ crSelectedColor: v })} />
					<ColorControl label={__('Border Color', 'cf7-styler-for-divi')} value={attributes.crBorderColor} onChange={(v) => setAttributes({ crBorderColor: v })} />
					<UnitControl label={__('Border Size', 'cf7-styler-for-divi')} value={attributes.crBorderSize} onChange={(v) => setAttributes({ crBorderSize: v })} />
					<ColorControl label={__('Label Color', 'cf7-styler-for-divi')} value={attributes.crLabelColor} onChange={(v) => setAttributes({ crLabelColor: v })} />
				</>
			)}
		</PanelBody>
	);
}

function ButtonPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Button', 'cf7-styler-for-divi')} initialOpen={false}>
			<ColorControl label={__('Text Color', 'cf7-styler-for-divi')} value={attributes.buttonTextColor} onChange={(v) => setAttributes({ buttonTextColor: v })} />
			<ColorControl label={__('Background Color', 'cf7-styler-for-divi')} value={attributes.buttonBgColor} onChange={(v) => setAttributes({ buttonBgColor: v })} />
			<ColorControl label={__('Hover Text Color', 'cf7-styler-for-divi')} value={attributes.buttonTextColorHover} onChange={(v) => setAttributes({ buttonTextColorHover: v })} />
			<ColorControl label={__('Hover Background Color', 'cf7-styler-for-divi')} value={attributes.buttonBgColorHover} onChange={(v) => setAttributes({ buttonBgColorHover: v })} />
			<ColorControl label={__('Hover Border Color', 'cf7-styler-for-divi')} value={attributes.buttonBorderColorHover} onChange={(v) => setAttributes({ buttonBorderColorHover: v })} />
			<BoxControl label={__('Padding', 'cf7-styler-for-divi')} values={attrsToBox(attributes, 'buttonPadding')} onChange={(v) => boxToAttrs(v, 'buttonPadding', setAttributes)} />
			<UnitControl label={__('Border Radius', 'cf7-styler-for-divi')} value={attributes.buttonBorderRadius} onChange={(v) => setAttributes({ buttonBorderRadius: v })} />
		</PanelBody>
	);
}

function MessagesPanel({ attributes, setAttributes }) {
	return (
		<PanelBody title={__('Messages', 'cf7-styler-for-divi')} initialOpen={false}>
			<UnitControl label={__('Validation Message Padding', 'cf7-styler-for-divi')} value={attributes.msgPadding} onChange={(v) => setAttributes({ msgPadding: v })} />
			<UnitControl label={__('Validation Message Margin Top', 'cf7-styler-for-divi')} value={attributes.msgMarginTop} onChange={(v) => setAttributes({ msgMarginTop: v })} />
			<SelectControl
				label={__('Message Text Alignment', 'cf7-styler-for-divi')}
				value={attributes.msgAlignment}
				options={[
					{ value: 'left', label: __('Left', 'cf7-styler-for-divi') },
					{ value: 'center', label: __('Center', 'cf7-styler-for-divi') },
					{ value: 'right', label: __('Right', 'cf7-styler-for-divi') },
				]}
				onChange={(v) => setAttributes({ msgAlignment: v })}
			/>
			<ColorControl label={__('Validation Text Color', 'cf7-styler-for-divi')} value={attributes.msgColor} onChange={(v) => setAttributes({ msgColor: v })} />
			<ColorControl label={__('Validation Background Color', 'cf7-styler-for-divi')} value={attributes.msgBgColor} onChange={(v) => setAttributes({ msgBgColor: v })} />
			<ColorControl label={__('Validation Border Color', 'cf7-styler-for-divi')} value={attributes.msgBorderColor} onChange={(v) => setAttributes({ msgBorderColor: v })} />
			<ColorControl label={__('Success Text Color', 'cf7-styler-for-divi')} value={attributes.successMsgColor} onChange={(v) => setAttributes({ successMsgColor: v })} />
			<ColorControl label={__('Success Background Color', 'cf7-styler-for-divi')} value={attributes.successMsgBgColor} onChange={(v) => setAttributes({ successMsgBgColor: v })} />
			<ColorControl label={__('Success Border Color', 'cf7-styler-for-divi')} value={attributes.successBorderColor} onChange={(v) => setAttributes({ successBorderColor: v })} />
			<ColorControl label={__('Error Text Color', 'cf7-styler-for-divi')} value={attributes.errorMsgColor} onChange={(v) => setAttributes({ errorMsgColor: v })} />
			<ColorControl label={__('Error Background Color', 'cf7-styler-for-divi')} value={attributes.errorMsgBgColor} onChange={(v) => setAttributes({ errorMsgBgColor: v })} />
			<ColorControl label={__('Error Border Color', 'cf7-styler-for-divi')} value={attributes.errorBorderColor} onChange={(v) => setAttributes({ errorBorderColor: v })} />
		</PanelBody>
	);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main edit component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Edit({ attributes, setAttributes, clientId }) {
	const { blockId, formId } = attributes;

	// Assign a unique blockId once on first insert.
	useEffect(() => {
		if (!blockId) {
			setAttributes({ blockId: 'cf7m-gb-' + clientId.replace(/-/g, '').slice(0, 8) });
		}
	}, [blockId, clientId, setAttributes]);

	return (
		<>
			<InspectorControls>
				<ContentPanel attributes={attributes} setAttributes={setAttributes} />
				<HeaderPanel attributes={attributes} setAttributes={setAttributes} />
				<FormCommonPanel attributes={attributes} setAttributes={setAttributes} />
				<FieldsPanel attributes={attributes} setAttributes={setAttributes} />
				<LabelsPanel attributes={attributes} setAttributes={setAttributes} />
				<PlaceholderPanel attributes={attributes} setAttributes={setAttributes} />
				<RadioCheckboxPanel attributes={attributes} setAttributes={setAttributes} />
				<ButtonPanel attributes={attributes} setAttributes={setAttributes} />
				<MessagesPanel attributes={attributes} setAttributes={setAttributes} />
			</InspectorControls>

			<div className="cf7m-gutenberg-editor-wrapper">
				{formId > 0 ? (
					<BlockPreview attributes={attributes} />
				) : (
					<div className="cf7m-gb-placeholder">
						<span className="dashicons dashicons-email-alt" />
						<p>{__('CF7 Styler – select a Contact Form 7 in the sidebar to preview it here.', 'cf7-styler-for-divi')}</p>
					</div>
				)}
			</div>
		</>
	);
}
