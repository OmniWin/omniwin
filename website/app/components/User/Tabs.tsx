"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Cog6ToothIcon,
    TicketIcon,
    RectangleStackIcon,
    HeartIcon,
    // QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import { classNames } from "@/app/utils";

interface TabItem {
    name: string;
    href: string;
    current: boolean;
    icon: any;
}

const tabs = [
    // { name: "Profile", href: "/profile", current: false, icon: InformationCircleIcon },
    { name: "Inventory", href: "/profile/inventory", current: true, icon: RectangleStackIcon },
    { name: "Tickets", href: "/profile/tickets", current: false, icon: TicketIcon },
    { name: "Favorites", href: "/profile/favorites", current: false, icon: HeartIcon },
    { name: "Settings", href: "/profile/settings", current: false, icon: Cog6ToothIcon },
    // { name: "Support", href: "#", current: false, icon: QuestionMarkCircleIcon },
];

export default function UserTabs() {
    const path = usePathname();
    const [navigation, setNavigation] = useState(tabs as TabItem[]);

    useEffect(() => {
        console.log(path)
        setNavigation((navigation: TabItem[]) =>
            navigation.map((navItem: TabItem) => ({
                ...navItem,
                current: navItem.href === path
            }))
        );
    }, [path]);

    return (
        <>
            {/* <div className="mx-auto max-w-5xl 2xl:max-w-7xl 3xl:max-w-8xl px-4 sm:px-6 lg:px-8 relative z-[2] py-10">
                <nav className="flex space-x-4" aria-label="Tabs">
                    {tabs.map((tab, key) => (
                        <Link key={tab.name} href={tab.href}>
                            <Button variant={tab.current ? "soft" : "ghost"}>{tab.name}</Button>
                        </Link>
                    ))}
                </nav>
            </div> */}

            <div className="sticky -top-[45px] bg-zinc-900 z-[30] border-b border-zinc-800 -mx-3 md:-mx-12">
                <div className="mx-auto max-w-5xl 2xl:max-w-7xl 3xl:max-w-8xl px-4 sm:px-6 lg:px-8 relative z-[2]">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {navigation.map((tab) => (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                    tab.current ? "border-emerald-500 text-emerald-600" : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-300",
                                    "group inline-flex items-center border-b-2 py-6 px-1 text-sm font-medium"
                                )}
                                aria-current={tab.current ? "page" : undefined}
                            >
                                <tab.icon className={classNames(tab.current ? "text-emerald-500" : "text-zinc-400 group-hover:text-zinc-300", "-ml-0.5 mr-2 h-5 w-5")} aria-hidden="true" />
                                <span>{tab.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
