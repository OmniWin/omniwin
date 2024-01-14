export type NFT = {
    lotID: number;
    totalTickets: number;
    bonusTickets: number;
    ticketsBought: number;
    ticketPrice: number;
    transactions: number;
    endTimestamp: number;
    fee: number;
    closed: boolean;
    buyout: boolean;
    assetClaimed: boolean;
    tokensClaimed: boolean;
    owner: string;
    token: string;
    tokenID: string;
    amount: string;
    assetType: number;
    data: string;
}

export type NFTMetadata = {
    id_nft: number;
    name: string;
    image: string;
    json: any;
    image_url: string;
    image_local: string;
    [key: string]: any;
}

export enum AssetType {
    ERC20 = 2,
    ERC721 = 0,
    ERC1155 = 1
}