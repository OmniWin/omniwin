import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { share } from "@/app/utils";

interface CopyReferralProps {
    referralCode?: string;
}

const CopyReferral: React.FC<CopyReferralProps> = ({ referralCode }) => {
    if (!referralCode) {
        return null; // Don't render anything if no referral code is provided
    }

    return (
        <div className="space-x-3 flex items-center px-3 py-2 h-full rounded-xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300">
            <div className="h-8 bg-zinc-800 flex items-center justify-center rounded-md p-1">
                <svg className={`h-6 w-6`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path
                        className="opacity-40"
                        d="M371 34.8c-11.5 5.1-19 16.6-19 29.2v43.3l85.4 76.9c6.7 6.1 10.6 14.7 10.6 23.8s-3.8 17.7-10.6 23.8L352 308.7V352c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
                    />
                    <path
                        className=""
                        d="M243 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h32v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"
                    />
                </svg>
            </div>

            <Input
                id="referralCode"
                type="text"
                value={referralCode}
                readOnly
                className="!bg-transparent !border-0 !outline-none !ring-0 !ring-offset-0 uppercase text-xl"
            />
            <Button onClick={() => share('default', {
                title: 'OmniWin Referral Code',
                text: `Use my referral code ${referralCode} to join OmniWin and earn rewards!`,
                url: 'https://omniwin.com',
            })} variant="outline">
                Share
            </Button>
        </div>
    );
};

export default CopyReferral;
