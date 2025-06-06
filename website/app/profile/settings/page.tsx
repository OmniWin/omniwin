"use client";

import UserTabs from "@/app/components/User/Tabs";
import UserHeader from "@/app/components/User/Header";
import LinkSocialPlatforms from "@/app/components/User/LinkSocialPlatforms";
import CopyReferral from "@/app/components/User/CopyReferral";
import ProfileForm from "@/app/components/User/ProfileForm";
import WalletConnect from "@/app/components/Wallet/WalletConnect";

import { useEffect, useState } from "react";

import { fetchUserSettingsData } from "@/app/services/userSettingsService";

export default function SettingsPage() {
    const [userData, setUserData] = useState(null);

    const fetchData = async () => {
        const data = await fetchUserSettingsData();
        setUserData(data);
        console.log("SettingsPage", userData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <UserHeader />
            <UserTabs />

            <div className=" -mx-3 md:-mx-12">
                <div className="mx-auto max-w-5xl 2xl:max-w-7xl 3xl:max-w-8xl px-4 sm:px-6 lg:px-8 mt-8">
                    <div className="flex flex-wrap gap-8 xl:gap-40">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Profile</h2>
                            <ProfileForm />
                        </div>
                        <div className="space-y-8 sm:min-w-96">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Social Platforms</h2>
                                <LinkSocialPlatforms />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Referral</h2>
                                <CopyReferral />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
