"use client";
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

export default function RootLayout(props: React.PropsWithChildren) {
    // const sidebarToggleState = useSelector(selectSidebarToggleState);

    return (
        <Providers>
            <ThemeContextProvider>
                <html lang="en" className="dark">
                    <body className={inter.className}>
                        <MainLayout>
                            {props.children}
                        </MainLayout>
                    </body>
                </html>
            </ThemeContextProvider>
        </Providers>
    );
}

