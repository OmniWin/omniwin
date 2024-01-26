import { AssetType } from '../types/nft';
import NFT_721_ABI from '../abi/NFT_721_ABI.json';
import NFT_1155_ABI from '../abi/NFT_1155_ABI.json';
import { ethers } from "ethers";
import { goerliProvider } from '../providers/goerli';

export async function getNFTData(nftContractAddress: string, tokenId: string, assetType: AssetType) {
    const nftContract = assetType === AssetType.ERC721 ? new ethers.Contract(nftContractAddress, NFT_721_ABI, goerliProvider) : new ethers.Contract(nftContractAddress, NFT_1155_ABI, goerliProvider);

    let response = {};
    let tokenURI;
    try {
        switch (assetType) {
            case AssetType.ERC721:
                tokenURI = await nftContract.tokenURI(tokenId);
                response = await fetchNFTData(tokenURI) as any;
                break;
            case AssetType.ERC1155:
                tokenURI = await nftContract.uri(tokenId);
                const formattedTokenId = tokenId.padStart(64, '0');
                const tokenWithId = tokenURI.replace("{id}", formattedTokenId);
                response = await fetchNFTData(tokenURI.includes("{id}") ? tokenWithId : tokenURI) as any;
                break;
            default:
                console.log("Unknown asset type");
                throw new Error("Unknown asset type");
        }

        if (!response) return {
            name: "",
            image: "",
            description: "",
            tokenURI: tokenURI,
        };

        (response as any).tokenURI = tokenURI;
        const metadata = response as any;

        return metadata;
    } catch (error) {
        console.error("Error fetching NFT data:", error);
        return {
            name: "",
            image: "",
            description: "",
            tokenURI: "",
        };
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
            throw new Error("Unknown URI scheme");
            return null;
        }
    } catch (error) {
        throw new Error("Error fetching NFT data");
        console.log("error fetchNFTData", error);
        return null;
    }
}