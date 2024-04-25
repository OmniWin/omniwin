import { FileImage, Mic, Paperclip, PlusCircle, SendHorizontal, Smile, ThumbsUp } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message, loggedInUserData } from "@/app/chatData";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ChatBottombarProps {
    sendMessage: (newMessage: Message) => void;
    isMobile: boolean;
}

// export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];
export const BottombarIcons = [];

export default function ChatBottombar({ sendMessage, isMobile }: ChatBottombarProps) {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleThumbsUp = () => {
        const newMessage: Message = {
            id: message.length + 1,
            name: loggedInUserData.name,
            avatar: loggedInUserData.avatar,
            message: "👍",
            createdAt: new Date().toISOString(),
        };
        sendMessage(newMessage);
        setMessage("");
    };

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: message.length + 1,
                name: loggedInUserData.name,
                avatar: loggedInUserData.avatar,
                message: message.trim(),
                createdAt: new Date().toISOString(),
            };
            sendMessage(newMessage);
            setMessage("");

            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }

        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setMessage((prev) => prev + "\n");
        }
    };

    return (
        <div className="p-2 flex justify-between w-full items-center gap-2">
            {/* <div className="flex">
                <Popover>
                    <PopoverTrigger asChild>
                        <Link href="#" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9", "dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100")}>
                            <PlusCircle size={20} className="text-zinc-200" />
                        </Link>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-full p-2">
                        {message.trim() || isMobile ? (
                            <div className="flex gap-2">
                                <Link href="#" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9", "dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100")}>
                                    <Mic size={20} className="text-zinc-200" />
                                </Link>
                                {BottombarIcons.map((icon, index) => (
                                    <Link
                                        key={index}
                                        href="#"
                                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9", "dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100")}
                                    >
                                        <icon.icon size={20} className="text-zinc-200" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Link href="#" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9", "dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100")}>
                                <Mic size={20} className="text-zinc-200" />
                            </Link>
                        )}
                    </PopoverContent>
                </Popover>
                {!message.trim() && !isMobile && (
                    <div className="flex">
                        {BottombarIcons.map((icon, index) => (
                            <Link key={index} href="#" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9", "dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100")}>
                                <icon.icon size={20} className="text-zinc-200" />
                            </Link>
                        ))}
                    </div>
                )}
            </div> */}

            <AnimatePresence initial={false}>
                <motion.div
                    key="input"
                    className="w-full relative"
                    layout
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{
                        opacity: { duration: 0.05 },
                        layout: {
                            type: "spring",
                            bounce: 0.15,
                        },
                    }}
                >
                    <Textarea
                        autoComplete="off"
                        value={message}
                        ref={inputRef}
                        onKeyDown={handleKeyPress}
                        onChange={handleInputChange}
                        name="message"
                        placeholder="Aa"
                        size="sm"
                        className=" w-full border !border-transparent focus-visible:!border-zinc-500 rounded-md flex items-center h-9 !min-h-[initial] resize-none overflow-hidden focus-visible:!ring-0"
                    ></Textarea>
                    <div className="absolute right-2 bottom-0.5  ">
                        <EmojiPicker
                            onChange={(value) => {
                                setMessage(message + value);
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            }}
                        />
                    </div>
                </motion.div>

                {message.trim() ? (
                    <Link
                        href="#"
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9", "dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 shrink-0")}
                        onClick={handleSend}
                    >
                        <SendHorizontal size={20} className="text-zinc-200" />
                    </Link>
                ) : (
                    <Link
                        href="#"
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9", "dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 shrink-0")}
                        onClick={handleThumbsUp}
                    >
                        <ThumbsUp size={20} className="text-zinc-200" />
                    </Link>
                )}
            </AnimatePresence>
        </div>
    );
}
