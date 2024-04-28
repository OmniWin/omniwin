import { useEffect, useState, useRef, useCallback } from "react";

// Components
import Filters from "../Filters";
import RaffleMetaWin from "../Raffle/RaffleMetaWin";
import RaffleEse from "../Raffle/RaffleEse";
import RaffleDefault from "../Raffle/RaffleDefault";
import CardSettings from "../Raffle/CardSettings";

// Redux Hooks
import { useSelector } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";
import { classNames } from "@/app/utils";

// Types
import { Filter, SortOption, FetchRafflesRequestBody, RaffleCard, FilterOption } from "@/app/types";

const raffleDemoList: RaffleCard[] = [
    {
        full_price: 1000,
        ticket_price: 100,
        tickets_bought: 3,
        tickets_total: 421,
        end_timestamp: 1715407420,
        nft_name: "Azuki #343",
        nft_image: "343_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 2,
        token_id: "343",
        network: "GOERLI",
        collection_name: "Azuki",
        is_verified: true,
        is_favorite: false,
        favorites_count: 0,
        count_views: 0,
    },
    {
        full_price: 33000,
        ticket_price: 3300,
        tickets_bought: 1,
        tickets_total: 22,
        end_timestamp: 1715197820,
        nft_name: "W#635",
        nft_image: "635_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 20,
        token_id: "635",
        network: "GOERLI",
        collection_name: "Wrapped Cryptopunks",
        is_verified: true,
        is_favorite: false,
        favorites_count: 0,
        count_views: 0,
    },
    {
        full_price: 2400000,
        ticket_price: 4000,
        tickets_bought: 21,
        tickets_total: 21,
        end_timestamp: 1715533544,
        nft_name: "W#872",
        nft_image: "872_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 3,
        token_id: "872",
        network: "GOERLI",
        collection_name: "Wrapped Cryptopunks",
        is_verified: true,
        is_favorite: false,
        favorites_count: 10, // Example placeholder
        count_views: 100, // Example placeholder
    },
    {
        full_price: 2000,
        ticket_price: 200,
        tickets_bought: 1,
        tickets_total: 353,
        end_timestamp: 1715506620,
        nft_name: "Doodle #246",
        nft_image: "246_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 4,
        token_id: "246",
        network: "GOERLI",
        collection_name: "Doodles",
        is_verified: false,
        is_favorite: true,
        favorites_count: 25, // Example placeholder
        count_views: 250, // Example placeholder
    },
    {
        full_price: 39000,
        ticket_price: 3900,
        tickets_bought: 1,
        tickets_total: 362,
        end_timestamp: 1715111420,
        nft_name: "Pudgy Penguin #798",
        nft_image: "798_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 5,
        token_id: "798",
        network: "GOERLI",
        collection_name: "Pudgy Penguins",
        is_verified: true,
        is_favorite: false,
        favorites_count: 15, // Example placeholder
        count_views: 150, // Example placeholder
    },
    {
        full_price: 47000,
        ticket_price: 4700,
        tickets_bought: 1,
        tickets_total: 206,
        end_timestamp: 1715370620,
        nft_name: "Doodle #128",
        nft_image: "128_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 6,
        token_id: "128",
        network: "GOERLI",
        collection_name: "Doodles",
        is_verified: true,
        is_favorite: true,
        favorites_count: 30, // Example placeholder
        count_views: 300, // Example placeholder
    },
    {
        full_price: 414000,
        ticket_price: 400,
        tickets_bought: 418,
        tickets_total: 418,
        end_timestamp: 1715279112,
        nft_name: "W#773",
        nft_image: "773_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 7,
        token_id: "773",
        network: "GOERLI",
        collection_name: "Wrapped Cryptopunks",
        is_verified: false,
        is_favorite: false,
        favorites_count: 5, // Example placeholder
        count_views: 50, // Example placeholder
    },
    {
        full_price: 13000,
        ticket_price: 1300,
        tickets_bought: 3,
        tickets_total: 340,
        end_timestamp: 1715025020,
        nft_name: "Azuki #719",
        nft_image: "719_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 8,
        token_id: "719",
        network: "GOERLI",
        collection_name: "Azuki",
        is_verified: false,
        is_favorite: true,
        favorites_count: 12,
        count_views: 120,
    },
    {
        full_price: 2300,
        ticket_price: 3700,
        tickets_bought: 0,
        tickets_total: 954,
        end_timestamp: 1715111420,
        nft_name: "Doodle #705",
        nft_image: "705_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 9,
        token_id: "705",
        network: "GOERLI",
        collection_name: "Doodles",
        is_verified: true,
        is_favorite: false,
        favorites_count: 7,
        count_views: 70,
    },
    {
        full_price: 30000,
        ticket_price: 3000,
        tickets_bought: 1,
        tickets_total: 188,
        end_timestamp: 1715111420,
        nft_name: "Azuki #96",
        nft_image: "96_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 10,
        token_id: "96",
        network: "GOERLI",
        collection_name: "Azuki",
        is_verified: false,
        is_favorite: true,
        favorites_count: 15,
        count_views: 150,
    },
    {
        full_price: 37000,
        ticket_price: 3700,
        tickets_bought: 1,
        tickets_total: 791,
        end_timestamp: 1715975420,
        nft_name: "DeGod #343",
        nft_image: "343_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 11,
        token_id: "343",
        network: "GOERLI",
        collection_name: "DeGods",
        is_verified: true,
        is_favorite: false,
        favorites_count: 20,
        count_views: 200,
    },
    {
        full_price: 31000,
        ticket_price: 3100,
        tickets_bought: 1,
        tickets_total: 612,
        end_timestamp: 1715975420,
        nft_name: "DeGod #886",
        nft_image: "886_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 12,
        token_id: "886",
        network: "GOERLI",
        collection_name: "DeGods",
        is_verified: false,
        is_favorite: true,
        favorites_count: 25,
        count_views: 250,
    },
    {
        full_price: 1000,
        ticket_price: 100,
        tickets_bought: 3,
        tickets_total: 421,
        end_timestamp: 1715407420,
        nft_name: "Azuki #343",
        nft_image: "343_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 2,
        token_id: "343",
        network: "GOERLI",
        collection_name: "Azuki",
        is_verified: true,
        is_favorite: false,
        favorites_count: 0,
        count_views: 0,
    },
    {
        full_price: 33000,
        ticket_price: 3300,
        tickets_bought: 1,
        tickets_total: 22,
        end_timestamp: 1715197820,
        nft_name: "W#635",
        nft_image: "635_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 20,
        token_id: "635",
        network: "GOERLI",
        collection_name: "Wrapped Cryptopunks",
        is_verified: true,
        is_favorite: false,
        favorites_count: 0,
        count_views: 0,
    },
    {
        full_price: 240000,
        ticket_price: 4000,
        tickets_bought: 21,
        tickets_total: 21,
        end_timestamp: 1715533544,
        nft_name: "W#872",
        nft_image: "872_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 3,
        token_id: "872",
        network: "GOERLI",
        collection_name: "Wrapped Cryptopunks",
        is_verified: true,
        is_favorite: false,
        favorites_count: 10, // Example placeholder
        count_views: 100, // Example placeholder
    },
    {
        full_price: 2000,
        ticket_price: 200,
        tickets_bought: 1,
        tickets_total: 353,
        end_timestamp: 1715506620,
        nft_name: "Doodle #246",
        nft_image: "246_goerli.png",
        nft_owner: "0xebFC7A970CAAbC18C8e8b7367147C18FC7585492",
        asset_type: "ERC721",
        nft_id: 4,
        token_id: "246",
        network: "GOERLI",
        collection_name: "Doodles",
        is_verified: false,
        is_favorite: true,
        favorites_count: 25, // Example placeholder
        count_views: 250, // Example placeholder
    },
];

