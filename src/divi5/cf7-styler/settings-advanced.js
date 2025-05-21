import React from 'react';
import { __ } from '@wordpress/i18n';
import { 
    FieldContainer, 
    ColorField 
} from '@divi/field-library';
import { useModuleProps } from '@divi/module-library';

export const SettingsAdvanced = props => {
    const { 
        advanced: {
            message_styling: {
                success_message_bg,
                success_message_text_color,
                error_message_bg,
                error_message_text_color
            }
        },
        updateAdvanced
    } = useModuleProps(props);
    
    return (
        <FieldContainer label={__('Message Styling', 'cf7-styler-for-divi')}>
            <ColorField
                name="advanced.message_styling.success_message_bg"
                label={__('Success Message Background', 'cf7-styler-for-divi')}
                value={success_message_bg}
                onChange={value => updateAdvanced('message_styling.success_message_bg', value)}
            />
            
            <ColorField
                name="advanced.message_styling.success_message_text_color"
                label={__('Success Message Text Color', 'cf7-styler-for-divi')}
                value={success_message_text_color}
                onChange={value => updateAdvanced('message_styling.success_message_text_color', value)}
            />
            
            <ColorField
                name="advanced.message_styling.error_message_bg"
                label={__('Error Message Background', 'cf7-styler-for-divi')}
                value={error_message_bg}
                onChange={value => updateAdvanced('message_styling.error_message_bg', value)}
            />
            
            <ColorField
                name="advanced.message_styling.error_message_text_color"
                label={__('Error Message Text Color', 'cf7-styler-for-divi')}
                value={error_message_text_color}
                onChange={value => updateAdvanced('message_styling.error_message_text_color', value)}
            />
        </FieldContainer>
    );
};
