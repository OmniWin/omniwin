// import * as React from "react"

// import { cn } from "@/lib/utils"

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Input.displayName = "Input"

// export { Input }

import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
    // Base styles
    "block w-full text-sm placeholder:text-zinc-400 focus:ring-0 sm:text-sm sm:leading-6 text-zinc-200",
    {
        variants: {
            variant: {
                default:
                    "flex rounded-md border border-zinc-800 bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-700",
                insetLabel: "border-0 p-0 text-zinc-200 placeholder:text-zinc-400 focus:ring-0 !py-0 !px-0 !bg-transparent !h-auto",
                backgroundBottomBorder: "bg-zinc-900 py-1.5 text-zinc-200 placeholder:text-zinc-400 focus:ring-0 border-t-0 border-l-0 border-r-0",
                overlappingLabel: "bg-zinc-900 text-zinc-200 rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-800",
                leadingIcon: "pl-10",
            },
            size: {
                sm: "h-8 px-3 text-xs sm:text-sm",
                md: "h-10 px-4 text-sm sm:text-base",
                lg: "h-12 px-5 text-base sm:text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof inputVariants> {
    parentClassName?: string;
    className?: string;
    icon?: React.ReactNode; // Generalizing to ReactNode for flexibility
    iconSize?: string; // New prop for icon size
    label?: string;
    size?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ parentClassName, className, variant, size, icon, iconSize = "h-5 w-5", label, id, ...props }, ref) => {
    const pClasses = cn({
        "flex flex-col": true,
        "rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-700 focus-within:ring-2 dark:ring-zinc-800 dark:focus-within:ring-zinc-700": variant === "insetLabel",
    });

    return (
        <div className={cn(pClasses, parentClassName)}>
            {label && variant !== "overlappingLabel" && (
                <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
                    {label}
                </label>
            )}
            <div className={cn({ "mt-1": label && variant !== "overlappingLabel", relative: label && variant === "overlappingLabel" })}>
                {icon && variant === "leadingIcon" && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: cn(iconSize, "text-zinc-400") }) : icon}
                    </div>
                )}
                {label && variant === "overlappingLabel" && (
                    <label htmlFor={id} className="absolute -top-2 left-2 bg-zinc-900 px-1 text-xs font-medium text-zinc-300">
                        {label}
                    </label>
                )}
                <input id={id} className={cn(inputVariants({ variant, size }), className)} ref={ref} {...props} />
            </div>
        </div>
    );
});

export { Input, inputVariants };
