import React, { Component } from "react";
import { get_responsive_styles, renderFontStyle } from "./helper";
import "./style.css";

class CF7_Styler extends Component {
    static slug = "dvppl_cf7_styler";

    static css(props) {
        const additionalCss = [];

         let iconFont = renderFontStyle(props, 'header_icon', '%%order_class%% .dipe-form-header-icon .et-pb-icon');

        let form_label_spacing = get_responsive_styles(
            props,
            "form_label_spacing",
            `%%order_class%% .dipe-cf7-container .wpcf7-form-control:not(.wpcf7-submit)`,
            { primary: "margin-top" },
            { default: "7px", important: true }
        );

        let form_field_spacing = get_responsive_styles(
            props,
            "form_field_spacing",
            `%%order_class%% .dipe-cf7 .wpcf7 form>p, .dipe-cf7 .wpcf7 form>div, .dipe-cf7 .wpcf7 form>label
            %%order_class%% .dipe-cf7 .wpcf7 form .dp-col>p, .dipe-cf7 .wpcf7 form .dp-col>div, .dipe-cf7 .wpcf7 form .dp-col>label`,
            { primary: "margin-bottom" },
            { default: "20px", important: true }
        );

        let form_field_height = [];
        if (props.form_field_height) {
            form_field_height = get_responsive_styles(
                props,
                "form_field_height",
                `%%order_class%% .wpcf7-form-control-wrap select, %%order_class%% .wpcf7-form-control-wrap input[type=text],
			%%order_class%% .wpcf7-form-control-wrap input[type=email], %%order_class%% .wpcf7-form-control-wrap input[type=number], %%order_class%% .wpcf7-form-control-wrap input[type=tel]`,
                { primary: "height" },
                { default: "initial", important: true }
            );
        }

        let form_field_padding = get_responsive_styles(
            props,
            "form_field_padding",
            `%%order_class%% .dipe-cf7-container .wpcf7 input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]), %%order_class%% .dipe-cf7-container .wpcf7 select, %%order_class%% .dipe-cf7-container .wpcf7 textarea`,
            { primary: "padding" },
            { default: "10px|15px|10px|15px", important: true }
        );

        if ("on" === props.use_form_button_fullwidth) {
            additionalCss.push([
                {
                    selector:
                        "%%order_class%% .dipe-cf7 .wpcf7 input[type=submit], %%order_class%% .wpcf7-form button.wpcf7-submit",
                    declaration: `width: 100% !important;`,
                },
            ]);
        }

        additionalCss.push([
            {
                selector: "%%order_class%% .dipe-form-header-container",
                declaration: `background-color: ${props.form_header_bg};`,
            },
        ]);

        additionalCss.push([
            {
                selector: "%%order_class%% .dipe-cf7-styler",
                declaration: `background-color: ${props.form_bg};`,
            },
        ]);

        additionalCss.push([
            {
                selector: "%%order_class%% .dipe-form-header-container",
                declaration: `margin-bottom: ${props.form_header_bottom};`,
            },
        ]);

        additionalCss.push([
            {
                selector:
                    "%%order_class%% .dipe-form-header-icon, %%order_class%% .dipe-form-header-image",
                declaration: `background-color: ${props.form_header_img_bg};`,
            },
        ]);

        additionalCss.push([
            {
                selector: "%%order_class%% .dipe-form-header-icon span",
                declaration: `color: ${props.form_header_icon_color};`,
            },
        ]);

        let form_header_padding = props.form_header_padding.split("|");
        let form_header_padding_last_edited =
            props.form_header_padding_last_edited;
        let form_header_padding_responsive_status =
            form_header_padding_last_edited &&
            form_header_padding_last_edited.startsWith("on");
        let form_header_padding_tablet = props.form_header_padding_tablet;
        let form_header_padding_phone = props.form_header_padding_phone;

        additionalCss.push([
            {
                selector: "%%order_class%% .dipe-form-header-container",
                declaration: `
            padding-top   : ${form_header_padding[0]};
            padding-right : ${form_header_padding[1]};
            padding-bottom: ${form_header_padding[2]};
            padding-left  : ${form_header_padding[3]};`,
            },
        ]);

        if (
            form_header_padding_tablet &&
            form_header_padding_responsive_status
        ) {
            let padding_tablet = form_header_padding_tablet.split("|");
            additionalCss.push([
                {
                    selector: "%%order_class%% .dipe-form-header-container",
                    device: "tablet",
                    declaration: `
                padding-top   : ${padding_tablet[0]};
                padding-right : ${padding_tablet[1]};
                padding-bottom: ${padding_tablet[2]};
                padding-left  : ${padding_tablet[3]};`,
                },
            ]);
        }

        if (
            form_header_padding_phone &&
            form_header_padding_responsive_status
        ) {
            let padding_phone = form_header_padding_phone.split("|");
            additionalCss.push([
                {
                    selector: "%%order_class%% .dipe-form-header-container",
                    device: "phone",
                    declaration: `
                padding-top   : ${padding_phone[0]};
                padding-right : ${padding_phone[1]};
                padding-bottom: ${padding_phone[2]};
                padding-left  : ${padding_phone[3]};`,
                },
            ]);
        }

        let form_padding = props.form_padding.split("|");
        let form_padding_last_edited = props.form_padding_last_edited;
        let form_padding_responsive_status =
            form_padding_last_edited &&
            form_padding_last_edited.startsWith("on");
        let form_padding_tablet = props.form_padding_tablet;
        let form_padding_phone = props.form_padding_phone;

        additionalCss.push([
            {
                selector: "%%order_class%% .dipe-cf7-styler",
                declaration: `
            padding-top   : ${form_padding[0]};
            padding-right : ${form_padding[1]};
            padding-bottom: ${form_padding[2]};
            padding-left  : ${form_padding[3]};`,
            },
        ]);

        if (form_padding_tablet && form_padding_responsive_status) {
            let padding_tablet = form_padding_tablet.split("|");
            additionalCss.push([
                {
                    selector: "%%order_class%% .dipe-cf7-styler",
                    device: "tablet",
                    declaration: `
                padding-top   : ${padding_tablet[0]};
                padding-right : ${padding_tablet[1]};
                padding-bottom: ${padding_tablet[2]};
                padding-left  : ${padding_tablet[3]};`,
                },
            ]);
        }

        if (form_padding_phone && form_padding_responsive_status) {
            let padding_phone = form_padding_phone.split("|");
            additionalCss.push([
                {
                    selector: "%%order_class%% .dipe-cf7-styler",
                    device: "phone",
                    declaration: `
                padding-top   : ${padding_phone[0]};
                padding-right : ${padding_phone[1]};
                padding-bottom: ${padding_phone[2]};
                padding-left  : ${padding_phone[3]};`,
                },
            ]);
        }

        additionalCss.push([
            {
                selector:
                    "%%order_class%% input:not([type=submit]), %%order_class%% select, %%order_class%% .dipe-cf7 textarea, %%order_class%% .wpcf7-checkbox input[type=checkbox] + span:before, %%order_class%% .wpcf7-acceptance input[type=checkbox] + span:before, %%order_class%% .wpcf7-radio input[type=radio]:not(:checked) + span:before",
                declaration: `background-color: ${props.form_background_color};`,
            },
        ]);

        additionalCss.push([
            {
                selector:
                    "%%order_class%% .dipe-cf7 .wpcf7 input:not([type=submit]):focus, %%order_class%% .dipe-cf7 .wpcf7 select:focus, %%order_class%% .dipe-cf7 .wpcf7 textarea:focus",
                declaration: `border-color: ${props.form_field_active_color};`,
            },
        ]);

        if ("on" === props.cr_custom_styles) {
            additionalCss.push([
                {
                    selector:
                        "%%order_class%% .wpcf7-checkbox input[type=checkbox] + span:before, %%order_class%% .wpcf7-acceptance input[type=checkbox] + span:before, %%order_class%% .wpcf7-radio input[type=radio]:not(:checked) + span:before",
                    declaration: `background-color: ${props.cr_background_color};`,
                },
            ]);

            additionalCss.push([
                {
                    selector:
                        "%%order_class%% .wpcf7-checkbox input[type=checkbox] + span:before, %%order_class%% .wpcf7-acceptance input[type=checkbox] + span:before, %%order_class%% .wpcf7-radio input[type=radio] + span:before, %%order_class%% .wpcf7-checkbox input[type=checkbox]:checked + span:before, %%order_class%% .wpcf7-acceptance input[type=checkbox]:checked + span:before",
                    declaration: `width: ${props.cr_size}; height: ${props.cr_size}; border-width: ${props.cr_border_size};`,
                },
            ]);

            additionalCss.push([
                {
                    selector:
                        "%%order_class%% .wpcf7-checkbox input[type=checkbox]:checked + span:before, %%order_class%% .wpcf7-acceptance input[type=checkbox]:checked + span:before",
                    declaration: `color: ${props.cr_selected_color}; font-size: calc( ${props.cr_size} / 1.2 );`,
                },
            ]);

            additionalCss.push([
                {
                    selector:
                        "%%order_class%% .wpcf7-radio input[type=radio]:checked + span:before",
                    declaration: `background-color: ${props.cr_selected_color}; box-shadow:inset 0px 0px 0px 4px ${props.cr_selected_color};`,
                },
            ]);

            additionalCss.push([
                {
                    selector:
                        "%%order_class%% .wpcf7-checkbox input[type=radio] + span:before, %%order_class%% .dipe-cf7 .wpcf7-radio input[type=checkbox] + span:before, %%order_class%% .dipe-cf7 .wpcf7-acceptance input[type=checkbox] + span:before",
                    declaration: `border-color: ${props.cr_border_color};`,
                },
            ]);

            additionalCss.push([
                {
                    selector:
                        "%%order_class%% .wpcf7-checkbox label, %%order_class%% .wpcf7-radio label, %%order_class%%  .wpcf7-acceptance label",
                    declaration: `color: ${props.cr_label_color};`,
                },
            ]);
        }

        additionalCss.push([
            {
                selector:
                    "%%order_class%% .wpcf7 form .wpcf7-response-output, %%order_class%% .wpcf7 form span.wpcf7-not-valid-tip",
                declaration: `text-align: ${props.cf7_message_alignment};`,
            },
        ]);

        additionalCss.push([
            {
                selector: "%%order_class%% span.wpcf7-not-valid-tip",
                declaration: `color: ${props.cf7_message_color}; background-color: ${props.cf7_message_bg_color}; border: 3px ${props.cf7_border_highlight_color}; padding: ${props.cf7_message_padding}; margin-top: ${props.cf7_message_margin_top};`,
            },
        ]);

        additionalCss.push([
            {
                selector: "%%order_class%% .wpcf7-mail-sent-ok",
                declaration: `color: ${props.cf7_success_message_color}; background-color: ${props.cf7_success_message_color}; border-color: ${props.cf7_success_border_color};`,
            },
        ]);

        additionalCss.push([
            {
                selector: "%%order_class%% .wpcf7-validation-errors",
                declaration: `color: ${props.cf7_error_message_color}; background-color: ${props.cf7_error_message_bg_color}; border-color: ${props.cf7_error_border_color};`,
            },
        ]);

        return additionalCss
            .concat(iconFont)
            .concat(form_field_spacing)
            .concat(form_label_spacing)
            .concat(form_field_height)
            .concat(form_field_padding);
    }

