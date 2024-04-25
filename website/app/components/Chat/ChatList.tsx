import { Message, UserData } from "@/app/chatData";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import ChatBottombar from "./ChatBottomBar";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";

interface ChatListProps {
    messages?: Message[];
    selectedUser: UserData;
    sendMessage: (newMessage: Message) => void;
    isMobile: boolean;
}

export function ChatList({ messages, selectedUser, sendMessage, isMobile }: ChatListProps) {
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
            <div ref={messagesContainerRef} className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
                <AnimatePresence>
                    {messages?.map((message, index) => (
                        <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                            transition={{
                                opacity: { duration: 0.1 },
                                layout: {
                                    type: "spring",
                                    bounce: 0.3,
                                    duration: messages.indexOf(message) * 0.05 + 0.2,
                                },
                            }}
                            style={{
                                originX: 0.5,
                                originY: 0.5,
                            }}
                            className={cn("flex flex-col gap-2 p-4 whitespace-pre-wrap text-sm item-end group/msg", message.name !== selectedUser.name ?? "")}
                        >
                            <div className="flex gap-3 items-start">
                                {message.name === selectedUser.name && (
                                    <Avatar className="flex justify-center items-center">
                                        <AvatarImage src={message.avatar} alt={message.name} width={6} height={6} />
                                    </Avatar>
                                )}
                                {message.name !== selectedUser.name && (
                                    <Avatar className="flex justify-center items-center">
                                        <AvatarImage src={message.avatar} alt={message.name} width={6} height={6} />
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        "bg-zinc-800 text-zinc-200 p-3 rounded-md max-w-xs flex-1 border-l border-transparent group-hover/msg:bg-zinc-700/50",
                                        message.name === selectedUser.name ? "border-jade-400" : ""
                                    )}
                                >
                                    <div className="flex items-center justify-between w-full mb-2">
                                        {/* TODO: Add link to user profile */}
                                        <span className="text-zinc-500 text-sm">{message.name === selectedUser.name ? "You" : message.name}</span>
                                        <span className="text-zinc-500 text-xs">{format(new Date(message.createdAt || ""), "h:mm a")}</span>
                                    </div>
                                    <div>{message.message}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <ChatBottombar sendMessage={sendMessage} isMobile={isMobile} />
        </div>
    );
}
