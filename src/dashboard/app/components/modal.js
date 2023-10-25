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
    <div className="flex flex-col mb-4">
        <svg
            className="mb-4"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="60" height="60" rx="30" fill="#FF6900" />
            <path
                d="M11.27 27.5555C11.27 28.0305 10.8742 28.3471 10.4784 28.3471C10.0826 28.3471 9.68677 28.0305 9.68677 27.5555C9.68677 27.4764 9.68677 27.318 9.68677 27.2389C9.76593 26.9222 10.0826 26.6848 10.4784 26.6848C10.8742 26.7639 11.27 27.0806 11.27 27.5555Z"
                fill="white"
            />
            <path
                d="M50.2174 30.0096C50.2174 41.2505 41.0346 50.354 29.7937 50.354H27.5772C25.3607 50.354 23.6191 48.6125 23.6191 46.396V28.6638C23.6191 26.4473 25.3607 24.7057 27.5772 24.7057C29.7937 24.7057 31.5353 26.4473 31.5353 28.6638V42.2796C37.5515 41.4088 42.2221 36.2633 42.2221 29.9304C42.2221 23.0433 36.6808 17.502 29.7937 17.502C27.5772 17.502 25.519 18.0562 23.7774 19.0853C21.6401 20.2727 19.8985 22.0934 18.7903 24.3099C18.7111 24.4683 18.2361 25.4974 17.9195 26.5264C17.7612 26.9223 17.4445 27.1597 17.0487 27.0806C16.5738 27.0014 16.2571 26.5264 16.4154 26.1306C16.7321 24.7849 17.2071 23.9141 17.2862 23.835C17.4445 23.4392 17.2862 23.0433 16.8904 22.885H16.8112C16.4154 22.7267 15.9405 22.885 15.7821 23.2017C15.703 23.4392 15.5447 23.5975 15.4655 23.835C14.9114 25.1807 14.5156 26.6056 14.2781 28.0305C14.2781 28.1097 14.1989 28.8221 14.1989 28.9013C14.1989 29.2971 13.8031 29.6929 13.4073 29.6137C12.9323 29.6137 12.6157 29.2179 12.6949 28.8221C12.774 27.4764 13.0907 26.0515 13.4073 24.8641C13.4073 24.7849 13.4073 24.7849 13.4865 24.7057C13.4865 24.3891 13.249 24.0724 12.9323 23.9141C12.5365 23.7558 12.1407 23.9933 11.9824 24.3891C11.9824 24.4683 11.7449 25.1015 11.6658 25.4182C11.5866 25.814 11.1908 26.0515 10.7158 25.9723C10.32 25.8932 10.0034 25.4974 10.0825 25.1015C10.32 24.2308 10.7158 23.0433 10.9533 22.3309C12.5365 18.3728 15.3863 15.048 18.9486 12.7524C22.1151 10.7733 25.8356 9.58591 29.8729 9.58591C41.1138 9.58591 50.2174 18.7686 50.2174 30.0096Z"
                fill="white"
            />
        </svg>

        <h2 className="modal-header text-2xl font-bold mt-4">Welcome to Torque Forms Styler!</h2>
    </div>
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
