// "use client";

/* Core */
import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames } from "../utils/index";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { CalendarIcon, ChartPieIcon, Cog6ToothIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, UsersIcon, XMarkIcon, BookOpenIcon, PlusCircleIcon, TrophyIcon, UserIcon, InformationCircleIcon, TicketIcon, RectangleStackIcon, HeartIcon, QuestionMarkCircleIcon, ChartBarIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";

import { useSelector, useDispatch, sidebarSlice } from "@/lib/redux";
import { selectSidebarOpenState, selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";

const navigation = [
    { name: "Home", href: "#", icon: HomeIcon, current: true },
    { name: "Explore", href: "raffles", icon: BookOpenIcon, current: false },
    {
        name: "Account",
        icon: UsersIcon,
        current: false,
        children: [
            { name: "Engineering", href: "#", current: false },
            { name: "Human Resources", href: "#", current: false },
            { name: "Customer Success", href: "#", current: false },
        ],
    },
    {
        name: "Challenges",
        icon: TrophyIcon,
        current: false,
        children: [
            { name: "Engineering", href: "#", current: false },
            { name: "Human Resources", href: "#", current: false },
        ],
    },
];


export const SidebarNavigation = () => {
    const path = usePathname();
    const [navigation, setNavigation] = useState([
        { name: "Home", href: "/", icon: HomeIcon, current: true, children: null },
        { name: "Explore", href: "/raffles", icon: BookOpenIcon, current: false, children: null },
        {
            name: "Challenges",
            icon: TrophyIcon,
            current: false,
            children: [
                { name: "List", href: "#", current: false, icon: TableCellsIcon },
                { name: "Leaderboard", href: "#", current: false, icon: ChartBarIcon },
            ],
        },
        {
            name: "Account",
            icon: UserIcon,
            current: false,
            children: [
                { name: "Profile", href: "#", current: false, icon: InformationCircleIcon },
                { name: "Inventory", href: "#", current: false, icon: RectangleStackIcon },
                { name: "Tickets", href: "#", current: false, icon: TicketIcon },
                { name: "Favorites", href: "#", current: false, icon: HeartIcon },
                { name: "Settings", href: "#", current: false, icon: Cog6ToothIcon },
                { name: "Support", href: "#", current: false, icon: QuestionMarkCircleIcon },
            ],
        },
    ] as { name: string; href: string; icon: any; current: boolean; children: null | { name: string; href: string; current: boolean, icon: any }[] }[]);

    // const pathname = usePathname();
    const dispatch = useDispatch();
    const sidebarOpenState = useSelector(selectSidebarOpenState);
    const sidebarToggleState = useSelector(selectSidebarToggleState);

    useEffect(() => {
        const storedIsSidebarOpen = JSON.parse(localStorage.getItem("toggleSidebar") || "false");
        dispatch(sidebarSlice.actions.setSidebarOpenState(storedIsSidebarOpen));

        const storedIsSidebarToggle = JSON.parse(localStorage.getItem("toggleSidebar") || "false");
        dispatch(sidebarSlice.actions.setSidebarToggleState(storedIsSidebarToggle));
    }, [dispatch]);

    useEffect(() => {
        if (path === "/") {
            setNavigation([
                { name: "Home", href: "/", icon: HomeIcon, current: true, children: null },
                { name: "Explore", href: "/raffles", icon: BookOpenIcon, current: false, children: null },
            ]);
        } else if (path === "/raffles") {
            setNavigation([
                { name: "Home", href: "/", icon: HomeIcon, current: false, children: null },
                { name: "Explore", href: "/raffles", icon: BookOpenIcon, current: true, children: null },
            ]);
        }
    }, [path]);

    // If user clicks inside the sidebar switch the toggle state to !toggleSidebar
    useEffect(() => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
            const handleClick = (event: Event) => {
                // event.preventDefault();
                // event.stopPropagation();
                // If is not a link
                if ((event.target as Element) && !(event.target as Element).closest("a") && !(event.target as Element).closest("button")) {
                    dispatch(sidebarSlice.actions.setSidebarToggleState(!sidebarToggleState.toggleSidebar));
                }
            };

            sidebar.addEventListener("click", handleClick);

            return () => {
                sidebar.removeEventListener("click", handleClick);
            };
        }
    }, [sidebarToggleState.toggleSidebar]); // Empty dependency array


    return (
        <>
            <Transition.Root show={sidebarOpenState.isSidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={() => dispatch(sidebarSlice.actions.setSidebarOpenState(false))}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-zinc-950/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => dispatch(sidebarSlice.actions.setSidebarOpenState(false))}>
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6 pb-4 ring-1 ring-white/10">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul role="list" className="-mx-2 space-y-1">
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            {!item.children ? (
                                                                <Link
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current ? "text-jade-400" : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                                    )}
                                                                >
                                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                    {item.name}
                                                                </Link>
                                                            ) : (
                                                                <Disclosure as="div">
                                                                    {({ open }) => (
                                                                        <>
                                                                            <Disclosure.Button
                                                                                className={classNames(
                                                                                    item.current ? "text-jade-400" : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                                                                                    "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"
                                                                                )}
                                                                            >
                                                                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                                {item.name}
                                                                                <ChevronRightIcon
                                                                                    className={classNames(open ? "rotate-90 text-zinc-500" : "text-zinc-400", "ml-auto h-5 w-5 shrink-0")}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </Disclosure.Button>
                                                                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                                                                                {item.children &&
                                                                                    item.children.map((subItem) => (
                                                                                        <li key={subItem.name}>
                                                                                            {/* 44px */}
                                                                                            <Disclosure.Button
                                                                                                as={Link}
                                                                                                href={subItem.href}
                                                                                                className={classNames(
                                                                                                    subItem.current ? "text-jade-400" : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                                                                                                    "block rounded-md py-2 pr-2 pl-9 text-sm leading-6"
                                                                                                )}
                                                                                            >
                                                                                                {subItem.name}
                                                                                            </Disclosure.Button>
                                                                                        </li>
                                                                                    ))}
                                                                            </Disclosure.Panel>
                                                                        </>
                                                                    )}
                                                                </Disclosure>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                            <li className="-mx-6 mt-auto">
                                                <a href="#" className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-zinc-950 hover:bg-zinc-50">
                                                    <img
                                                        className="h-8 w-8 rounded-full bg-zinc-50"
                                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                        alt=""
                                                    />
                                                    <span className="sr-only">Your profile</span>
                                                    <span aria-hidden="true">Tom Cook</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 group-[parent]`}>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                {/* <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-950 px-6 pb-4"> */}
                <div className={classNames("flex h-16 shrink-0 items-center", sidebarOpenState.toggleSidebar ? "ml-3" : "self-center")}>
                    <img className="h-8  w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                </div>
                <div className={`group flex grow flex-col bg-zinc-950 pb-4 relative transition-all duration-300 ${sidebarOpenState.toggleSidebar ? "px-4 w-[64px] hover:!w-72 " : "pl-4 pr-4 lg:w-72"}`}>
                    <nav className="flex flex-1 flex-col sidebar relative">
                        {/* <div className="md:opacity-100 w-4 transition-opacity duration-300 absolute -right-6 top-1/2 transform -translate-y-1/2">
                            <button
                                onClick={() => dispatch(sidebarSlice.actions.setSidebarToggleState(!sidebarToggleState.toggleSidebar))}
                                className="hidden rounded-md bg-zinc-950 px-0.5 py-[8px] md:block focus:outline-none"
                            >
                                {sidebarToggleState.toggleSidebar ? <ChevronRightIcon className="h-6 w-6 text-zinc-400" aria-hidden="true" /> : <ChevronLeftIcon className="h-6 w-6 text-zinc-400" aria-hidden="true" />}
                            </button>
                        </div> */}
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            {!item.children ? (
                                                <Link
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current ? "text-jade-400" : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-300"
                                                        // sidebarToggleState.toggleSidebar ? "pl-3" : ""
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                    {/* {sidebarToggleState.toggleSidebar ? "" : item.name} */}
                                                    <span className={classNames(sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100", "transition-all duration-300")}>
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            ) : (
                                                <Disclosure as="div">
                                                    {({ open }) => (
                                                        <>
                                                            <Disclosure.Button
                                                                className={classNames(
                                                                    item.current ? "text-jade-400" : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                                                                    // sidebarToggleState.toggleSidebar ? "pl-3" : "",
                                                                    "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"
                                                                )}
                                                            >
                                                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                                                {/* {sidebarToggleState.toggleSidebar ? "" : item.name} */}
                                                                <span className={classNames(sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100", "transition-all duration-300")}>
                                                                    {item.name}
                                                                </span>
                                                                <ChevronRightIcon
                                                                    className={classNames(
                                                                        open ? "rotate-90 text-zinc-500" : "text-zinc-400",
                                                                        sidebarToggleState.toggleSidebar ? "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100" : "",
                                                                        "ml-auto h-5 w-5 shrink-0 transition-all duration-300"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel as="ul" className="mt-1">
                                                                {item.children &&
                                                                    item.children.map((subItem) => (
                                                                        <li key={subItem.name}>
                                                                            {/* 44px */}
                                                                            <Disclosure.Button
                                                                                as="a"
                                                                                href={subItem.href}
                                                                                className={classNames(
                                                                                    subItem.current ? "text-jade-400" : "text-zinc-400/90 hover:bg-zinc-800 hover:text-white",
                                                                                    subItem.icon && "pl-2",
                                                                                    !sidebarToggleState.toggleSidebar && "!pl-10",
                                                                                    "rounded-md py-2 pr-2 text-sm leading-6 flex items-center w-full group-hover:pl-10 transition-all duration-300 self-center mx-auto gap-x-3"
                                                                                )}
                                                                            >
                                                                                {subItem.icon && <subItem.icon className="h-6 w-6 shrink-0" aria-hidden="true" />}

                                                                                <span
                                                                                    className={classNames(
                                                                                        sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100",
                                                                                        "transition-[padding] duration-300"
                                                                                    )}
                                                                                >
                                                                                    {subItem.name}
                                                                                </span>
                                                                            </Disclosure.Button>
                                                                        </li>
                                                                    ))}
                                                            </Disclosure.Panel>
                                                        </>
                                                    )}
                                                </Disclosure>
                                            )}
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            className={classNames(
                                                "w-full group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                                                // sidebarToggleState.toggleSidebar ? "pl-3" : ""
                                            )}
                                        >
                                            <PlusCircleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                            {/* {sidebarToggleState.toggleSidebar ? "" : item.name} */}
                                            <span className={classNames(sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100", "transition-all duration-300")}>Create</span>
                                        </button>
                                    </li>
                                </ul>
                            </li>
                            {/* <li className="mt-auto">
                                <a
                                    href="#"
                                    className={classNames("group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-200 hover:bg-zinc-800 hover:text-white", 
                                        // sidebarToggleState.toggleSidebar ? "pl-3" : ""
                                    )}
                                >
                                    <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    <span className={classNames(sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100", "transition-all duration-300")}>{"Settings"}</span>
                                </a>
                            </li> */}
                            <li className="mt-auto">
                                <a
                                    href="#"
                                    className={classNames(
                                        "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                                        // sidebarToggleState.toggleSidebar ? "pl-3" : ""
                                    )}
                                >
                                    <QuestionMarkCircleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    <span className={classNames(sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100")}>{"Support"}</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};
