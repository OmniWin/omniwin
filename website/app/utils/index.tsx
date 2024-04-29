import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from "date-fns";
import { EventDetails } from "@/app/types";
export * from "./getExplorerLink";
import USDT from "@/public/images/coins/USDT.svg";
import USDC from "@/public/images/coins/USDC.svg";

export const classNames = (...args: any[]) => {
    return args.filter(Boolean).join(" ");
};

export function formatCountdown(startDate: Date, endDate: Date): { diff: number; unit: string; hasEnded: boolean } {
    if (endDate <= startDate) {
        return { diff: 0, unit: "seconds", hasEnded: true };
    }

    const diffDays = differenceInDays(endDate, startDate);
    if (diffDays > 0) return { diff: diffDays, unit: "days", hasEnded: false };

    const diffHours = differenceInHours(endDate, startDate);
    if (diffHours > 0) return { diff: diffHours, unit: "hrs", hasEnded: false };

    const diffMinutes = differenceInMinutes(endDate, startDate);
    if (diffMinutes > 0) return { diff: diffMinutes, unit: "mins", hasEnded: false };

    const diffSeconds = differenceInSeconds(endDate, startDate);
    return { diff: diffSeconds, unit: "secs", hasEnded: false };
}

export function shortenAddress(address: string | undefined, left: number = 4, right: number = 6): string | undefined {
    if (!address) return undefined;

    const leftPart = address.slice(0, left);
    const rightPart = address.slice(-right);
    return `${leftPart}...${rightPart}`;
}

export function formatMoney(amount: number, currency: string, locale: string = "en-US", decimalPlaces: number = 0): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    }).format(amount);
}

function calculateBonus(amount: number, totalTickets: number) {
    const bonus = (amount * amount) / (4 * totalTickets);

    return Math.floor(bonus);
}

export function getPurchaseOptions(totalTickets: number) {
    const purchaseOptions = [1, 10, 100, 250, 500]; // Default purchase options
    const validOptions = purchaseOptions.filter((option) => option <= totalTickets); // Filter out options greater than totalTickets
    const optionsWithBonuses = validOptions.map((amount) => {
        const bonus = calculateBonus(amount, totalTickets); // Assume calculateBonus is the function from previous messages
        return {
            amount,
            bonus,
            total: amount + bonus, // This is the total number of tickets including bonuses
        };
    });
    return optionsWithBonuses;
}

// Utility function to share raffle on social media
type ShareOptions = {
    title?: string; // Title of the content to share
    text?: string; // Text to share along with the URL
    url: string; // URL of the raffle to share
};

type SocialPlatform = "twitter" | "facebook" | "linkedin" | "whatsapp" | "copy";

