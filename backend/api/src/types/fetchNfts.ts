import { NftRepository } from "../repositories/nftRepository";

type ResolvedType<T> = T extends Promise<infer R> ? R : T;
export type FetchNFTsResultType = ResolvedType<ReturnType<InstanceType<typeof NftRepository>['fetchNFTs']>>;
