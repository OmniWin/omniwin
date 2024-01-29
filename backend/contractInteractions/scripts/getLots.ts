import { mysqlInstance } from '../repository/MysqlRepository';
import logger from "../log/winston";
import util from "util";
import { getLotByID } from "../contractInteractions/contractMain";

import { getNFTData } from "../utils/getNftMetadata";
import config from "../contracts/contractConfig"

export async function getLots(start: number) {

    const result = await config.contract.getLotsLength();
    console.log("Count: ", result);

    for (let i = start; i < Number(result); i++) {
        try {
            console.log("Lot: ", i);
            const dataToInsert = await getLotByID(config.contract, i);
            const nftMetadata = await getNFTData(dataToInsert.token, dataToInsert.tokenID, dataToInsert.assetType);

            const nftID = await mysqlInstance.insertNFT(dataToInsert);
            await mysqlInstance.insertMetadata(nftID, dataToInsert.lotID, nftMetadata);

        } catch (error) {
            logger.error(`Lot_id: ${i}, Error: ${util.inspect(error)}`);
            console.error('Error calling method:', error);
        }
    }
}

