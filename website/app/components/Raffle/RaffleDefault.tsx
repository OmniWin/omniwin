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

export default function RaffleDefault(raffle: Raffle) {
    return (
        <div className="max-w-xs w-full lg:max-w-full group hover:transform hover:scale-105 transition-all duration-300 ease-in-out">
            {/* // <div className="max-w-xs w-full lg:max-w-full lg:flex group"> */}
            <div className="h-48 md:h-auto flex-none bg-cover text-center overflow-hidden relative" title="Woman holding a mug">
                <img src={raffle.image} alt="" className="object-cover object-center h-full w-full md:min-h-64 2xl:min-h-72 rounded-t-xl" />
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
                                    <p className="text-jade-400 whitespace-nowrap">{raffle.raisedTickets}</p>
                                    <p className="text-white">/</p>
                                    <p className="text-white">{raffle.tickets}</p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-xl bg-white/20 h-1 w-full">
                            <div className="h-full rounded-xl bg-gradient-to-b from-jade-400 to-jade-500 w-6"></div>
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
                            <span className="text-smoke-300 font-bold truncate select-text max-w-14 block xl:hidden text-[11px] leading-none">#{raffle.id}</span>
                            {raffle.title}
                        </p>
                        {/* <p className="text-smoke-300 font-bold truncate select-text max-w-14 hidden xl:block">#{raffle.id}</p> */}
                        <p className="text-smoke-300 font-bold select-text hidden xl:block">#{raffle.id}</p>
                    </div>
                    <div className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-3xl bg-lemon-400/90 group-hover:bg-lemon-400 text-smoke-900 font-bold h-full">
                        <span>{raffle.endingIn}</span>
                    </div>
                </div>
                <div className="text-white font-bold text-xl flex items-center my-4 mb-3 xl:my-3">
                    <div className="flex flex-col">
                        <p className="text-xs font-bold text-smoke-300 xl:mb-1">Market value / Full price</p>
                        <p className="text-2xl font-bold text-white truncate select-text">${raffle.price}</p>
                    </div>
                    {/* <div className="flex flex-col max-w-[30%] min-w-[30%]">
                                    <p className="text-xs font-bold text-smoke-300">Ticket price</p>
                                    <p className="text-xl font-bold text-white truncate select-text">$100</p>
                                </div> */}
                </div>
                <div className="flex justify-between gap-6">
                    {/* <p className="text-xs font-bold text-smoke-300 self-center">100 USDC lowest entry</p> */}
                    <p className="text-[11px] xl:text-xs font-bold text-smoke-300 self-center inline-flex items-center">
                        <span>$100 entry price</span>
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
                </div>
            </div>
        </div>
    );
}
