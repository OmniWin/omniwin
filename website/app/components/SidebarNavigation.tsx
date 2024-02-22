// "use client";

/* Core */
import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames } from "../utils/index";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import {
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    BookOpenIcon,
    PlusCircleIcon,
    TrophyIcon,
    UserIcon,
    InformationCircleIcon,
    TicketIcon,
    RectangleStackIcon,
    HeartIcon,
    QuestionMarkCircleIcon,
    ChartBarIcon,
    TableCellsIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";

import { useSelector, useDispatch, sidebarSlice } from "@/lib/redux";
import { selectSidebarOpenState, selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";

interface NavigationItemChildren {
    name: string;
    href: string;
    current: boolean;
    icon: any;
}
interface NavigationItem {
    name: string;
    href: string;
    icon: any;
    current: boolean;
    children: null | NavigationItemChildren[];
}

const initialNavigation = [
    { name: "Home", href: "/", icon: HomeIcon, current: true, children: null },
    { name: "Explore", href: "/raffles", icon: BookOpenIcon, current: false, children: null },
    {
        name: "Challenges",
        icon: TrophyIcon,
        current: false,
        children: [
            { name: "List", href: "/challenges/list", current: false, icon: TableCellsIcon },
            { name: "Leaderboard", href: "/challenges/leaderboard", current: false, icon: ChartBarIcon },
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
];

const navigationIcons = [
    {
        name: "Home",
        icon: (
            <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                    className="fill-zinc-700"
                    d="M64 270.5L64.1 448c0 35.3 28.7 64 64 64H448.5c35.4 0 64.1-28.7 64-64.1l-.4-177.3L288 74.5 64 270.5zM288 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM176 432c0-44.2 35.8-80 80-80h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H192c-8.8 0-16-7.2-16-16z"
                />
                <path
                    className="fill-emerald-400"
                    d="M266.9 7.9C279-2.6 297-2.6 309.1 7.9l256 224c13.3 11.6 14.6 31.9 3 45.2s-31.9 14.6-45.2 3L288 74.5 53.1 280.1c-13.3 11.6-33.5 10.3-45.2-3s-10.3-33.5 3-45.2l256-224zM224 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm32 96h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H192c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80z"
                />
            </svg>
        ),
    },
    {
        name: "Explore",
        icon: (
            <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    className="fill-zinc-700"
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4L162.4 380.6z"
                />
                <path
                    className="fill-emerald-400"
                    d="M162.4 380.6l144.3-55.5c8.5-3.3 15.1-9.9 18.4-18.4l55.5-144.3c7.5-19.4-11.6-38.5-31-31L205.3 186.9c-8.5 3.3-15.1 9.9-18.4 18.4L131.4 349.6c-7.5 19.4 11.6 38.5 31 31zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                />
            </svg>
        ),
    },
    {
        name: "Challenges",
        icon: (
            <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path
                    className="fill-zinc-700"
                    d="M441.8 112c1.8-15.1 3.3-31.1 4.3-48H552c13.3 0 24 10.7 24 24c0 134.5-70.4 207.7-140.5 246.1c-34.5 18.9-68.8 29.3-94.3 35c-12.2 2.7-22.5 4.4-30 5.4c18.1-9.9 44.1-29.5 68.6-67.3c10.6-4.2 21.6-9.2 32.6-15.2c53.7-29.4 107.1-82 114.6-179.9H441.8zM196.1 307.2c24.5 37.8 50.6 57.4 68.6 67.3c-7.5-1-17.8-2.7-30-5.4c-25.5-5.7-59.8-16.1-94.3-35C70.4 295.7 0 222.5 0 88C0 74.7 10.7 64 24 64H129.9c1 16.9 2.5 32.9 4.3 48H48.9c7.5 97.9 60.9 150.6 114.6 179.9c11 6 22 11 32.6 15.2z"
                />
                <path
                    className="fill-emerald-400"
                    d="M256 395.5c0-16.3-8.6-31.2-20.8-42C192.2 315.3 137.3 231 129 48c-1.2-26.5 20.4-48 47-48H400c26.5 0 48.1 21.6 47 48c-8.2 183-63.2 267.2-106.2 305.4c-12.2 10.8-20.8 25.7-20.8 42V400c0 26.5 21.5 48 48 48h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32h16c26.5 0 48-21.5 48-48v-4.5z"
                />
            </svg>
        ),
        children: [
            {
                name: "List",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path
                            className="fill-zinc-700"
                            d="M4.4 256c0 12.3 4.7 24.6 14.1 33.9L64 335.5 64 400c0 26.5 21.5 48 48 48l64.5 0 45.6 45.6c18.7 18.7 49.1 18.7 67.9 0L335.5 448l64.5 0c26.5 0 48-21.5 48-48l0-64.5 45.6-45.6c18.7-18.7 18.7-49.1 0-67.9L448 176.5l0-64.5c0-26.5-21.5-48-48-48l-64.5 0L289.9 18.4c-18.7-18.7-49.1-18.7-67.9 0L176.5 64 112 64c-26.5 0-48 21.5-48 48l0 64.5L18.4 222.1C9 231.4 4.4 243.7 4.4 256zm165-89.5c-4.4 12.5 2.1 26.2 14.6 30.6s26.2-2.1 30.6-14.6l.4-1.2c1.1-3.2 4.2-5.3 7.5-5.3l58.3 0c8.4 0 15.1 6.8 15.1 15.1c0 5.4-2.9 10.4-7.6 13.1c-14.8 8.5-29.6 17-44.3 25.4c-7.5 4.3-12.1 12.2-12.1 20.8l0 13.5c0 13.3 10.7 24 24 24c13.1 0 23.8-10.5 24-23.6c10.8-6.2 21.5-12.4 32.3-18.5c19.6-11.3 31.7-32.2 31.7-54.8c0-34.9-28.3-63.1-63.1-63.1l-58.3 0c-23.7 0-44.8 14.9-52.8 37.3l-.4 1.2zM224 352a32 32 0 1 0 64 0 32 32 0 1 0 -64 0z"
                        />
                        <path
                            className="fill-emerald-400"
                            d="M222.6 128c-23.7 0-44.8 14.9-52.8 37.3l-.4 1.2c-4.4 12.5 2.1 26.2 14.6 30.6s26.2-2.1 30.6-14.6l.4-1.2c1.1-3.2 4.2-5.3 7.5-5.3l58.3 0c8.4 0 15.1 6.8 15.1 15.1c0 5.4-2.9 10.4-7.6 13.1l-44.3 25.4c-7.5 4.3-12.1 12.2-12.1 20.8l0 13.5c0 13.3 10.7 24 24 24c13.1 0 23.8-10.5 24-23.6l32.3-18.5c19.6-11.3 31.7-32.2 31.7-54.8c0-34.9-28.3-63.1-63.1-63.1l-58.3 0zM256 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                        />
                    </svg>
                ),
            },
            {
                name: "Leaderboard",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                        <path
                            className="fill-zinc-700"
                            d="M224 288c0-17.7 14.3-32 32-32H384c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32H256c-17.7 0-32-14.3-32-32V288zM0 352c0-17.7 14.3-32 32-32H160c17.7 0 32 14.3 32 32V480c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V352zm480 32H608c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V416c0-17.7 14.3-32 32-32z"
                        />
                        <path
                            className="fill-emerald-400"
                            d="M330.2 6.3l23.6 47.8 52.3 7.5c9.3 1.4 13.2 12.9 6.4 19.8l-38 36.6 9 52.1c1.4 9.3-8.2 16.5-16.8 12.2l-46.6-24.4-46.9 24.8c-8.6 4.3-18.3-2.9-16.8-12.2l9-52.1-38-37c-6.8-6.8-2.9-18.3 6.4-19.8l52.3-7.5L309.8 6.3c4.3-8.6 16.5-8.3 20.4 0z"
                        />
                    </svg>
                ),
            },
        ],
    },
    {
        name: "Account",
        icon: (
            <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                    className="fill-zinc-700"
                    d="M176 112H120c-7.9 0-15.5-1.7-22.3-4.6C96.6 114.1 96 121 96 128c0 70.7 57.3 128 128 128s128-57.3 128-128c0-11-1.4-21.8-4-32H312c-22.8 0-42.8-11.9-54.1-29.8C241 93.7 210.6 112 176 112z"
                />
                <path
                    className="fill-emerald-400"
                    d="M120 112h56c34.6 0 65-18.3 81.9-45.8C269.2 84.1 289.2 96 312 96h36C333.8 40.8 283.6 0 224 0C160.3 0 107.5 46.5 97.7 107.4c6.8 3 14.4 4.6 22.3 4.6zm25.9 202.9c-3.5-5.2-9.8-8-15.9-6.6C55.5 325.5 0 392.3 0 472v8c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32v-8c0-79.7-55.5-146.5-130-163.7c-6.1-1.4-12.4 1.4-15.9 6.6L237.3 412c-6.3 9.5-20.3 9.5-26.6 0l-64.8-97.1z"
                />
            </svg>
        ),
        children: [
            {
                name: "Profile",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path
                            className="fill-zinc-700"
                            d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                        />
                        <path className="fill-emerald-400" d="M176 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H272c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H144z" />
                    </svg>
                ),
            },
            {
                name: "Inventory",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path
                            className="fill-zinc-700"
                            d="M464 104c0-13.3-10.7-24-24-24L72 80c-13.3 0-24 10.7-24 24s10.7 24 24 24l368 0c13.3 0 24-10.7 24-24zM416 24c0-13.3-10.7-24-24-24L120 0C106.7 0 96 10.7 96 24s10.7 24 24 24l272 0c13.3 0 24-10.7 24-24z"
                        />
                        <path className="fill-emerald-400" d="M448 160c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64l384 0z" />
                    </svg>
                ),
            },
            {
                name: "Tickets",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                        <path
                            className="fill-zinc-700"
                            d="M160 32c-35.3 0-64 28.7-64 64v48c0 8.8 7.4 15.7 15.7 18.6C130.5 169.1 144 187 144 208s-13.5 38.9-32.3 45.4C103.4 256.3 96 263.2 96 272v48c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V272c0-8.8-7.4-15.7-15.7-18.6C605.5 246.9 592 229 592 208s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V96c0-35.3-28.7-64-64-64H160zm64 96l0 160H512V128H224zm-32 0c0-17.7 14.3-32 32-32H512c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V128z"
                        />
                        <path
                            className="fill-emerald-400"
                            d="M48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V360c0 66.3 53.7 120 120 120H520c13.3 0 24-10.7 24-24s-10.7-24-24-24H120c-39.8 0-72-32.2-72-72V120zm176 8H512V288H224l0-160zm-32 0V288c0 17.7 14.3 32 32 32H512c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32z"
                        />
                    </svg>
                ),
            },
            {
                name: "Favorites",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path
                            className="fill-zinc-700"
                            d="M512 416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64V416zM144 253.3c0 16.2 6.5 31.8 17.9 43.3l82.7 82.7c6.2 6.2 16.4 6.2 22.6 0l82.7-82.7c11.5-11.5 17.9-27.1 17.9-43.3c0-33.8-27.4-61.3-61.3-61.3c-16.2 0-31.8 6.5-43.3 17.9l-7.4 7.4-7.4-7.4c-11.5-11.5-27.1-17.9-43.3-17.9c-33.8 0-61.3 27.4-61.3 61.3z"
                        />
                        <path
                            className="fill-emerald-400"
                            d="M205.3 192c-33.8 0-61.3 27.4-61.3 61.3c0 16.2 6.5 31.8 17.9 43.3l82.7 82.7c6.2 6.2 16.4 6.2 22.6 0l82.7-82.7c11.5-11.5 17.9-27.1 17.9-43.3c0-33.8-27.4-61.3-61.3-61.3c-16.2 0-31.8 6.5-43.3 17.9l-7.4 7.4-7.4-7.4c-11.5-11.5-27.1-17.9-43.3-17.9z"
                        />
                    </svg>
                ),
            },
            {
                name: "Settings",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path className="fill-zinc-700" d="M192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z" />
                        <path
                            className="fill-emerald-400"
                            d="M305.4 21.8c-1.3-10.4-9.1-18.8-19.5-20C276.1 .6 266.1 0 256 0c-11.1 0-22.1 .7-32.8 2.1c-10.3 1.3-18 9.7-19.3 20l-2.9 23.1c-.8 6.4-5.4 11.6-11.5 13.7c-9.6 3.2-19 7.2-27.9 11.7c-5.8 3-12.8 2.5-18-1.5l-18-14c-8.2-6.4-19.7-6.8-27.9-.4c-16.6 13-31.5 28-44.4 44.7c-6.3 8.2-5.9 19.6 .5 27.8l14.2 18.3c4 5.1 4.4 12 1.5 17.8c-4.4 8.8-8.2 17.9-11.3 27.4c-2 6.2-7.3 10.8-13.7 11.6l-22.8 2.9c-10.3 1.3-18.7 9.1-20 19.4C.7 234.8 0 245.3 0 256c0 10.6 .6 21.1 1.9 31.4c1.3 10.3 9.7 18.1 20 19.4l22.8 2.9c6.4 .8 11.7 5.4 13.7 11.6c3.1 9.5 6.9 18.7 11.3 27.5c2.9 5.8 2.4 12.7-1.5 17.8L54 384.8c-6.4 8.2-6.8 19.6-.5 27.8c12.9 16.7 27.8 31.7 44.4 44.7c8.2 6.4 19.7 6 27.9-.4l18-14c5.1-4 12.2-4.4 18-1.5c9 4.6 18.3 8.5 27.9 11.7c6.1 2.1 10.7 7.3 11.5 13.7l2.9 23.1c1.3 10.3 9 18.7 19.3 20c10.7 1.4 21.7 2.1 32.8 2.1c10.1 0 20.1-.6 29.9-1.7c10.4-1.2 18.2-9.7 19.5-20l2.8-22.5c.8-6.5 5.5-11.8 11.7-13.8c10-3.2 19.7-7.2 29-11.8c5.8-2.9 12.7-2.4 17.8 1.5L385 457.9c8.2 6.4 19.6 6.8 27.8 .5c2.8-2.2 5.5-4.4 8.2-6.7L451.7 421c1.8-2.2 3.6-4.4 5.4-6.6c6.5-8.2 6-19.7-.4-27.9l-14-17.9c-4-5.1-4.4-12.2-1.5-18c4.8-9.4 9-19.3 12.3-29.5c2-6.2 7.3-10.8 13.7-11.6l22.8-2.8c10.3-1.3 18.8-9.1 20-19.4c.2-1.7 .4-3.5 .6-5.2V230.1c-.2-1.7-.4-3.5-.6-5.2c-1.3-10.3-9.7-18.1-20-19.4l-22.8-2.8c-6.4-.8-11.7-5.4-13.7-11.6c-3.4-10.2-7.5-20.1-12.3-29.5c-3-5.8-2.5-12.8 1.5-18l14-17.9c6.4-8.2 6.8-19.7 .4-27.9c-1.8-2.2-3.6-4.4-5.4-6.6L421 60.3c-2.7-2.3-5.4-4.5-8.2-6.7c-8.2-6.4-19.6-5.9-27.8 .5L366.7 68.3c-5.1 4-12.1 4.4-17.8 1.5c-9.3-4.6-19-8.6-29-11.8c-6.2-2-10.9-7.3-11.7-13.7l-2.8-22.5zM256 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                        />
                    </svg>
                ),
            },
            {
                name: "Support",
                icon: (
                    <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                        <path
                            className="fill-zinc-700"
                            d="M64 0C28.7 0 0 28.7 0 64V256c0 35.3 28.7 64 64 64H96v48c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L202.7 320H352c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zm72.2 92.4c6.6-18.6 24.2-31.1 44-31.1h48.5c29.1 0 52.6 23.6 52.6 52.6c0 18.8-10.1 36.3-26.4 45.6L228 175c-.2 10.9-9.1 19.6-20 19.6c-11 0-20-9-20-20V163.5c0-7.2 3.8-13.8 10-17.3L235 124.9c3.9-2.3 6.3-6.4 6.3-10.9c0-7-5.7-12.6-12.6-12.6H180.2c-2.8 0-5.3 1.8-6.3 4.4l-.4 1c-3.7 10.4-15.1 15.9-25.5 12.2s-15.9-15.1-12.2-25.5l.4-1zM181.3 248a26.7 26.7 0 1 1 53.3 0 26.7 26.7 0 1 1 -53.3 0z"
                        />
                        <path
                            className="fill-emerald-400"
                            d="M136.2 92.4c6.6-18.6 24.2-31.1 44-31.1h48.5c29.1 0 52.6 23.6 52.6 52.6c0 18.8-10.1 36.3-26.4 45.6L228 175c-.2 10.9-9.1 19.6-20 19.6c-11 0-20-9-20-20V163.5c0-7.2 3.8-13.8 10-17.3L235 124.9c3.9-2.3 6.3-6.4 6.3-10.9c0-7-5.7-12.6-12.6-12.6H180.2c-2.8 0-5.3 1.8-6.3 4.4l-.4 1c-3.7 10.4-15.1 15.9-25.5 12.2s-15.9-15.1-12.2-25.5l.4-1zM181.3 248a26.7 26.7 0 1 1 53.3 0 26.7 26.7 0 1 1 -53.3 0zM256 384V352h96c53 0 96-43 96-96V128H576c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H544v48c0 6.1-3.4 11.6-8.8 14.3s-11.9 2.1-16.8-1.5L437.3 448H320c-35.3 0-64-28.7-64-64z"
                        />
                    </svg>
                ),
            },
        ],
    },
];

