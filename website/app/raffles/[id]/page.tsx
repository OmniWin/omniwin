"use client";

/**
 * TODO:
 * 
 * ❌ Add ws for activity
 * ❌ Add ws for participants
 * ✅ Fetch participants with pagination
 * ❌ Show winner if exists, if not show the raffle as incomplete
 * ❌ Add favorite logic
 * ❌ Show favorites counts and likes if the user already liked the raffle
 * ❌ Implement the ws connection to update the raffle status in real time
 * ❌ Add fallback to the ws connection to update the raffle status in real time
 * ❌ If none of the updates worked show user an allert to refresh the page
 * ❌ Add the ability to buy tickets
 * ❌ Add the ability to claim the asset
 * ❌ Add the ability to claim the tokens
 * ❌ Add the ability to buyout the raffle
 * ❌ Add the ability to see the transactions
 * ❌ Add the ability to see the NFT stats
 * ❌ Maximize the image on click | WIP
 * ✅ Add the ability to share the raffle | Need to test
 * ❌ Add the ability to see the raffle on the blockchain
 */

/* Components */
// import Tabs from "@/app/components/Raffle/Tabs";
import Activity from "@/app/components/Raffle/Activity";
import Participants from "@/app/components/Raffle/Participants";
import CustomImageWithFallback from "@/app/components/Raffle/CustomImageWithFallback";

import Link from "next/link";
import Countdown from "react-countdown";
import { useState, useEffect } from "react";

import { ArrowsPointingOutIcon, ChevronLeftIcon, EyeIcon, HeartIcon, ShareIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon, ShoppingCartIcon, TicketIcon } from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";

import { classNames, share, countdownRederer, formatCountdown, shortenAddress, formatMoney } from "@/app/utils";

// Types
import { RaffleCard, Ticket, PurchaseOption } from "@/app/types";

interface RaffleResponse {
    success: boolean;
    data: {
        nft: RaffleCard;
        tickets: Ticket[];
        purchaseOptions: PurchaseOption[];
    };
    message: string;
}



