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

export default function RankInfoModal(props: React.PropsWithChildren) {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {props.children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] lg:max-w-2xl text-zinc-100 max-h-[calc(100vh-6rem)] overflow-auto">
                    <DialogHeader className="space-y-5">
                        <DialogTitle className="text-zinc-100">Tier list</DialogTitle>
                        <DialogDescription>
                            In our rank system, participants can advance through various levels by completing quests. Each tier offers a unique set of benefits, enhancing the user experience and rewarding continued
                            engagement. As users accumulate more quests, they level up, unlocking new perks, exclusive access, or rewards specific to their tier.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 rounded-lg space-y-8" style={{ background: "linear-gradient(160deg, rgb(17 186 130 / 10%) 0%, rgb(229 42 95 / 5%) 54%, rgb(251 162 19 / 12%) 100%)" }}>
                        <div className="flex items-center justify-center">
                            <CustomImageWithFallback src="/images/tier/2.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[64px]" width={60} height={60} />
                            <div className="text-left ml-6">
                                <p className="text-base font-semibold">Tier 2</p>
                                <p className="text-zinc-400">1 more rank to go</p>
                            </div>
                        </div>
                        <UserProgress />
                        {/* <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div
                                    className={classNames("flex items-center text-xs gap-1 py-1.5 px-2.5 rounded")}
                                    style={{ backgroundColor: tiers[1].lowOpacityColor, color: tiers[1].color, borderColor: tiers[1].color }}
                                >
                                    <CustomImageWithFallback src="/images/tier/2.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                                    <span>Tier 2</span>
                                </div>
                                <p className="text-zinc-400 text-sm">2500 left</p>
                                <div
                                    className={classNames("flex items-center text-xs gap-1 py-1.5 px-2.5 rounded")}
                                    style={{ backgroundColor: tiers[0].lowOpacityColor, color: tiers[0].color, borderColor: tiers[0].color }}
                                >
                                    <CustomImageWithFallback src="/images/tier/1.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                                    <span>Tier 1</span>
                                </div>
                            </div>
                            <Progress value={20} className="h-2" />
                        </div> */}
                    </div>
                    {
                        <dl className="space-y-3">
                            {tiers.map((tier) => (
                                <Disclosure as="div" key={tier.name} className="bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 px-4 py-2.5 rounded-lg">
                                    {({ open }) => (
                                        <>
                                            <dt className="">
                                                <Disclosure.Button className="flex w-full items-center justify-between text-left text-white">
                                                    <div className="text-base font-semibold leading-7 flex items-center gap-6">
                                                        {/* <div className="text-center w-14"> */}
                                                        <CustomImageWithFallback
                                                            src={tier.image}
                                                            alt=""
                                                            containerClass="flex justify-center !w-14"
                                                            className="object-cover inset-0 !w-auto !h-[36px]"
                                                            width={60}
                                                            height={60}
                                                        />
                                                        {/* </div> */}
                                                        <span className="flex items-center gap-4">
                                                            {tier.name}
                                                            {tier.name === "Tier 2" && (
                                                                <Badge form="round" variant="zinc">
                                                                    Your tier
                                                                </Badge>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="ml-6 flex h-7 items-center">
                                                        {open ? <ChevronUpIcon className="h-6 w-6" aria-hidden="true" /> : <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />}
                                                    </span>
                                                </Disclosure.Button>
                                            </dt>
                                            <Disclosure.Panel as="dd" className="mt-6 pr-12">
                                                <p className="text-base leading-7 text-gray-300">{tier.description}</p>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            ))}
                        </dl>
                    }
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
