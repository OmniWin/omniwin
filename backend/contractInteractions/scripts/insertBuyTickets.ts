import { ethers } from 'ethers';
import { mysqlInstance } from '../repository/MysqlRepository';
import { goerliProvider } from '../providers/goerli';
import config from "../contracts/contractConfig";


export async function insertBuyTickets(numberOfBlocks: number, all = false) {
    const latestBlock = await goerliProvider.getBlockNumber(); // Get the latest block number
    const blockSize = 1000; // Define the size of each block range for queries
    let fromBlock = latestBlock - numberOfBlocks;

    if (all) {
        fromBlock = 10043386; // 10043386 is the block where the contract was deployed on goerli
    }

    console.log(`Fetching events for block range ${fromBlock} to ${latestBlock}`);

    for (let block = fromBlock; block < latestBlock; block += blockSize) {
        console.log(`Fetching events for block range ${block} to ${block + blockSize - 1}`);
        const endBlock = Math.min(block + blockSize - 1, latestBlock);

        try {
            const eventFilter = config.contract.filters.BuyTickets();
            const events = await config.contract.queryFilter(eventFilter, block, endBlock);

            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                const { ID, recipient, lowerBound, ticketAmount, tokensSpent, bonusTickets } = event.args;
                const uniqueID = ethers.keccak256(ethers.toUtf8Bytes(
                    `${event.transactionHash}${event.index}`
                ));

                const dataToInsert = {
                    lotID: Number(ID),
                    recipient,
                    totalTickets: Number(lowerBound),
                    amount: Number(ticketAmount),
                    tokensSpent: Number(tokensSpent),
                    bonus: Number(bonusTickets),
                    uniqueID: uniqueID,
                    block: block,
                } as {
                    lotID: number,
                    recipient: string,
                    totalTickets: number,
                    amount: number,
                    tokensSpent: number,
                    bonus: number,
                    uniqueID: string,
                    block: number
                }

                await mysqlInstance.buyTickets(dataToInsert);
            }
            const progress = ((block + blockSize - fromBlock) / (latestBlock - fromBlock)) * 100;
            console.log(`Progress: ${Math.min(progress, 100).toFixed(2)}%`); // Ensure progress does not exceed 100%


        } catch (error) {
            console.error(`Error fetching events for block range ${block} to ${endBlock}:`, error);
        }
    }
}

// async function main() {
//     insertBuyTickets(0, true); //get all
//     // insertBuyTickets(30000); //last 120000 blocks * 12s = 40 days

// }

// main().catch((error) => {
//     console.error(error);
//     process.exit(1);
// });