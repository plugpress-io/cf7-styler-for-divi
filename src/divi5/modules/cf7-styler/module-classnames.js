export const moduleClassnames = ({ classnamesInstance, attrs }) => {
	const adv = attrs?.module?.advanced ?? attrs?.cf7?.advanced;
	const useFormHeader =
		adv?.useFormHeader?.desktop?.value === 'on';

	// Add form header class if enabled
	if (useFormHeader) {
		classnamesInstance.add('cf7m-has-form-header');
	}

	return classnamesInstance;
};
