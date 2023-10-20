export const process_margin_padding = (
    val = '0|0|0|0',
    type = 'padding',
    imp = false
) => {
    if (val) {
        let _val = val.split('|'),
            top = '',
            right = '',
            bottom = '',
            left = '',
            important = '';

        if (imp) {
            important = '!important';
        }

        if (Array.isArray(_val)) {
            top = `${type}-top:${_val[0]}${important};`;
            right = `${type}-right:${_val[1]}${important};`;
            bottom = `${type}-bottom:${_val[2]}${important};`;
            left = `${type}-left:${_val[3]}${important};`;
        }

        return `${top} ${right} ${bottom} ${left}`;
    }
};

export const process_flex_style = (data, type, important) => {
    let flex_val = 'center';
    if (data === 'left') {
        flex_val = 'flex-start';
    } else if (data === 'right') {
        flex_val = 'flex-end';
    }

    return `${type}:${flex_val}${important ? '!important' : ''}`;
};

export const get_conditional_responsive_styles = (styles = {}, data, style) => {
    let important = styles['important'] ? styles['important'] : false;

    if (
        style === 'align-self' ||
        style === 'align-items' ||
        style === 'justify-content'
    ) {
        return process_flex_style(data, style, important);
    } else if (style === 'padding' || style === 'margin') {
        return process_margin_padding(data, style, important);
    } else if (style === 'flex') {
        return `flex: 0 0 ${data}`;
    } else {
        return `
			  ${style}:${data}${important ? '!important' : ''}`;
    }
};

export const get_responsive_styles = (
    props,
    opt_name,
    selector,
    styles = {},
    pre_values = {}
) => {
    let additionalCss = [],
        _data = props[opt_name],
        _style = styles['primary'],
        _data_tablet = props[opt_name + '_tablet'],
        _data_phone = props[opt_name + '_phone'],
        opt_last_edited = props[opt_name + '_last_edited'],
        is_enabled = opt_last_edited && opt_last_edited.startsWith('on');

    if (!_data && pre_values) {
        let is_default = true;
        if (pre_values['conditional']) {
            pre_values['conditional']['values'].forEach((value) => {
                let property_val = props[pre_values['conditional']['name']];
                if (property_val === value['a']) {
                    _data = value['b'];
                    is_default = false;
                }
            });
        }
        if (is_default) {
            _data = pre_values['default'];
        }
    }

    if (_data) {
        additionalCss.push([
            {
                selector,
                declaration: get_conditional_responsive_styles(
                    styles,
                    _data,
                    _style
                ),
            },
        ]);

        if (styles['secondary']) {
            additionalCss.push([
                {
                    selector,
                    declaration: styles['secondary'],
                },
            ]);
        }
    }

    if (is_enabled) {
        if (_data_tablet) {
            additionalCss.push([
                {
                    selector,
                    device: 'tablet',
                    declaration: get_conditional_responsive_styles(
                        styles,
                        _data_tablet,
                        _style
                    ),
                },
            ]);

            if (styles['secondary']) {
                additionalCss.push([
                    {
                        selector,
                        device: 'tablet',
                        declaration: styles['secondary'],
                    },
                ]);
            }
        }

        if (_data_phone) {
            additionalCss.push([
                {
                    selector,
                    device: 'phone',
                    declaration: get_conditional_responsive_styles(
                        styles,
                        _data_phone,
                        _style
                    ),
                },
            ]);

            if (styles['secondary']) {
                additionalCss.push([
                    {
                        selector,
                        device: 'phone',
                        declaration: styles['secondary'],
                    },
                ]);
            }
        }
    }

    return additionalCss;
};

export const renderFontStyle = (props, slug, selector) => {
    if (props[slug]) {
        let fontFamily = {
                divi: "ETmodules !important",
                fa: "FontAwesome!important"
            },
            icon = props[slug] ? props[slug].split("|") : [],
            additionalCss = [];

        additionalCss.push([
            {
                selector,
                declaration: `
                font-family: ${fontFamily[icon[2]]};
                font-weight: ${icon[4]}!important;`
            }
        ]);
        return additionalCss;
    }

    return [];
};
