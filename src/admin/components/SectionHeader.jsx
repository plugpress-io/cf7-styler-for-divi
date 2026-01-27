import React from '@wordpress/element';

const SectionHeader = ({ title, actions }) => {
	return (
		<div className="dcs-admin__section-header">
			<h2 className="dcs-admin__section-title">{title}</h2>
			{actions && <div className="dcs-admin__section-actions">{actions}</div>}
		</div>
	);
};

export default SectionHeader;