export function share(platform: SocialPlatform | "default", options: ShareOptions): void {
    const { title, text = "", url } = options; // Provide a default empty string for text to ensure it's always a string

    // First, attempt to use the Web Share API if available and if 'default' is selected
    if (navigator.share && platform === "default") {
        navigator
            .share({
                title: title ?? "", // Ensure title is a string, provide a default as needed
                text,
                url,
            })
            .catch((err) => {
                console.error("Error sharing:", err);
            });
        return; // Return early since we don't need to process further for the 'default' case
    }

    // For copying to clipboard, handle it separately as it doesn't open a URL
    if (platform === "copy") {
        navigator.clipboard
            .writeText(`${title}\n${text}\n${url}`)
            .then(() => {
                alert("Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
            });
        return;
    }

    // For other platforms, construct the share URL
    let shareUrl = "";
    switch (platform) {
        case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case "linkedin":
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title ?? "")}&summary=${encodeURIComponent(text)}`;
            break;
        case "whatsapp":
            shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${text} ${url}`)}`;
            break;
    }

    // Open share URL in a new tab if it's not empty
    if (shareUrl) window.open(shareUrl, "_blank");
}

export async function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
        () => {},
        (err) => {
            console.error("Failed to copy to clipboard:", err);
        }
    );
}

import { CountdownRendererProps } from "@/app/types";
export const countdownRederer = ({ days, hours, minutes, seconds, completed }: CountdownRendererProps) => {
    if (completed) {
        // Render a completed state
        return <span className="text-xl font-bold leading-7 text-zinc-100 sm:truncate sm:text-2xl sm:tracking-tight">Ended</span>;
    } else {
        // Render a countdown
        return (
            <>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col text-center">
                        <span className="text-xl font-bold leading-7 text-zinc-100 sm:truncate sm:text-2xl sm:tracking-tight">{days}</span>
                        <span className="text-zinc-400 text-xs uppercase">Days</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-xl font-bold leading-7 text-zinc-100 sm:truncate sm:text-2xl sm:tracking-tight">{hours}</span>
                        <span className="text-zinc-400 text-xs uppercase">Hours</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-xl font-bold leading-7 text-zinc-100 sm:truncate sm:text-2xl sm:tracking-tight">{minutes}</span>
                        <span className="text-zinc-400 text-xs uppercase">Mins</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-xl font-bold leading-7 text-zinc-100 sm:truncate sm:text-2xl sm:tracking-tight">{seconds}</span>
                        <span className="text-zinc-400 text-xs uppercase">Secs</span>
                    </div>
                </div>
            </>
        );
    }
};

function formatICSDate(date: Date): string {
    // Format date to YYYYMMDDTHHmm00Z (UTC time for .ics)
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

function createICSContent(eventDetails: EventDetails): string {
    const { title, description, location, startTime, endTime } = eventDetails;
    const startDate = formatICSDate(startTime);
    const endDate = formatICSDate(endTime);

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `URL:${document.location.href}`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\n");
}

// Example usage
export function downloadICS(eventDetails: EventDetails) {
    const icsContent = createICSContent(eventDetails);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "event.ics"; // The file name for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
}

export const tiers = [
    {
        name: "Tier 1",
        description: "Tier 1 description",
        image: "/images/tier/1.png",
        gradientColor: "bg-gradient-to-r from-[#e52a5f38] to-transparent",
        color: "#e52a5f",
        lowOpacityColor: "#e52a5f1a",
    },
    {
        name: "Tier 2",
        description: "Tier 2 description",
        image: "/images/tier/2.png",
        gradientColor: "bg-gradient-to-r from-[#fba21342] to-transparent",
        color: "#fba213",
        lowOpacityColor: "#fba2131a",
    },
    {
        name: "Tier 3",
        description: "Tier 3 description",
        image: "/images/tier/3.png",
        gradientColor: "bg-gradient-to-r from-[#c41b1e38] to-transparent",
        color: "#c41b1e",
        lowOpacityColor: "#c41b1e1a",
    },
    {
        name: "Tier 4",
        description: "Tier 4 description",
        image: "/images/tier/4.png",
        gradientColor: "bg-gradient-to-r from-[#e536e541] to-transparent",
        color: "#e536e5",
        lowOpacityColor: "#e536e51a",
    },
    {
        name: "Tier 5",
        description: "Tier 5 description",
        image: "/images/tier/5.png",
        gradientColor: "bg-gradient-to-r from-[#01d8e33a] to-transparent",
        color: "#01d8e3",
        lowOpacityColor: "#01d8e31a",
    },
    {
        name: "Tier 6",
        description: "Tier 6 description",
        image: "/images/tier/6.png",
        gradientColor: "bg-gradient-to-r from-[#51a6323d] to-transparent",
        color: "#51a632",
        lowOpacityColor: "#51a6321a",
    },
    {
        name: "Tier 7",
        description: "Tier 7 description",
        image: "/images/tier/7.png",
        gradientColor: "bg-gradient-to-r from-[#5768e833] to-transparent",
        color: "#5768e8",
        lowOpacityColor: "#5768e81a",
    },
    {
        name: "Tier 8",
        description: "Tier 8 description",
        image: "/images/tier/8.png",
        gradientColor: "bg-gradient-to-r from-[#caa64b42] to-transparent",
        color: "#caa64b",
        lowOpacityColor: "#caa64b1a",
    },
    {
        name: "Tier 9",
        description: "Tier 9 description",
        image: "/images/tier/9.png",
        gradientColor: "bg-gradient-to-r from-[#8d8d8d4f] to-transparent",
        color: "#8d8d8d",
        lowOpacityColor: "#8d8d8d1a",
    },
    {
        name: "Tier 10",
        description: "Tier 10 description",
        image: "/images/tier/10.png",
        gradientColor: "bg-gradient-to-r from-[#f68b623b] to-transparent",
        color: "#f68b62",
        lowOpacityColor: "#f68b621a",
    },
];

export const tokensContracts = {
    ethereum: [
        {
            name: "USDC",
            symbol: "USDC",
            contract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            testnetContract: "0x8e0b7e6062272B5eF4524250bFFF8e5Bd3497757",
            image: USDC,
        },
        {
            name: "USDT",
            symbol: "USDT",
            contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            testnetContract: "0x13512979ade267ab5100878e2e0f485b568328a4",
            image: USDT,
        },
    ],
    bsc: [
        {
            name: "USDC",
            symbol: "USDC",
            contract: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
            testnetContract: "",
            image: USDC,
        },
        {
            name: "USDT",
            symbol: "USDT",
            contract: "0x55d398326f99059ff775485246999027b3197955",
            testnetContract: "",
            image: USDT,
        },
    ],
    matic: [
        {
            name: "USDC",
            symbol: "USDC",
            contract: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
            testnetContract: "",
            image: USDC,
        },
        {
            name: "USDT",
            symbol: "USDT",
            contract: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            testnetContract: "",
            image: USDT,
        },
    ],
};
