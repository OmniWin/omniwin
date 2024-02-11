"use client";
/* Components */
// import { Nav } from "./components/Nav
import { SidebarNavigation } from "./SidebarNavigation";
import { TopNavigation } from "./TopNavigation";
import { MobileNavigation } from "./MobileNavigation";

/* Core */
import { useSelector } from "@/lib/redux";
import { selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";
import React, { useRef } from "react";



export default function MainLayout(props: React.PropsWithChildren) {
    const sidebarToggleState = useSelector(selectSidebarToggleState);
    const mainRef = useRef(null); // Reference to the main tag

    return (
        <>
            <SidebarNavigation />
            {/* <div className="lg:pl-72"> */}
            <div className={`${sidebarToggleState.toggleSidebar ? "lg:pl-8" : "lg:pl-64"} transition-all duration-300`}>
                <TopNavigation />
                <main ref={mainRef} className="py-3 md:py-12 px-3 md:px-12 mx-2 sm:mx-6 lg:mx-8   bg-zinc-900 rounded-lg max-h-[calc(100vh-64px-.75rem)] overflow-y-auto no-scrollbar min-h-[calc(100vh-64px-1rem)]">
                    {props.children}
                </main>
                <MobileNavigation mainRef={mainRef} />
            </div>
        </>
    );
}
