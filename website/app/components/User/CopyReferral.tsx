import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CopyReferralProps {
    referralCode?: string;
}

const CopyReferral: React.FC<CopyReferralProps> = ({ referralCode }) => {
    if (!referralCode) {
        return null; // Don't render anything if no referral code is provided
    }

    const { toast } = useToast();

    const handleCopy = () => {
        if (!navigator.clipboard) {
            // Clipboard API not available
            toast({
                title: "Error",
                description: "Clipboard not available. Please copy manually.",
            });
            return;
        }

        try {
            navigator.clipboard
                .writeText(referralCode)
                .then(() => {
                    toast({
                        title: "Referral Code Copied",
                        description: "Your referral code has been copied to the clipboard.",
                    });
                })
                .catch((err) => {
                    // Handle clipboard write error
                    console.error("Failed to copy:", err);
                    toast({
                        title: "Error",
                        description: "Failed to copy. Please try again.",
                    });
                });
        } catch (err) {
            console.error("Failed to copy: ", err);
            toast({
                title: "Error",
                description: "Unexpected error. Please try again.",
            });
        }
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700">
                Referral Code
            </label>
            <Input
                id="referralCode"
                type="text"
                value={referralCode}
                readOnly
                className="mb-2" // You can add additional classes as needed
            />
            <Button onClick={handleCopy} variant="primary">
                Copy
            </Button>
        </div>
    );
};

export default CopyReferral;
