import React from '@wordpress/element';
import Card from './Card';
import SectionHeader from './SectionHeader';

const QuickStartSection = () => {
	return (
		<Card>
			<SectionHeader title="Quick Start" />
			<ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 leading-relaxed pl-6">
				<li>Create or edit a page with Divi Builder</li>
				<li>Add the CF7 Styler module to your page</li>
				<li>Select your Contact Form 7 form</li>
				<li>Customize the styling using Divi's visual controls</li>
			</ol>
		</Card>
	);
};

export default QuickStartSection;
