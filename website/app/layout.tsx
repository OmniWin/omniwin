// "use client";
/* Components */
import { Providers } from "@/lib/providers";
// import { Nav } from "./components/Nav
// import { SidebarNavigation } from "./components/SidebarNavigation";
// import { TopNavigation } from "./components/TopNavigation";
import MainLayout from "./components/MainLayout";
import { ThemeContextProvider } from "./contexts/ThemeContextProvider";

/* Core */
// import { useSelector } from "@/lib/redux";
// import { selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";

/* Instruments */
// import styles from "./styles/layout.module.css";
import "./styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

/**walletConnect */
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'

import { config } from '@/config'
import { Web3Modal } from '@/context'




export const metadata: Metadata = {
    title: 'Omniwin',
    description: 'Your one stop shop for all things crypto',
}

export default function RootLayout(props: React.PropsWithChildren) {

    // const sidebarToggleState = useSelector(selectSidebarToggleState);
    const initialState = cookieToInitialState(config, headers().get('cookie'))

    return (
        <Providers>
            <Web3Modal initialState={initialState}>
                <ThemeContextProvider>
                    <html lang="en" className="dark">
                        <head>
                            <link rel="preload" href="/fonts/Himagsikan-MoXB.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
                        </head>
                        <body className={inter.className}>
                            <MainLayout>
                                {props.children}
                            </MainLayout>
                        </body>
                    </html>
                </ThemeContextProvider>
            </Web3Modal>
        </Providers>
    );
}

