const { getAttrValue } = window?.divi?.moduleUtils ?? {};

/**
 * Visibility callback for CF7 Styler settings.
 * Divi may pass attrName, attributeName, or others – accept all via first arg.
 */
export const isVisibleFields = (args) => {
	if (!args || typeof args !== 'object') {
		return true;
	}
	const attrs = args.attrs ?? args.attributes;
	const breakpoint = args.breakpoint;
	const baseBreakpoint = args.baseBreakpoint;
	const breakpointNames = args.breakpointNames;
	const state = args.state;
	const attrName = args.attrName ?? args.attributeName ?? '';
	const subName = args.subName;

	if (!getAttrValue) {
		return true;
	}

	const attrNameWithSubName = subName ? `${attrName}.*.${subName}` : attrName;
	const ctx = { breakpoint, baseBreakpoint, breakpointNames, state };

	// Helper to get useFormHeader value
	const getUseFormHeader = () =>
		getAttrValue({
			attr: attrs?.cf7?.advanced?.useFormHeader,
			...ctx,
		});

	// Helper to get useIcon value
	const getUseIcon = () =>
		getAttrValue({ attr: attrs?.cf7?.advanced?.useIcon, ...ctx });

	// Helper to get useFormButtonFullwidth value
	const getUseFormButtonFullwidth = () =>
		getAttrValue({ attr: attrs?.cf7?.advanced?.useFormButtonFullwidth, ...ctx });

	// Helper to get crCustomStyles value
	const getCrCustomStyles = () =>
		getAttrValue({ attr: attrs?.cf7?.advanced?.crCustomStyles, ...ctx });

	switch (attrNameWithSubName) {
		// Form header dependent fields - show when useFormHeader is "on"
		case 'cf7.advanced.formHeaderTitle':
		case 'cf7.advanced.formHeaderText':
		case 'cf7.advanced.useIcon': {
			const useFormHeader = getUseFormHeader();
			return useFormHeader === 'on';
		}

		// Header icon - show when useFormHeader is "on" AND useIcon is "on"
		case 'cf7.advanced.headerIcon': {
			const useFormHeader = getUseFormHeader();
			const useIcon = getUseIcon();
			return useFormHeader === 'on' && useIcon === 'on';
		}

		// Header image - show when useFormHeader is "on" AND useIcon is "off"
		case 'cf7.advanced.headerImage': {
			const useFormHeader = getUseFormHeader();
			const useIcon = getUseIcon();
			return useFormHeader === 'on' && useIcon === 'off';
		}

		// Button alignment - show when useFormButtonFullwidth is "off"
		case 'cf7.advanced.buttonAlignment': {
			const useFormButtonFullwidth = getUseFormButtonFullwidth();
			return useFormButtonFullwidth === 'off';
		}

		// Radio/Checkbox styling fields - show when crCustomStyles is "on"
		case 'cf7.advanced.crSize':
		case 'cf7.advanced.crBackgroundColor':
		case 'cf7.advanced.crSelectedColor':
		case 'cf7.advanced.crBorderColor':
		case 'cf7.advanced.crBorderSize':
		case 'cf7.advanced.crLabelColor': {
			const crCustomStyles = getCrCustomStyles();
			return crCustomStyles === 'on';
		}

		// Form header styling - show when useFormHeader is "on"
		case 'cf7.advanced.formHeaderBg':
		case 'cf7.advanced.formHeaderPadding':
		case 'cf7.advanced.formHeaderBottom':
		case 'cf7.advanced.formHeaderImgBg': {
			const useFormHeader = getUseFormHeader();
			return useFormHeader === 'on';
		}

		// Header icon color - show when useFormHeader and useIcon are "on"
		case 'cf7.advanced.formHeaderIconColor': {
			const useFormHeader = getUseFormHeader();
			const useIcon = getUseIcon();
			return useFormHeader === 'on' && useIcon === 'on';
		}

		// Legacy decoration paths (if used elsewhere)
		case 'cf7.decoration.formHeaderBg':
		case 'cf7.decoration.formHeaderPadding':
		case 'cf7.decoration.formHeaderBottom':
		case 'cf7.decoration.formHeaderImgBg':
		case 'cf7.decoration.formHeaderIconColor': {
			const useFormHeader = getUseFormHeader();
			return useFormHeader === 'on';
		}

		default: {
			return true;
		}
	}
};
