import { ChainIds} from '../config/config'

export type CreateRaffleEvent = {
    log: {
      transactionHash: string;
      blockHash: string;
      blockNumber: number;
      removed: boolean;
      address: string;
      data: string;
      topics: string[];
      index: number;
      transactionIndex: number;
      interface: any;
    fragment: any;
    },
    blockNumber: number;
    args: {
      raffleId: string;
      nftAddress: string;
      nftId: BigInt;
      assetType: BigInt;
      seller: string;
      minimumFundsInWei: BigInt;
      blockTimestamp: BigInt;
      deadlineDuration: BigInt;
    };
  }

export type CreateRaffleToSidechainEvent = {
    log: {
      transactionHash: string;
      blockHash: string;
      blockNumber: number;
      removed: boolean;
      address: string;
      data: string;
      topics: string[];
      index: number;
      transactionIndex: number;
      interface: any;
    fragment: any;
    },
    blockNumber: number;
    args: {
      raffleId: string;
      receiver: string;
      chainSelector: BigInt;
      gasLimit: BigInt;
      messageId: string;
    };
  }

export type BuyEntryEvent = {
    log: {
      transactionHash: string;
      blockHash: string;
      blockNumber: number;
      removed: boolean;
      address: string;
      data: string;
      topics: string[];
      index: number;
      transactionIndex: number;
      interface: any;
    fragment: any;
    },
    blockNumber: number;
    args: {
      raffleId: string;
      buyer: string;
      price: number;
      numEntries: number;
      amountRaised: number;
      totalNumEntries: number;
      priceStructureId: number;
      blockTimestamp: BigInt;
    };
  }

export type RaffleInsert = {
  id: string;
  chainId: ChainIds;
  contractAddress: any;
  status: string;
  assetType: BigInt;
  prizeAddress: string;
  prizeNumber: string;
  blockTimestamp: string;
  ownerAddress: string;
  minFundsToRaise: string,
  countViews: number,
  winnerAddress: string | null,
  claimedPrize: boolean,
  deadline: string

}

export type BlockchainEvent = {
  id: string;
  raffleId: string;
  name: string;
  json: any;
  statusParsing: string;
  statusMessage: null;
  createdAt: Date;
}

export type sideChainInsertEvent = {
  raffleId: string;
  chainId: number;
  receiver: string;
  chainSelector: string;
  gasLimit: BigInt;
  messageId: string;
  status: string;
}

export type BuyEntryInsertEvent = {
    tx: string;
    eventId: string;
    chainId: ChainIds;
    raffleId: string;
    buyerAddress: string;
    numberOfEntries: number;
    valueOfTickets: number;
    totalEntriesBought: number;
    totalRaisedAmount: number;
    priceStructureId: number;
    claimed: boolean;
    blockNumber: number;
    blockTimestamp: string;
    hasArrived: boolean;
}
