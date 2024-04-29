import { useContractRead } from "wagmi";

export default (tokenAddress: string | undefined) => {
  // Minimal ABI for interacting with ERC-20's decimals function
  const abi = [
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const;

  // Use the wagmi hook to read the contract data
  return useContractRead({
    address: tokenAddress as `0x${string}`, // The address of the ERC-20 token contract
    abi: abi,         // ABI for the ERC-20 contract's decimals function
    functionName: 'decimals',
    enabled: !!tokenAddress, // Only enabled if tokenAddress is provided
  });
}
