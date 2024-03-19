const Card = ({svg, title, description, buttonText, onButtonClick}) => {
    const isButtonHaveText = buttonText ? true : false;
    const isSvg = svg ? true : false;

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-100">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{description}</p>
            {isButtonHaveText && (
                <a
                    className="text-purple-600 font-semibold hover:underline"
                    href={onButtonClick}
                    target="_blank"
                >
                    {buttonText}
                </a>
            )}
        </div>
    );
};

export default Card;
