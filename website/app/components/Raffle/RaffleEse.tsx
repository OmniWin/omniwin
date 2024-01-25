import { HeartIcon, PlusIcon, CheckBadgeIcon } from "@heroicons/react/20/solid";
import { TicketIcon, ClockIcon } from "@heroicons/react/24/outline";

type Raffle = {
    id: number;
    title: string;
    price: string;
    currency: string;
    image: string;
    chain: string;
    chainIcon: string;
    tickets: number;
    raisedTickets: number;
    endingIn: string;
};

export default function RaffleEse(raffle: Raffle) {
    return (
        <a href="#" className="flex items-center rounded-lg relative xl:min-h-96 group">
            <img className="object-cover inset-0 rounded-lg h-full w-full" alt="img" src={raffle.image} />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent    opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            {/* <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100 transition-opacity duration-700"></div> */}
            <div className="absolute left-0 top-0 z-10 w-full max-w-full flex justify-between px-3">
                <div className="inline-flex items-center gap-2 my-5 px-2 py-1.5 rounded-3xl bg-smoke-900/20 group-hover:bg-smoke-900/90 transition-colors duration-700">
                    <div className="flex flex-row items-center gap-1 text-xs xl:text-sm">
                        <CheckBadgeIcon className="inline-block h-5 w-5 text-sky-500" />
                        <p className="text-white font-bold truncate select-text max-w-20">{raffle.title}</p>
                        <p className="text-white font-bold truncate select-text max-w-14">#{raffle.id}</p>
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
                            <p className="text-jade-400 whitespace-nowrap">{raffle.raisedTickets}</p>
                            <p className="text-white">/</p>
                            <p className="text-white">{raffle.tickets}</p>
                        </div>
                    </div>
                    <p className="inline-flex items-center px-2 py-1 gap-1 rounded-3xl bg-lemon-400 text-smoke-900 font-bold">
                        <ClockIcon className="inline-block h-[14px] w-[14px] xl:h-[18px] xl:w-[18px]" />
                        <span>{raffle.endingIn} left</span>
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
                        <div className="h-full rounded-xl bg-gradient-to-b from-jade-400 to-jade-500 w-6"></div>
                    </div>
                    {/* </div> */}
                    <div className="flex flex-row justify-between py-2.5 px-3 w-full">
                        <div className="flex flex-col items-center max-w-[30%] min-w-[30%]">
                            <p className="text-[11px] xl:text-xs font-bold text-smoke-300">Market value</p>
                            <p className="2xl:text-xl xl:text-lg font-bold text-white truncate select-text">${raffle.price}</p>
                        </div>
                        <div className="flex max-w-[30%] min-w-[30%]">
                            <button className="text-md font-bold text-smoke-900 bg-gradient-to-b from-jade-400 to-jade-500 group-hover:to-jade-400 rounded-lg px-3 py-1.5 w-full leading-5">Play</button>
                        </div>
                        <div className="flex flex-col items-center max-w-[30%] min-w-[30%]">
                            <p className="text-[11px] xl:text-xs font-bold text-smoke-300">Ticket price</p>
                            <p className="2xl:text-xl xl:text-lg font-bold text-white truncate select-text">$100</p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}
