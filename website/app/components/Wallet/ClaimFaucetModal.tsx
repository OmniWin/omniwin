"use client";

import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";
import UserProgress from "@/app/components/User/Progress";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

import { Disclosure } from "@headlessui/react";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { classNames, tiers } from "@/app/utils";

import Coins from '@/public/images/coins/coins.png'

export default function ClaimFaucetModal(props: React.PropsWithChildren) {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>{props.children}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px] lg:max-w-2xl text-zinc-100 max-h-[calc(100vh-6rem)] overflow-auto p-8">
                    <div className="flex gap-8">
                        <DialogHeader className="space-y-5">
                            <DialogTitle className="text-zinc-100 text-xl mb-0">Faucet</DialogTitle>
                            <DialogDescription className="text-xl !text-jade-400 !mt-0">Get testnet tokens</DialogDescription>
                            <CustomImageWithFallback src={Coins} containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[300px] opacity-70" placeholder="blur" width={600} height={775} />
                            <span
                                className={classNames('mt-auto font-himagsikan text-[#6cf60f] text-4xl inline-flex items-center gap-3 hue-rotate-[45deg]')}
                                style={{
                                    // "-webkit-text-stroke-width": "1px",
                                    // "-webkit-text-stroke-color": "black",
                                    WebkitTextStrokeWidth: "1px",
                                    WebkitTextStrokeColor: "black",
                                }}
                            >
                                OmniWin
                            </span>
                        </DialogHeader>
                        <div className="flex-1 flex p-6 border border-zinc-800 bg-zinc-900 rounded-lg shadow shadow-zinc-900 bg-gradient-to-tr from-zinc-800 to-zinc-800/5">
                            <p>Now the project is in the testing phase, can get test tokens by performing the following activity</p>

                            <DialogFooter className="mt-auto">
                                <DialogClose asChild>
                                    <Button type="button" variant="link">
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
