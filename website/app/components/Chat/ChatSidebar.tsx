"use client";

import { useSelector, useDispatch } from "@/lib/redux";
import { selectChatOpenState } from "@/lib/redux/slices/sidebarSlice/selectors";
import { ChatLayout } from "./ChatLayout";

export const ChatSidebar = () => {
    // const dispatch = useDispatch();
    const isChatOpenState = useSelector(selectChatOpenState);

    return (
        <>
            {/* Static sidebar for desktop */}
            {isChatOpenState.isChatOpen && (
                <div
                    className={`fixed z-30 h-full w-full max-h-[calc(100dvh-64px-.75rem)] lg:right-3 top-16 lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 group-[parent] xl:max-w-[404px] lg:w-[calc(100vw-20rem)] lg:max-h-[calc(100%-64px)] lg:!top-16 xl:!top-3 xl:max-h-full`}
                >
                    <div
                        className={`group h-full flex grow flex-col bg-zinc-900 mb-3 py-3 pb-0 mx-2 lg:ml-3 hover:bg-gradient-to-br hover:from-zinc-800/5 hover:to-zinc-800/20 rounded-lg relative transition-all duration-300 xl:max-h-[calc(100vh-1.5rem)]`}
                    >
                        <ChatLayout />
                    </div>
                </div>
            )}
        </>
    );
};
