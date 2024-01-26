"use client";
/* Components */
// import { Nav } from "./components/Nav
import { SidebarNavigation } from "./SidebarNavigation";
import { TopNavigation } from "./TopNavigation";

/* Core */
import { useSelector } from "@/lib/redux";
import { selectSidebarToggleState } from "@/lib/redux/slices/sidebarSlice/selectors";

export default function MainLayout(props: React.PropsWithChildren) {
    const sidebarToggleState = useSelector(selectSidebarToggleState);

    return (
        <>
            <SidebarNavigation />
            {/* <div className="lg:pl-72"> */}
            <div className={`${sidebarToggleState.toggleSidebar ? "lg:pl-8" : "lg:pl-64"} transition-all duration-300`}>
                <TopNavigation />
                <main className="py-3 md:py-12 px-3 md:px-12 mx-2 sm:mx-6 lg:mx-8 min-h-full bg-zinc-900 rounded-lg max-h-[calc(100vh-64px-.75rem)] overflow-y-auto no-scrollbar">{props.children}</main>
            </div>
        </>

    );
}
