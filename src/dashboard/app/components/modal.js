import React, {useState} from 'react';

function ModalComponent() {
    const [isVisible, setIsVisible] = useState(window.tfsApp?.isModalVisible || false);

    const handleClose = () => {
        setIsVisible(false);
        sendTfsCloseModalRequest();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleClose}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <ModalContent onClose={handleClose} />
        </div>
    );
}

const ModalContent = ({onClose}) => (
    <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div
            className="relative z-20 bg-black p-10 rounded-lg max-w-xl mx-auto font-sans text-gray-800 leading-relaxed"
            onClick={(e) => e.stopPropagation()}
        >
            <button className="absolute top-4 right-4" onClick={onClose} aria-label="Close Modal">
                <span className="text-2xl font-bold">×</span>
            </button>
            <Header />
            <MainContent />
            <Footer />
        </div>
    </div>
);

const Header = () => (
    <div className="flex flex-col mb-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-white">
            Wait, you're missing the biggest deal of the year!
        </h1>
        <div className="flex items-center mb-4 text-base italic"></div>
    </div>
);

const MainContent = () => (
    <>
        <Paragraph>
            <img
                src={'https://assets.divitorque.com/dashboard/bf-2023.png'}
                alt="Divi Forms Styler"
            />
            <NewFeatures />
        </Paragraph>
    </>
);

const NewFeatures = () => (
    <div className="my-4">
        <strong className="mb-4 text-base text-white">What's New:</strong>
        <ul className="list-none mt-4 mb-8 text-base text-white">
            <li className="">🆕 Instagram Feed Module.</li>
            <li className="">🆕 WhatsApp Chat Module.</li>
            <li className="">🆕 Gravity Forms Styler.</li>
            <li className="">🆕 Filterble Gallery.</li>
        </ul>
    </div>
);

const Footer = () => (
    <div className="flex items-center text-base italic">
        <a
            href="https://divitorque.com/pricing/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="External link to Black Friday Deal"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 hover:text-white"
        >
            Get the Deal Now
        </a>
    </div>
);

const Paragraph = ({children}) => <p className="modal-paragraph text-base mb-4">{children}</p>;

async function sendTfsCloseModalRequest() {
    try {
        const response = await fetch(tfsApp.ajaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'tfs_modal_bfcm',
                nonce: tfsApp.nonce,
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with a status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status && data.status === 'error') {
            throw new Error(data.message || 'Error from server');
        }

        return data;
    } catch (error) {
        console.error('There was an error with the AJAX request:', error.message);
        return null;
    }
}

export default ModalComponent;
