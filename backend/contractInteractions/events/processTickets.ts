import { EventQueue } from "../queue/EventQueue";
import { ethers } from "ethers";
import { blocksByTime } from "../utils";
import { insertBuyTickets } from "../scripts/insertBuyTickets";
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
    block: number,
    transactionHash: string,
    network: string

}

export async function processTickets() {
    const eventQueue = new EventQueue<any>();
    let hashLots = {} as HashLots;

    const createBuyTicketsEvent = config.contract.getEvent("BuyTickets");
    config.contract.on(createBuyTicketsEvent, async (ID, recipient, totalTickets, amount, tokensSpent, bonus, event: any) => {
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
            block: event.log.blockNumber,
            transactionHash: event.log.transactionHash,
            network: config.network
        } as EventTicketCustom

        console.log("BuyTickets event fired", ticketData);

        //after we processed all buy tickets, we enqueue events to be processed in order
        eventQueue.enqueue(ticketData, () => processBuyTicketEvent(ticketData, hashLots, uniqueID, lotID));

    });

    //We first get all the tickets from the chain and insert them in our db
    const timeFromBlock = 60 * 10; // 
    const numberOfBlocks = blocksByTime(config.network, timeFromBlock)
    eventQueue.enqueue("", () => insertBuyTickets(numberOfBlocks));
}


async function processBuyTicketEvent(ticketData: EventTicketCustom, hashLots: HashLots, uniqueID: string, lotID: number) {
    if (hashLots[lotID] === undefined) {
        //3. Get all tickets from db
        const ticketExists = await mysqlInstance.ticketExists(uniqueID)

        if (!ticketExists) {
            //insert new ticket
            await mysqlInstance.buyTickets(ticketData);
        }
    }
}

processTickets().catch((error) => {
    console.error(error);
    process.exit(1);
});