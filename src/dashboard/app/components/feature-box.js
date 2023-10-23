import React from 'react';

const FeatureBox = (props) => {
    const imageDiv = (
        <div className="md:w-1/2 flex items-center justify-center">
            <img src={props.imageUrl} alt={props.imageAlt || 'Description of Image'} />
        </div>
    );

    const textDiv = (
        <div className="md:w-1/2 flex flex-col justify-center p-6">
            <h2 className="text-2xl font-semibold mb-4">{props.title}</h2>
            <p className="text-gray-600 text-lg">{props.description}</p>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row mb-20 gap-20">
            {props.imagePosition === 'left' ? imageDiv : textDiv}
            {props.imagePosition === 'left' ? textDiv : imageDiv}
        </div>
    );
};

export default FeatureBox;
