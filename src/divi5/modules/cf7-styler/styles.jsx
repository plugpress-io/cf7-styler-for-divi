/**
 * CF7 Styler Module - Style Components.
 *
 * @since 3.0.0
 */

import React from 'react';
import { StyleContainer } from '@divi/module';

/**
 * Module's style components.
 */
const ModuleStyles = ({
  attrs,
  settings,
  orderClass,
  mode,
  state,
  noStyleTag,
  elements,
}) => {
  return (
    <StyleContainer mode={mode} state={state} noStyleTag={noStyleTag}>
      {/* Module container styles */}
      {elements.style({
        attrName: 'module',
        styleProps: {
          disabledOn: {
            disabledModuleVisibility: settings?.disabledModuleVisibility,
          },
        },
      })}

      {/* CF7 container styles */}
      {elements.style({
        attrName: 'cf7',
        styleProps: {
          disabledOn: {
            disabledModuleVisibility: settings?.disabledModuleVisibility,
          },
        },
      })}
    </StyleContainer>
  );
};

export { ModuleStyles };
