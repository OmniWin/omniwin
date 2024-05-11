"use client";
/* Components */
// import { Nav } from "./components/Nav
import { SidebarNavigation } from "./SidebarNavigation";
import { TopNavigation } from "./TopNavigation";
import { MobileNavigation } from "./MobileNavigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faDiscord, faTelegram, faInstagram } from "@fortawesome/free-brands-svg-icons";

/* Core */
import { useSelector } from "@/lib/redux";
import { selectSidebarToggleState, selectChatOpenState } from "@/lib/redux/slices/sidebarSlice/selectors";
import React, { useRef } from "react";
import Link from "next/link";

import { useState } from "react";
import { ChatSidebar } from "./Chat/ChatSidebar";

export default function MainLayout(props: React.PropsWithChildren) {
    const sidebarToggleState = useSelector(selectSidebarToggleState);
    const chatSidebarState = useSelector(selectChatOpenState);
    const mainRef = useRef(null); // Reference to the main tag

    return (
        <>
            <SidebarNavigation />
            {/* <div className="lg:pl-72"> */}
            {/* <div className={`${sidebarToggleState.toggleSidebar ? "lg:pl-8" : "lg:pl-64"} transition-all duration-300`}> */}
            <div className={`${sidebarToggleState.toggleSidebar ? "lg:pl-[5.5rem]" : "lg:pl-72"} transition-all duration-300 ${chatSidebarState.isChatOpen ? "xl:pr-[395px]" : ""}`}>
                <TopNavigation />
                <main className="relative mx-2 sm:mx-6 lg:mx-8 bg-zinc-900 rounded-lg overflow-hidden">
                    <div ref={mainRef} className="h-full relative py-3 pb-24 md:py-12 md:pb-20 px-3 md:px-6 2xl:px-12 overflow-y-auto no-scrollbar min-h-[calc(100dvh-64px-1rem)] max-h-[calc(100dvh-64px-.75rem)]">
                        {props.children}
                    </div>
                    <div className="absolute bottom-0 left-0 z-20 w-full flex flex-wrap items-center justify-center gap-4 bg-gradient-to-b from-zinc-800 to-zinc-900 p-2 text-zinc-400 text-xs rounded-b-lg">
                        <Link href="/about" className="hover:text-white transition-all duration-300">
                            About
                        </Link>
                        <Link href="/contact" className="hover:text-white transition-all duration-300">
                            Contact
                        </Link>
                        <Link href="/support" className="hover:text-white transition-all duration-300">
                            Support
                        </Link>
                        <Link href="/privacy-policy" className="hover:text-white transition-all duration-300">
                            Privacy Policy
                        </Link>
                        <Link href="/terms-of-service" className="hover:text-white transition-all duration-300">
                            Terms of Service
                        </Link>
                        {/* Socials */}
                        <div className="hidden sm:flex items-center justify-center gap-4 ml-5">
                            <Link href="https://twitter.com/omniwin" className="hover:text-white transition-all duration-300">
                                <FontAwesomeIcon icon={faXTwitter} className="h-4 w-4" />
                            </Link>
                            <Link href="https://discord.gg/omniwin" className="hover:text-white transition-all duration-300">
                                <FontAwesomeIcon icon={faDiscord} className="h-4 w-4" />
                            </Link>
                            <Link href="https://t.me/omniwin" className="hover:text-white transition-all duration-300">
                                <FontAwesomeIcon icon={faTelegram} className="h-4 w-4" />
                            </Link>
                            <Link href="https://www.instagram.com/omniwin" className="hover:text-white transition-all duration-300">
                                <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </main>
                {!chatSidebarState.isChatOpen && <MobileNavigation mainRef={mainRef} />}
            </div>

            <ChatSidebar />
        </>
    );
}
