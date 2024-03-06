"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";
import RankInfoModal from "@/app/components/Challenges/RankInfoModal";

import { classNames, tiers } from "@/app/utils";

export default function UserProgressCard() {
    return (
        <>
            <div className="bg-zinc-900 rounded-2xl p-px h-full mt-8 xl:mt-0">
                <div
                    className="border border-transparent hover:border-emerald-400 shadow-xl rounded-2xl flex flex-col divide-y divide-zinc-800 min-w-80"
                    style={{ background: "linear-gradient(160deg, rgb(17 186 130 / 10%) 0%, rgb(229 42 95 / 5%) 54%, rgb(251 162 19 / 12%) 100%)" }}
                >
                    <div className="flex items-center justify-between gap-2 py-4 px-6">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-zinc-200">Rank</p>
                            <RankInfoModal>
                                <InformationCircleIcon className="w-5 h-5 text-zinc-300 cursor-pointer" />
                            </RankInfoModal>
                        </div>
                        <div className="text-emerald-400 font-semibold">
                            <div className={classNames("flex items-center text-xs gap-1 py-1.5 px-2.5 rounded")} style={{ backgroundColor: tiers[0].lowOpacityColor, color: tiers[0].color, borderColor: tiers[0].color }}>
                                <CustomImageWithFallback src="/images/tier/1.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                                <span>Tier 1</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 py-4 px-6">
                        <p className="text-sm text-zinc-200">XP</p>
                        <p className="text-emerald-400 font-semibold">
                            1,000 <span className="text-zinc-400 text-xs">points</span>
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 py-4 px-6">
                        <p className="text-sm text-zinc-200">Position</p>
                        <p className="text-emerald-400 font-semibold">
                            234 <span className="text-zinc-400 text-xs">/ 20,000</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
