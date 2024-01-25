"use client";

import { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utils/index";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";


const results = [
    // {
    //     id: 1,
    //     name: "Leslie Alexander",
    //     phone: "1-493-747-9031",
    //     email: "lesliealexander@example.com",
    //     role: "Co-Founder / CEO",
    //     url: "https://example.com",
    //     profileUrl: "#",
    //     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    // },
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
];

// Result types
type Result = {
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
// const recent = [results[5], results[4], results[2]];

export const Search = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { push } = useRouter();

    // const filteredresults =
    //     query === ""
    //         ? []
    //         : results.filter((result) => {
    //               return result.title.toLowerCase().includes(query.toLowerCase());
    //           });

    // Focus the input whenever the popover opens
    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    // When use press Ctrl + K, open the search bar
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "k") {
                event.stopPropagation();
                event.preventDefault();

                setOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setOpen]);

    return (
        <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery("")} appear>
            <Dialog as="div" className="relative z-50" onClose={setOpen}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    {/* add blur */}
                    <div className="fixed inset-0 bg-zinc-900 bg-opacity-30 transition-opacity backdrop-filter backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 z-50 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-zinc-800/50 overflow-hidden rounded-xl bg-zinc-900 shadow-2xl shadow-zinc-800 ring-1 ring-zinc-800 ring-opacity-50 transition-all">
                            <Combobox onChange={(result: Result) => (result ? push(`/raffle/${result.id}`) : null)} className="relative">
                                {({ activeOption }) => (
                                    <>
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-zinc-200" aria-hidden="true" />
                                            <Combobox.Input
                                                ref={inputRef}
                                                autoFocus
                                                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-zinc-100 placeholder:text-zinc-200 focus:ring-0 sm:text-sm"
                                                placeholder="Search..."
                                                onChange={(event) => setQuery(event.target.value)}
                                            />
                                        </div>

                                        {(query === "" || results.length > 0) && (
                                            <Combobox.Options as="div" static hold className="flex transform-gpu divide-x divide-zinc-800/50">
                                                <div className={classNames("max-h-110 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4", activeOption && "sm:h-110")}>
                                                    {/* {query === "" && <h2 className="mb-4 mt-2 text-xs font-semibold text-zinc-500">Recent searches</h2>} */}
                                                    <div className="-mx-2 text-sm text-zinc-300">
                                                        {results.map((result) => (
                                                            <Combobox.Option
                                                                as="div"
                                                                key={result.id}
                                                                value={result}
                                                                className={({ active }) => classNames("flex cursor-pointer select-none items-center rounded-md p-2", active && "bg-zinc-800 text-zinc-100")}
                                                            >
                                                                {({ active }) => (
                                                                    <>
                                                                        <img src={result.image} alt="" className="h-6 w-6 flex-none rounded-full" />
                                                                        <span className="ml-3 flex-auto truncate">{result.title}</span>
                                                                        {active && <ChevronRightIcon className="ml-3 h-5 w-5 flex-none text-zinc-200" aria-hidden="true" />}
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))}
                                                    </div>
                                                </div>

                                                {activeOption && (
                                                    <div className="hidden w-1/2 flex-none flex-col divide-y divide-zinc-800/50 overflow-y-auto sm:flex">
                                                        <div className="flex-none p-6 text-center">
                                                            <img src={activeOption.image} alt="" className="mx-auto h-16 w-16 rounded-full" />
                                                            <h2 className="mt-3 font-semibold text-zinc-100">
                                                                {activeOption.title} #{activeOption.id}
                                                            </h2>
                                                            <p className="text-sm leading-6 text-zinc-500">{activeOption.chain}</p>
                                                            <div className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-3xl bg-lemon-400/90 group-hover:bg-lemon-400 text-zinc-900 font-bold">
                                                                <span>{activeOption.endingIn}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-auto flex-col justify-between p-6 gap-6">
                                                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-zinc-300 items-center">
                                                                <dt className="col-end-1 font-semibold">
                                                                    <p>Price</p>
                                                                </dt>
                                                                <dd className="text-right text-zinc-100 text-xl font-semibold">
                                                                    {activeOption.price} {activeOption.currency}
                                                                </dd>
                                                                {/* <dt className="col-end-1 font-semibold text-zinc-100">URL</dt>
                                                                <dd className="truncate">
                                                                    <a href={activeOption.url} className="text-jade-600 underline">
                                                                        {activeOption.url}
                                                                    </a>
                                                                </dd>
                                                                <dt className="col-end-1 font-semibold text-zinc-100">Email</dt>
                                                                <dd className="truncate">
                                                                    <a href={`mailto:${activeOption.email}`} className="text-jade-600 underline">
                                                                        {activeOption.email}
                                                                    </a>
                                                                </dd> */}
                                                            </dl>
                                                            <div className="py-1 pb-2 gap-x-1 rounded-md bg-zinc-900/90">
                                                                <div className="flex items-center justify-between text-xs mb-1 font-bold">
                                                                    <div className="flex items-center justify-between gap-x-2 w-full">
                                                                        {/* <TicketIcon className="inline-block h-5 w-5 text-jade-400" /> */}
                                                                        <span className="text-zinc-300">Ticket sold</span>
                                                                        <div className="flex items-center space-x-1">
                                                                            <p className="text-jade-400 whitespace-nowrap">{activeOption.raisedTickets}</p>
                                                                            <p className="text-white">/</p>
                                                                            <p className="text-white">{activeOption.tickets}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="overflow-hidden rounded-xl bg-white/20 h-1 w-full">
                                                                    <div className="h-full rounded-xl bg-gradient-to-b from-jade-400 to-jade-500 w-6"></div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    type="button"
                                                                    className="w-full rounded-md bg-jade-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-jade-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade-600"
                                                                >
                                                                    Enter now
                                                                </button>
                                                                <p className="text-[11px] xl:text-xs font-bold text-zinc-300 self-center mt-3 text-center">
                                                                    <span>All entries require gas.</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Combobox.Options>
                                        )}

                                        {query !== "" && results.length === 0 && (
                                            <div className="px-6 py-14 text-center text-sm sm:px-14">
                                                <UsersIcon className="mx-auto h-6 w-6 text-zinc-200" aria-hidden="true" />
                                                <p className="mt-4 font-semibold text-zinc-100">No results found</p>
                                                <p className="mt-2 text-zinc-500">We couldn’t find anything with that term. Please try again.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
