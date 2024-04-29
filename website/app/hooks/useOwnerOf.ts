import { useContractRead } from "wagmi";

export default (contract: string | undefined, tokenId: bigint | undefined) => {
    // Minimal ABI to interact with ERC-721 ownerOf function
    const abi = [
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ownerOf",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    // Use the wagmi hook to read the contract data
    return useContractRead({
        address: contract as `0x${string}`,
        abi: abi,
        functionName: "ownerOf",
        args: [tokenId ?? 0n], // Use nullish coalescing operator to provide a default value of 0n if tokenId is undefined
        enabled: !!contract && !!tokenId, // Only enabled if both contractId and tokenId are provided
    });
};
