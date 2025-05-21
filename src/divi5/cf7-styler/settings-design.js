import React from 'react';
import { __ } from '@wordpress/i18n';
import { 
    FieldContainer, 
    ColorField, 
    RangeField 
} from '@divi/field-library';
import { useModuleProps } from '@divi/module-library';

export const SettingsDesign = props => {
    const { 
        content: {
            form_header: {
                use_form_header,
                use_icon
            }
        },
        design: {
            form_styling: {
                form_bg,
                form_padding
            },
            header_styling: {
                form_header_bg,
                form_header_bottom,
                form_header_img_bg,
                form_header_icon_color
            }
        },
        updateDesign
    } = useModuleProps(props);
    
    return (
        <>
            <FieldContainer label={__('Form Styling', 'cf7-styler-for-divi')}>
                <ColorField
                    name="design.form_styling.form_bg"
                    label={__('Form Background', 'cf7-styler-for-divi')}
                    value={form_bg}
                    onChange={value => updateDesign('form_styling.form_bg', value)}
                />
                
                <RangeField
                    name="design.form_styling.form_padding"
                    label={__('Form Padding', 'cf7-styler-for-divi')}
                    value={form_padding}
                    min={0}
                    max={100}
                    step={1}
                    onChange={value => updateDesign('form_styling.form_padding', value)}
                />
            </FieldContainer>
            
            {use_form_header === 'on' && (
                <FieldContainer label={__('Header Styling', 'cf7-styler-for-divi')}>
                    <ColorField
                        name="design.header_styling.form_header_bg"
                        label={__('Form Header Background', 'cf7-styler-for-divi')}
                        value={form_header_bg}
                        onChange={value => updateDesign('header_styling.form_header_bg', value)}
                    />
                    
                    <RangeField
                        name="design.header_styling.form_header_bottom"
                        label={__('Bottom Spacing', 'cf7-styler-for-divi')}
                        value={form_header_bottom}
                        min={0}
                        max={100}
                        step={1}
                        onChange={value => updateDesign('header_styling.form_header_bottom', value)}
                    />
                    
                    <ColorField
                        name="design.header_styling.form_header_img_bg"
                        label={__('Header Image/Icon Background', 'cf7-styler-for-divi')}
                        value={form_header_img_bg}
                        onChange={value => updateDesign('header_styling.form_header_img_bg', value)}
                    />
                    
                    {use_icon === 'on' && (
                        <ColorField
                            name="design.header_styling.form_header_icon_color"
                            label={__('Header Icon Color', 'cf7-styler-for-divi')}
                            value={form_header_icon_color}
                            onChange={value => updateDesign('header_styling.form_header_icon_color', value)}
                        />
                    )}
                </FieldContainer>
            )}
        </>
    );
};
