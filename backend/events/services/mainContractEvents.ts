import { ethers } from "ethers";
import util from 'util';
import mysqlInstance from './mysqlService';
import redisService from './redisService'
import {SelectorChainId, listenerConfig, ChainIds} from '../config/config'
import { CreateRaffleToSidechainEvent, BuyEntryEvent } from '../types';
import  {mysqlRepository} from '../repository/MysqlRepository';
import QueueService from '../queue/pqueue';
import PQueue from 'p-queue';
import { ASSET_TYPE, CreateRaffleEvent } from '../types';
import {getNFTData} from './nftService'
import { Pool, PoolConnection } from 'mysql2/promise';
import logger from '../log/logger';
import { log } from "winston";

class MainContractEvents {
    private queue:  PQueue;
    private chainId: ChainIds;
    constructor(chainId: ChainIds) {
      this.queue = QueueService.getInstance(chainId).getQueue();
      this.chainId = chainId;
    }

    async fetchHistoricalEvents(contract:any, eventNames: string[], provider: ethers.Provider, startBlock: number) {
      const currentBlock = await provider.getBlockNumber();

      for(const eventName of eventNames) {
          const eventFilter = contract.filters[eventName]();
          const events = await contract.queryFilter(eventFilter, startBlock, currentBlock);
        
          logger.info({
            message: `Fetched ${events.length} historical events`,
            eventName,
            eventCount: events.length,
            startBlock,
            currentBlock
          });
    
        
          for (const event of events) {
            try {
              if(event?.log === undefined) {
                //Depending on RPC provider, the event object might not have a log property
                event.log = event;
              }

              const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
                `${event.log.transactionHash}${event.log.index}`
              ));

              logger.info({
                message: `Processing event`,
                eventName,
                uniqueID,
                transactionHash: event.transactionHash,
              });

              await this.processEvent(event, eventName);
            } catch (error) {
                logger.error(`[fetchHistoricalEvents] -> ${error}`);
            }
          }
      }
    }
      
      
    async listenForNewEvents(contract:any, eventNames: string[]) {
      for(const eventName of eventNames) { 
        const createBuyTicketsEvent = contract.getEvent(eventName);

        logger.info(`Listening for new ${eventName} events...`);

        contract.on(createBuyTicketsEvent, (...args: any[]) => {
          const length = args.length;
          console.log(`Received ${eventName} event with ${length} arguments`);
          try{
            this.queue.add(() => this.processEvent(args[length - 1], eventName));
          }catch(e){
            console.log(e)
          }
        });
      }
    }


    async processEvent(event: any, eventName: string) {
        if(event?.log === undefined) {
          //Depending on RPC provider, the event object might not have a log property
          event.log = event;
        }

        switch (eventName) {
            case 'CreateRaffle':
                return await this.processCreateRaffleEvent(event, eventName);
            case 'CreateRaffleToSidechain':
                return await this.processCreateRaffleToSidechainEvent(event, eventName);
            case 'EntrySold':
                return await this.processBuyEntryEvent(event, eventName);
                  
            default:
                throw new Error(`Unhandled event type: ${eventName}`);
        }
      }

      
  async processCreateRaffleToSidechainEvent(event: CreateRaffleToSidechainEvent, eventName: string) {
    let connection: PoolConnection | null = null; 
    try {
      connection = await mysqlInstance.getConnection();
      await connection.beginTransaction();

      const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
        `${event.log.transactionHash}${event.log.index}`
      ));

      const existEventInRedis = await redisService.getEventFromRedis(uniqueID);
      
      if (existEventInRedis) {
        logger.info(`Event already processed`, {
          eventName,
          uniqueID
        });
        return true;
      } else {
        const raffleData = {
            raffleId: event.args.raffleId,
            chainId: SelectorChainId[event.args.chainSelector.toString()],
            receiver: event.args.receiver,
            chainSelector: event.args.chainSelector.toString(),
            gasLimit: event.args.gasLimit,
            messageId: event.args.messageId,
            status: 'pending'
        };

        const blockchainEvent = this.processBlockchainEvent(event, eventName, uniqueID);
        await mysqlRepository.insertSidechainRaffle(connection, raffleData);
        logger.info(`Inserted sidechain raffle`,{
          uniqueID: uniqueID,
          ...raffleData
        });
        await mysqlRepository.insertBlockchainEvent(connection, blockchainEvent);
        logger.info(`Inserted blockchain event`, blockchainEvent);

        await connection.commit();

        await redisService.updateRedis(uniqueID);
      }
    } catch (error) {
      await connection?.rollback();
      throw new Error(`-> [processCreateRaffleToSidechainEvent] Failed to process and store raffle event: ${error}`);
    } finally {
      connection?.release();
    }

    return true;
  }
        

  
