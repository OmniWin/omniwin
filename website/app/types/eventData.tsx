export type EventData = {
    tickets_bought: number;
    nft_id: number;
    total_tickets: number;
    total_bonus: number;
    total_tokens_spent: number;
    participants: {
        block: number,
        recipient: string,
        tickets: number,
        bonus: number,
        max_id_ticket: number,
        max_block: number,
        total_tickets: number,
        total_bonus: number,
        total_tokens_spent: number,
        username: string | null
        transaction_hash: string
    }[];
}