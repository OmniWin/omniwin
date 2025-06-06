import React from "react";

const WalletConnectIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(({...props}, ref) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.0"
            id="katman_1"
            x="0px"
            y="0px"
            viewBox="0 0 824 618"
            // style="enable-background:new 0 0 824 618;"
            // xml:space="preserve"
            {...props}
            ref={ref}
        >
                <radialGradient id="SVGID_1_" cx="13.2793" cy="609.416" r="1" gradientTransform="matrix(512 0 0 -512 -6643 312330)" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#5D9DF6" />
                    <stop offset="1" stopColor="#006FFF" />
                </radialGradient>
                <path fillRule="evenodd" clipRule="evenodd" fill="url(#SVGID_1_)" d="M412,53c141.4,0,256,114.6,256,256S553.4,565,412,565S156,450.4,156,309S270.6,53,412,53z" />
                <path
                    fill="#FFFFFF"
                    d="M318.7,250.7c51.5-50.3,135.1-50.3,186.6,0l6.2,6.1c2.6,2.5,2.6,6.6,0,9.1l-21.2,20.7c-1.3,1.3-3.4,1.3-4.7,0   l-8.5-8.3c-36-35.1-94.2-35.1-130.2,0l-9.1,8.9c-1.3,1.3-3.4,1.3-4.7,0l-21.2-20.7c-2.6-2.5-2.6-6.6,0-9.1L318.7,250.7z    M549.2,293.5l18.9,18.4c2.6,2.5,2.6,6.6,0,9.1l-85.1,83.1c-2.6,2.5-6.8,2.5-9.3,0c0,0,0,0,0,0l-60.4-59c-0.6-0.6-1.7-0.6-2.3,0   c0,0,0,0,0,0l-60.4,59c-2.6,2.5-6.8,2.5-9.3,0c0,0,0,0,0,0L255.9,321c-2.6-2.5-2.6-6.6,0-9.1l18.9-18.4c2.6-2.5,6.8-2.5,9.3,0   l60.4,59c0.6,0.6,1.7,0.6,2.3,0c0,0,0,0,0,0l60.4-59c2.6-2.5,6.8-2.5,9.3,0c0,0,0,0,0,0l60.4,59c0.6,0.6,1.7,0.6,2.3,0l60.4-59   C542.4,291,546.6,291,549.2,293.5L549.2,293.5z"
                />
        </svg>
    );
});

export default WalletConnectIcon;
