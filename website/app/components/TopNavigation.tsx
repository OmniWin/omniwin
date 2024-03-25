"use client";

/* Core */
import Link from "next/link";
// import { usePathname } from "next/navigation";

/* Instruments */
// import styles from "../styles/layout.module.css";

import { classNames } from "../utils/index";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Search } from "./Search";
import WalletConnect from "./Wallet/WalletConnect";

import { useDispatch, sidebarSlice } from "@/lib/redux";

import { useState, useEffect } from "react";
// import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from "wagmi";

import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";

// const userNavigation = [
//     { name: "Your profile", href: "#" },
//     { name: "Sign out", href: "#" },
// ];
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button";

export const TopNavigation = () => {
    const { data: session } = useSession()
    // console.log('lululululu', session)

    // const pathname = usePathname();
    // const dispatch = useDispatch();
    const account = useAccount();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    // useEffect(() => {
    //     if (account && account.status === "connected") {
    //         // dispatch(userSettingsSlice.actions.setUser(account));
    //     }
    // }, [account]);

    return (
        <>
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-zinc-950 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <Link href="/" className="font-himagsikan text-[#6cf60f] text-4xl inline-flex items-center gap-3 hue-rotate-[45deg] sm:hidden">
                    <img className="h-10  w-auto" src="/images/omniwin-logo.png" alt="Your Company" />
                    {/* <span
                        style={{
                            // "-webkit-text-stroke-width": "1px",
                            // "-webkit-text-stroke-color": "black",
                            WebkitTextStrokeWidth: "1px",
                            WebkitTextStrokeColor: "black",
                        }}
                    >
                        OmniWin
                    </span> */}
                </Link>
                {/* <button type="button" className="-m-2.5 p-2.5 text-zinc-700 lg:hidden" onClick={() => dispatch(sidebarSlice.actions.setSidebarOpenState(true))}>
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Separator */}
                {/* <div className="h-6 w-px bg-zinc-950/10 lg:hidden" aria-hidden="true" /> */}

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form className="relative flex flex-1" action="#" method="GET">
                        {/* <label htmlFor="search-field" className="sr-only">
                            Search
                        </label>
                        <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-2 h-full w-5 text-zinc-400" aria-hidden="true" />
                        <input
                            id="search-field"
                            className="block border-0 py-0 pl-10 pr-2 text-white placeholder:text-zinc-400 focus:ring-2 sm:text-sm bg-zinc-900 my-2 rounded-md shadow-sm ring-1 ring-inset ring-zinc-800 sm:leading-6"
                            placeholder="Search..."
                            type="search"
                            name="search"
                            autoComplete="off"
                        /> */}
                        <button
                            onClick={() => setOpen(true)}
                            type="button"
                            className="min-w-72 my-3 hidden w-auto lg:flex items-center text-sm leading-6 text-zinc-400 rounded-md ring-1 ring-zinc-900/10 shadow-sm py-1.5 pl-2 pr-3 ring-zinc-700 bg-zinc-900 highlight-white/5 hover:bg-zinc-800"
                        >
                            <svg width="24" height="24" fill="none" aria-hidden="true" className="mr-3 flex-none">
                                <path d="m19 19-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></circle>
                            </svg>
                            Quick search...<span className="ml-auto pl-3 flex-none text-xs font-semibold">Ctrl K</span>
                        </button>
                    </form>
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        <button onClick={() => setOpen(true)} type="button" className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500 block lg:hidden">
                            <span className="sr-only">Quick search</span>
                            <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        {/* <button type="button" className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500">
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button> */}

                        {/* Separator */}
                        {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-950/10" aria-hidden="true" /> */}

                        <WalletConnect />
                        {/* <w3m-button /> */}
                        {/* Profile dropdown */}
                        {/* <Menu as="div" className="relative">
                            <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="h-8 w-8 rounded-full bg-zinc-50"
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt=""
                                />
                                <span className="hidden lg:flex lg:items-center">
                                    <span className="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">
                                        Tom Cook
                                    </span>
                                    <ChevronDownIcon className="ml-2 h-5 w-5 text-zinc-400" aria-hidden="true" />
                                </span>
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-zinc-950 py-2 shadow-lg ring-1 ring-zinc-950/5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                        <Menu.Item key={item.name}>
                                            {({ active }) => (
                                                <a href={item.href} className={classNames(active ? "bg-zinc-50" : "", "block px-3 py-1 text-sm leading-6 text-white")}>
                                                    {item.name}
                                                </a>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu> */}
                    </div>
                </div>
            </div>
            <Search open={open} setOpen={setOpen} />
        </>
    );
};
