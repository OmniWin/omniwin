import { useEffect, useState } from "react";

// Components
import Filters from "./Filters";
import RaffleMetaWin from "../Raffle/RaffleMetaWin";
import RaffleEse from "../Raffle/RaffleEse";
import RaffleDefault from "../Raffle/RaffleDefault";
import CardSettings from "../Raffle/CardSettings";

// Redux Hooks
import { useSelector } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";
import { classNames } from "@/app/utils";

// Types
import {FetchNFTsResultType} from "../../../../backend/api/src/types/fetchNfts";
import { Filter, SortOption, FetchRequestBody } from "@/app/types";

const raffleList = [
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "10,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "12,200",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/2.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/3.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1,000,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/4.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "15,000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/5.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50K",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/6.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/7.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/8.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmNf1UsmdGaMbpatQ6toXSkzDpizaGmC9zfunCyoz1enD5/penguin/2674.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "12.22K",
        currency: "USDC",
        image: "https://metadata.degods.com/g/1792-dead.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50K",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmUUnTTWCrnfkVCv2gU8Mpdzeu2PR867kdjWeZBCoKCUVZ",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/2029.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 33279,
        title: "Doodles",
        price: "12.22K",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmSxtE6WeLDVNsSnmBtADoRDWqdHMEKRSG1MXBhkiRw1jY",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 10276,
        title: "BoredApeYachtClub",
        price: "50K",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/QmdfqpbAhx9BQrZqY1UR3RpuGUmPe2jkXMVXC9drCBjQZG",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://ipfs.raribleuserdata.com/ipfs/Qmb7rsvrzTfHhB9aJxygWhR1mSkpsTcWuqNZD1zPgP9V1D",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
    {
        id: 9750,
        title: "BoredApeYachtClub",
        price: "1000",
        currency: "USDC",
        image: "https://metadata.degods.com/g/1570-dead.png",
        chain: "Goerli Network",
        chainIcon: "/icons.svg#ethereumChain",
        tickets: 50,
        raisedTickets: 5,
        endingIn: "1 day",
    },
];

export default function RaffleList() {
    // const [raffleList, setRaffleList] = useState([] as FetchNFTsResultType);
    const [nextCursor, setNextCursor] = useState(0);
    const userSettingsState = useSelector(selectUserSettingsState);

    const [sortOptions, setSortOptions] = useState<SortOption[]>([
        { id: "tickets_remaining", name: "% Tickets Remaining", href: "#", current: true },
        { id: "newest", name: "Newest", href: "#", current: false },
        { id: "oldest", name: "Oldest", href: "#", current: false },
        { id: "time_remaining", name: "Time remaining", href: "#", current: false },
    ]);
    const [filters, setFilters] = useState<Filter[]>([
        {
            id: "chain",
            name: "Chain",
            options: [
                { value: "eth", label: "Ethereum", checked: false },
                { value: "polygon", label: "Polygon", checked: false },
                { value: "bsc", label: "BSC", checked: true },
            ],
        },
        {
            id: "types",
            name: "Types",
            options: [
                { value: "nfts", label: "NFTs", checked: false },
                { value: "ERC20", label: "Tokens", checked: false },
            ],
        },
    ]);

    const fetchRaffleList = (): void => {
        const nftsTypes = ["ERC721", "ERC1155"];

        // Extract types from filters
        const typesFilter = filters.find((filter) => filter.id === "types");
        let types = typesFilter ? typesFilter.options.filter((option) => option.checked).map((option) => option.value) : [];
        if (types.includes("nfts")) {
            types = types.filter((type) => type !== "nfts").concat(nftsTypes);
        }

        // Extract networks from filters
        const networkFilter = filters.find((filter) => filter.id === "chain");
        const networks = networkFilter ? networkFilter.options.filter((option) => option.checked).map((option) => option.value) : [];

        // Determine sort option
        const selectedSortOption = sortOptions.find((option) => option.current)?.id || "time_remaining";

        const requestBody: FetchRequestBody = {
            pagination: {
                pageSize: 10,
                offset: nextCursor,
            },
            types: types,
            networks: networks,
            sortBy: selectedSortOption,
        };

        fetch("https://api-omniwin.web3trust.app/v1/nfts", {
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
                // setRaffleList(data.data.items);
                // setNextCursor(data.data.nextCursor);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };



    useEffect(() => {
        fetchRaffleList();
    }, [sortOptions, filters]);

    return (
        <>
            <Filters filters={filters} setFilters={setFilters} sortOptions={sortOptions} setSortOptions={setSortOptions} />
            <CardSettings showStyle={true} showDisplay={true} />
            <div
                className={classNames(
                    "flex flex-wrap sm:grid sm:gap-x-3 gap-y-4 lg:gap-y-3 mt-5 xl:mt-5",
                    // userSettingsState.userSettings.style === 1 && "sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",
                    userSettingsState.userSettings.style === 1 && "sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8",
                    userSettingsState.userSettings.style === 2 && "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-5 4xl:grid-cols-6",
                    userSettingsState.userSettings.style === 3 && "grid gap-3 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 4xl:grid-cols-6"
                )}
            >
                {raffleList.map((item) => (
                    <>
                        {userSettingsState.userSettings.style === 1 && <RaffleMetaWin {...item} />}
                        {userSettingsState.userSettings.style === 2 && <RaffleEse {...item} />}
                        {userSettingsState.userSettings.style === 3 && <RaffleDefault {...item} />}
                    </>
                ))}
            </div>
        </>
    );
}
