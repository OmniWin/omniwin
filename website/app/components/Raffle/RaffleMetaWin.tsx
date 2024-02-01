import { HeartIcon, TicketIcon, CheckBadgeIcon, ClockIcon } from "@heroicons/react/24/outline";

import { Raffle } from "@/app/types";
import { classNames, formatCountdown, shortenAddress, formatMoney } from "@/app/utils";

export default function RaffleMetaWin(raffle: Raffle) {
    const progress = (raffle.tickets_bought / raffle.tickets_total) * 100;

    const timeLeft = formatCountdown(new Date(), new Date(raffle.time_left * 1000));

    return (
        <a href="#" className="d-block w-[calc(33%-.45rem)] sm:w-full mx-1 sm:mx-0 flex flex-col items-center rounded-lg relative group hover:bg-smoke-800 transition-color duration-400">
            {/* <a href="#" className="flex items-center rounded-lg relative xl:min-h-60 group"> */}
            {/* <div className="absolute left-0 bottom-[78px] z-10 w-full bg-smoke-900/20 group-hover:bg-smoke-900/90 transition-colors duration-700 rounded-t-xl rounded-b-lg overflow-hidden"> */}
            <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img className="object-cover rounded-t-lg h-full w-full xl:min-h-64" alt="img" src={`/nfts/${raffle.nft_image}`} />

                <div className="absolute left-1 top-1 lg:left-2 lg:top-2 z-10">
                    <div className="inline-flex items-center py-1.5 px-2.5 rounded-3xl bg-smoke-900/20 group-hover:bg-smoke-900/90 transition-colors duration-400 gap-1">
                        <p className="text-[11px] leading-3 lg:text-sm text-white font-bold truncate select-text max-w-20">10 </p>
                        <img className="tw-ml-2 inline-block h-4 lg:h-5 w-4 lg:w-5 tw-object-fill" loading="lazy" alt="USDC" src="https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694"></img>
                    </div>
                </div>

                <div className="absolute right-1 top-1 lg:right-2 lg:top-2 z-10">
                    {/* Add to collection / Like */}
                    <button className="group/like relative z-[10] fill-blood-500 transition-colors duration-400 hover:fill-blood-700 bg-smoke-950/20 group-hover:bg-smoke-950/90 p-1 px-1.5 sm:px-2 lg:py-1 lg:px-1.5 rounded-full">
                        <HeartIcon className="inline-block h-4 lg:h-5 w-4 lg:w-5 fill-inherit stroke-inherit group-hover/like:animate-pulse" />
                    </button>
                </div>

                {/* <div className="absolute left-1 lg:left-2 bottom-2 lg:bottom-7 text-[11px] leading-3 px-1 lg:px-2 py-0.5 lg:py-1 inline-flex items-center gap-x-1 bg-smoke-900/90 rounded-3xl">
                                        <TicketIcon className="inline-block h-3 w-3 xl:h-5 xl:w-5 text-jade-400" />
                                        <div className="flex items-center space-x-1">
                                            <p className="text-jade-400 whitespace-nowrap">{raffle.raisedTickets}</p>
                                            <p className="text-white">/</p>
                                            <p className="text-white">{raffle.tickets}</p>
                                        </div>
                                </div> */}

                {/* <div className="absolute right-1 lg:right-3 bottom-7 text-[11px] inline-flex items-center gap-2 px-2 py-1 rounded-3xl bg-lemon-400 text-smoke-900 font-bold"> */}
                <div
                    className={classNames(
                        "absolute right-1 lg:right-2 bottom-2 lg:bottom-7 text-[11px] leading-3 px-1 lg:px-2 py-0.5 lg:py-1 rounded-3xl text-smoke-900 font-bold",
                        // timeLeft.hasEnded && "bg-jade-400",
                        timeLeft.hasEnded && "bg-blood-400",
                        timeLeft.unit === "days" && !timeLeft.hasEnded && "bg-lemon-400",
                        timeLeft.unit === "hrs" && !timeLeft.hasEnded && "bg-lemon-400",
                        timeLeft.unit === "mins" && !timeLeft.hasEnded && "bg-orange-400",
                        timeLeft.unit === "secs" && !timeLeft.hasEnded && "bg-blood-400"
                    )}
                >
                    {/* <ClockIcon className="inline-block h-5 w-5" /> */}
                    {timeLeft.hasEnded ? (
                        <p className="text-smoke-900">Ended</p>
                    ) : (
                        // <p className="text-smoke-900">Winner {raffle.nft_owner.length > 10 ? shortenAddress(raffle.nft_owner, 3, 3) : raffle.nft_owner}</p>
                        <>
                            {/* <ClockIcon className="inline-block h-3 w-3 xl:h-5 xl:w-5" /> */}
                            <p className="text-smoke-900">
                                {timeLeft.diff} {timeLeft.unit} left
                            </p>
                        </>
                    )}
                </div>

                {/* <div className="absolute left-3 bottom-3 text-[11px] inline-flex items-center gap-2 px-2 py-1 rounded-3xl bg-smoke-950/20 group-hover:bg-smoke-950/90 p-2 rounded-3xl font-bold">
                    <div className="flex items-center space-x-1">
                        <p className="text-jade-400 whitespace-nowrap">{raffle.raisedTickets}</p>
                        <p className="text-white">/</p>
                        <p className="text-white">{raffle.tickets}</p>
                    </div>
                </div> */}
            </div>
            <div className="w-full text-center py-2 bg-smoke-950 -mt-1 lg:-mt-5 relative z-10">
                <div className="overflow-hidden bg-white/20 h-1 lg:h-2 -mt-2 mb-2">
                    <div className={classNames("h-full bg-gradient-to-b from-jade-400 to-jade-500")} style={{ width: progress + `%` }}></div>
                </div>
                <p className="text-[11px] leading-3 lg:leading-none lg:text-xs font-bold text-smoke-300 flex items-center justify-center gap-1 truncate">
                    <CheckBadgeIcon className="inline-block h-4 lg:h-5 w-4 lg:w-5 text-[#1475e1] z-10 relative" />
                    <span className="truncate max-w-[90%]">{raffle.nft_name}</span>
                </p>
                <p className="lg:text-xl font-bold text-white truncate select-text">{formatMoney(raffle.full_price, "USD")}</p>
            </div>
            <div className={classNames("w-full text-center py-1.5 rounded-b-lg leading-4", timeLeft.hasEnded && "bg-smoke-950", !timeLeft.hasEnded && "bg-jade-400 hover:bg-jade-500 text-smoke-900")}>
                <p className="text-xs lg:text-base font-bold truncate select-text">
                    {/* {timeLeft.hasEnded ? "Ended" : "Enter now"} */}
                    {timeLeft.hasEnded ? (
                        // <p className="text-smoke-900">Ended</p>
                        <p className="text-jade-400 text-[11px] lg:text-sm lg:leading-6">Winner {raffle.nft_owner.length > 10 ? shortenAddress(raffle.nft_owner, 3, 3) : raffle.nft_owner}</p>
                    ) : (
                        <>Enter now</>
                    )}
                </p>
                {/* <p className="text-xs font-normal text-smoke-900">10 USDC</p> */}
            </div>
        </a>
    );
}
