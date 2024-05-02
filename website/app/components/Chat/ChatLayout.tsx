"use client";

import { userData } from "@/app/chatData";
import React, { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
// import { Sidebar } from "../sidebar";
import { Chat } from "./Chat";

interface ChatLayoutProps {
    defaultLayout?: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize?: number;
}

export function ChatLayout({ defaultLayout = [320, 480], defaultCollapsed = false, navCollapsedSize }: ChatLayoutProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const [selectedUser, setSelectedUser] = React.useState(userData[0]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Initial check
        checkScreenWidth();

        // Event listener for screen width changes
        window.addEventListener("resize", checkScreenWidth);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", checkScreenWidth);
        };
    }, []);

    return (
        <Chat messages={selectedUser.messages} selectedUser={selectedUser} isMobile={isMobile} />

        // <ResizablePanelGroup
        //     direction="horizontal"
        //     onLayout={(sizes: number[]) => {
        //         document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        //     }}
        //     className="h-full items-stretch"
        // >
        // {/* <ResizableHandle withHandle /> */}
        // <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        // <Chat messages={selectedUser.messages} selectedUser={selectedUser} isMobile={isMobile} />
        //     {/* </ResizablePanel>
        // </ResizablePanelGroup> */}
    );
}
