import React from 'react';
import CF7StylerModule from './components/CF7StylerModule';
import { registerVisualBuilder } from '@divi/module-utils';
import useFetchCF7Forms from './hooks/useFetchCF7Forms';

registerVisualBuilder({
  moduleSlug: 'dvppl_cf7_styler',
  component: CF7StylerModule,
  formFieldInjections: {
    cf7: {
      injectionPath: 'content.cf7',
      component: ({ defaultValue, name, error, onChange, onError, onReset, value }) => {
        const { forms, isLoading, error: fetchError } = useFetchCF7Forms();
        
        if (isLoading) {
          return <div>Loading forms...</div>;
        }
        
        if (fetchError) {
          return <div>Error loading forms: {fetchError}</div>;
        }
        
        return (
          <select
            value={value || defaultValue}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
          >
            {forms.map((form) => (
              <option key={form.value} value={form.value}>
                {form.label}
              </option>
            ))}
          </select>
        );
      },
    },
  },
});
