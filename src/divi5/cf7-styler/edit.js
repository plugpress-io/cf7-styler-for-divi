import React, { useState, useEffect } from 'react';
import { useModuleProps } from '@divi/module-library';

export const cf7StylerEdit = props => {
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
        }
    } = useModuleProps(props);
    
    const [formContent, setFormContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forms, setForms] = useState([]);
    
    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('/wp-json/divi-cf7-styler/v1/get-forms');
                if (!response.ok) {
                    throw new Error('Failed to fetch Contact Form 7 forms');
                }
                const data = await response.json();
                setForms(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchForms();
    }, []);
    
    useEffect(() => {
        const fetchFormContent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/wp-json/divi-cf7-styler/v1/get-form-content?form_id=${cf7}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch form content');
                }
                const data = await response.json();
                setFormContent(data.content);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        if (cf7 && cf7 !== '0') {
            fetchFormContent();
        } else {
            setFormContent('Please select a Contact Form 7 form.');
            setIsLoading(false);
        }
    }, [cf7]);
    
    const renderHeader = () => {
        if (use_form_header !== 'on') return null;
        
        const iconOrImage = use_icon === 'on' 
            ? <div className="dipe-form-header-icon" style={{backgroundColor: form_header_img_bg}}>
                <span className="et-pb-icon" style={{color: form_header_icon_color}}>{header_icon}</span>
              </div>
            : header_img 
              ? <div className="dipe-form-header-image" style={{backgroundColor: form_header_img_bg}}>
                  <img src={header_img} alt="" />
                </div> 
              : null;
              
        const titleElement = form_header_title 
            ? <h2 className="dipe-form-header-title">{form_header_title}</h2> 
            : null;
            
        const textElement = form_header_text 
            ? <div className="dipe-form-header-text">{form_header_text}</div> 
            : null;
            
        const headerInfo = (titleElement || textElement) 
            ? <div className="dipe-form-header-info">{titleElement}{textElement}</div> 
            : null;
        
        return (
            <div 
                className="dipe-form-header-container" 
                style={{
                    backgroundColor: form_header_bg,
                    marginBottom: form_header_bottom
                }}
            >
                <div className="dipe-form-header">
                    {iconOrImage}
                    {headerInfo}
                </div>
            </div>
        );
    };
    
    const buttonClass = use_form_button_fullwidth === 'on' 
        ? 'dipe-cf7-button-fullwidth' 
        : `dipe-cf7-button-${button_alignment}`;
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error}</div>;
    }
    
    return (
        <div className={`dipe-cf7-container ${buttonClass}`}>
            {renderHeader()}
            <div 
                className="dipe-cf7" 
                style={{
                    backgroundColor: form_bg,
                    padding: form_padding
                }}
            >
                <div 
                    className="dipe-cf7-content" 
                    dangerouslySetInnerHTML={{ __html: formContent }} 
                />
            </div>
        </div>
    );
};
