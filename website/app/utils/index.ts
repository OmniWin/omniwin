import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
export const classNames = (...args: any[]) => {
    return args.filter(Boolean).join(' ');
};

export function formatCountdown(startDate: Date, endDate: Date): { diff: number, unit: string, hasEnded: boolean } {
    if (endDate <= startDate) {
        return { diff: 0, unit: 'seconds', hasEnded: true };
    }

    const diffDays = differenceInDays(endDate, startDate);
    if (diffDays > 0) return { diff: diffDays, unit: 'days', hasEnded: false };

    const diffHours = differenceInHours(endDate, startDate);
    if (diffHours > 0) return { diff: diffHours, unit: 'hrs', hasEnded: false };

    const diffMinutes = differenceInMinutes(endDate, startDate);
    if (diffMinutes > 0) return { diff: diffMinutes, unit: 'mins', hasEnded: false };

    const diffSeconds = differenceInSeconds(endDate, startDate);
    return { diff: diffSeconds, unit: 'secs', hasEnded: false };
}

export function shortenAddress(address: string | undefined, left: number = 6, right: number = 4): string | undefined {
    if (!address) return undefined;

    const leftPart = address.slice(0, left);
    const rightPart = address.slice(-right);
    return `${leftPart}...${rightPart}`;
}

export function formatMoney(
    amount: number,
    currency: string,
    locale: string = 'en-US',
    decimalPlaces: number = 0
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    }).format(amount);
}
