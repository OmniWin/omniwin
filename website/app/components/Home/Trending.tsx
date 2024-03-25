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

import { ChevronLeft, ChevronRight } from "lucide-react";
import CardSettings from "../Raffle/CardSettings";
import RaffleMetaWin from "../Raffle/RaffleMetaWin";

import { classNames } from "@/app/utils";

import { useState, useEffect, useRef } from "react";

export const Trending = () => {
    const [display, setDisplay] = useState("grid");
    const [isGrabbing, setIsGrabbing] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [totalScrollWidth, setTotalScrollWidth] = useState(0);
    const [initialMousePosition, setInitialMousePosition] = useState<number | null>(null);
    const [velX, setVelX] = useState(0);
    const momentumID = useRef<number | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (carouselRef.current) {
            console.log(carouselRef);
            setTotalScrollWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, [display]);

    const scrollAmount = 650; // Adjust based on your needs

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const handleScroll = () => {
        if (carouselRef.current) {
            setScrollPosition(carouselRef.current.scrollLeft);
        }
    };

    // Add this effect to attach the scroll event listener
    useEffect(() => {
        const currentCarousel = carouselRef.current;
        currentCarousel?.addEventListener("scroll", handleScroll);

        return () => currentCarousel?.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsGrabbing(true);
        setInitialMousePosition(e.clientX);
    };

    const handleMouseUp = () => {
        setIsGrabbing(false);
        setInitialMousePosition(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isGrabbing && initialMousePosition !== null && carouselRef.current) {
            const currentMouseX = e.clientX;
            const moveDistance = currentMouseX - initialMousePosition;

            carouselRef.current.scrollLeft -= moveDistance;

            // Update lastMouseX for the next move
            setInitialMousePosition(currentMouseX);
        }
    };

    return (
        <>
            {/* <div className="mt-5 grid min-h-[18rem] gap-x-[40px] gap-y-0 rounded-lg border border-smoke-800 px-6 py-6 grid-auto-fit-[18.5rem] lg:px-4 lg:py-4 2xl:px-[26px] 2xl:py-6"> */}
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <h2 className="text-base font-semibold leading-8 text-emerald-400">The most popular NFTs</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Trending</p>
                {/* <p className="mt-6 text-lg leading-8 text-gray-300">
                    These NFTs are selected based on the number of tickets raised and the number of favorites they have.
                </p> */}
            </div>

            <CardSettings showStyle={false} showDisplay={true} display={display} setDisplay={setDisplay} />

            <div className="relative">
                <div
                    ref={carouselRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={(e) => handleMouseMove(e)}
                    onMouseLeave={handleMouseUp}
                    className={classNames(
                        "relative flex flex-wrap sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 sm:gap-x-3 gap-y-4 lg:gap-y-3 mt-8 xl:mt-12",
                        display === "carousel" && "!flex !flex-nowrap overscroll-x-contain overflow-x-scroll no-scrollbar snap-x w-[calc(100%-.5rem)]",
                        isGrabbing && "cursor-grabbing"
                    )}
                >
                    {trending.map((item) => (
                        <>
                            <span className={classNames(display === "carousel" && "w-[calc(33%-.45rem)] sm:w-[calc(16.66%-.55rem)] inline-block shrink-0 grow-0 hardware-accelerate", isGrabbing && "pointer-events-none")}>
                                <RaffleMetaWin {...item} />
                            </span>
                        </>
                    ))}
                </div>
                {display === "carousel" && (
                    <>
                        {scrollPosition < totalScrollWidth && (
                            <button
                                onClick={scrollRight}
                                className="absolute top-0 z-10 w-14 h-full to-transparent cursor-pointer group transition-all before:to-transparent before:absolute before:top-0 before:w-full before:h-full before:opacity-0 hover:before:opacity-100 before:transition-all overflow-hidden from-zinc-900/90 before:from-zinc-900/90 right-0 bg-gradient-to-l before:right-0 before:bg-gradient-to-l translate-x-2"
                            >
                                <ChevronRight className="w-6 h-6 text-white font-bold transition-all group-hover:scale-110 absolute top-1/2 -translate-y-1/2 drop-shadow-xl text-4xl right-0 -translate-x-1" />
                            </button>
                        )}
                        {scrollPosition > 0 && (
                            <button
                                onClick={scrollLeft}
                                className="absolute top-0 z-10 w-14 h-full to-transparent cursor-pointer group transition-all before:to-transparent before:absolute before:top-0 before:w-full before:h-full before:opacity-0 hover:before:opacity-100 before:transition-all overflow-hidden from-zinc-900/90 before:from-zinc-900/90 left-0 bg-gradient-to-r before:left-0 before:bg-gradient-to-r -translate-x-2"
                            >
                                <ChevronLeft className="w-6 h-6 text-white font-bold transition-all group-hover:scale-110 absolute top-1/2 -translate-y-1/2 drop-shadow-xl text-4xl left-0 translate-x-1" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
