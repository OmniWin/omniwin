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
