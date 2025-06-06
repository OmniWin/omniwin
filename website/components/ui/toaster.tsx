"use client";

import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({ id, title, description, variant, action, ...props }) {
                return (
                    <Toast key={id} {...props} variant={variant}>
                        {variant && ['error', 'success'].includes(variant) &&
                            <div className="flex">
                            {variant === "error" && <ExclamationCircleIcon className="h-6 w-6 text-blood-500" />}
                            {variant === "success" && <CheckCircleIcon className="h-6 w-6 text-emerald-500" />}
                        </div>}
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}
