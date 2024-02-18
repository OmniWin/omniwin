import { classNames } from "@/app/utils";

type ProgressBarProps = {
    value: number;
    maxValue: number;
    size: "small" | "default" | "large" | "extraLarge";
    labelInside?: boolean;
    labelOutside?: boolean;
    color?: string; // Assuming this is Tailwind color classes e.g., 'blue-600'
    labelOutsideText?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ value, maxValue, size, labelInside = false, labelOutside = false, color = "emerald", labelOutsideText = 'Progress' }) => {
    const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100)).toFixed(0);

    const sizeClasses = {
        small: "h-1.5",
        default: "h-2.5",
        large: "h-4",
        extraLarge: "h-6",
    };

    const colors: { [key: string]: string } = {
        blue: "bg-blue-400",
        emerald: "bg-emerald-400",
        red: "bg-red-400",
        yellow: "bg-yellow-400",
    };

    const heightClass = sizeClasses[size] || sizeClasses.default;
    const bgColorClass = colors[color] || colors.emerald;
    const labelSizeClass = ['small', 'default', 'large'].includes(size) ? "text-xs" : "text-sm";

    return (
        <div>
            {labelOutside && (
                <div className="flex justify-between mb-1">
                    <span className={`${labelSizeClass} font-medium dark:text-white`}>{labelOutsideText}</span>
                    <span className={`${labelSizeClass} font-medium dark:text-white`}>{`${percentage}%`}</span>
                </div>
            )}
            <div className={`w-full bg-gray-200 rounded-full dark:bg-gray-700 ${heightClass}`}>
                <div className={classNames(`${bgColorClass} ${heightClass} rounded-full ${bgColorClass} text-center ${labelSizeClass} text-zinc-900`)} style={{ width: `${percentage}%` }}>
                    {/* {labelInside && <span className={`text-xs font-medium text-blue-100 text-center p-0.5 leading-none ${labelSizeClass}`}>{`${percentage}%`}</span>} */}
                    {labelInside && `${percentage}%`}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
