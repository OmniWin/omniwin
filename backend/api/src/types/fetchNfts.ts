// import { NftRepository } from "../repositories/nftRepository";

// type ResolvedType<T> = T extends Promise<infer R> ? R : T;
// export type FetchNFTsResultType = ResolvedType<ReturnType<InstanceType<typeof NftRepository>['fetchNFTs']>>;

import { AssetType, NetworkType } from "@prisma/client";

export type FetchNFTsResultType = {
    items: {
        full_price: number;
        ticket_price: number;
        tickets_bought: number;
        tickets_total: number;
        end_timestamp: Date;
        nft_name: string;
        nft_image: string;
        nft_owner: string;
        asset_type: AssetType;
        nft_id: number;
        token_id: string;
        network: NetworkType;
    }[],
    nextCursor: string | null;
}