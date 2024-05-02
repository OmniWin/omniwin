import { ethers } from "ethers";
import PQueue from 'p-queue';
import abi from "./Omniwin.json" assert { type: "json" };
import { mysqlInstance } from '../contractInteractions/repository/MysqlRepository';


export const provider = new ethers.WebSocketProvider("wss://bsc-testnet-rpc.publicnode.com");
const mainContractAddress = "0xE9F8A374399d36e231d4765bb347a39047Bbd2a0"; // BSC Testnet new contract
const contract = new ethers.Contract(mainContractAddress, abi.abi, provider) as unknown as any;

const queue = new PQueue({
    concurrency: 2, // Adjust concurrency level as needed
});

async function processEvent(event) {
  console.log(event.args);
  // Implement your event handling logic here
  // For example, save data to a database or perform some calculations
  return new Promise(resolve => setTimeout(resolve, 1000)); // Simulates async processing delay
}


async function fetchHistoricalEvents(contract, eventName, provider) {
 const currentBlock = await provider.getBlockNumber();

  //const fromBlock = currentBlock - 50000; // Adjust the number to fetch events from more blocks in the past
  const startBlock = 39955806;

  const eventFilter = contract.filters[eventName](); // Replace eventName with the actual event name
  const events = await contract.queryFilter(eventFilter, startBlock, currentBlock);

  console.log(`Fetched ${events.length} historical events`);
  console.log(events);
  events.forEach(event => {
      //let raffleId = event.args.raffleId;

      const raffleData = {
        raffleId: 1,
        chainId: 2,
        status: 'created',
        assetType: event.args.assetType,
        prizeAddress: event.args.nftAddress,
        prizeNumber: event.args.nftId,
        blockTimestamp: getBlockTimestamp(event.blockNumber),
        ownerAddress: '0x8A50887289Fbf44B086C576C59005416c1e61C19'
    };

    // mysqlInstance.insertRaffle(raffleData);

  });
}


function listenForNewEvents(contract, eventName) {
  contract.on(eventName, (...args) => {
      const event = args.pop();
      console.log(`New event received:`, event);
      queue.add(() => processEvent(event));
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

async function main() {
  const eventName = "RaffleStarted";

  await fetchHistoricalEvents(contract, eventName, provider);
  listenForNewEvents(contract, eventName);
}

main().catch(console.error);
