import abi from "./Omniwin.json" assert { type: "json" };
import { ethers } from "ethers";
import conn from './mysql';
import { mysqlInstance } from './MysqlRepository';
import PQueue from 'p-queue';
import Redis from 'ioredis';

const providerPath = "wss://bsc-testnet-rpc.publicnode.com";
export const provider = new ethers.WebSocketProvider(providerPath);

/** BSC Testnet new contract*/
const mainContractAddress = "0xEb0Af68e467B2F2E68Aa9995DDAA2ef300c85D94"; 
const contract = new ethers.Contract(mainContractAddress, abi, provider) as unknown as any;

const queue = new PQueue({
    concurrency: 2,
});

/** REDIS START */
const redis = new Redis();
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

      try{
        queue.add(() => processEvent(args[length - 1], eventName));
      }catch(e){
        console.log(e)
      }
  });
  
}

async function getBlockTimestamp(blockNumber) {
  try {
      const block = await provider.getBlock(blockNumber);
      if (block) {
          return block.timestamp;
      } else {
          console.log('No block information found');
      }
  } catch (error) {
      console.error('Error fetching block:', error);
  }
}

async function getTransactionStatus(txHash) {
  try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
          console.log(`Transaction status: ${receipt.status ? 'Success' : 'Failed'}`);
          return receipt.status;
      } else {
          console.log('Transaction receipt not found.');
          return null;
      }
  } catch (error) {
      console.error('Error fetching transaction status:', error);
      throw error;
  }
}

/** process Events Data Start*/
async function processCreateRaffleEvent(event: any) {
  let connection; 
  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const blockTimestamp = await getBlockTimestamp(event.blockNumber);
    const deadline = event.args.deadline.toString();

    const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
      `${event.transactionHash}${event.index}`
    ));

    const existEventInRedis = await getEventFromRedis(uniqueID);

    if (existEventInRedis) {
      return true;
    } else {
      const raffleData = {
          id: event.args.raffleId,
          chainId: 2,
          status: 'money_raised',
          assetType: event.args.assetType,
          prizeAddress: event.args.nftAddress,
          prizeNumber: event.args.nftId.toString(),
          blockTimestamp: blockTimestamp,
          ownerAddress: event.args.seller,
          minFundsToRaise: event.args.minimumFundsInWei.toString(),
          countViews: 0,
          winnerAddress: null,
          claimedPrize: false,
          deadline: new Date(deadline * 1000).toISOString().slice(0, 19).replace('T', ' ')
      };

      const blockchainEvent = await processBlockchainEvent(event, "CreateRaffle");
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

async function processCreateRaffleToSidechainEvent(event: any) {
  let connection; 
  try {
    connection = await conn.getConnection();
    await connection.beginTransaction();

    const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
      `${event.transactionHash}${event.index}`
    ));

    const existEventInRedis = await getEventFromRedis(uniqueID);
    const transactionStatus = await getTransactionStatus(event.transactionHash)
    .catch(error => {
      console.error('Failed to fetch transaction status:', error);
      return null});

    if (existEventInRedis) {
      return true;
    } else {
      const raffleData = {
          raffleId: event.args.raffleId,
          chainId: 2,
          status: transactionStatus,
          receiver: event.args.receiver
      };

      const blockchainEvent = await processBlockchainEvent(event, "CreateRaffleToSidechain");
      await mysqlInstance.insertRaffleToSidechain(raffleData);
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

async function processBlockchainEvent(event, eventName) {

  const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
    `${event.transactionHash}${event.index}`
  ));

  const transactionStatus = await getTransactionStatus(event.transactionHash)
    .catch(error => {
      console.error('Failed to fetch transaction status:', error);
      return null});

  
  const newBlockchainEvent = {
    id: uniqueID,
    raffleId: event.args.raffleId,
    name: eventName,
    json: event,
    statusParsing: transactionStatus,
    statusMessage: transactionStatus == 1 ? 'Succesful transaction' : event.message,
    createdAt: new Date() as Date
  };

  console.log("BlockchainEvent processed success: ", newBlockchainEvent);

  return newBlockchainEvent;
}

async function processEvent(event: any, eventName: String) {
  switch (eventName) {
      case 'CreateRaffle':
          return await processCreateRaffleEvent(event);
      case 'CreateRaffleToSidechain':
          return await processCreateRaffleToSidechainEvent(event);
      case 'BuyEntry':
          return await processBuyEntryEvent(event);
            
      default:
          throw new Error(`Unhandled event type: ${eventName}`);
  }
}

/** process Events Data End */

async function fetchHistoricalEvents(contract:any, eventName: string, provider) {
  const currentBlock = await provider.getBlockNumber();
  const startBlock = 40005720;

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

  await fetchHistoricalEvents(contract, eventName, provider);
  listenForNewEvents(contract, eventName);
}

main().catch(console.error);
