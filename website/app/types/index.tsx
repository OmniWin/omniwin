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

export type FetchRequestBody = {
    pagination: {
        pageSize: number;
        offset: number;
    };
    types: string[];
    networks: string[];
    sortBy: string;
};

export type Raffle = {
    full_price: number;
    ticket_price: number;
    tickets_bought: number;
    tickets_total: number;
    time_left: number;
    nft_name: string;
    nft_image: string;
    nft_owner: string;
    asset_type: string;
    nft_id: number;
    token_id: string;
    network: string;
    collectionName: string;
    isVerified: boolean;
};