async processBuyEntryEvent(event: BuyEntryEvent, eventName: string) {
  let connection: PoolConnection | null = null;
  try {
    connection = await mysqlInstance.getConnection();
    await connection.beginTransaction();

    const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
      `${event.log.transactionHash}${event.log.index}`
    ));

    const existEventInRedis = await redisService.getEventFromRedis(uniqueID);

    if (existEventInRedis) {
      logger.info(`Event already processed`, {
        eventName,
        uniqueID
      });
      return true;
    } else {
      const entrySold = {
          tx: event.log.transactionHash,
          eventId: uniqueID,
          chainId: this.chainId,
          raffleId: event.args.raffleId,
          buyerAddress: event.args.buyer,
          numberOfEntries: event.args.numEntries,
          valueOfTickets: event.args.price,
          totalEntriesBought: event.args.totalNumEntries,
          totalRaisedAmount: event.args.amountRaised,
          priceStructureId: event.args.priceStructureId,
          blockTimestamp: event.args.blockTimestamp.toString(),
          claimed: false,
          blockNumber: event.blockNumber,
          hasArrived: true
      };
      
      const blockchainEvent = this.processBlockchainEvent(event, eventName, uniqueID);
      await mysqlRepository.insertBuyEntry(connection, entrySold);
      logger.info(`Inserted buy entry`, {
        eventName: eventName,
        uniqueID: uniqueID,
        ...entrySold
      });

      await mysqlRepository.insertBlockchainEvent(connection, blockchainEvent);
      logger.info(`Inserted blockchain event`, blockchainEvent);

      await connection.commit();

      await redisService.updateRedis(uniqueID);
    }
  } catch (error) {
    await connection?.rollback();
    throw new Error(`-> [processBuyEntryEvent] ${error}`);
  } finally {
    connection?.release();
  }

  return true;
}


