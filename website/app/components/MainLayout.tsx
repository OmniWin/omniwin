"use client";
/* Components */
// import { Nav } from "./components/Nav
import { SidebarNavigation } from "./SidebarNavigation";
import { TopNavigation } from "./TopNavigation";
import { MobileNavigation } from "./MobileNavigation";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord, faTelegram, faInstagram } from '@fortawesome/free-brands-svg-icons'

/* Core */
import { useSelector } from "@/lib/redux";
import { selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";
import React, { useRef } from "react";
import Link from "next/link";



export default function MainLayout(props: React.PropsWithChildren) {
    const sidebarToggleState = useSelector(selectSidebarToggleState);
    const mainRef = useRef(null); // Reference to the main tag

    return (
        <>
            <SidebarNavigation />
            {/* <div className="lg:pl-72"> */}
            <div className={`${sidebarToggleState.toggleSidebar ? "lg:pl-8" : "lg:pl-64"} transition-all duration-300`}>
                <TopNavigation />
                <main ref={mainRef} className="relative py-3 md:py-12 px-3 md:px-12 mx-2 sm:mx-6 lg:mx-8 bg-zinc-900 rounded-lg max-h-[calc(100vh-64px-.75rem)] overflow-y-auto no-scrollbar min-h-[calc(100vh-64px-1rem)]">
                    {props.children}
                    <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-4 bg-gradient-to-b from-zinc-800 to-zinc-900 p-2 mt-8 text-zinc-400 text-xs">
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
                        <div className="flex items-center justify-center gap-4 ml-5">
                            <Link href="https://twitter.com/omniwin" className="hover:text-white transition-all duration-300">
                                <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
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
                <MobileNavigation mainRef={mainRef} />
            </div>
        </>
    );
}
