import abi from "./Omniwin.json" assert { type: "json" };
import { ethers } from "ethers";
import conn from './mysql';
import { mysqlInstance } from './MysqlRepository';
import PQueue from 'p-queue';
import Redis from 'ioredis';
import util from 'util';

const providerPathHistoryURL = "https://bsc-testnet-rpc.publicnode.com";
const providerLiveURL = "wss://falling-intensive-smoke.bsc-testnet.quiknode.pro/81d8733025b2515526cbce4707cc78314201c03b/";
const providerLive = new ethers.WebSocketProvider(providerLiveURL);
const providerHistory = new ethers.JsonRpcProvider(providerPathHistoryURL);


/** BSC Testnet new contract*/
const mainContractAddress = "0xEb0Af68e467B2F2E68Aa9995DDAA2ef300c85D94"; 
const contract = new ethers.Contract(mainContractAddress, abi, providerHistory) as unknown as any;

const queue = new PQueue({
    concurrency: 2,
});

/** REDIS START */
const redis = new Redis(
  {
    host: 'localhost',
    port: 6380
  }
);
async function updateRedis(uniqueID) {
  try {
    await redis.set(uniqueID, uniqueID);
    console.log(`Event data saved to Redis with key: ${uniqueID}`);
  } catch (error) {
    console.error('Failed to save event data to Redis:', error);
  }
  console.log("Updating Redis with new raffle and blockchain event data.");
}

async function getEventFromRedis(uniqueID) {
  try {
    const data = await redis.get(uniqueID);
    if (!data) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to retrieve event data from Redis:', error);
    return false;
  }
}
/** REDIS END */

function listenForNewEvents(contract:any, eventName: string) {
  const createBuyTicketsEvent = contract.getEvent(eventName);

  console.log(`Listening for new ${eventName} events...`);

  contract.on(createBuyTicketsEvent, (...args: any[]) => {
    const length = args.length;
    console.log(`Received ${eventName} event with ${length} arguments`);
    try{
      queue.add(() => processEvent(args[length - 1], eventName));
    }catch(e){
      console.log(e)
    }
  });
  
}


/** process Events Data Start*/
async function processCreateRaffleEvent(event: {
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
    deadline: BigInt;
    deadlineDuration: BigInt;
  };
},eventName: string) {

  let connection; 
  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const deadline = event.args.deadline.toString();
    
    //TODO: Check if this is correct, once the contract emits deadlineDuration
    const deadlineDuration = "0"; //event.args.deadlineDuration.toString();
    const blockTimestamp = parseInt(deadline) - parseInt(deadlineDuration);

    const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
      `${event.log.transactionHash}${event.log.index}`
    ));

    const existEventInRedis = await getEventFromRedis(uniqueID);

    if (existEventInRedis) {
      console.log('Event already processed');
      return true;
    } else {
      console.log('Preparing for insert...');
      const raffleData = {
          id: event.args.raffleId,
          chainId: 2,
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
          deadline: new Date(parseInt(deadline) * 1000).toISOString().slice(0, 19).replace('T', ' ')
      };

      const blockchainEvent = processBlockchainEvent(event, eventName, uniqueID);
      await mysqlInstance.insertRaffle(raffleData);
      await mysqlInstance.insertBlockchainEvent(blockchainEvent);

      await connection.commit();

      await updateRedis(uniqueID);
    }
  } catch (error) {
    await connection.rollback();
    console.error('Failed to process and store raffle event:', error);
    throw error;
  } finally {
    connection.release();
  }

  return true;
}

async function processCreateRaffleToSidechainEvent(event: any, eventName: string) {
  let connection; 
  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
      `${event.log.transactionHash}${event.log.index}`
    ));

    const existEventInRedis = await getEventFromRedis(uniqueID);
    
    if (existEventInRedis) {
      return true;
    } else {
      const raffleData = {
          raffleId: event.args.raffleId,
          chainId: 2,
          status: 'success',
          receiver: event.args.receiver
      };

      const blockchainEvent = processBlockchainEvent(event, eventName, uniqueID);
      await mysqlInstance.insertSidechainRaffle(raffleData);
      await mysqlInstance.insertBlockchainEvent(blockchainEvent);

      await connection.commit();

      await updateRedis(uniqueID);
    }
  } catch (error) {
    await connection.rollback();
    console.error('Failed to process and store raffle event:', error);
    throw error;
  } finally {
    connection.release();
  }

  return true;
}

function processBlockchainEvent(event: any, eventName: string, uniqueID: string) {

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

async function processEvent(event: any, eventName: string) {
  console.log(`Processing ${eventName} event...`);
  if(event?.log === undefined) {
    event.log = event;
  }
  switch (eventName) {
      case 'CreateRaffle':
          return await processCreateRaffleEvent(event, eventName);
      case 'CreateRaffleToSidechain':
          return await processCreateRaffleToSidechainEvent(event, eventName);
      case 'BuyEntry':
          // return await processBuyEntryEvent(event);
            
      default:
          throw new Error(`Unhandled event type: ${eventName}`);
  }
}

/** process Events Data End */

async function fetchHistoricalEvents(contract:any, eventName: string, provider: ethers.Provider) {
  const currentBlock = await provider.getBlockNumber();
  const startBlock = 40232451;

  const eventFilter = contract.filters[eventName]();
  const events = await contract.queryFilter(eventFilter, startBlock, currentBlock);

  console.log(`Fetched ${events.length} historical events`);

  for (const event of events) {
    try {
      const raffleData = await processEvent(event, eventName);

    } catch (error) {
        console.error('Error processing event:', error);
    }
  }
}

async function main() {
  const eventName = "CreateRaffle";

  await fetchHistoricalEvents(contract, eventName, providerHistory);
  listenForNewEvents(contract, eventName);
}

main().catch(console.error);
