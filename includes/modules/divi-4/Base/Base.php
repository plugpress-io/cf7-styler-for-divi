<?php

abstract class DCS_Builder_Module extends ET_Builder_Module
{
    public $module_credits = array(
        'module_uri' => 'https://diviepic.com/?utm_source=builder&utm_medium=tfs&utm_campaign=divi-form-styler',
        'author'     => 'DiviEpic',
        'author_uri' => 'https://diviepic.com/?utm_source=builder&utm_medium=tfs&utm_campaign=divi-form-styler',
    );

    public function _getResponsiveValues($optionName, $presetValues = null)
    {
        $presetValues = $presetValues ?? [];
        $responsiveEnabled = false;
        $mainData = $this->props[$optionName];
        $responsiveStatus = $this->props["{$optionName}_last_edited"] ?? null;

        if ($responsiveStatus) {
            $responsiveEnabled = et_pb_get_responsive_status($responsiveStatus);
        }

        // Handle preset conditional values
        if (empty($mainData) && isset($presetValues['conditional'])) {
            foreach ($presetValues['conditional']['values'] as $value) {
                $propValue = $this->props[$presetValues['conditional']['name']];
                if ($propValue === $value['a']) {
                    $mainData = $value['b'];
                    break;
                }
            }
        }

        // Handle preset default values
        $mainData = $mainData ?: ($presetValues['default'] ?? '');

        // If responsive is enabled, return an array of values for all devices.
        if ($responsiveEnabled) {
            return [
                'desktop' => $mainData,
                'tablet'  => $this->props["{$optionName}_tablet"] ?? '',
                'phone'   => $this->props["{$optionName}_phone"] ?? '',
            ];
        }

        // If not, return just the desktop value.
        return $mainData;
    }
}
