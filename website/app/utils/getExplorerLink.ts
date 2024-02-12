import { LinkType } from '@/app/types';

export function getExplorerLink(network: string, type: LinkType, identifier: string) {
    let baseUrl;
    switch (network.toLowerCase()) {
        case 'ethereum':
            baseUrl = 'https://etherscan.io/';
            break;
        case 'bsc':
            baseUrl = 'https://bscscan.com/';
            break;
        case 'polygon':
            baseUrl = 'https://polygonscan.com/';
            break;
        case 'sepolia':
            baseUrl = 'https://sepolia.etherscan.io/';
            break;
        case 'goerli':
            baseUrl = 'https://goerli.etherscan.io/';
            break;
        case 'mumbai':
            baseUrl = 'https://mumbai.polygonscan.com/';
            break;
        default:
            throw new Error('Unsupported network');
    }
    return `${baseUrl}${type}/${identifier}`;
}