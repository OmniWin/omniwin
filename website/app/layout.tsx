"use client";
/* Components */
import { Providers } from "@/lib/providers";
// import { Nav } from "./components/Nav
import { SidebarNavigation } from "./components/SidebarNavigation";
import { TopNavigation } from "./components/TopNavigation";

/* Instruments */
// import styles from "./styles/layout.module.css";
import "./styles/globals.css";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout(props: React.PropsWithChildren) {
    return (
        <Providers>
            <html lang="en">
                <body className={inter.className}>
                    <SidebarNavigation />
                    {/* <div className="lg:pl-72"> */}
                    <div className="lg:pl-64">
                        <TopNavigation />
                        <main className="py-3 md:py-12 px-3 md:px-12 mx-2 sm:mx-6 lg:mx-8 min-h-full bg-smoke-900 rounded-lg max-h-[calc(100vh-64px-.5rem)] overflow-y-auto no-scrollbar">
                            {props.children}
                        </main>
                    </div>
                </body>
            </html>
        </Providers>
    );
}
