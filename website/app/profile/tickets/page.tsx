"use client";

import UserTabs from "@/app/components/User/Tabs";
import UserHeader from "@/app/components/User/Header";
import UserInventory from "@/app/components/User/Inventory";

export default function Inventory() {
    return (
        <>
            <UserHeader />
            <UserTabs />
            <UserInventory />
        </>
    );
}
