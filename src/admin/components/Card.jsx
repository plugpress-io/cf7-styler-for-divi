import React from '@wordpress/element';

const Card = ({ children, className = '', padding = true }) => {
	const classes = [
		'dcs-admin__card',
		padding && 'dcs-admin__card--padding',
		className,
	].filter(Boolean).join(' ');

	return <div className={classes}>{children}</div>;
};

export default Card;
