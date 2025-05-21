import React from 'react';

import { __ } from '@wordpress/i18n';

import { 
    FieldContainer, 
    SelectField, 
    ToggleField, 
    TextField 
} from '@divi/field-library';
import { useModuleProps } from '@divi/module-library';

/**
 * Content settings panel component.
 *
 * @param {Object} props - React component props
 * @returns {React.ReactElement} Content settings panel
 */
export const SettingsContent = props => {
    const { 
        content: {
            main_content: {
                cf7,
                use_form_button_fullwidth,
                button_alignment
            },
            form_header: {
                use_form_header,
                form_header_title,
                form_header_text,
                use_icon,
                header_icon,
                header_img
            }
        },
        updateContent
    } = useModuleProps(props);
    
    const [forms, setForms] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('/wp-json/divi-cf7-styler/v1/get-forms');
                if (!response.ok) {
                    throw new Error('Failed to fetch Contact Form 7 forms');
                }
                const data = await response.json();
                setForms(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching forms:', error);
                setIsLoading(false);
            }
        };

        fetchForms();
    }, []);
    
    const formOptions = forms.map(form => ({
        label: form.label,
        value: form.value
    }));
    
    formOptions.unshift({
        label: __('Select a form', 'cf7-styler-for-divi'),
        value: '0'
    });
    
    return (
        <>
            <FieldContainer label={__('Form', 'cf7-styler-for-divi')}>
                <SelectField
                    name="content.main_content.cf7"
                    value={cf7}
                    options={formOptions}
                    onChange={value => updateContent('main_content.cf7', value)}
                    isLoading={isLoading}
                />
                
                <ToggleField
                    name="content.main_content.use_form_button_fullwidth"
                    label={__('Fullwidth Button', 'cf7-styler-for-divi')}
                    value={use_form_button_fullwidth}
                    onChange={value => updateContent('main_content.use_form_button_fullwidth', value)}
                />
                
                {use_form_button_fullwidth === 'off' && (
                    <SelectField
                        name="content.main_content.button_alignment"
                        label={__('Button Alignment', 'cf7-styler-for-divi')}
                        value={button_alignment}
                        options={[
                            { label: __('Left', 'cf7-styler-for-divi'), value: 'left' },
                            { label: __('Center', 'cf7-styler-for-divi'), value: 'center' },
                            { label: __('Right', 'cf7-styler-for-divi'), value: 'right' }
                        ]}
                        onChange={value => updateContent('main_content.button_alignment', value)}
                    />
                )}
            </FieldContainer>
            
            <FieldContainer label={__('Form Header', 'cf7-styler-for-divi')}>
                <ToggleField
                    name="content.form_header.use_form_header"
                    label={__('Show Form Header', 'cf7-styler-for-divi')}
                    value={use_form_header}
                    onChange={value => updateContent('form_header.use_form_header', value)}
                />
                
                {use_form_header === 'on' && (
                    <>
                        <TextField
                            name="content.form_header.form_header_title"
                            label={__('Header Title', 'cf7-styler-for-divi')}
                            value={form_header_title}
                            onChange={value => updateContent('form_header.form_header_title', value)}
                        />
                        
                        <TextField
                            name="content.form_header.form_header_text"
                            label={__('Header Text', 'cf7-styler-for-divi')}
                            value={form_header_text}
                            onChange={value => updateContent('form_header.form_header_text', value)}
                        />
                        
                        <ToggleField
                            name="content.form_header.use_icon"
                            label={__('Use Icon', 'cf7-styler-for-divi')}
                            value={use_icon}
                            onChange={value => updateContent('form_header.use_icon', value)}
                        />
                        
                        {use_icon === 'on' ? (
                            <SelectField
                                name="content.form_header.header_icon"
                                label={__('Header Icon', 'cf7-styler-for-divi')}
                                value={header_icon}
                                onChange={value => updateContent('form_header.header_icon', value)}
                                options={[
                                    { label: 'Icon 1', value: '&#xe600;' },
                                    { label: 'Icon 2', value: '&#xe601;' }
                                ]}
                            />
                        ) : (
                            <TextField
                                name="content.form_header.header_img"
                                label={__('Header Image URL', 'cf7-styler-for-divi')}
                                value={header_img}
                                onChange={value => updateContent('form_header.header_img', value)}
                            />
                        )}
                    </>
                )}
            </FieldContainer>
        </>
    );
};
