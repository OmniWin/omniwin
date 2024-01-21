export function cleanHashLots(hashLots: {
    [key: number]: {
        timestamp: number,
        tickets: {
            id_ticket: number,
            id_lot: number,
            recipient: string,
            totalTickets: number,
            amount: number,
            tokensSpent: number,
            bonus: number,
            created_at: Date,
            updated_at: Date,
            uniqueID: string,
        }[]
    }
}) {
    for (const lotID in hashLots) {
        const deleteAfter = 60 * 60 * 24; //1 day
        if (hashLots[lotID].timestamp < Date.now() - deleteAfter) {
            //delete old lot
            delete hashLots[lotID];
        }
    }
}

