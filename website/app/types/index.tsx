export * from './eventData';

export type SortOption = {
    id: string;
    name: string;
    href: string;
    current: boolean;
};
export type FilterOption = {
    value: string;
    label: string;
    checked: boolean;
};

export type Filter = {
    id: string;
    name: string;
    options: FilterOption[];
};

export type FilterComponentProps = {
    sortOptions: SortOption[];
    setSortOptions: React.Dispatch<React.SetStateAction<SortOption[]>>;
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
};

export type FetchRafflesRequestBody = {
    pagination: {
        pageSize: number;
        cursor: number;
    };
    types: string[];
    networks: string[];
    sortBy: string;
};

export type RaffleCard = {
    full_price: number;
    ticket_price: number;
    tickets_bought: number;
    tickets_total: number;
    end_timestamp: number;
    nft_name: string;
    nft_image: string;
    nft_owner: string;
    asset_type: string;
    nft_id: number;
    token_id: string;
    network: string;
    collection_name: string;
    is_verified: boolean;
    is_favorite: boolean;
    favorites_count: number;
    count_views: number;
};

export interface Raffle {
    id_nft: number;
    id_lot: number;
    total_tickets: number;
    bonus_tickets: number;
    tickets_bought: number;
    ticket_price: string;
    transactions: number;
    end_timestamp: number;
    fee: number;
    closed: number;
    buyout: number;
    asset_claimed: number;
    tokens_claimed: number;
    owner: string;
    signer: string | null;
    token: string;
    token_id: string;
    amount: string;
    asset_type: string;
    data: string;
    network: string;
    created_at: string;
    updated_at: string;
    name: string;
    collection_name: string;
    image_local: string;
}

export type RaffleResponse = {
    success: boolean;
    data: {
        nft: RaffleCard;
        tickets: Ticket[];
        purchaseOptions: PurchaseOption[];
        activity: RaffleActivity[];
        participants: Participants[];
    };
    message: string;
}

export type Participants = {
    max_id_ticket: number;
    block: number,
    recipient: string,
    total_tickets: number,
    total_bonus: number,
    total_tokens_spent: number,
    username: string,
}

export type RaffleActivityResponse = {
    success: boolean;
    data: {
        items: RaffleActivity[];
        pagination: {
            totalPages: number;
            totalCount: number;
        }
    };
    message: string;
}

export type RaffleActivity = {
    block: number;
    recipient: string;
    total_tickets: number;
    tickets: string;
    bonus: number;
    tokens_spent: string;
    created_at: string;
    transaction_hash: string;
}

export type RaffleParticipantsResponse = {
    success: boolean;
    data: {
        items: Participants[];
    };
    message: string;
}


export interface Ticket {
    id_ticket: number;
    id_lot: number;
    unique_id: string;
    recipient: string;
    total_tickets: number;
    amount: string;
    bonus: number;
    transaction_hash: string;
    tokens_spent: string;
    created_at: string;
}

export interface PurchaseOption {
    amount?: number;
    bonus?: number;
    total?: number;
}

export interface CountdownRendererProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
}

export interface EventDetails {
    title: string;
    description: string;
    location: string;
    startTime: Date; // Using Date object for start time
    endTime: Date; // Using Date object for end time
}

export enum LinkType {
    address = 'address',
    tx = 'tx',
}