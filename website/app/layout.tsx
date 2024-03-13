// "use client";
/* Components */
import { Providers } from "@/lib/providers";
import { getServerSession } from "next-auth";
// import { Nav } from "./components/Nav
// import { SidebarNavigation } from "./components/SidebarNavigation";
// import { TopNavigation } from "./components/TopNavigation";
import MainLayout from "./components/MainLayout";
import { ThemeContextProvider } from "./contexts/ThemeContextProvider";
import SessionProvider from "./components/SessionProvider";

/* Core */
// import { useSelector } from "@/lib/redux";
// import { selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";

/* Instruments */
// import styles from "./styles/layout.module.css";
import "./styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

/**walletConnect */
import type { Metadata } from "next";
import { headers } from "next/headers";

// import { cookieToInitialState } from "wagmi";

// import { config } from "@/config";
import { Web3Modal } from "@/context";

import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: "Omniwin",
    description: "Your one stop shop for all things crypto",
};

export default async function RootLayout(props: React.PropsWithChildren) {
    // const sidebarToggleState = useSelector(selectSidebarToggleState);
    const session = await getServerSession();
    console.log("session 123213", session);
    // const initialState = cookieToInitialState(config, headers().get("cookie"));

    return (
        <Providers>
            <ThemeContextProvider>
                <html lang="en" className="dark">
                    <head>
                        <link rel="preload" href="/fonts/Himagsikan-MoXB.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
                    </head>
                    <body className={inter.className}>
                        <SessionProvider session={session} refetchInterval={0}>
                            <Web3Modal>
                                {/* <MainLayout>{pageProps.children}</MainLayout> */}
                                <MainLayout>{props.children}</MainLayout>
                                <Toaster />
                            </Web3Modal>
                        </SessionProvider>
                    </body>
                </html>
            </ThemeContextProvider>
        </Providers>
    );
}
