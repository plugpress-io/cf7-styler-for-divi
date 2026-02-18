export const moduleClassnames = ({ classnamesInstance, attrs }) => {
	// Get settings from new attribute structure
	const useFormHeader =
		attrs?.cf7?.advanced?.useFormHeader?.desktop?.value === 'on';

	// Add form header class if enabled
	if (useFormHeader) {
		classnamesInstance.add('cf7m-has-form-header');
	}

	return classnamesInstance;
};
