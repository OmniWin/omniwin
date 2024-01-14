import { ethers } from "ethers";
import mainABI from './abi/mainABI.json';
import { MainABI } from './types/MainABI'; // Import the TypeChain-generated type
import NFT_721_ABI from './abi/NFT_721_ABI.json';
import NFT_1155_ABI from './abi/NFT_1155_ABI.json';
import { mysqlInstance } from './repository/MysqlRepository';
import { AssetType } from './types/nft';
//https://eesee.io/asset/EthereumGoerli/0x2f143067ea57ea5bf87578ac02d5629de9a95887/1/103313
//NFTtokenAddress=0x2f143067ea57ea5bf87578ac02d5629de9a95887
//NFTtokenID=1
//NFTtokenURI=103313

//https://goerli.etherscan.io/address/0xa03167de1a56160e4647d77d81e9139af55b63d4#readContract
const provider = new ethers.JsonRpcProvider(
    "https://goerli.infura.io/v3/9d9284a66189412282e5c644ad094a93"
);

const mainContractAddress = "0xa03167de1a56160e4647d77d81e9139af55b63d4";
async function main() {
    // Your Ethers.js code here
    const contract = new ethers.Contract(mainContractAddress, mainABI, provider) as unknown as MainABI;

    // Call a read-only method from the contract
    try {
        const result = await contract.getLotsLength(); // Replace 'exampleMethod' with the actual method name

        for (let i = 330; i < Number(result); i++) {
            console.log("Lot: ", i);
            const lot = await contract.lots(i);

            const lotID = i;
            const totalTickets = Number(lot.totalTickets);
            const bonusTickets = Number(lot.bonusTickets);
            const ticketsBought = Number(lot.ticketsBought);
            const ticketPrice = Number(lot.ticketPrice);
            const transactions = Number(lot.transactions);
            const endTimestamp = Number(lot.endTimestamp);
            const fee = Number(lot.fee);
            const closed = lot.closed;
            const buyout = lot.buyout;
            const assetClaimed = lot.assetClaimed;
            const tokensClaimed = lot.tokensClaimed;
            const owner = lot.owner;

            // Accessing the asset struct
            const asset = lot.asset;
            const token = asset.token;
            const tokenID = asset.tokenID.toString(); // Assuming tokenID is a large number
            const amount = asset.amount.toString(); // Assuming amount is a large number
            const assetType = Number(asset.assetType);
            const data = asset.data; // Assuming it's bytes or a string

            // console.log({
            //     lotID,
            //     totalTickets,
            //     bonusTickets,
            //     ticketsBought,
            //     ticketPrice,
            //     transactions,
            //     endTimestamp,
            //     fee,
            //     closed,
            //     buyout,
            //     assetClaimed,
            //     tokensClaimed,
            //     owner,
            //     token,
            //     tokenID,
            //     amount,
            //     assetType,
            //     data
            // })

            // console.log("assetLot", {
            //     token,
            //     tokenID,
            //     amount,
            //     assetType,
            //     data
            // })


            const nftMetadata = await getNFTData(token, tokenID, assetType);

            const dataToInsert = {
                lotID,
                totalTickets,
                bonusTickets,
                ticketsBought,
                ticketPrice,
                transactions,
                endTimestamp,
                fee,
                closed,
                buyout,
                assetClaimed,
                tokensClaimed,
                owner,
                token,
                tokenID,
                amount,
                assetType,
                data
            };
            await mysqlInstance.insertNFT(dataToInsert, nftMetadata);

            await sleep(300);

            // process.exit(1);
        }


    } catch (error) {
        console.error('Error calling method:', error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

async function getNFTData(nftContractAddress: string, tokenId: string, assetType: AssetType) {
    const nftContract = assetType === AssetType.ERC721 ? new ethers.Contract(nftContractAddress, NFT_721_ABI, provider) : new ethers.Contract(nftContractAddress, NFT_1155_ABI, provider);

    let response;
    try {
        let tokenURI;


        switch (assetType) {
            case AssetType.ERC721:
                console.log("tokenId", tokenId, "nftContractAddress", nftContractAddress);
                tokenURI = await nftContract.tokenURI(tokenId);
                response = await fetchNFTData(tokenURI)
                break;
            case AssetType.ERC1155:
                tokenURI = await nftContract.uri(tokenId);
                const formattedTokenId = tokenId.padStart(64, '0');
                const tokenWithId = tokenURI.replace("{id}", formattedTokenId);
                response = await fetchNFTData(tokenURI.includes("{id}") ? tokenWithId : tokenURI);
                break;
            default:
                console.log("Unknown asset type");
                throw new Error("Unknown asset type");
        }

        if (!response) return null;

        const metadata = response as any;

        return metadata;
        // Here you can access metadata properties like metadata.name, metadata.image, etc.
    } catch (error) {
        console.error("Error fetching NFT data:", error);
        return null;
    }
}

async function fetchNFTData(uri: string) {
    try {
        const ipfsGateway = 'https://ipfs.io/ipfs/';

        // Check if the URI is an IPFS URI
        if (uri.startsWith('ipfs://')) {
            // Extract the IPFS hash from the URI
            const ipfsHash = uri.slice(7);

            console.log("ipfsHash", ipfsGateway + ipfsHash);
            // Fetch the data from the IPFS gateway
            const response = await fetch(ipfsGateway + ipfsHash);
            const data = await response.json();
            return data;
        } else if (uri.startsWith('ar://')) {
            const arweaveGateway = 'https://arweave.net/';
            const arweaveHash = uri.slice(5);
            console.log("arweaveHash", arweaveGateway + arweaveHash);
            const response = await fetch(arweaveGateway + arweaveHash);
            const data = await response.json();
            return data;
        } else if (uri.startsWith('https://') || uri.startsWith('http://')) {
            console.log("uri", uri);
            // Fetch the data from the HTTP(S) URI
            const response = await fetch(uri);
            const data = await response.json();
            return data;
        } else if (uri.startsWith('data:')) {
            return null;
        } else if (uri.length < 5) {
            return null;
        } else {
            console.log("uri", uri);
            process.exit(1);
            return null;
        }
    } catch (error) {
        console.log("error fetchNFTData", error);
        return null;
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}