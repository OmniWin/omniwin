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
            let dataToInsert = await getLotByID(config.contract, i);

            // dataToInsert.token = "0xA89Af8DC152933a1b225048527b4fF6776e93213"
            // dataToInsert.tokenID = "30561";
            // dataToInsert.assetType = 0;
            if (dataToInsert.token == "0x0000000000000000000000000000000000000000") {
                //lot has been deleted
                continue;
            }
            const nftMetadata = await getNFTData(dataToInsert.token, dataToInsert.tokenID, dataToInsert.assetType);

            const nftID = await mysqlInstance.insertNFT(dataToInsert);
            await mysqlInstance.insertMetadata(nftID, dataToInsert.lotID, nftMetadata);
        } catch (error) {
            logger.error(`Lot_id: ${i}, Error: ${util.inspect(error)}`);
            console.error('Error calling method:', error);
        }
    }
}


async function main() {
    getLots(167859); // 0 - start from the beginning
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});