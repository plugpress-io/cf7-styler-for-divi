import React, { Component } from "react";
import { generateStyles } from '@Dependencies/styles';
import { renderDiviFont } from '@Dependencies/et-render-font';

class GFStyler extends Component {
    static slug = "tfs_gravity_forms_styler";

    static css(props) {
        let additionalCss = [];
        let address = props.address;

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_padding',
              selector: `
                div%%order_class%% .tfs-gf-styler .gform_wrapper form .gform_body input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="file"]),
                div%%order_class%% .tfs-gf-styler .gform_wrapper textarea,div%%order_class%% .tfs-gf-styler .ginput_container select`,
              cssProperty: 'padding',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_padding',
              selector: `div%%order_class%% .tfs-gf-styler .gfield_checkbox input[type="checkbox"] + label:before,
              div%%order_class%% .tfs-gf-styler .gfield_radio input[type="radio"] + label:before`,
              cssProperty: 'height',
              important: false,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_padding',
              selector: `div%%order_class%% .tfs-gf-styler .gfield_checkbox input[type="checkbox"] + label:before,
              div%%order_class%% .tfs-gf-styler .gfield_radio input[type="radio"] + label:before`,
              cssProperty: 'width',
              important: false,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_bgcolor',
              selector: `
                div%%order_class%% .tfs-gf-styler .gform_wrapper input[type=email],
                div%%order_class%% .tfs-gf-styler .gform_wrapper input[type=text],
                div%%order_class%% .tfs-gf-styler .gform_wrapper input[type=password],
                div%%order_class%% .tfs-gf-styler .gform_wrapper input[type=url],
                div%%order_class%% .tfs-gf-styler .gform_wrapper input[type=tel],
                div%%order_class%% .tfs-gf-styler .gform_wrapper input[type=number],
                div%%order_class%% .tfs-gf-styler .gform_wrapper input[type=date],
                div%%order_class%% .tfs-gf-styler .gform_wrapper select,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .chosen-container-single .chosen-single,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .chosen-container-multi .chosen-choices,
                div%%order_class%% .tfs-gf-styler .gform_wrapper textarea,
                div%%order_class%% .tfs-gf-styler .gfield_checkbox input[type="checkbox"] + label:before,
                div%%order_class%% .tfs-gf-styler .gfield_radio input[type="radio"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gf_progressbar,
                div%%order_class%% .tfs-gf-styler .ginput_container_consent input[type="checkbox"] + label:before`,
              cssProperty: 'background-color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_required_color',
              selector: 'div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_required',
              cssProperty: 'color',
              important: true,
            })
        );

        // Radio and Checkbox
        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'gf_radio_check_size',
              selector: `
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio .gchoice_label label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"],
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"],
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"]`,
              cssProperty: 'height',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'gf_radio_check_size',
              selector: `
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio .gchoice_label label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"],
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"],
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"]`,
              cssProperty: 'width',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'gf_radio_check_bgcolor',
              selector: `
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio .gchoice_label label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"] + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"],
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"],
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"]`,
              cssProperty: 'background-color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'gf_selected_color',
              selector: `
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"]:checked + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_checkbox input[type="checkbox"]:checked:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"]:checked + label:before,
                div%%order_class%% .tfs-gf-styler .gform_wrapper .ginput_container_consent input[type="checkbox"]:checked:before`,
              cssProperty: 'color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'gf_selected_color',
              selector: `
                    div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"]:checked:before,
                    div%%order_class%% .tfs-gf-styler .gform_wrapper .gfield_radio input[type="radio"]:checked + label:before`, 
              cssProperty: 'background-color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'gf_selected_color',
              selector: 'div%%order_class%% .tfs-gf-styler ',
              cssProperty: 'color',
              important: true,
            })
        );

        // Form error and success message
        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_error_padding',
              type: 'padding',
              selector: 'div%%order_class%% .tfs-gf-styler .gform_wrapper div.gform_validation_errors',
              cssProperty: 'padding',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_error_bgcolor',
              selector: 'div%%order_class%% .tfs-gf-styler .gform_wrapper div.gform_validation_errors',
              cssProperty: 'background-color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_valid_padding',
              type: 'padding',
              selector: 'div%%order_class%% .tfs-gf-styler .gform_wrapper div.gform_confirmation_message',
              cssProperty: 'padding',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_valid_bgcolor',
              selector: 'div%%order_class%% .tfs-gf-styler .gform_wrapper div.gform_confirmation_message',
              cssProperty: 'background-color',
              important: true,
            })
        );

        return additionalCss;

    }
    
    render() {

        const props = this.props;

        console.log(props.__gravity_forms);

        return (
            <div
                className={`tfs-gf-styler`}
                dangerouslySetInnerHTML={{ __html: props.__gravity_forms }}
            />
        );
    }

}

export default GFStyler;
