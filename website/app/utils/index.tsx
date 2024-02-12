import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from "date-fns";
import { EventDetails } from "@/app/types";
export * from './getExplorerLink';

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

export function shortenAddress(address: string | undefined, left: number = 6, right: number = 4): string | undefined {
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