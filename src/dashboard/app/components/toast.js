import {toast} from 'react-toastify';

const Toast = (message, type) => {
    const randomId = Math.random().toString(36).substring(7);

    const options = {
        toastId: randomId,
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
    };

    if ('success' === type) {
        return toast.success(message, options);
    } else if ('error' === type) {
        return toast.error(message, options);
    } else {
        return toast.info(message, options);
    }
};

export default Toast;
