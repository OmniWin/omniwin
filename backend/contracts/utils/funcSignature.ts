import { ethers } from "ethers";

export function calcFunctionSignature(functionName: string){
    const functionSignatureAsUtf8Bytes = ethers.toUtf8Bytes(functionName)
    const signatureCksum = ethers.keccak256(functionSignatureAsUtf8Bytes)
    const firstFourBytesOfChecksum = signatureCksum.slice(0, 10)

    return firstFourBytesOfChecksum
}