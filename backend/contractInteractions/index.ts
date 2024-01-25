import { ethers } from "ethers";
import mainABI from './abi/mainABI.json';
import { MainABI } from './types/MainABI'; // Import the TypeChain-generated type
import { mysqlInstance } from './repository/MysqlRepository';
import logger from "./log/winston";
import util from "util";
import { getLotByID } from "./contractInteractions/contractMain";
import { goerliProvider } from "./providers/goerli";
import { getNFTData } from "./utils/getNftMetadata";
//https://eesee.io/asset/EthereumGoerli/0x2f143067ea57ea5bf87578ac02d5629de9a95887/1/103313
//NFTtokenAddress=0x2f143067ea57ea5bf87578ac02d5629de9a95887
//NFTtokenID=1
//NFTtokenURI=103313

//https://goerli.etherscan.io/address/0xa03167de1a56160e4647d77d81e9139af55b63d4#readContract

const mainContractAddress = "0xa03167de1a56160e4647d77d81e9139af55b63d4";
async function main() {
    const contract = new ethers.Contract(mainContractAddress, mainABI, goerliProvider) as unknown as MainABI;
    const result = await contract.getLotsLength(); // Replace 'exampleMethod' with the actual method name

    console.log("Count: ", result);

    for (let i = 330; i < Number(result); i++) {
        try {
            console.log("Lot: ", i);
            const dataToInsert = await getLotByID(contract, i);

            const nftMetadata = await getNFTData(dataToInsert.token, dataToInsert.tokenID, dataToInsert.assetType);
            const nftID = await mysqlInstance.insertNFT(dataToInsert);
            await mysqlInstance.insertMetadata(nftID, dataToInsert.lotID, nftMetadata);

            // await sleep(300);
            // process.exit(1);
        } catch (error) {
            logger.error(`Lot_id: ${i}, Error: ${util.inspect(error)}`);
            console.error('Error calling method:', error);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

