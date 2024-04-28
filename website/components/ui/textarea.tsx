// import * as React from "react"

// import { cn } from "@/lib/utils"

// export interface TextareaProps
//   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ className, ...props }, ref) => {
//     return (
//       <textarea
//         className={cn(
//           // "flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
//           "flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white text-zinc-100 px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-500",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Textarea.displayName = "Textarea"

// export { Textarea }

import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
    "flex min-h-[80px] w-full text-sm placeholder:text-zinc-400 focus:ring-0 sm:text-sm", // Base styles
    {
        variants: {
            variant: {
                default:
                    "rounded-md border border-zinc-200 px-3 py-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-500 text-zinc-200",
                insetLabel: "border-0 p-0 text-zinc-200 placeholder:text-zinc-400 focus:ring-0 !py-0 !px-0 !bg-transparent !h-auto",
                backgroundBottomBorder: "bg-zinc-50 py-1.5 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 dark:bg-zinc-700 dark:text-zinc-200 dark:placeholder:text-zinc-500",
                overlappingLabel:
                    "rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:ring-zinc-600 dark:placeholder:text-zinc-400",
            },
            size: {
                sm: "min-h-[60px] px-3 py-2 text-xs sm:text-sm",
                md: "min-h-[80px] px-4 py-2 text-sm sm:text-base", // Default size
                lg: "min-h-[100px] px-5 py-2 text-base sm:text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">, VariantProps<typeof textareaVariants> {
    className?: string;
    label?: string;
    size?: "sm" | "md" | "lg";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant, size, label, id, ...props }, ref) => {
    const parentClasses = cn({
        "flex flex-col": true,
        "rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-zinc-800 focus-within:ring-2 focus-within:ring-indigo-600 dark:ring-zinc-800 dark:focus-within:ring-zinc-700": variant === "insetLabel",
    });

    return (
        <div className={parentClasses}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-zinc-900 dark:text-zinc-200">
                    {label}
                </label>
            )}
            <textarea
                id={id}
                className={cn(textareaVariants({ variant, size }), "block w-full", className)} // Apply className directly to the textarea
                ref={ref}
                {...props}
            />
        </div>
    );
});

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
