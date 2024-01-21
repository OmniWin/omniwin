
import { ethers } from "ethers";
import mainABI from '../abi/mainABI.json';
import { goerliProvider } from "../providers/goerli";
import { MainABI } from "../types/MainABI";

const mainContractAddress = "0xa03167de1a56160e4647d77d81e9139af55b63d4";
const contract = new ethers.Contract(mainContractAddress, mainABI, goerliProvider) as unknown as MainABI;

const config = {
    mainContractAddress,
    contract,
    network: "goerli",
}

export default config;