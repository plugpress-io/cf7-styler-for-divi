import React from 'react';

const IconBox = (props) => {
    return (
        <a
            href={props.url}
            target="_blank"
            className="p-4 bg-white flex flex-col items-center justify-center border border-slate-100 rounded-xl hover:bg-slate-50 transition duration-300"
        >
            <div className="mb-4">
                <img
                    className="h-auto max-w-full rounded-lg"
                    src={props.imageUrl}
                    alt={props.imageAlt}
                />
            </div>
            <h3 className="mb-3 text-xl font-bold text-center">{props.title}</h3>
            <p className="text-center text-md text-slate-800">{props.description}</p>
        </a>
    );
};

export default IconBox;
