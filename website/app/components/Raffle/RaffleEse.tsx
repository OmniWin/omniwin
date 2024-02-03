import Link from 'next/link'

import CustomImageWithFallback from '@/app/components/Raffle/CustomImageWithFallback'

import { HeartIcon, PlusIcon, CheckBadgeIcon } from "@heroicons/react/20/solid";
import { TicketIcon, ClockIcon } from "@heroicons/react/24/outline";

import { RaffleCard } from "@/app/types";
import { classNames, formatCountdown, shortenAddress, formatMoney } from "@/app/utils";

export default function RaffleEse(raffle: RaffleCard) {
    const progress = (raffle.tickets_bought / raffle.tickets_total) * 100;

    const timeLeft = formatCountdown(new Date(), new Date(raffle.time_left * 1000));

    return (
        <Link href={"/raffles/" + raffle.nft_id} className="flex items-center rounded-lg relative xl:min-h-96 group">
            {/* <img className="object-cover inset-0 rounded-lg h-full w-full min-h-[inherit]" alt="img" src={'https://web3trust.app/nft/'+ raffle.nft_image} /> */}
            <CustomImageWithFallback
                className="object-cover inset-0 rounded-lg h-full w-full min-h-[inherit]"
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
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent    opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            {/* <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100 transition-opacity duration-700"></div> */}
            <div className="absolute left-0 top-0 z-10 w-full max-w-full flex justify-between px-3">
                <div className="inline-flex items-center gap-2 my-5 px-2 py-1.5 rounded-3xl bg-smoke-900/20 group-hover:bg-smoke-900/90 transition-colors duration-700">
                    <div className="flex flex-row items-center gap-1 text-xs xl:text-sm">
                        <CheckBadgeIcon className="inline-block h-5 w-5 text-sky-500" />
                        <p className="text-white font-bold truncate select-text max-w-36">{raffle.nft_name}</p>
                        {/* <p className="text-white font-bold truncate select-text max-w-20">{raffle.nft_name}</p> */}
                        {/* <p className="text-white font-bold truncate select-text max-w-14">#{raffle.id}</p> */}
                    </div>
                </div>

                {/* Add to collection / Like */}
                <div className="inline-flex items-center gap-2.5 my-3 py-1.5">
                    <button className="group/like relative z-[10] fill-blood-500 transition-colors duration-700 hover:fill-blood-700 bg-smoke-900/20 group-hover:bg-smoke-900/90 p-2 rounded-full">
                        <div className="border-box items-center flex gap-[4px]">
                            <HeartIcon className="inline-block h-4 w-4 xl:h-5 xl:w-5 fill-inherit stroke-inherit group-hover/like:animate-pulse" />
                        </div>
                    </button>
                </div>
            </div>
            {/* <div className="absolute left-0 bottom-[85px] z-10 w-full px-3"> */}
            <div className="absolute left-0 bottom-[90px] z-10 w-full px-3">
                <div className="flex items-center justify-between text-[11px] xl:text-xs">
                    <div className="inline-flex items-center px-2 py-1 gap-x-1 bg-smoke-900/90 rounded-3xl">
                        <TicketIcon className="inline-block h-4 w-4 xl:h-5 xl:w-5 text-jade-400" />
                        <div className="flex items-center space-x-1">
                            <p className="text-jade-400 whitespace-nowrap">{raffle.tickets_bought}</p>
                            <p className="text-white">/</p>
                            <p className="text-white">{raffle.tickets_total}</p>
                        </div>
                    </div>
                    <p
                        // className="inline-flex items-center px-2 py-1 gap-1 rounded-3xl bg-lemon-400 text-smoke-900 font-bold"
                        className={classNames(
                            "inline-flex items-center px-2 py-1 gap-1 rounded-3xl text-smoke-900 font-bold",
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
                    </p>
                </div>
                {/* <div className="w-full bg-smoke-900/90 rounded-xl overflow-hidden py-2 px-3 mt-2">
                                    <div className="overflow-hidden rounded-xl bg-white/20 h-1">
                                        <div className="h-full rounded-xl bg-gradient-to-b from-jade-400 to-jade-500 w-6"></div>
                                    </div>
                                </div> */}
            </div>
            <div className="absolute left-0 bottom-3 z-10 w-full px-3">
                <div className="bg-smoke-900/95 rounded-t-xl rounded-b-lg overflow-hidden">
                    {/* <div className="w-full bg-smoke-900/90 rounded-xl overflow-hidden py-2 px-3 mt-2"> */}
                    <div className="overflow-hidden rounded-xl bg-white/20 h-2">
                        <div className="h-full rounded-xl bg-gradient-to-b from-jade-400 to-jade-500" style={{ width: progress + `%` }}></div>
                    </div>
                    {/* </div> */}
                    <div className="flex flex-row justify-between py-2.5 px-3 w-full">
                        <div className="flex flex-col items-center max-w-[30%] min-w-[30%]">
                            <p className="text-[11px] xl:text-xs font-bold text-smoke-300">Market value</p>
                            <p className="2xl:text-xl xl:text-lg font-bold text-white truncate select-text">{formatMoney(raffle.full_price, "USD")}</p>
                        </div>
                        <div className={classNames("flex max-w-[30%] min-w-[30%]", timeLeft.hasEnded && "flex-col items-center")}>
                            {timeLeft.hasEnded ? (
                                <>
                                    <p className="text-[11px] xl:text-xs font-bold text-smoke-300">Winner</p>
                                    <p className="2xl:text-xl xl:text-lg font-bold text-jade-400 truncate select-text">{raffle.nft_owner.length > 10 ? shortenAddress(raffle.nft_owner, 3, 3) : raffle.nft_owner}</p>
                                </>
                            ) : (
                                <button className="text-md font-bold text-smoke-900 bg-gradient-to-b from-jade-400 to-jade-500 group-hover:to-jade-400 rounded-lg px-3 py-1.5 w-full leading-5">Play</button>
                            )}
                        </div>
                        <div className="flex flex-col items-center max-w-[30%] min-w-[30%]">
                            <p className="text-[11px] xl:text-xs font-bold text-smoke-300">Ticket price</p>
                            <p className="2xl:text-xl xl:text-lg font-bold text-white truncate select-text">{formatMoney(raffle.ticket_price, "USD")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
