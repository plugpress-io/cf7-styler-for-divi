import React from 'react';

const IconBox = (props) => {
    return (
        <a
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white flex flex-col items-center justify-center border border-slate-100 rounded-xl hover:bg-slate-50 transition duration-300"
        >
            <div className="flex items-center justify-center mb-4 rounded-full w-20 h-20 shadow-sm shadow-slate-300">
                <img className="w-10 h-20" src={props.imageUrl} alt={props.imageAlt} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-center">{props.title}</h3>
            <p className="text-center text-slate-600">{props.description}</p>
        </a>
    );
};

export default IconBox;
