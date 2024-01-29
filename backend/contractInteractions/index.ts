import { getLots } from "./scripts";
// import { insertBuyTickets } from "./scripts";
//https://eesee.io/asset/EthereumGoerli/0x2f143067ea57ea5bf87578ac02d5629de9a95887/1/103313
//https://eesee.io/asset/EthereumGoerli/0x2f143067ea57ea5bf87578ac02d5629de9a95887/NFTtokenID/INDEX_ARRAY_CONTRACT
//NFTtokenAddress=0x2f143067ea57ea5bf87578ac02d5629de9a95887
//NFTtokenID=1
//NFT token index from contract array=103313
//https://goerli.etherscan.io/address/0xa03167de1a56160e4647d77d81e9139af55b63d4#readContract
// const mainContractAddress = "0xa03167de1a56160e4647d77d81e9139af55b63d4";
async function main() {
    getLots(209); // 0 - start from the beginning
    // insertBuyTickets(0, true); //get all    
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

