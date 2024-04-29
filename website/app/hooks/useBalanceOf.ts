import { useContractRead } from "wagmi";

export default (tokenAddress: string | undefined, walletAddress: string | undefined) => {
  // Minimal ABI for interacting with ERC-20's balanceOf function
  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const;

  // Use the wagmi hook to read the contract data
  return useContractRead({
    address: tokenAddress as `0x${string}`, // The address of the ERC-20 token contract
    abi: abi,         // ABI for the ERC-20 contract's balanceOf function
    functionName: 'balanceOf',
    args: [walletAddress as `0x${string}`], // The address of the wallet to check the balance of
    enabled: !!tokenAddress && !!walletAddress, // Only enabled if both tokenAddress and walletAddress are provided
  });
}
