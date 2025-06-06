import { Message, UserData } from "@/app/chatData";
import { ChatList } from "./ChatList";
import React from "react";

interface ChatProps {
    messages?: Message[];
    selectedUser: UserData;
    isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
    const [messagesState, setMessages] = React.useState<Message[]>(messages ?? []);

    const sendMessage = (newMessage: Message) => {
        setMessages([...messagesState, newMessage]);
    };

    return (
        <div className="flex flex-col justify-between w-full h-full">
            <ChatList messages={messagesState} selectedUser={selectedUser} sendMessage={sendMessage} isMobile={isMobile} />
        </div>
    );
}
