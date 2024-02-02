import CustomImageWithFallback from "@/app/components/Raffle/CustomImageWithFallback";

import { HeartIcon, PlusIcon, CheckBadgeIcon } from "@heroicons/react/20/solid";
import { TicketIcon, ClockIcon } from "@heroicons/react/24/outline";

import Link from "next/link";

import { Raffle } from "@/app/types";
import { classNames, formatCountdown, shortenAddress, formatMoney } from "@/app/utils";

export default function RaffleDefault(raffle: Raffle) {
    const progress = (raffle.tickets_bought / raffle.tickets_total) * 100;
    const timeLeft = formatCountdown(new Date(), new Date(raffle.time_left * 1000));

    return (
        <Link href={"/raffles/" + raffle.nft_id} className="max-w-xs w-full lg:max-w-full group hover:transform hover:scale-105 transition-all duration-300 ease-in-out">
            {/* // <div className="max-w-xs w-full lg:max-w-full lg:flex group"> */}
            <div className="h-48 md:h-auto flex-none bg-cover text-center overflow-hidden relative rounded-t-xl border-l border-t border-r border-smoke-800 lg:border-smoke-800 group-hover:border-smoke-600" title="Woman holding a mug">
                {/* <img src={"https://web3trust.app/nft/" + raffle.nft_image} alt="" className="object-cover object-center h-full w-full md:min-h-64 2xl:min-h-72 rounded-t-xl" /> */}
                <CustomImageWithFallback
                    className="object-cover object-center h-full w-full md:min-h-64 2xl:min-h-72 rounded-t-xl"
                    alt={"Raffle for " + raffle.nft_name + " to win it"}
                    width={100} // Placeholder width for aspect ratio calculation
                    height={100} // Placeholder height for aspect ratio calculation
                    src={`https://web3trust.app/nft/${raffle.nft_image}`}
                    sizes="100%"
                    style={{
                        objectFit: "cover",
                        width: "100%",
                    }}
                />
                <div className="absolute right-3 top-3">
                    <button className="group/like relative z-[10] fill-blood-500 transition-colors duration-400 hover:fill-blood-700 bg-smoke-900/20 group-hover:bg-smoke-900/90 p-2 rounded-full">
                        <div className="border-box items-center flex gap-[4px]">
                            <HeartIcon className="inline-block h-5 w-5 fill-inherit stroke-inherit group-hover/like:animate-pulse" />
                        </div>
                    </button>
                </div>
                <div className="absolute bottom-3 w-full px-3 -ml-[2px]">
                    <div className="px-2 py-1 pb-2 gap-x-1 rounded-md bg-smoke-900/90">
                        <div className="flex items-center justify-between text-xs mb-1 font-bold">
                            <div className="flex items-center justify-between gap-x-2 w-full">
                                {/* <TicketIcon className="inline-block h-5 w-5 text-jade-400" /> */}
                                <span className="text-smoke-300">Ticket sold</span>
                                <div className="flex items-center space-x-1">
                                    <p className="text-jade-400 whitespace-nowrap">{raffle.tickets_bought}</p>
                                    <p className="text-white">/</p>
                                    <p className="text-white">{raffle.tickets_total}</p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-xl bg-white/20 h-1 w-full">
                            <div className="h-full rounded-xl bg-gradient-to-b from-jade-400 to-jade-500" style={{ width: progress + `%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="relative border-r border-b border-l border-smoke-800 lg:border-l-0 lg:border-t lg:border-smoke-800 group-hover:border-smoke-600 bg-smoke-900 rounded-b lg:rounded-b-none lg:rounded-r-xl p-4 flex flex-col justify-between leading-normal w-full lg:-ml-1"> */}
            <div className="relative border-r border-b border-l border-smoke-800 lg:border-smoke-800 group-hover:border-smoke-600 bg-smoke-900 rounded-b-xl p-4 flex flex-col justify-between leading-normal w-full -mt-2 group-hover:bg-gradient-to-t group-hover:from-smoke-900 group-hover:to-smoke-800/50">
                <div className="flex justify-between items-center">
                    <div className="text-xs xl:text-sm text-smoke-600 flex items-center space-x-1 max-w-[calc(100%-60px)]">
                        <div className="relative">
                            <CheckBadgeIcon className="inline-block h-6 xl:h-5 w-6 xl:w-5 text-[#1475e1] z-10 relative" />
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 rounded-full bg-white h-3 w-3"></div>
                        </div>
                        <p className="text-smoke-300 font-bold truncate select-text max-w-36 leading-none xl:leading-tight">
                            {/* <span className="text-smoke-300 font-bold truncate select-text max-w-14 block xl:hidden text-[11px] leading-none">#{raffle.id}</span> */}
                            {raffle.nft_name}
                        </p>
                        {/* <p className="text-smoke-300 font-bold truncate select-text max-w-14 hidden xl:block">#{raffle.id}</p> */}
                        {/* <p className="text-smoke-300 font-bold select-text hidden xl:block">#{raffle.id}</p> */}
                    </div>
                    <div
                        className={classNames(
                            "text-xs inline-flex items-center gap-2 px-2 py-1 rounded-3xl text-smoke-900 font-bold h-full",
                            // bg-lemon-400/90 group-hover:bg-lemon-400
                            // timeLeft.hasEnded && "bg-jade-400",
                            timeLeft.hasEnded && "bg-blood-400",
                            timeLeft.unit === "days" && !timeLeft.hasEnded && "bg-lemon-400",
                            timeLeft.unit === "hrs" && !timeLeft.hasEnded && "bg-lemon-400",
                            timeLeft.unit === "mins" && !timeLeft.hasEnded && "bg-orange-400",
                            timeLeft.unit === "secs" && !timeLeft.hasEnded && "bg-blood-400"
                        )}
                    >
                        {timeLeft.hasEnded ? (
                            <>Ended</>
                        ) : (
                            <>
                                <ClockIcon className="inline-block h-[14px] w-[14px] xl:h-[18px] xl:w-[18px]" />
                                <span>
                                    {timeLeft.diff} {timeLeft.unit} left
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="text-white font-bold text-xl flex items-center my-4 mb-3 xl:my-3">
                    <div className="flex flex-col">
                        <p className="text-xs font-bold text-smoke-300 xl:mb-1">Market value / Full price</p>
                        <p className="text-2xl font-bold text-white truncate select-text">{formatMoney(raffle.full_price, "USD")}</p>
                    </div>
                    {/* <div className="flex flex-col max-w-[30%] min-w-[30%]">
                                    <p className="text-xs font-bold text-smoke-300">Ticket price</p>
                                    <p className="text-xl font-bold text-white truncate select-text">$100</p>
                                </div> */}
                </div>
                <div className="sm:flex justify-between gap-2 sm:gap-6">
                    {/* <p className="text-xs font-bold text-smoke-300 self-center">100 USDC lowest entry</p> */}
                    {timeLeft.hasEnded ? (
                        <>
                            <div className="flex items-center gap-2">
                                <p className="text-[11px] xl:text-xs font-bold text-smoke-300">Winner</p>
                                <p className="2xl:text-xl xl:text-lg font-bold text-jade-400 truncate select-text">{raffle.nft_owner.length > 10 ? shortenAddress(raffle.nft_owner, 3, 3) : raffle.nft_owner}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-[11px] xl:text-xs font-bold text-smoke-300 self-center hidden sm:inline-flex items-center">
                                <span>
                                    {formatMoney(raffle.ticket_price, "USD")} <span className="2xl:hidden">per</span> entry <span className="hidden 2xl:inline">price</span>
                                </span>
                            </p>
                            <div className="min-w-[6rem]">
                                {/* <button className="text-sm font-bold text-smoke-900 bg-gradient-to-b from-sky-400 to-sky-500 hover:to-sky-600 rounded-md px-3 py-1.5 w-full leading-5"> */}
                                {/* <button className="text-sm font-bold text-smoke-900 bg-gradient-to-b bg-[#23f7dd] hover:bg-[#08d3ba] rounded-md px-3 py-1.5 w-full leading-5"> */}
                                <button className="text-sm font-bold text-white bg-[#1475e1] hover:bg-[#1475e1] rounded-md px-3 py-1.5 w-full leading-5">
                                    Enter Now
                                    {/* Enter
                                                        <br />
                                                        Now */}
                                    {/* Play */}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