async processCreateRaffleEvent(event: CreateRaffleEvent,eventName: string) {
  let connection: PoolConnection | null = null;
  try {
    // console.log(util.inspect(event, false, null, true /* enable colors */))
    connection = await mysqlInstance.getConnection();
    await connection.beginTransaction();

    const blockTimestamp = event.args.blockTimestamp.toString(); // timestamp in seconds
    
    //TODO: Check if this is correct, once the contract emits deadlineDuration
    const deadlineDuration = event.args.deadlineDuration.toString(); // duration in seconds (how many seconds from blockTimestamp to deadline)
    // const blockTimestamp = parseInt(deadline) - parseInt(deadlineDuration);

    const deadline = BigInt(blockTimestamp) + BigInt(deadlineDuration)

    const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
      `${event.log.transactionHash}${event.log.index}`
    ));

    const existEventInRedis = await redisService.getEventFromRedis(uniqueID);

    if (existEventInRedis) {
      logger.info(`Event already processed`, {
        eventName,
        uniqueID
      });
      return true;
    } else {
      const raffleData = {
          id: event.args.raffleId,
          chainId: this.chainId,
          contractAddress: listenerConfig[this.chainId].mainContractAddress,
          status: 'money_raised', //TODO: fix status
          assetType: event.args.assetType,
          prizeAddress: event.args.nftAddress,
          prizeNumber: event.args.nftId.toString(),
          blockTimestamp: blockTimestamp,
          ownerAddress: event.args.seller,
          minFundsToRaise: event.args.minimumFundsInWei.toString(),
          countViews: 0,
          winnerAddress: null,
          claimedPrize: false,
          deadline: new Date(parseInt(deadline.toString()) * 1000).toISOString().slice(0, 19).replace('T', ' ')
      };

      const blockchainEvent = this.processBlockchainEvent(event, eventName, uniqueID);
      await mysqlRepository.insertRaffle(connection, raffleData);
      logger.info(`Inserted raffle`, {
        eventName: eventName,
        uniqueID: uniqueID,
        ...raffleData
      });
      await mysqlRepository.insertBlockchainEvent(connection, blockchainEvent);
      logger.info(`Inserted blockchain event`, blockchainEvent);

      const raffleMetadata = {
        raffleId: event.args.raffleId,
        json: {},
        name: '',
        description: '',
        imageUrl: '',
        imageCid: '',
        status: 'success',
        collectionName: '',
        statusMessage: ''
      }
  
      if(event.args.assetType.toString() === ASSET_TYPE.ERC721.toString()) {
        const nftMetadata = await getNFTData(event.args.nftAddress, event.args.nftId.toString(), parseInt(event.args.assetType.toString()), listenerConfig[this.chainId].providerHistoryHttp, this.chainId);

        raffleMetadata.json = nftMetadata;
        raffleMetadata.name = nftMetadata.name;
        raffleMetadata.description = nftMetadata.description;
        raffleMetadata.imageUrl = nftMetadata.image;
        raffleMetadata.imageCid = nftMetadata.image_local;
        raffleMetadata.collectionName = nftMetadata.collectionName;
      } else if(event.args.assetType.toString() === ASSET_TYPE.ERC20.toString()) {
        // ERC-20 Token Contract ABI (only including functions needed for getting name and symbol)
        const tokenAbi = [
          "function name() view returns (string)",
          "function symbol() view returns (string)"
        ];

        //get symbol and name of the token from erc20 contract 
        const tokenContract = new ethers.Contract(event.args.nftAddress, tokenAbi, listenerConfig[this.chainId].providerHistory);

        const symbol = await tokenContract.symbol();
        const name = await tokenContract.name();

        raffleMetadata.json = {symbol, name};
        raffleMetadata.name = name;
        raffleMetadata.description = '';
        raffleMetadata.imageUrl = '';
        raffleMetadata.imageCid = '';
        raffleMetadata.collectionName = '';
      } else if (event.args.assetType.toString() === ASSET_TYPE.ETH.toString()) {
        raffleMetadata.json = {symbol: 'ETH', name: 'Ethereum'};
        raffleMetadata.name = 'Ethereum';
        raffleMetadata.description = '';
        raffleMetadata.imageUrl = '';
        raffleMetadata.imageCid = '';
        raffleMetadata.collectionName = '';
      } else if (event.args.assetType.toString() === ASSET_TYPE.CCIP.toString()) {
        //Prize is not here, its on another chain
        raffleMetadata.json = {symbol: 'CCIP', name: 'CCIP'};
        raffleMetadata.name = 'CCIP';
        raffleMetadata.description = '';
        raffleMetadata.imageUrl = '';
        raffleMetadata.imageCid = '';
        raffleMetadata.collectionName = '';
      }


      await connection.commit();

      await redisService.updateRedis(uniqueID);
    }
  } catch (error) {
    await connection?.rollback();
    throw new Error(`-> [processCreateRaffleEvent] Failed to process and store raffle event: ${error}`);
  } finally {
    connection?.release();
  }

  return true;
}


  processBlockchainEvent(event: any, eventName: string, uniqueID: string) {

    const newBlockchainEvent = {
      id: uniqueID,
      raffleId: event.args.raffleId,
      name: eventName,
      json: event,
      statusParsing: 'success',
      statusMessage: null,
      createdAt: new Date() as Date
    };
  
    return newBlockchainEvent;
  }
}

export default MainContractEvents;