export default function RaffleList() {
    // Local states
    // const [raffleList, setRaffleList] = useState<RaffleCard[]>([]);
    const [raffleList, setRaffleList] = useState<RaffleCard[]>([]);
    const [nextCursor, setNextCursor] = useState(0);
    const [sortOptions, setSortOptions] = useState<SortOption[]>([
        { id: "trending", name: "Trending", href: "#", current: false },
        { id: "tickets_remaining", name: "% Tickets Remaining", href: "#", current: false },
        { id: "newest", name: "Newest", href: "#", current: true },
        { id: "oldest", name: "Oldest", href: "#", current: false },
        { id: "time_remaining", name: "Time remaining", href: "#", current: false },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState<Filter[]>([
        {
            id: "chain",
            name: "Chain",
            options: [
                { value: "eth", label: "Ethereum", checked: false },
                { value: "polygon", label: "Polygon", checked: false },
                { value: "bsc", label: "BSC", checked: false },
                { value: "goerli", label: "Goerli", checked: true },
            ],
        },
        {
            id: "types",
            name: "Types",
            options: [
                { value: "nfts", label: "NFTs", checked: true },
                { value: "ERC20", label: "Tokens", checked: true },
            ],
        },
    ]);

    // Redux
    const userSettingsState = useSelector(selectUserSettingsState);

    // Infinite scroll
    const observer = useRef<IntersectionObserver>();
    const lastRaffleElementRef = useCallback(
        (node: any) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && nextCursor) {
                    // Load more items here
                    // fetchRaffleList();
                }
            });
            if (node) observer.current.observe(node);
        },
        [nextCursor]
    ); // Depend on nextCursor to reinitialize when it changes

    const fetchRaffleList = (): void => {
        const nftsTypes = ["ERC721", "ERC1155"];
        setIsLoading(true);

        // Extract types from filters
        const typesFilter = filters.find((filter: Filter) => filter.id === "types");
        let types = typesFilter ? typesFilter.options.filter((option: FilterOption) => option.checked).map((option: FilterOption) => option.value) : [];
        if (types.includes("nfts")) {
            types = types.filter((type: any) => type !== "nfts").concat(nftsTypes);
        }

        // Extract networks from filters
        const networkFilter = filters.find((filter: Filter) => filter.id === "chain");
        const networks = networkFilter ? networkFilter.options.filter((option: FilterOption) => option.checked).map((option: FilterOption) => option.value.toUpperCase()) : [];

        // Determine sort option
        const selectedSortOption = sortOptions.find((option: SortOption) => option.current)?.id || "time_remaining";

        const requestBody: FetchRafflesRequestBody = {
            pagination: {
                pageSize: 20,
                cursor: nextCursor,
            },
            types: types,
            networks: networks,
            sortBy: selectedSortOption,
        };

        console.log("process.env.NEXT_PUBLIC_API_URL: ", process.env.NEXT_PUBLIC_API_URL);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/nfts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setRaffleList((prevList: RaffleCard[]) => [...prevList, ...data.data.items]); // Append new items
                setNextCursor(data.data.nextCursor);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setRaffleList([]); // Clear the list before fetching new data
        setNextCursor(0); // Reset cursor
        // fetchRaffleList();
        setRaffleList(raffleDemoList);
        console.log("test", typeof userSettingsState.userSettings.style, userSettingsState.userSettings.style);
    }, [sortOptions, filters]); // Dependency array includes sortOptions and filters

    return (
        <>
            <div className="pt-16 pb-8">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Explore Raffles</h1>
                <p className="mt-4 max-w-xl text-sm text-zinc-400">Dive into a world of unique chances and hidden gems. Find your next big win or the perfect addition to your collection — start exploring today!</p>
            </div>
            {/* <div className="sticky -top-[80px] bg-zinc-900 z-[30] sm:mx-0"> */}
            <div className="sticky sm:-top-[50px] -top-[25px] bg-zinc-900 z-[30] sm:mx-0 pt-8 pb-4">
                <Filters filters={filters} setFilters={setFilters} sortOptions={sortOptions} setSortOptions={setSortOptions} />
                <CardSettings showStyle={true} showDisplay={false} />
            </div>
            <div
                className={classNames(
                    "flex flex-wrap sm:grid sm:gap-x-3 gap-y-4 lg:gap-y-3 mt-5 xl:mt-5",
                    // userSettingsState.userSettings.style === 1 && "sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",
                    userSettingsState.userSettings.style === 1 && "justify-center gap-x-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8",
                    userSettingsState.userSettings.style === 2 && "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-5 4xl:grid-cols-6",
                    userSettingsState.userSettings.style === 3 && "grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 4xl:grid-cols-6"
                )}
            >
                {raffleList.map((item: any, index: number) => (
                    <>
                        <span
                            className={classNames(userSettingsState.userSettings.style === 1 && "w-[calc(33.33%-.45rem)] sm:w-full inline-block", "w-full")}
                            ref={index === raffleList.length - 1 ? lastRaffleElementRef : null}
                            key={item.nft_id}
                        >
                            {userSettingsState.userSettings.style === 1 && <RaffleMetaWin {...item} />}
                            {userSettingsState.userSettings.style === 2 && <RaffleEse {...item} />}
                            {userSettingsState.userSettings.style === 3 && <RaffleDefault {...item} />}
                        </span>
                    </>
                ))}
            </div>
            {isLoading && (
                <div role="status" className="py-10 text-center">
                    <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-jade-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </>
    );
}
