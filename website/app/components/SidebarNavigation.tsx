"use client";

/* Core */
// import Link from "next/link";
// import { usePathname } from "next/navigation";

import { classNames } from "../utils/index";

import { Fragment, useEffect } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { CalendarIcon, ChartPieIcon, Cog6ToothIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, UsersIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { useSelector, useDispatch, sidebarSlice } from "@/lib/redux";
import { selectSidebarOpenState, selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";

const navigation = [
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    {
        name: "Teams",
        icon: UsersIcon,
        current: false,
        children: [
            { name: "Engineering", href: "#" },
            { name: "Human Resources", href: "#" },
            { name: "Customer Success", href: "#" },
        ],
    },
    {
        name: "Projects",
        icon: FolderIcon,
        current: false,
        children: [
            { name: "GraphQL API", href: "#" },
            { name: "iOS App", href: "#" },
            { name: "Android App", href: "#" },
            { name: "New Customer Portal", href: "#" },
        ],
    },
    { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
    { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
    { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
const teams = [
    { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
    { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
    { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

export const SidebarNavigation = () => {
    // const pathname = usePathname();
    const dispatch = useDispatch();
    const sidebarOpenState = useSelector(selectSidebarOpenState);
    const sidebarToggleState = useSelector(selectSidebarToggleState);

    useEffect(() => {
        const storedIsSidebarOpen = JSON.parse(localStorage.getItem("isSidebarOpen") || "false");
        dispatch(sidebarSlice.actions.setSidebarOpenState(storedIsSidebarOpen));

        const storedIsSidebarToggle = JSON.parse(localStorage.getItem("isSidebarToggle") || "false");
        dispatch(sidebarSlice.actions.setSidebarToggleState(storedIsSidebarToggle));
    }, [dispatch]);

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
                        <div className="fixed inset-0 bg-smoke-950/80" />
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
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => dispatch(sidebarSlice.actions.setSidebarOpenState(false))}>
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-smoke-950 px-6 pb-4 ring-1 ring-white/10">
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
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current ? "bg-smoke-900 text-white" : "text-smoke-400 hover:text-white hover:bg-smoke-900",
                                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                                    )}
                                                                >
                                                                    <item.icon className="h-6 w-6 shrink-0 text-smoke-400" aria-hidden="true" />
                                                                    {item.name}
                                                                </a>
                                                            ) : (
                                                                <Disclosure as="div">
                                                                    {({ open }) => (
                                                                        <>
                                                                            <Disclosure.Button
                                                                                className={classNames(
                                                                                    item.current ? "bg-smoke-900 text-white" : "text-smoke-400 hover:text-white hover:bg-smoke-900",
                                                                                    "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"
                                                                                )}
                                                                            >
                                                                                <item.icon className="h-6 w-6 shrink-0 text-smoke-400" aria-hidden="true" />
                                                                                {item.name}
                                                                                <ChevronRightIcon
                                                                                    className={classNames(open ? "rotate-90 text-smoke-500" : "text-smoke-400", "ml-auto h-5 w-5 shrink-0")}
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </Disclosure.Button>
                                                                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                                                                                {item.children.map((subItem) => (
                                                                                    <li key={subItem.name}>
                                                                                        {/* 44px */}
                                                                                        <Disclosure.Button
                                                                                            as="a"
                                                                                            href={subItem.href}
                                                                                            className={classNames(
                                                                                                subItem.current ? "bg-smoke-900 text-white" : "text-smoke-400 hover:text-white hover:bg-smoke-900",
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
                                                <a href="#" className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-smoke-950 hover:bg-smoke-50">
                                                    <img
                                                        className="h-8 w-8 rounded-full bg-smoke-50"
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
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                {/* <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-smoke-950 px-6 pb-4"> */}
                <div className="flex grow flex-col overflow-y-auto bg-smoke-950 pl-6 pr-4 pb-4">
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
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current ? "bg-smoke-900 text-white" : "text-smoke-400 hover:text-white hover:bg-smoke-900",
                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                    )}
                                                >
                                                    <item.icon className="h-6 w-6 shrink-0 text-smoke-400" aria-hidden="true" />
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <Disclosure as="div">
                                                    {({ open }) => (
                                                        <>
                                                            <Disclosure.Button
                                                                className={classNames(
                                                                    item.current ? "bg-smoke-900 text-white" : "text-smoke-400 hover:text-white hover:bg-smoke-900",
                                                                    "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"
                                                                )}
                                                            >
                                                                <item.icon className="h-6 w-6 shrink-0 text-smoke-400" aria-hidden="true" />
                                                                {item.name}
                                                                <ChevronRightIcon
                                                                    className={classNames(open ? "rotate-90 text-smoke-500" : "text-smoke-400", "ml-auto h-5 w-5 shrink-0")}
                                                                    aria-hidden="true"
                                                                />
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                                                                {item.children.map((subItem) => (
                                                                    <li key={subItem.name}>
                                                                        {/* 44px */}
                                                                        <Disclosure.Button
                                                                            as="a"
                                                                            href={subItem.href}
                                                                            className={classNames(
                                                                                subItem.current ? "bg-smoke-900 text-white" : "text-smoke-400 hover:text-white hover:bg-smoke-900",
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
                            <li className="mt-auto">
                                <a href="#" className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-smoke-400 hover:bg-smoke-900 hover:text-white">
                                    <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};