export const SidebarNavigation = () => {
    const path = usePathname();
    const [navigation, setNavigation] = useState(initialNavigation as NavigationItem[]);

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
        setNavigation((navigation: NavigationItem[]) =>
            navigation.map((navItem: NavigationItem) => ({
                ...navItem,
                current: navItem.href === path,
                children: navItem?.children?.map((child: NavigationItemChildren) => ({
                    ...child,
                    current: child.href === path,
                })),
            }))
        );
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
                <div className={classNames("flex h-16 shrink-0 items-center pl-1", sidebarOpenState.toggleSidebar ? "ml-8" : "self-center")}>
                    <Link href="/" className="font-himagsikan text-[#6cf60f] text-4xl inline-flex items-center gap-3 hue-rotate-[45deg]">
                        <img className="h-10  w-auto" src="/images/omniwin-logo.png" alt="Your Company" />
                        <span
                            className={classNames(sidebarToggleState.toggleSidebar && "hidden")}
                            style={{
                                // "-webkit-text-stroke-width": "1px",
                                // "-webkit-text-stroke-color": "black",
                                WebkitTextStrokeWidth: "1px",
                                WebkitTextStrokeColor: "black",
                            }}
                        >
                            OmniWin
                        </span>
                    </Link>
                </div>
                {/* <div className={`group flex grow flex-col bg-zinc-950 pb-4 relative transition-all duration-300 ${sidebarOpenState.toggleSidebar ? "px-4 w-[64px] hover:!w-72" : "pl-4 pr-4 lg:w-72"}`}> */}
                <div className={`group flex grow flex-col bg-zinc-900 mb-3 pt-4 ml-3 hover:bg-gradient-to-br hover:from-zinc-800/5 hover:to-zinc-800/20 rounded-lg pb-4 relative transition-all duration-300 ${sidebarOpenState.toggleSidebar ? "px-4 w-[90px] hover:!w-72" : "pl-4 pr-4 lg:w-72"}`}>
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
                                <ul role="list" className="-mx-2 space-y-2">
                                    {navigation.map((item: NavigationItem, navKey: number) => (
                                        <li key={item.name}>
                                            {!item.children ? (
                                                <Link
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current ? "text-jade-400 bg-zinc-800/70" : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-300 pl-6 !py-3"
                                                        // sidebarToggleState.toggleSidebar ? "pl-3" : ""
                                                    )}
                                                >
                                                    {/* <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" /> */}
                                                    {navigationIcons[navKey].icon}

                                                    {/* {sidebarToggleState.toggleSidebar ? "" : item.name} */}
                                                    <span className={classNames(sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100", "transition-all duration-300 ease-out")}>
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            ) : (
                                                <Disclosure as="div" defaultOpen={item.children.some((child) => child.current)} key={item.children.some((child) => child.current)}>
                                                    {({ open }) => (
                                                        <>
                                                            <Disclosure.Button
                                                                className={classNames(
                                                                    item.current ? "text-jade-400" : "text-zinc-200 hover:bg-zinc-800 hover:text-white",
                                                                    // sidebarToggleState.toggleSidebar ? "pl-3" : "",
                                                                    "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold  pl-6 !py-3"
                                                                )}
                                                            >
                                                                {/* <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" /> */}
                                                                {navigationIcons[navKey].icon}
                                                                {/* {sidebarToggleState.toggleSidebar ? "" : item.name} */}
                                                                <span className={classNames(sidebarToggleState.toggleSidebar && "w-0 opacity-0 group-hover:w-auto group-hover:opacity-100", "transition-all duration-300 ease-out")}>
                                                                    {item.name}
                                                                </span>
                                                                <ChevronRightIcon
                                                                    className={classNames(
                                                                        open ? "rotate-90 text-zinc-500" : "text-zinc-400",
                                                                        sidebarToggleState.toggleSidebar ? "w-0 hidden opacity-0 group-hover:w-auto group-hover:opacity-100 group-hover:block" : "",
                                                                        "ml-auto h-5 w-5 shrink-0 transition-all duration-300"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel as="ul" className="mt-1">
                                                                {item.children &&
                                                                    item.children.map((subItem, childrenKey) => (
                                                                        <li key={subItem.name}>
                                                                            {/* 44px */}
                                                                            <Disclosure.Button
                                                                                as="a"
                                                                                href={subItem.href}
                                                                                className={classNames(
                                                                                    // subItem.current ? "text-jade-400" : "text-zinc-400/90 hover:bg-zinc-800 hover:text-white",
                                                                                    subItem.current ? "text-jade-400 bg-zinc-800/70" : "text-zinc-400/90 hover:bg-zinc-800 hover:text-white",
                                                                                    subItem.icon && "pl-2",
                                                                                    !sidebarToggleState.toggleSidebar && "!pl-10",
                                                                                    "rounded-md pr-2 text-sm leading-6 flex items-center w-full group-hover:pl-10 transition-all duration-300 self-center mx-auto gap-x-3 pl-6 !py-3"
                                                                                )}
                                                                            >
                                                                                {/* {subItem.icon && <subItem.icon className="h-6 w-6 shrink-0" aria-hidden="true" />} */}
                                                                                {navigationIcons?.[navKey]?.children !== undefined && navigationIcons[navKey].children[childrenKey].icon}

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
                                                "w-full group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-200 hover:bg-zinc-800 hover:text-white pl-6 !py-3"
                                                // sidebarToggleState.toggleSidebar ? "pl-3" : ""
                                            )}
                                        >
                                            {/* <PlusCircleIcon className="h-6 w-6 shrink-0" aria-hidden="true" /> */}
                                            <svg className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path
                                                    className="fill-zinc-700"
                                                    d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
                                                />
                                                <path
                                                    className="fill-emerald-400"
                                                    d="M200 280v64c0 13.3 10.7 24 24 24s24-10.7 24-24V280h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V168c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H136c-13.3 0-24 10.7-24 24s10.7 24 24 24h64z"
                                                />
                                            </svg>

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
                                        "group -mx-2 flex gap-x-3 rounded-md p-2 pl-6 !py-3 text-sm font-semibold leading-6 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                                        // sidebarToggleState.toggleSidebar ? "pl-3" : ""
                                    )}
                                >
                                    {/* <QuestionMarkCircleIcon className="h-6 w-6 shrink-0" aria-hidden="true" /> */}
                                    {navigationIcons[3].children[5].icon}
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
