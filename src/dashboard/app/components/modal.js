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
            className="relative z-20 bg-white p-10 rounded-lg max-w-xl mx-auto font-sans text-gray-800 leading-relaxed"
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
    <h2 className="modal-header text-2xl font-semibold mb-4">Welcome to Torque Forms Styler!</h2>
);

const MainContent = () => (
    <>
        <Paragraph>
            Surprised by the new name? 🙀 Let me spill the beans! The well-loved "Divi Contact Form
            7 Styler" is now embracing its fresh identity as part of the Divi Torque family. Say
            hello to its snazzy name:
            <strong>Torque Forms Styler</strong>! 🎉
        </Paragraph>
        <Paragraph>
            Over the past year, we've been flooded with over 100 messages about your wishes for a
            Gravity Forms module. Guess what? We've heard you! 🎧💌 Now, this plugin not only works
            seamlessly with Contact Form 7, but it's also compatible with{' '}
            <strong>Gravity Forms</strong> and <strong>Fluent Forms</strong>.
        </Paragraph>
        <NewFeatures />
        <Paragraph>
            If you hit a bump or notice anything quirky after the update, please give our support
            team a shout! 📣🔧 We're here for you, always.
        </Paragraph>
    </>
);

const NewFeatures = () => (
    <>
        <strong className="mb-8 text-base">Here's What's New:</strong>
        <ul className="list-disc pl-6 my-4 text-base">
            <li>🆕 Gravity Forms module.</li>
            <li>🆕 Fluent Forms module.</li>
        </ul>
    </>
);

const Footer = () => (
    <div className="flex items-center mb-4 text-base italic">
        <span>~ Fahim and the Divi Torque team</span>
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
                action: 'tfs_close_modal',
                nonce: tfsApp.nonce,
            }),
        });

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Server responded with a status: ${response.status}`);
        }

        const data = await response.json();

        // You can add additional checks here if your server sends some specific error codes or messages
        if (data.status && data.status === 'error') {
            throw new Error(data.message || 'Error from server');
        }

        return data;
    } catch (error) {
        console.error('There was an error with the AJAX request:', error.message);
        return null; // You can return a specific value here if you want to
    }
}

export default ModalComponent;
