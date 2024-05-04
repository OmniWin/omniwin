import abi from "./Omniwin.json" assert { type: "json" };
import { ethers } from "ethers";
import { mysqlInstance } from './MysqlRepository';
import PQueue from 'p-queue';

const providerPath = "wss://bsc-testnet-rpc.publicnode.com";
export const provider = new ethers.WebSocketProvider(providerPath);

/** BSC Testnet new contract*/
const mainContractAddress = "0xEb0Af68e467B2F2E68Aa9995DDAA2ef300c85D94"; 
const contract = new ethers.Contract(mainContractAddress, abi, provider) as unknown as any;

const queue = new PQueue({
    concurrency: 2,
});


async function fetchHistoricalEvents(contract, eventName, provider) {
  const currentBlock = await provider.getBlockNumber();
  const startBlock = 40005720;

  const eventFilter = contract.filters[eventName]();
  const events = await contract.queryFilter(eventFilter, startBlock, currentBlock);

  console.log(`Fetched ${events.length} historical events`);

  for (const event of events) {
    try {
        const raffleData = await processEvent(event, eventName);
        await mysqlInstance.insertRaffle(raffleData);
    } catch (error) {
        console.error('Error processing event:', error);
    }
  }
}



function listenForNewEvents(contract, eventName) {
  contract.on(eventName, (...args) => {
      const event = args.pop();
      console.log(`New event received:`, event);
      queue.add(() => processEvent(event, eventName));
  });

  console.log(`Listening for new ${eventName} events...`);
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


/** process Events Data Start*/

async function processEvent(event, eventName: String) {
  switch (eventName) {
      case 'CreateRaffle':
          return await processCreateRaffleEvent(event);
      default:
          throw new Error(`Unhandled event type: ${eventName}`);
  }
}

async function processCreateRaffleEvent(event) {
  const blockTimestamp = await getBlockTimestamp(event.blockNumber);
  const deadline = event.args.deadline.toString();

  return {
      id: event.args.raffleId,
      chainId: 2, //dynamic , get it from provider array
      status: 'money_raised',
      assetType: event.args.assetType,
      prizeAddress: event.args.nftAddress,
      prizeNumber: event.args.nftId, //string -> convert it into string or if 
      blockTimestamp: blockTimestamp,
      ownerAddress: event.args.seller,
      minFundsToRaise: event.args.minimumFundsInWei, //make it string or it is , check
      countViews: 0,
      winnerAddress: null,
      claimedPrize: false,
      deadline: new Date(deadline * 1000).toISOString().slice(0, 19).replace('T', ' ')
  };
}

/** process Events Data End */

async function main() {
  const eventName = "CreateRaffle";

  await fetchHistoricalEvents(contract, eventName, provider);
  listenForNewEvents(contract, eventName);
}

main().catch(console.error);
