import { EventQueue } from "../queue/EventQueue";
import { ethers } from "ethers";
import { blocksByTime, getNFTData, cleanHashLots } from "../utils";
import { insertBuyTickets } from "../contractInteractions/insertBuyTickets";
import { getLotByID } from "../contractInteractions/contractMain";
import config from "../contracts/contractConfig";
import { mysqlInstance } from '../repository/MysqlRepository';

type HashLots = {
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
}

type EventTicketCustom = {
    lotID: number,
    recipient: string,
    totalTickets: number,
    amount: number,
    tokensSpent: number,
    bonus: number,
    uniqueID: string,
}

export async function processTickets() {
    const eventQueue = new EventQueue<any>();
    let hashLots = {} as HashLots;

    const createBuyTicketsEvent = config.contract.getEvent("BuyTickets");
    config.contract.on(createBuyTicketsEvent, async (ID, recipient, totalTickets, amount, tokensSpent, bonus, event: any) => {
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
        } as EventTicketCustom

        //after we processed all buy tickets, we enqueue events to be processed in order
        eventQueue.enqueue(ticketData, () => processBuyTicketEvent(ticketData, hashLots, uniqueID, lotID));

    });

    //We first get all the tickets from the chain and insert them in our db
    const timeFromBlock = 60 * 10; //10 minutes
    const numberOfBlocks = blocksByTime(config.network, timeFromBlock)
    eventQueue.enqueue("", () => insertBuyTickets(numberOfBlocks, config.contract));

    setInterval(() => {
        cleanHashLots(hashLots);
    }, 60000);
}


async function processBuyTicketEvent(ticketData: EventTicketCustom, hashLots: HashLots, uniqueID: string, lotID: number) {
    if (hashLots[lotID] === undefined) {
        //first time we see lot in ur hashmap. We want to create a starting point for the hashmap 
        //1. Get all tickets from chain last X days
        //2. Now that we have all ticket events in our db, we can get the lot data from the chain. We should now have a starting point for our hashmap (all tickets up until current event in db, clean totalTickets count)
        const nftData = await getLotByID(config.contract, lotID);
        await mysqlInstance.insertNFT(nftData);


        //3. Get all tickets from db
        const ticketsDB = await mysqlInstance.getTicketsByLotID(lotID)
        hashLots[lotID] = {
            timestamp: Date.now(),
            tickets: ticketsDB
        }

        if (ticketsDB.length === 0) {
            //first insert
            const dataToInsert = await getLotByID(config.contract, lotID);
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
