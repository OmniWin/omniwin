import React from "react";

const RabbyIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(({ ...props }, ref) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" id="katman_1" x="0px" y="0px" viewBox="0 0 170 150" {...props} ref={ref}>
            <defs />
            <style type="text/css">
                {`
          .st0{fill:url(#SVGID_1_);}
          .st1{fill-rule:evenodd;clip-rule:evenodd;fill:url(#SVGID_00000161597173617360504640000012432366591255278478_);}
          .st2{fill-rule:evenodd;clip-rule:evenodd;fill:url(#SVGID_00000021803777515098205300000017382971856690286485_);}
          .st3{fill:url(#SVGID_00000031192219548086493050000012287181694732331425_);}
        `}
            </style>
            <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="82.6827" y1="79.8441" x2="148.229" y2="61.2564" gradientTransform="matrix(1.680451, 0, 0, -1.680451, -88.215726, 206.079913)">
                <stop offset="0" style={{ stopColor: "#8797FF" }} />
                <stop offset="1" style={{ stopColor: "#AAA8FF" }} />
            </linearGradient>
            <path
                className="st0"
                d="M 162.005 84.921 C 168.222 70.973 137.302 31.818 107.727 15.685 C 89.073 3.083 69.747 4.763 65.714 10.308 C 57.145 22.407 94.283 32.826 119.153 44.757 C 113.775 47.109 108.734 51.311 105.878 56.52 C 96.635 46.438 76.301 37.7 52.439 44.757 C 36.306 49.463 23.031 60.722 17.822 77.527 C 16.645 77.023 15.133 76.686 13.788 76.686 C 8.244 76.686 3.706 81.223 3.706 86.77 C 3.706 92.314 8.244 96.852 13.788 96.852 C 14.798 96.852 17.99 96.18 17.99 96.18 L 69.747 96.516 C 49.079 129.452 32.61 134.158 32.61 139.871 C 32.61 145.585 48.237 144.072 54.12 141.888 C 82.351 131.805 112.6 100.045 117.809 90.969 C 139.655 93.826 157.972 93.994 162.005 84.921 Z"
            />
            {/* Include additional paths and gradients as needed */}
        </svg>
    );
});

export default RabbyIcon;
