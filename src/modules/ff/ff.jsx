import React, { Component } from "react";
import { generateStyles } from '@Dependencies/styles';
import { renderDiviFont } from '@Dependencies/et-render-font';

class FFStyler extends Component {
    static slug = "tfs_fluent_forms_styler";

    static css(props) {
        let additionalCss = [];
        let address = props.address;

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_padding',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, div%%order_class%% .tfs-ff-styler .fluentform textarea',
              cssProperty: 'padding',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_padding',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
              cssProperty: 'height',
              important: false,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_padding',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
              cssProperty: 'width',
              important: false,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_input_bgcolor',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-control, div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input, div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-select',
              cssProperty: 'background-color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_required_color',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-input--label.ff-el-is-required.asterisk-right label:after',
              cssProperty: 'color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'ff_radio_check_bgcolor',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
              cssProperty: 'background-color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'ff_selected_color',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform input[type=checkbox]:checked:before',
              cssProperty: 'color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'ff_selected_color',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform input[type=radio]:checked:before',
              cssProperty: 'background-color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'ff_selected_color',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input + span, div%%order_class%% .tfs-ff-styler .fluentform .ff_tc_checkbox +  div.ff_t_c',
              cssProperty: 'color',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'ff_radio_check_size',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
              cssProperty: 'height',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'ff_radio_check_size',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-form-check-input',
              cssProperty: 'width',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_error_padding',
              type: 'padding',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-is-error .error',
              cssProperty: 'padding',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_error_bgcolor',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-el-is-error .error',
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
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-message-success',
              cssProperty: 'padding',
              important: true,
            })
        );

        additionalCss.push(
            generateStyles({
              address,
              attrs: props,
              name: 'form_valid_bgcolor',
              selector: 'div%%order_class%% .tfs-ff-styler .fluentform .ff-message-success',
              cssProperty: 'background-color',
              important: true,
            })
        );

        return additionalCss;

    }
    
    render() {

        const props = this.props;

        return (
            <div
                className={`tfs-ff-styler`}
                dangerouslySetInnerHTML={{ __html: props.__fluent_forms }}
            />
        );
    }

}

export default FFStyler;
