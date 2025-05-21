import React from 'react';
import { useModuleContentState, useModuleAdvancedState } from '@divi/module';
import { useFetch } from '@divi/data';
import useFetchCF7Forms from '../hooks/useFetchCF7Forms';

const CF7StylerModule = () => {
  const { 
    cf7,
    use_form_header,
    form_header_title,
    form_header_text,
    use_icon,
    header_icon,
    header_img,
    use_form_button_fullwidth,
    button_alignment
  } = useModuleContentState();
  
  const {
    form_header,
    common,
    form_field,
    radio_checkbox,
    suc_err_msg
  } = useModuleAdvancedState();
  
  const { forms, isLoading: formsLoading, error: formsError } = useFetchCF7Forms();
  
  const { data, isLoading, error } = useFetch({
    path: '/wp-json/divi-cf7-styler/v1/get-form-content',
    params: {
      form_id: cf7,
    },
  });

  if (formsLoading || isLoading) {
    return <div>Loading...</div>;
  }

  if (formsError || error) {
    return <div>Error: {formsError || error}</div>;
  }
  
  const renderHeader = () => {
    if (!use_form_header) return null;
    
    const iconOrImage = use_icon 
      ? <div className="dipe-form-header-icon"><span className="et-pb-icon">{header_icon}</span></div>
      : header_img ? <div className="dipe-form-header-image"><img src={header_img} alt="" /></div> : null;
      
    const titleElement = form_header_title ? <h2 className="dipe-form-header-title">{form_header_title}</h2> : null;
    const textElement = form_header_text ? <div className="dipe-form-header-text">{form_header_text}</div> : null;
    const headerInfo = (titleElement || textElement) ? <div className="dipe-form-header-info">{titleElement}{textElement}</div> : null;
    
    const headerStyles = {
      backgroundColor: form_header?.form_header_bg,
      marginBottom: form_header?.form_header_bottom
    };
    
    const iconStyles = {
      backgroundColor: form_header?.form_header_img_bg,
      color: form_header?.form_header_icon_color
    };
    
    return (
      <div className="dipe-form-header-container" style={headerStyles}>
        <div className="dipe-form-header">
          {iconOrImage && <div style={iconStyles}>{iconOrImage}</div>}
          {headerInfo}
        </div>
      </div>
    );
  };

  const formStyles = {
    backgroundColor: common?.form_bg,
    padding: common?.form_padding
  };
  
  const buttonClass = use_form_button_fullwidth 
    ? 'dipe-cf7-button-fullwidth' 
    : `dipe-cf7-button-${button_alignment}`;

  return (
    <div className={`dipe-cf7-container ${buttonClass}`}>
      {renderHeader()}
      <div className="dipe-cf7" style={formStyles}>
        <div className="dipe-cf7-content" dangerouslySetInnerHTML={{ __html: data?.content || 'Please select a Contact Form 7.' }} />
      </div>
    </div>
  );
};

export default CF7StylerModule;
