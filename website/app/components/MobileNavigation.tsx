"use client";

/* Core */
import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames } from "../utils/index";
import { useState, useEffect, useRef } from "react";

import { HomeIcon, BookOpenIcon, UserCircleIcon, PlusIcon, AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@nextui-org/react";

export const MobileNavigation = ({ mainRef }: { mainRef: React.RefObject<HTMLDivElement> }) => {
    const pathname = usePathname();

    const [scrollUp, setScrollUp] = useState(true);
    const lastScrollPositionRef = useRef(0);
    const throttleTimeout = useRef<any>(null); // Ref for storing the timeout

    // If user scrolls down then hide the bottom navigation else show it
    // Based on the currentScrollPosition and the lastScrollPosition
    const handleScroll = () => {
        if (mainRef.current) {
            const currentScrollPosition = mainRef.current.scrollTop;

            if (currentScrollPosition === 0) {
                setScrollUp(true);
            } else if (currentScrollPosition > lastScrollPositionRef.current) {
                setScrollUp(false);
            } else {
                setScrollUp(true);
            }

            lastScrollPositionRef.current = currentScrollPosition;
        }
    };

    const throttledScrollHandler = () => {
        if (!throttleTimeout.current) {
            throttleTimeout.current = setTimeout(() => {
                handleScroll();
                throttleTimeout.current = null;
            }, 100); // Adjust the 100ms to increase or decrease the throttle rate
        }
    };

    useEffect(() => {
        const mainElement = mainRef.current;
        if (mainElement) {
            mainElement.addEventListener("scroll", throttledScrollHandler, { passive: true });

            return () => {
                if (throttleTimeout.current) {
                    clearTimeout(throttleTimeout.current);
                }
                mainElement.removeEventListener("scroll", throttledScrollHandler);
            };
        }
    }, []); // Empty dependency array

    return (
        <>
            <div
                className={classNames(
                    scrollUp ? "bottom-0" : "-bottom-20",
                    // "fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-zinc-200 rounded-full left-1/2 dark:bg-zinc-950 dark:border-zinc-800/70 transition-all duration-300 shadow-sm shadow-zinc-900/10 dark:shadow-zinc-900/20 block sm:hidden"
                    "fixed z-50 w-full h-20 max-w-lg -translate-x-1/2 bg-white border border-zinc-200 rounded-t-lg left-1/2 dark:bg-zinc-950 dark:border-zinc-800/70 transition-all duration-300 shadow-sm shadow-zinc-900/10 dark:shadow-zinc-900/20 block sm:hidden"
                )}
            >
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
                    <Link href="/" className="inline-flex gap-y-2 flex-col items-center justify-center px-5 group">
                        {/* <HomeIcon className="w-7 h-7 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" /> */}
                        <svg className="h-7 w-7 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path
                                className="fill-zinc-700"
                                d="M64 270.5L64.1 448c0 35.3 28.7 64 64 64H448.5c35.4 0 64.1-28.7 64-64.1l-.4-177.3L288 74.5 64 270.5zM288 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM176 432c0-44.2 35.8-80 80-80h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H192c-8.8 0-16-7.2-16-16z"
                            />
                            <path
                                className={classNames([pathname === '/' ? 'fill-emerald-400' : 'fill-zinc-400'])}
                                d="M266.9 7.9C279-2.6 297-2.6 309.1 7.9l256 224c13.3 11.6 14.6 31.9 3 45.2s-31.9 14.6-45.2 3L288 74.5 53.1 280.1c-13.3 11.6-33.5 10.3-45.2-3s-10.3-33.5 3-45.2l256-224zM224 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm32 96h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H192c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80z"
                            />
                        </svg>
                        {/* <span className="sr-only">Home</span> */}
                        <span className={classNames(pathname === '/' ? 'text-emerald-400' : 'text-zinc-400','text-xs')}>Home</span>
                    </Link>
                    <Link href="/raffles" className="inline-flex gap-y-2 flex-col items-center justify-center px-5 group">
                        {/* <BookOpenIcon className="w-7 h-7 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" /> */}
                        <svg className="h-7 w-7 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                className="fill-zinc-700"
                                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4L162.4 380.6z"
                            />
                            <path
                                className={classNames([pathname.includes('/raffles')  ? 'fill-emerald-400' : 'fill-zinc-400'])}
                                d="M162.4 380.6l144.3-55.5c8.5-3.3 15.1-9.9 18.4-18.4l55.5-144.3c7.5-19.4-11.6-38.5-31-31L205.3 186.9c-8.5 3.3-15.1 9.9-18.4 18.4L131.4 349.6c-7.5 19.4 11.6 38.5 31 31zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                            />
                        </svg>
                        {/* <span className="sr-only">Explore</span> */}
                        <span className={classNames(pathname.includes('/raffles')  ? 'text-emerald-400' : 'text-zinc-400','text-xs')}>Explore</span>
                    </Link>
                    {/* <div className="flex items-center justify-center"> */}
                    <div className="inline-flex gap-y-2 flex-col items-center justify-center px-5 group">
                        <button
                            type="button"
                            className={classNames('inline-flex items-center justify-center w-7 h-7 font-medium rounded-full group focus:outline-none bg-zinc-700')}
                        >
                            <PlusIcon className="w-5 h-5 text-zinc-200" aria-hidden="true" />
                        </button>
                        <span className={classNames('text-zinc-400','text-xs')}>Create</span>
                    </div>
                    <Link href="/challenges/list" className="inline-flex gap-y-2 flex-col items-center justify-center px-5 group">
                        {/* <AdjustmentsVerticalIcon className="w-7 h-7 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" /> */}
                        <svg className="h-7 w-7 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path
                                className="fill-zinc-700"
                                d="M441.8 112c1.8-15.1 3.3-31.1 4.3-48H552c13.3 0 24 10.7 24 24c0 134.5-70.4 207.7-140.5 246.1c-34.5 18.9-68.8 29.3-94.3 35c-12.2 2.7-22.5 4.4-30 5.4c18.1-9.9 44.1-29.5 68.6-67.3c10.6-4.2 21.6-9.2 32.6-15.2c53.7-29.4 107.1-82 114.6-179.9H441.8zM196.1 307.2c24.5 37.8 50.6 57.4 68.6 67.3c-7.5-1-17.8-2.7-30-5.4c-25.5-5.7-59.8-16.1-94.3-35C70.4 295.7 0 222.5 0 88C0 74.7 10.7 64 24 64H129.9c1 16.9 2.5 32.9 4.3 48H48.9c7.5 97.9 60.9 150.6 114.6 179.9c11 6 22 11 32.6 15.2z"
                            />
                            <path
                                className={classNames([pathname.includes('/challenges') ? 'fill-emerald-400' : 'fill-zinc-400'])}
                                d="M256 395.5c0-16.3-8.6-31.2-20.8-42C192.2 315.3 137.3 231 129 48c-1.2-26.5 20.4-48 47-48H400c26.5 0 48.1 21.6 47 48c-8.2 183-63.2 267.2-106.2 305.4c-12.2 10.8-20.8 25.7-20.8 42V400c0 26.5 21.5 48 48 48h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32h16c26.5 0 48-21.5 48-48v-4.5z"
                            />
                        </svg>
                        {/* <span className="sr-only">Settings</span> */}
                        <span className={classNames(pathname.includes('/challenges') ? 'text-emerald-400' : 'text-zinc-400','text-xs')}>Challenges</span>
                    </Link>
                    <Link href="/profile/settings" className="inline-flex gap-y-2 flex-col items-center justify-center px-5 group">
                        {/* <UserCircleIcon className="w-7 h-7 text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" /> */}
                        <svg className="h-7 w-7 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path
                                className="fill-zinc-700"
                                d="M176 112H120c-7.9 0-15.5-1.7-22.3-4.6C96.6 114.1 96 121 96 128c0 70.7 57.3 128 128 128s128-57.3 128-128c0-11-1.4-21.8-4-32H312c-22.8 0-42.8-11.9-54.1-29.8C241 93.7 210.6 112 176 112z"
                            />
                            <path
                                className={classNames([pathname.includes('/profile') ? 'fill-emerald-400' : 'fill-zinc-400'])}
                                d="M120 112h56c34.6 0 65-18.3 81.9-45.8C269.2 84.1 289.2 96 312 96h36C333.8 40.8 283.6 0 224 0C160.3 0 107.5 46.5 97.7 107.4c6.8 3 14.4 4.6 22.3 4.6zm25.9 202.9c-3.5-5.2-9.8-8-15.9-6.6C55.5 325.5 0 392.3 0 472v8c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32v-8c0-79.7-55.5-146.5-130-163.7c-6.1-1.4-12.4 1.4-15.9 6.6L237.3 412c-6.3 9.5-20.3 9.5-26.6 0l-64.8-97.1z"
                            />
                        </svg>
                        {/* <span className="sr-only">Profile</span> */}
                        <span className={classNames(pathname.includes('/profile') ? 'text-emerald-400' : 'text-zinc-400','text-xs')}>Profile</span>
                    </Link>
                </div>
            </div>
        </>
    );
};
