import { ethers } from "ethers";
import abi from "../Omniwin.json" assert { type: "json" };


export const enum ChainIds  {
    BNB_CHAIN_TESTNET = 97,
    BNB_CHAIN_MAINNET = 56,
    BASE_TESTNET = 84532
}
 
export const SelectorChainId = {
    "13264668187771770619": ChainIds.BNB_CHAIN_TESTNET,
    "10344971235874465080": ChainIds.BASE_TESTNET
}


const providerPathHistoryURL = "wss://endpoints.omniatech.io/v1/ws/bsc/testnet/e567b8026fb243ba9f21dd746acfbe57";
const providerLiveURL = "wss://falling-intensive-smoke.bsc-testnet.quiknode.pro/81d8733025b2515526cbce4707cc78314201c03b/";
const providerLive = new ethers.WebSocketProvider(providerLiveURL);
const providerHistory = new ethers.WebSocketProvider(providerPathHistoryURL);
const providerHistoryHttp = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
const mainContractAddress = "0xFFbeaA7343647aC6F78fdCaf452e1c03b1dC4c07"; 
const contract = new ethers.Contract(mainContractAddress, abi, providerHistory) as unknown as any;


export const listenerConfig = {
    "97": {
        providerLive,
        providerHistory,
        providerHistoryHttp,
        contract,
        mainContractAddress,
        concurrency: 2,
    }
}