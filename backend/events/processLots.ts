import config from "../contracts/contractConfig";
import logger from "../log/winston";
import { mysqlInstance } from '../repository/MysqlRepository';

type lotEventCustom = {
    lotID: string,
    token: string,
    tokenID: string,
    amount: string,
    assetType: number,
    data: string,
    owner: string,
    signer: string,
    totalTickets: string,
    ticketPrice: string,
    endTimestamp: string,

}

export async function processLots() {
    const createLotEvent = config.contract.getEvent("CreateLot");

    logger.info("Listening for CreateLot event");
    config.contract.on(createLotEvent, async (ID, asset, signer, owner, totalTickets, ticketPrice, endTimestamp, event) => {
        // Accessing the asset struct
        const token = asset.token;
        const tokenID = asset.tokenID.toString(); // Assuming tokenID is a large number
        const amount = asset.amount.toString(); // Assuming amount is a large number
        const assetType = Number(asset.assetType);
        const data = asset.data; // Assuming it's bytes or a string

        const dataToInsert = {
            lotID: ID.toString(),
            token,
            tokenID,
            amount,
            assetType,
            data,
            owner,
            signer,
            totalTickets: totalTickets.toString(),
            ticketPrice: ticketPrice.toString(),
            endTimestamp: endTimestamp.toString(),
        } as lotEventCustom

        logger.info("CreateLot event fired", { dataToInsert });
        await mysqlInstance.createLot(dataToInsert);

        //TODO: get nft metadata

    });

}

processLots().catch((error) => {
    console.error(error);
    process.exit(1);
});