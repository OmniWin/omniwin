'use client'

import React, { ReactNode } from 'react'
// import { config, projectId } from '@/config'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { WagmiConfig } from 'wagmi'
import siweConfig from '@/config/siweConfig'
import { mainnet, sepolia } from 'wagmi/chains'

// Setup queryClient
// const queryClient = new QueryClient()
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_PROJECT_ID");

const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, sepolia],
  projectId,
});


if (!projectId) throw new Error('Project ID is not defined')

// Create modal
createWeb3Modal({
    siweConfig,
    wagmiConfig,
    projectId,
    enableAnalytics: true,
})

export function Web3Modal({
    children,
}: {
    children: ReactNode
}) {
    return (
        <WagmiConfig config={wagmiConfig as any}>
            {/* <QueryClientProvider client={queryClient}>{children}</QueryClientProvider> */}
            {children}
        </WagmiConfig>
    )
}