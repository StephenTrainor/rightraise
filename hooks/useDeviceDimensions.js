import { useState, useEffect } from 'react';

const getDeviceWidthAndHeight = () => {
    const { innerWidth: width, innerHeight: height } = window;

    return {
        width,
        height,
    };
};

const useDeviceDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(getDeviceWidthAndHeight());

    useEffect(() => {
        setWindowDimensions(getDeviceWidthAndHeight());

        const handleResize = () => {
            setWindowDimensions(getDeviceWidthAndHeight());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};

export default useDeviceDimensions;
