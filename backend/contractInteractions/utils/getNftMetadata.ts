import { AssetType } from '../types/nft';
import NFT_721_ABI from '../abi/NFT_721_ABI.json';
import NFT_1155_ABI from '../abi/NFT_1155_ABI.json';
import { ethers } from "ethers";
import { goerliProvider } from '../providers/goerli';
import fs from 'fs';
import path from 'path';
import config from "../contracts/contractConfig";

export async function getNFTData(nftContractAddress: string, tokenId: string, assetType: AssetType) {
    const nftContract = assetType === AssetType.ERC721 ? new ethers.Contract(nftContractAddress, NFT_721_ABI, goerliProvider) : new ethers.Contract(nftContractAddress, NFT_1155_ABI, goerliProvider);

    let response = {} as any;
    let tokenURI;
    try {
        switch (assetType) {
            case AssetType.ERC721:
                tokenURI = await nftContract.tokenURI(tokenId);

                let collectionName_721;
                try {
                    // Custom function to retrieve collection name, if available
                    collectionName_721 = await nftContract.name(); // Adjust based on the actual function name
                } catch (error) {
                    console.error("Error fetching collection name:", error);
                }

                console.log("collectionName_721", collectionName_721);

                response = await fetchNFTData(tokenURI, tokenId) as any;


                response.collectionName = collectionName_721;
                break;
            case AssetType.ERC1155:
                tokenURI = await nftContract.uri(tokenId);
                const formattedTokenId = tokenId.padStart(64, '0');
                const tokenWithId = tokenURI.replace("{id}", formattedTokenId);

                let collectionName_1155;
                try {
                    // Custom function to retrieve collection name, if available
                    collectionName_1155 = await nftContract.collectionName(); // Adjust based on the actual function name
                } catch (error) {
                    console.error("Error fetching collection name:", error);
                }

                console.log("collectionName_1155", collectionName_1155);

                response = await fetchNFTData(tokenURI.includes("{id}") ? tokenWithId : tokenURI, tokenId) as any;

                response.collectionName = collectionName_1155;
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

async function downloadImage(url: string, tokenId: string) {
    // const __dirname = path.resolve(path.dirname(''));
    const __dirname = '/home/spike/omniwin/website/public/';

    if (url.startsWith("ipfs:")) {
        const baseUrl = "https://ipfs.io/ipfs/";
        const ipfsHash = url.slice(7);
        const uri = baseUrl + ipfsHash;


        const imageName = `${tokenId}_${config.network}`;
        let outputFilePath = path.join(__dirname, "nft", `${imageName} `);

        try {
            const response = await fetch(uri);
            if (!response.ok) {
                console.log("ipfs: response.statusText", response.statusText);
                return false;
            }

            const contentType = response.headers.get('Content-Type');
            let fileExtension = getFileExtension(contentType);

            if (!fileExtension) return false;

            // Convert the response to a Buffer
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Write the buffer to a file
            fs.writeFileSync(outputFilePath.trim() + "." + fileExtension, buffer);

            console.log(`ipfs Image downloaded and saved to ${outputFilePath}.${fileExtension} `);

            return imageName.trim() + "." + fileExtension;
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    } else if (url.startsWith("ar:")) {
        const baseUrl = "https://arweave.net/";
        const arweaveHash = url.slice(5);
        const uri = baseUrl + arweaveHash;

        console.log("arweaveHash", uri);

        const imageName = `${tokenId}_${config.network}`;
        const outputFilePath = path.join(__dirname, "nft", `${imageName} `);

        try {
            const response = await fetch(uri);
            if (!response.ok) {
                console.log("ar: response.statusText", response.statusText);
                return false;
            }

            const contentType = response.headers.get('Content-Type');
            let fileExtension = getFileExtension(contentType);
            if (!fileExtension) return false;
            // Convert the response to a Buffer
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Write the buffer to a file
            fs.writeFileSync(outputFilePath.trim() + "." + fileExtension, buffer);

            console.log(`ar Image downloaded and saved to ${outputFilePath}.${fileExtension} `);
            return imageName.trim() + "." + fileExtension;
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    } else if (url.startsWith("https://") || url.startsWith("http://")) {
        const uri = url;
        console.log("uri", uri);

        const imageName = `${tokenId}_${config.network}`;
        const outputFilePath = path.join(__dirname, "nft", `${imageName} `);

        try {
            const response = await fetch(uri);
            if (!response.ok) {
                console.log("https: response.statusText", response.statusText);
                return false;
            }


            const contentType = response.headers.get('Content-Type');
            let fileExtension = getFileExtension(contentType);
            if (!fileExtension) return false;
            // Convert the response to a Buffer
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Write the buffer to a file
            fs.writeFileSync(outputFilePath.trim() + "." + fileExtension, buffer);

            console.log(`https Image downloaded and saved to ${outputFilePath}.${fileExtension} `);
            return imageName.trim() + "." + fileExtension;
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    } else if (url.startsWith("data:")) {
        console.log("data uri", url);
        const mimeType = url.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

        let fileExtension = false as string | boolean;
        if (mimeType && mimeType.length > 1) {
            fileExtension = getFileExtension(mimeType[1]);
        }

        if (!fileExtension) return false;
        const base64String = url.split(',')[1];
        const buffer = Buffer.from(base64String, 'base64');

        const imageName = `${tokenId}_${config.network}`;
        const outputFilePath = path.join(__dirname, "nft", `${imageName} `);

        fs.writeFileSync(outputFilePath.trim() + "." + fileExtension, buffer);


        return false
    }

    return false;
}

async function fetchNFTData(uri: string, tokenId: string) {
    try {
        const ipfsGateway = 'https://ipfs.io/ipfs/';
        if (uri.startsWith('ipfs://')) {
            const ipfsHash = uri.slice(7);
            const response = await fetch(ipfsGateway + ipfsHash);
            let data = await response.json() as any;

            let imageUri = data.image;

            const image_local = await downloadImage(imageUri, tokenId);
            if (image_local) data.image_local = image_local;

            return data;
        } else if (uri.startsWith('ar://')) {
            const arweaveGateway = 'https://arweave.net/';
            const arweaveHash = uri.slice(5);
            console.log("arweaveHash", arweaveGateway + arweaveHash);
            const response = await fetch(arweaveGateway + arweaveHash);
            let data = await response.json() as any;

            let imageUri = data.image;

            const image_local = await downloadImage(imageUri, tokenId);
            if (image_local) data.image_local = image_local;

            return data;
        } else if (uri.startsWith('https://') || uri.startsWith('http://')) {
            const response = await fetch(uri);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText} `);
            let data = await response.json() as any;

            let imageUri = data.image;

            const image_local = await downloadImage(imageUri, tokenId);
            if (image_local) data.image_local = image_local;

            return data;
        } else if (uri.startsWith('data:')) {
            const base64String = uri.split(',')[1];
            const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
            let data = JSON.parse(decodedString);

            const image_local = await downloadImage(data.image, tokenId);
            if (image_local) data.image_local = image_local;


            return data;
        } else if (uri.length < 5) {
            console.log("uri.length < 5", uri);
            return null;
        } else {
            console.log("uri", uri);
            throw new Error("Unknown URI scheme");
            return null;
        }
    } catch (error) {
        console.log("zzzEzrror fetchNFTData", error);
        throw new Error("zzzError fetching NFT data");

    }
}

function getFileExtension(contentType: string | null) {
    if (!contentType) return false;
    let fileExtension = '';
    switch (contentType) {
        case 'image/jpeg':
            fileExtension = 'jpg';
            break;
        case 'image/png':
            fileExtension = 'png';
            break;
        case 'image/svg+xml':
            fileExtension = '.svg';
            break;
        case 'image/gif':
            fileExtension = 'gif';
            break;
        case 'image/webp':
            fileExtension = 'webp';
            break;

        case 'video/mp4':
            fileExtension = 'mp4';
            break;
        case 'binary/octet-stream':
            fileExtension = 'bin';
            break;

        case 'application/octet-stream':
            fileExtension = 'bin';
            break;

        default:
            console.log('https Unknown Content-Type:', contentType);
            process.exit(1);
            return false;
    }

    return fileExtension;
}