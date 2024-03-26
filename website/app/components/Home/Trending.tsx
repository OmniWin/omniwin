"use client";

const trending = [
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "10,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "12,200",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/2.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/3.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1,000,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/4.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "15,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/5.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50K",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/6.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/7.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/8.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/2674.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "12.22K",
        currency: "USDC",
        image: "https://metadata.degods.com/g/1792-dead.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50K",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmUUnTTWCrnfkVCv2gU8Mpdzeu2PR867kdjWeZBCoKCUVZ",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/2029.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "12.22K",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmSxtE6WeLDVNsSnmBtADoRDWqdHMEKRSG1MXBhkiRw1jY",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50K",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmdfqpbAhx9BQrZqY1UR3RpuGUmPe2jkXMVXC9drCBjQZG",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/Qmb7rsvrzTfHhB9aJxygWhR1mSkpsTcWuqNZD1zPgP9V1D",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://metadata.degods.com/g/1570-dead.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
];

import CardSettings from "../Raffle/CardSettings";
import RaffleMetaWin from "../Raffle/RaffleMetaWin";

import { classNames } from "@/app/utils";

import { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const Trending = () => {
    const [display, setDisplay] = useState("carousel");

    return (
        <>
            {/* <div className="mt-5 grid min-h-[18rem] gap-x-[40px] gap-y-0 rounded-lg border border-smoke-800 px-6 py-6 grid-auto-fit-[18.5rem] lg:px-4 lg:py-4 2xl:px-[26px] 2xl:py-6"> */}
            {/* <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl"> */}
            <div className="">
                <div className="flex items-end justify-between w-full">
                    <div>
                        <h2 className="text-base font-semibold leading-8 text-emerald-400">The most popular NFTs</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Trending</p>
                    </div>
                    <CardSettings showStyle={false} showDisplay={true} display={display} setDisplay={setDisplay} showDisplayLabel={false} />
                </div>
                {/* <p className="mt-6 text-lg leading-8 text-gray-300">
                    These NFTs are selected based on the number of tickets raised and the number of favorites they have.
                </p> */}
            </div>

            <div className="relative">
                {display === 'grid' && <div
                    className={classNames(
                        "relative flex flex-wrap sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-x-3 gap-y-4 lg:gap-y-3 mt-8 xl:mt-12",
                    )}
                >
                    {trending.map((item) => (
                        <>
                            <div className="w-[calc(33%-.45rem)] sm:w-auto inline-block">
                                <RaffleMetaWin {...item} />
                            </div>
                        </>
                    ))}
                </div>}
                {display === 'carousel' &&
                    <>
                    <Carousel className="mt-8 xl:mt-12" opts={{
                        // loop: true,
                        dragFree: true,
                    }}>
                        <CarouselContent className="-ml-1">
                            {trending.map((item, key) => (
                                <>
                                    <CarouselItem className={classNames("basis-1/3 lg:basis-1/4 xl:basis-1/6 2xl:basis-[10%] lg:pl-6 pl-0", key === 0 && 'xl:!pl-2')}>
                                        <div className="hardware-accelerate">
                                            <RaffleMetaWin {...item} />
                                        </div>
                                    </CarouselItem>
                                </>
                            ))}
                        </CarouselContent>
                        <div className="absolute top-0 z-10 w-14 h-full to-transparent cursor-pointer group transition-all before:to-transparent before:absolute before:top-0 before:w-full before:h-full before:opacity-0 hover:before:opacity-100 before:transition-all overflow-hidden from-zinc-900/90 before:from-zinc-900/90 left-0 lg:-left-2 bg-gradient-to-r before:left-0 before:bg-gradient-to-r -translate-x-2">
                            <CarouselPrevious className="left-0 transition-all group-hover:scale-110" />
                        </div>
                        <div className="absolute top-0 z-10 w-14 h-full to-transparent cursor-pointer group transition-all before:to-transparent before:absolute before:top-0 before:w-full before:h-full before:opacity-0 hover:before:opacity-100 before:transition-all overflow-hidden from-zinc-900/90 before:from-zinc-900/90 right-0 lg:-right-2 bg-gradient-to-l before:right-0 before:bg-gradient-to-l translate-x-2">
                            <CarouselNext className="right-0 transition-all group-hover:scale-110" />
                        </div>
                    </Carousel>
                    </>}
            </div>
        </>
    );
};
