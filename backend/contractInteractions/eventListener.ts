// eventListener.ts
import { ethers } from "ethers";
import mainABI from './abi/mainABI.json';
import { MainABI } from './types/MainABI'; // Import the TypeChain-generated type
import { mysqlInstance } from './repository/MysqlRepository';
// import logger from "./log/winston";
// import util from "util";
import { getLotByID } from "./contractInteractions/contractMain";
import { goerliProvider } from "./providers/goerli";
import { insertBuyTickets } from "./scripts/insertBuyTickets";
import { blocksByTime, getNFTData, cleanHashLots } from "./utils";
import { EventQueue } from "./queue/EventQueue";

const mainContractAddress = "0xa03167de1a56160e4647d77d81e9139af55b63d4";
const contract = new ethers.Contract(mainContractAddress, mainABI, goerliProvider) as unknown as MainABI;
const network = "goerli";

const eventQueue = new EventQueue<any>();


async function listenForEvents() {

  await insertBuyTickets(0, contract, true); //insert all tickets from the beginning of the contract

  let hashLots = {} as {
    [key: number]: {
      timestamp: number,
      tickets: {
        id_ticket: number,
        id_lot: number,
        recipient: string,
        totalTickets: number,
        amount: number,
        tokensSpent: number,
        bonus: number,
        created_at: Date,
        updated_at: Date,
        uniqueID: string,
      }[]
    }
  };



  const createBuyTicketsEvent = contract.getEvent("BuyTickets");
  contract.on(createBuyTicketsEvent, async (ID, recipient, totalTickets, amount, tokensSpent, bonus, event: any) => {
    console.log("BuyTickets event fired", { ID, recipient, totalTickets, amount, tokensSpent, bonus });
    //recipient = the buyer
    //tokensSpent = ticketPrice * amount
    //amount = how many tickets bought
    //bonus = how many bonus tickets he received based on the amount of tickets bought
    //totalTickets = total tickets bought (this includes also the tickets bought in previous transactions)
    const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
      `${event.log.transactionHash}${event.log.index}`
    ));

    const lotID = Number(ID);

    const ticketData = {
      lotID: lotID,
      recipient,
      totalTickets: Number(totalTickets),
      amount: Number(amount),
      tokensSpent: Number(tokensSpent),
      bonus: Number(bonus),
      uniqueID: uniqueID,
    } as {
      lotID: number,
      recipient: string,
      totalTickets: number,
      amount: number,
      tokensSpent: number,
      bonus: number,
      uniqueID: string,
    }

    //after we processed all buy tickets, we enqueue events to be processed in order
    eventQueue.enqueue(ticketData, () => processBuyTicketEvent(ticketData, hashLots, uniqueID, lotID));

  });

  //We first get all the tickets from the chain and insert them in our db
  const timeFromBlock = 60 * 10; //10 minutes
  const numberOfBlocks = blocksByTime(network, timeFromBlock)
  eventQueue.enqueue("", () => insertBuyTickets(numberOfBlocks, contract));

  setInterval(() => {
    cleanHashLots(hashLots);
  }, 60000);
}

listenForEvents();

async function processBuyTicketEvent(ticketData: {
  lotID: number,
  recipient: string,
  totalTickets: number,
  amount: number,
  tokensSpent: number,
  bonus: number,
  uniqueID: string,
}, hashLots: {
  [key: number]: {
    timestamp: number,
    tickets: {
      id_ticket: number,
      id_lot: number,
      recipient: string,
      totalTickets: number,
      amount: number,
      tokensSpent: number,
      bonus: number,
      created_at: Date,
      updated_at: Date,
      uniqueID: string,
    }[]
  }
}, uniqueID: string, lotID: number) {
  if (hashLots[lotID] === undefined) {
    //first time we see lot in ur hashmap. We want to create a starting point for the hashmap 
    //1. Get all tickets from chain last X days
    //2. Now that we have all ticket events in our db, we can get the lot data from the chain. We should now have a starting point for our hashmap (all tickets up until current event in db, clean totalTickets count)
    const nftData = await getLotByID(contract, lotID);
    await mysqlInstance.insertNFT(nftData);


    //3. Get all tickets from db
    const ticketsDB = await mysqlInstance.getTicketsByLotID(lotID)
    hashLots[lotID] = {
      timestamp: Date.now(),
      tickets: ticketsDB
    }

    if (ticketsDB.length === 0) {
      //first insert
      const dataToInsert = await getLotByID(contract, lotID);
      const nftMetadata = await getNFTData(dataToInsert.token, dataToInsert.tokenID, dataToInsert.assetType);
      const nftID = await mysqlInstance.insertNFT(dataToInsert);
      await mysqlInstance.insertMetadata(nftID, dataToInsert.lotID, nftMetadata);
    }

    if (ticketsDB.length > 0) {
      //check if incoming ticket is already in the db
      const ticket = ticketsDB.find(ticket => ticket.uniqueID === uniqueID);
      if (ticket === undefined) {
        //insert new ticket
        await mysqlInstance.buyTickets(ticketData);
        //update totalTickets in NFT table
        await mysqlInstance.incrementTotalTickets(lotID);
      }
    }
  }
}
