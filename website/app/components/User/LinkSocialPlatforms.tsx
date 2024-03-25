"use client";

// LinkSocialPlatforms.tsx
import React from "react";
// import { Input } from '@/components/ui/input'; // Adjust the import path as necessary
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

import { syncSocialPlatforms } from "@/app/services/userSettingsService";

import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
import { useDiscordLogin, UseDiscordLoginParams } from 'react-discord-login';

const staticPlatforms = [
    { id: "twitter", label: "Twitter", icon: faXTwitter, color: "text-black", iconType: "fontawesome" },
    { id: "discord", label: "Discord", icon: faDiscord, color: "text-discord", iconType: "fontawesome" },
    { id: "telegram", label: "Telegram", icon: faTelegram, color: "text-telegram", iconType: "fontawesome" },
    // { id: "email", label: "Email", icon: faEnvelope, color: "text-black", iconType: "svg" },
];

import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";

const LinkSocialPlatforms: React.FC = () => {
    const dispatch = useDispatch();
    const userSettingsState = useSelector(selectUserSettingsState);
    const [platforms, setPlatforms] = React.useState(staticPlatforms);

    const discordLoginParams: UseDiscordLoginParams = {
        clientId: '1220451304674037801',
        redirectUri: 'http://omniwin.local/profile/settings',
        responseType: 'token', // or 'code'
        scopes: ['identify', 'email'],
        onSuccess: (response: any) => {
            // Handle successful login
            console.log('Login successful:', response);
            handleSync('discord', response);
        },
        onFailure: (error: any) => {
            // Handle login failure
            console.error('Login failed:', error);
        },
    };

    const { buildUrl, isLoading } = useDiscordLogin(discordLoginParams);

    // Let's add user socials to the platforms array [socials are in userSettingsState.user.twitter, userSettingsState.user.discord, userSettingsState.user.telegram, userSettingsState.user.email]

    React.useEffect(() => {
        if (userSettingsState.user) {
            setPlatforms((prevPlatforms) =>
                prevPlatforms.map((platform) => {
                    if (platform.id === "twitter") {
                        return { ...platform, synced: !!Object.keys(userSettingsState.user?.twitter ?? {}).length , value: userSettingsState.user.twitter?.username ?? '' };
                    }
                    if (platform.id === "discord") {
                        return { ...platform, synced: !!Object.keys(userSettingsState.user?.discord ?? {}).length , value: userSettingsState.user.discord?.user?.username };
                    }
                    if (platform.id === "telegram") {
                        return { ...platform, synced: !!Object.keys(userSettingsState.user?.telegram ?? {}).length , value: userSettingsState.user.telegram?.username };
                    }
                    if (platform.id === "email") {
                        return { ...platform, synced: !!userSettingsState.user.email, value: userSettingsState.user.email };
                    }
                    return platform;
                })
            );
        }
    }, [userSettingsState.user]);

    const handleSync = async (platformId: string, user?: TelegramUser) => {
        // Placeholder for actual sync logic
        syncSocialPlatforms(platformId, user).then((res) => {
            // Update userSettingsState.user with the new data based on the platform
            switch (platformId) {
                case "twitter":
                    dispatch(userSettingsSlice.actions.setUser({ ...userSettingsState.user, twitter: res }));
                    break;
                case "discord":
                    dispatch(userSettingsSlice.actions.setUser({ ...userSettingsState.user, discord: res }));
                    break;
                case "telegram":
                    dispatch(userSettingsSlice.actions.setUser({ ...userSettingsState.user, telegram: res }));
                    break;
                // case "email":
                //     dispatch(userSettingsSlice.actions.setUser({ ...userSettingsState.user, email: res.data }));
                //     break;
                default:
                    break;
            }
        });
        console.log(`Synced ${platformId}`);
    };

    const handleOnClick = (platformId: string) => {
        if (platformId === "telegram") {
            return;
        } else if (platformId === "twitter") {
            // window.open('https://api.twitter.com/oauth/authenticate?oauth_token=1234567890', '_blank');
        } else if (platformId === "discord") {
            window.open(buildUrl());
        }
        console.log(`Clicked ${platformId}`);
    }

    return (
        <div className="space-y-4">
            {platforms.map((platform: any) => (
                <div
                    key={platform.id}
                    className="space-x-3 flex items-center px-3 py-2 h-full rounded-xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                >
                    <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center rounded-md">
                        {platform.iconType === "fontawesome" && <FontAwesomeIcon icon={platform.icon} className={`h-6 w-6 ${platform.color}`} />}
                        {platform.iconType === "svg" && (
                            <>
                                <svg className={`h-6 w-6 ${platform.color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path
                                        className="opacity-40"
                                        d="M0 112V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V112c0 15.1-7.1 29.3-19.2 38.4L275.2 313.6c-11.4 8.5-27 8.5-38.4 0L19.2 150.4C7.1 141.3 0 127.1 0 112z"
                                    />
                                    <path className="" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48z" />
                                </svg>
                                {/* Envelope Checked */}
                                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path
                                        className="opacity-40"
                                        d="M0 112C0 85.5 21.5 64 48 64H464c26.5 0 48 21.5 48 48c0 15.1-7.1 29.3-19.2 38.4l-13.9 10.4c-66.6 6.4-122.4 50-146.3 109.8l-57.4 43c-11.4 8.5-27 8.5-38.4 0L19.2 150.4C7.1 141.3 0 127.1 0 112zM320.8 319.4c-.5 5.5-.8 11-.8 16.6c0 42.5 15.1 81.6 40.2 112H64c-35.3 0-64-28.7-64-64V176L217.6 339.2c22.8 17.1 54 17.1 76.8 0l26.4-19.8z"
                                    />
                                    <path
                                        className=""
                                        d="M496 480a144 144 0 1 0 0-288 144 144 0 1 0 0 288zm67.3-164.7l-72 72c-6.2 6.2-16.4 6.2-22.6 0l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L480 353.4l60.7-60.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                                    />
                                </svg> */}
                            </>
                        )}
                    </div>
                    <span className="flex-1 text-zinc-200 space-x-1">
                        <span>{!platform.synced && platform.label}</span>
                        <span className="text-zinc-400">{platform.synced ? `Connected as ${platform.value}` : "Not Synced"}</span>
                    </span>
                    {!platform.synced && <Button onClick={() => handleOnClick(platform.id)} variant="secondary" className="relative">
                        <span>
                            {platform.id === 'telegram' && <TelegramLoginButton
                                className="opacity-0 absolute left-0 top-0 w-full h-full"
                                botName={process.env.NEXT_PUBLIC_BOT_USERNAME || ''}
                                dataOnauth={(user: TelegramUser) => handleSync('telegram', user)}
                            />}
                            {/* {platform.id === 'twitter' && <TwitterLogin
                                // className="opacity-0 absolute left-0 top-0 w-full h-full"
                                authCallback={(err, res) => console.log('caca', err, res)}
                                consumerKey={process.env.TWITTER_CONSUMER_KEY || ''}
                                consumerSecret={process.env.TWITTER_CONSUMER_SECRET || ''}
                            />} */}
                            Sync
                        </span>
                    </Button>}

                </div>
            ))}
        </div>
    );
};

export default LinkSocialPlatforms;