export default function RafflePage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const [raffleData, setRaffleData] = useState<{ nft: RaffleCard; tickets: Ticket[]; purchaseOptions: PurchaseOption[] } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const progress = raffleData?.nft ? ((raffleData.nft.tickets_bought / raffleData.nft.tickets_total) * 100) : 0;
    const timeLeft = raffleData?.nft ? formatCountdown(new Date(), new Date(raffleData.nft.end_timestamp * 1000)) : { days: 0, hours: 0, minutes: 0, seconds: 0 };


    useEffect(() => {
        // Create a new EventSource instance to connect to the SSE endpoint
        const eventSource = new EventSource('http://localhost/v1/events');

        // Handle incoming messages
        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            console.log('New message:', newMessage);
        };

        // Handle any errors
        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        // Clean up the connection when the component unmounts
        return () => {
            eventSource.close();
        };
    }, []);


    useEffect(() => {
        const fetchRaffleData = async () => {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${params.id}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: RaffleResponse = await response.json();
                setRaffleData(data.data);
            } catch (error) {
                console.error("Failed to fetch raffle data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRaffleData();
    }, [params.id]);

    if (isLoading) {
        return <div>Loading...</div>; // Implement your skeleton loader here
    }

    // if (!raffleData?.success) {
    //     return <div>Failed to load raffle data.</div>;
    // }

    const contest = {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        // image: "https://metadata.degods.com/g/1570-dead.png",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmUbgubLVZdyZF1ocsJisX7weQARQ2fgxDiTHJYcG6UViq",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    };

    const priceVariants = [
        {
            id: 1,
            name: "1",
            price: "0.006",
            currency: "USDC",
            recomanded: false,
            tickets: 1,
        },
        {
            id: 2,
            name: "1",
            price: "0.012",
            currency: "USDC",
            recomanded: false,
            tickets: 10,
        },
        {
            id: 3,
            name: "10",
            price: "0.11",
            currency: "USDC",
            recomanded: false,
            tickets: 100,
        },
        {
            id: 4,
            name: "50",
            price: "0.525",
            currency: "USDC",
            recomanded: true,
            tickets: 500,
        },
    ];

    return (
        <>
            {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8"> */}
            <div className="mx-auto max-w-7xl relative z-10">
                {/* Back button */}
                <Link href="/raffles" className="flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-200 mb-4">
                    <ChevronLeftIcon className="-ml-1 mr-1 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    Back to Raffles list
                </Link>
                <div className="lg:flex items-center justify-between">
                    <h1 className="text-2xl font-bold leading-7 text-zinc-100 sm:truncate sm:text-3xl sm:tracking-tight mb-5 lg:mb-0">
                        {raffleData?.nft.is_verified && (
                            <div className="relative inline-block h-auto mr-2">
                                <CheckBadgeIcon className="inline-block h-6 xl:h-8 w-6 xl:w-8 text-water-600 z-10 relative" />
                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 inset-0 rounded-full bg-white h-3 w-3 xl:h-4 xl:w-4"></div>
                            </div>
                        )}
                        {raffleData?.nft.nft_name}
                        {/* <span className="text-gray-400">#{contest.id}</span> */}
                    </h1>
                    {/* <Countdown date={Date.now() + 1000000000} renderer={countdownRederer}></Countdown> */}
                    <Countdown date={raffleData?.nft?.end_timestamp * 1000} renderer={countdownRederer}></Countdown>
                </div>

                <div className="grid items-center grid-cols-2 xl:grid-cols-5 mt-8 border-zinc-800 border rounded-xl">
                    {/* <div className="grid items-center lg:grid-cols-8 mt-8"> */}
                    <div className="p-4 flex items-center justify-center gap-3 col-span-1 xl:border-r border-zinc-800 h-full">
                        {/* <div className="p-4 flex items-center gap-3 lg:col-span-1 h-full"> */}
                        <div className="relative">
                            <img className="w-10 h-w-10 rounded-full" src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg" alt="Avatar of Jonathan Reinink" />
                        </div>
                        <div>
                            <div className="text-zinc-400 text-sm">Owner</div>
                            {/* <div className="text-lg font-bold leading-7 text-zinc-100 sm:truncate sm:text-xl sm:tracking-tight">0x6d..d34</div> */}
                            <div className="text-lg font-bold leading-7 text-zinc-100 sm:truncate sm:text-base sm:tracking-tight">
                                {raffleData?.nft?.nft_owner?.length > 10 ? shortenAddress(raffleData?.nft?.nft_owner, 3, 3) : raffleData?.nft?.nft_owner}
                            </div>
                        </div>
                    </div>
                    <div className="py-4 px-4 lg:px-8 flex flex-col justify-center col-span-2 xl:col-span-3 xl:border-r border-zinc-800 h-full">
                        {/* <div className="py-4 px-8 flex flex-col justify-center lg:col-span-5 h-full"> */}
                        <div className="flex items-center justify-between gap-x-2 w-full font-bold text-sm mb-3">
                            <span className="text-zinc-300">
                                {!timeLeft.hasEnded && (
                                    <>
                                        Only<span className="text-jade-400 inline-block mx-1">{raffleData?.nft?.tickets_total - raffleData?.nft?.tickets_bought}</span>
                                        tickets until the raffle starts
                                    </>
                                )}
                                {timeLeft.hasEnded && raffleData?.nft?.tickets_total - raffleData?.nft?.tickets_bought == 0 && <>Raffle filled</>}
                            </span>
                            <div className="flex items-center space-x-1">
                                <p className="text-jade-400 whitespace-nowrap">{raffleData?.nft?.tickets_bought}</p>
                                <p className="text-white">/</p>
                                <p className="text-white">{raffleData?.nft?.tickets_total}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="overflow-hidden rounded-xl bg-white/20 h-2 w-full">
                                <div className="h-full rounded-xl bg-gradient-to-b from-jade-400 to-jade-500" style={{ width: progress + `%` }}></div>
                            </div>
                            <span className="text-xs text-zinc-400">{progress + `%`}</span>
                        </div>
                    </div>
                    {/* <div className="p-4 flex items-center justify-center lg:col-span-1 bg-gradient-to-b from-zinc-900 to-zinc-800/50 rounded-tr-xl rounded-br-xl"> */}
                    <div className="p-4 flex items-center justify-center col-span-1 col-start-2 row-start-1 xl:col-start-5 xl:bg-gradient-to-b from-zinc-900 to-emerald-800/5 rounded-tr-xl rounded-br-xl">
                        {/* <div className="p-4 flex flex-col items-center lg:col-span-2 border-zinc-800 border rounded-xl"> */}
                        <div>
                            <div className="text-zinc-400 text-sm">Market value</div>
                            <div className="text-xl font-bold leading-7 text-zinc-100 sm:truncate sm:text-3xl sm:tracking-tight">
                                {formatMoney(raffleData?.nft?.full_price, "USD")}
                                {/* <span className="text-zinc-400 text-sm">$</span> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-10 xl:grid-cols-2 mt-10">
                    <div className="">
                        <div className={`relative`}>
                            {/* <div
                                style={{ backgroundImage: `url(${contest.image})` }}
                                className="absolute rounded-xl w-full h-full mx-auto after:content-[''] after:w-full after:h-full after:block after:absolute after:-bottom-[6px] after:z-[-1] after:blur-[20px] after:bg-inherit opacity-80 max-w-[98%] max-h-[98%] left-0 right-0"
                            ></div>
                            <img className="relative z-1 object-cover rounded-xl h-full w-full xl:max-h-144" alt="img" src={contest.image} />
                            <button className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/40">
                                <ArrowsPointingOutIcon className="h-5 w-5 text-zinc-50" />
                            </button> */}
                            <CustomImageWithFallback
                                showMaximizeButton
                                glowEffect
                                alt={"Raffle for " + raffleData?.nft?.nft_name + " to win it"}
                                width={100} // Placeholder width for aspect ratio calculation
                                height={100} // Placeholder height for aspect ratio calculation
                                src={`https://web3trust.app/nft/${raffleData?.nft?.nft_image}`}
                                sizes="100%"
                                style={{
                                    objectFit: "cover",
                                    width: "100%",
                                }}
                                className="relative z-[2] object-cover rounded-xl h-full w-full xl:max-h-144"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-7 text-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-sm leading-6 text-zinc-400 rounded-md ring-1 ring-zinc-900/10 shadow-sm p-2 ring-zinc-700 bg-zinc-800 highlight-white/5 hover:bg-zinc-700"
                                    >
                                        <HeartIcon className="h-5 w-5 text-blood-500" />
                                        <span>3300</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <EyeIcon className="h-5 w-5 text-blue-500" />
                                    <span>3300</span>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-2 text-zinc-400 cursor-pointer group"
                                onClick={() => {
                                    share("default", {
                                        title: "Example Title",
                                        text: "Example text",
                                        url: "https://example.com",
                                    });
                                }}
                            >
                                <span>Share this competiton</span>
                                <button
                                    type="button"
                                    className="flex items-center text-sm leading-6 text-zinc-400 rounded-md ring-1 ring-zinc-900/10 shadow-sm py-2 pl-2 pr-3 ring-zinc-700 bg-zinc-800 highlight-white/5 group-hover:bg-zinc-700"
                                >
                                    <ShareIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <h2 className="flex items-center gap-2 text-md lg:text-xl text-zinc-100 font-semibold mb-5">
                            <TicketIcon className="inline-block h-8 w-8 text-zinc-500 -rotate-90" />
                            <span>
                                Purchase Tickets
                                {/* <div className="text-xs text-zinc-400">Available Tickets 500</div> */}
                            </span>
                        </h2>
                        <div className="flex flex-col rounded-xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30">
                            {priceVariants.map((variant) => (
                                <div
                                    className={classNames(
                                        "flex items-center justify-between p-4 pb-5 lg:!p-4 border-zinc-800 hover:bg-zinc-700/10 relative space-x-3 xl:space-x-0",
                                        variant.id !== 1 && "border-t",
                                        variant.recomanded && "ring-1 bg-jade-400/5 ring-jade-400 hover:ring-jade-300 hover:!bg-jade-400/10 rounded-xl"
                                    )}
                                    key={variant.id}
                                >
                                    {/* {variant.recomanded && <span className="text-[11px] leading-3 px-1 lg:px-2 py-0.5 lg:py-1 rounded-3xl font-bold bg-blue-300 text-blue-900">RECOMMENDED</span>} */}
                                    <div className="xl:space-y-2">
                                        {variant.recomanded && (
                                            <span className="absolute -top-4 left-0 right-0 text-center">
                                                <span className="text-[11px] leading-3 px-1 lg:px-2 py-0.5 lg:py-1 rounded-3xl font-bold bg-jade-400 text-jade-950">RECOMMENDED</span>
                                            </span>
                                        )}
                                        <div className="xl:flex items-center gap-1">
                                            <div className="text-4xl font-bold text-zinc-100">{variant.tickets}</div>
                                            <div className="flex items-center text-xs xl:text-sm text-zinc-400">
                                                <div className="flex items-center gap-1 mt-2 xl:mt-5">
                                                    {/* USDC logo */}
                                                    <div>
                                                        {variant.price} {variant.currency} per entry
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] xl:text-xs text-zinc-400 font-semibold">
                                            INCLUDES <span className="text-jade-400">8 FREE</span> TICKETS
                                        </p>
                                    </div>
                                    <div className={classNames("flex items-center border border-zinc-800 rounded-xl hover:border-zinc-700", variant.recomanded && "border-zinc-600/40 hover:!border-zinc-600/80")}>
                                        <button
                                            className="inline-flex items-center justify-center p-4 border border-transparent bg-transparent text-zinc-400 font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled
                                        >
                                            <MinusIcon className="h-5 w-5" />
                                        </button>
                                        <input
                                            type="text"
                                            value={0}
                                            className="text-zinc-100 border-0 focus:!outline-0 !ring-0 !shadow-transparent text-center w-full max-w-20 rounded p-2 bg-transparent focus:outline-none"
                                        />
                                        <button className="p-4 bg-transparent border border-transparent text-zinc-400 rounded">
                                            <PlusIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h2 className="flex items-center gap-2 text-md lg:text-xl text-zinc-100 font-semibold mt-8 mb-5">
                            <ShoppingCartIcon className="inline-block h-7 w-7 text-zinc-500" />
                            <span>
                                Order Summary
                                {/* <InformationCircleIcon className="inline-block h-5 w-5 text-zinc-400" /> */}
                                {/* <p className="text-xs text-zinc-400">All entries require gas</p> */}
                            </span>
                        </h2>
                        <div className="group relative border border-zinc-800 bg-zinc-800/20 py-5 px-4 rounded-xl hover:border-zinc-700">
                            <div className="pointer-events-none">
                                <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] opacity-50">
                                    <svg aria-hidden="true" className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5">
                                        <defs>
                                            <pattern id=":R56hdsqla:" width="72" height="56" patternUnits="userSpaceOnUse" x="50%" y="16">
                                                <path d="M.5 56V.5H72" fill="none"></path>
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" stroke-width="0" fill="url(#:R56hdsqla:)"></rect>
                                        <svg x="50%" y="16" className="overflow-visible">
                                            <rect stroke-width="0" width="73" height="57" x="0" y="56"></rect>
                                            <rect stroke-width="0" width="73" height="57" x="72" y="168"></rect>
                                        </svg>
                                    </svg>
                                </div>
                                <div
                                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D7EDEA] to-[#F4FBDF] transition duration-300 opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
                                    style={{ maskImage: "radial-gradient(180px at 236px 36px, white, transparent)" }}
                                ></div>
                                <div className="absolute inset-0 rounded-2xl mix-blend-overlay transition duration-300 opacity-100" style={{ maskImage: "radial-gradient(180px at 130px 36px, white, transparent)" }}>
                                    <svg aria-hidden="true" className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10">
                                        <defs>
                                            <pattern id=":R1d6hdsqla:" width="72" height="56" patternUnits="userSpaceOnUse" x="50%" y="16">
                                                <path d="M.5 56V.5H72" fill="none"></path>
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" stroke-width="0" fill="url(#:R1d6hdsqla:)"></rect>
                                        <svg x="50%" y="16" className="overflow-visible">
                                            <rect stroke-width="0" width="73" height="57" x="0" y="56"></rect>
                                            <rect stroke-width="0" width="73" height="57" x="72" y="168"></rect>
                                        </svg>
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center justify-between relative">
                                <div className="space-y-2">
                                    <div className="text-5xl font-bold text-zinc-100">500</div>
                                    <div className="text-xs text-zinc-400 font-semibold uppercase">
                                        Includes <span className="text-jade-400">40 free</span> tickets
                                    </div>
                                </div>
                                <div className="py-1">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-zinc-900 bg-jade-400 hover:bg-jade-500 xl:min-w-48"
                                    >
                                        BUY
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex flex-col p-4 border border-zinc-800 rounded-xl hover:border-zinc-700 gap-2 mt-5">
                            <div className="flex items-center gap-4 justify-between">
                                <div className="text-sm text-zinc-300">Current Tickets</div>
                                <div className="text-sm text-zinc-300">
                                    <span className="text-lg text-zinc-300">0</span> (0% of Total)
                                </div>
                            </div>
                            <div className="flex items-center gap-4 justify-between">
                                <div className="text-sm text-zinc-300">Remaining Available Tickets</div>
                                <div className="text-lg text-zinc-300">500</div>
                            </div>
                        </div> */}

                        {/* <p className="text-xs text-zinc-400 text-center mt-5">All entries require gas.</p> */}
                        {/* <div className="my-6 flex gap-2.5 rounded-xl border p-4 leading-6 border-emerald-500/30 bg-emerald-500/5 text-emerald-200 [--tw-prose-links-hover:theme(colors.emerald.300)] [--tw-prose-links:theme(colors.white)]">
                            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 flex-none  fill-emerald-200/20 stroke-emerald-200">
                                <circle cx="8" cy="8" r="8" stroke-width="0"></circle>
                                <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 7.75h1.5v3.5"></path>
                                <circle cx="8" cy="4" r=".5" fill="none"></circle>
                            </svg>
                            <div className="text-xs">
                                <p>All entries require gas.</p>
                            </div>
                        </div> */}
                    </div>
                    <div className="">
                        <Activity />
                    </div>
                    <div className="">
                        <Participants />
                    </div>
                </div>
            </div>
        </>
    );
}
