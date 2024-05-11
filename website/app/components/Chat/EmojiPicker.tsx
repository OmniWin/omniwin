"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    return (
        <Popover>
            <PopoverTrigger>
                <SmileIcon className="h-5 w-5 text-zinc-400 hover:text-zinc-100 transition" />
            </PopoverTrigger>
            <PopoverContent className="w-full !p-0">
                <Picker emojiSize={18} theme="dark" data={data} maxFrequentRows={1} onEmojiSelect={(emoji: any) => onChange(emoji.native)} />
            </PopoverContent>
        </Popover>
    );
};
