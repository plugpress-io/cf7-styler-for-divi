import React from 'react';
import { useModuleContentState } from '@divi/module';
import { useFetch } from '@divi/data';
import useFetchCF7Forms from '../hooks/useFetchCF7Forms';

const CF7StylerModule = () => {
  const { cf7 } = useModuleContentState();
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

  return (
    <div className="dipe-cf7">
      <div className="dipe-cf7-content" dangerouslySetInnerHTML={{ __html: data?.content || 'Please select a Contact Form 7.' }} />
    </div>
  );
};

export default CF7StylerModule;