    _renderHeader(props) {
        if ("on" !== props.use_form_header) {
            return;
        }

        const utils = window.ET_Builder.API.Utils;

        //Icon & Image
        const header_img =
            typeof props.header_img !== "undefined" ? props.header_img : false;
        const image = header_img ? (
            <div className='dipe-form-header-image'>
                <img src={header_img} alt='' />
            </div>
        ) : (
            ""
        );

        const header_icon = utils.processFontIcon(props.header_icon);
        const icon = (
            <div className='dipe-form-header-icon'>
                <span className='et-pb-icon'>{header_icon}</span>
            </div>
        );
        const icon_image = "on" === props.use_icon ? icon : image;

        // Header
        const title =
            typeof props.form_header_title !== "undefined" ? (
                <h2 className='dipe-form-header-title'>
                    {props.form_header_title}
                </h2>
            ) : (
                ""
            );
        const text =
            typeof props.form_header_text !== "undefined" ? (
                <div className='dipe-form-header-text'>
                    {props.form_header_text}
                </div>
            ) : (
                ""
            );

        const header_info =
            title || text ? (
                <div className='dipe-form-header-info'>
                    {title} {text}
                </div>
            ) : (
                ""
            );

        return (
            <div className='dipe-form-header-container'>
                <div className='dipe-form-header'>
                    {icon_image}
                    {header_info}
                </div>
            </div>
        );
    }

    render() {
        const props = this.props;

        let cr_custom_class = "";
        if ("on" === props.cr_custom_styles) {
            cr_custom_class = "dipe-cf7-cr";
        }

        let button_alignment = props.button_alignment;
        if ("on" === props.use_form_button_fullwidth) {
            button_alignment = "fullwidth";
        }

        return (
            <div
                className={`dipe-cf7-container dipe-cf7-button-${button_alignment}`}
            >
                {this._renderHeader(props)}
                <div
                    className={`dipe-cf7 dipe-cf7-styler ${cr_custom_class}`}
                    dangerouslySetInnerHTML={{ __html: props.__cf7form }}
                />
            </div>
        );
    }
}

export default CF7_Styler;
