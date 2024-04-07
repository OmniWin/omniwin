"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useSignMessage, useDisconnect, useBalance, useNetwork } from "wagmi";
import { useSession } from "next-auth/react";
// import { SiweMessage } from "siwe";
import siweConfig from "@/config/siweConfig";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import { shortenAddress, copyToClipboard } from "@/app/utils";
import { checkIfUserExists, createAccount } from "@/app/services/authService";

import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Button as ButtonWithMovingBorder } from "@/components/ui/moving-border";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import MetaMaskIcon from "../Icons/MetaMask";
import WalletConnectIcon from "../Icons/WalletConnect";
import CoinbaseWalletIcon from "../Icons/Coinbase";
import AccessFormByInvitation from "../User/AccessFormByInvitation";
import { BackgroundBeams } from "@/components/ui/background-beams";

// Rudex ModalOpen state
import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";

const WalletConnect = () => {
    const { toast } = useToast();

    // Rudex ModalOpen state
    const dispatch = useDispatch();
    const userSettingsState = useSelector(selectUserSettingsState);

    const [isMounted, setIsMounted] = useState(false);
    const [userExists, setUserExists] = useState(false);

    const { chain } = useNetwork();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: session } = useSession();
    const { signMessage, isLoading, error, status, isError } = useSignMessage({
        onSuccess: async (signature, variables) => {
            const success = await siweConfig.verifyMessage({ message: variables.message, signature });
            console.log("success", success);
            if (success) {
                const user = await createAccount({ address: address, chainId: chain?.id, usedReferralCode: userSettingsState.usedReferralCode });

                if (user) {
                    dispatch(userSettingsSlice.actions.setUser(user));
                    toast({
                        title: "Success",
                        description: "You have successfully signed in",
                        variant: "success",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "An error occurred while signing in",
                        variant: "error",
                    });
                    await disconnectWallet()
                }
            }
        },
    });
    const { address, connector } = useAccount();
    const { data: balance } = useBalance({ address });

    const supportedChains = ["Ethereum", "Binance Smart Chain", "Polygon", "Goerli", "Polygon Mumbai"];

    // Invalidate user state if session is null
    useEffect(() => {
        if (!session) {
            dispatch(userSettingsSlice.actions.setUser({}));
        }
    }, [session]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Sign in with Ethereum if the user has a referral code
    useEffect(() => {
        // if (userSettingsState.usedReferralCode && !session && connector && !userExists && address) {
        //     // Open the wallet connector modal if the user has a referral code and is not connected
        //     !userSettingsState.isWalletConnectorModalOpen && dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true));
        //     signWithEthereum();
        // }

        // if (userExists && !session && connector && address) {
        //     signWithEthereum();
        // }
    }, [userSettingsState.usedReferralCode, session, connector, userExists, address]);

    // Show modal if the use is connected with wallet but didn't use referral code
    useEffect(() => {
        if (address && !userSettingsState.usedReferralCode && connector && !userSettingsState.isWalletConnectorModalOpen && !session) {
            dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true));
        }
    }, [address, userSettingsState.usedReferralCode, connector, session]);

    // Set userExists state
    useEffect(() => {
        if (address) {
            checkIfUserExists(address).then((res) => setUserExists(res));
        }
    }, [address]);

    // If sign is denied, show error toast
    useEffect(() => {
        if (status === "error" && isError) {
            toast({
                title: "Error",
                description: "An error occurred while signing the message",
                variant: "error",
            });
        }
    }, [isError, status]);

    // Define the connectors you want to use by their names or IDs
    const allowedConnectors = ["MetaMask", "Coinbase Wallet", "WalletConnect", "Rabby"];

    // Filter the connectors to only include the ones you want
    const filteredConnectors = connectors.filter((connector) => allowedConnectors.includes(connector.name));

    const handleConnect = async (connectorId: string) => {
        const connector = filteredConnectors.find((c) => c.id === connectorId);
        if (!connector) return;

        await connect({ connector });
    };

    const signWithEthereum = async () => {
        if (address && connector && chain && chain.id) {
            const nonce = await siweConfig.getNonce();
            const message = await siweConfig.createMessage({ nonce, address, chainId: chain?.id });

            await signMessage({ message: message });
        }
    };

    const disconnectWallet = async () => {
        // dispatch(userSettingsSlice.actions.setUsedReferralCode(''))
        dispatch(userSettingsSlice.actions.setUser({}))
        dispatch(userSettingsSlice.actions.setWalletStatusModalOpen(false))
        dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(false))
        await siweConfig.signOut();
        await disconnect();
    }

    if (!isMounted) {
        return <div>Loading...</div>;
    }

    if (session) {
        return (
            <>
                <button
                    onClick={() => dispatch(userSettingsSlice.actions.setWalletStatusModalOpen(true))}
                    // className="gap-x-3 inline-flex items-center pr-1 pl-3 py-1 rounded-full text-zinc-100 text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                    // className="gap-x-3 inline-flex items-center pr-1 pl-3 py-1 rounded-md text-zinc-100 text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                    className="gap-x-3 inline-flex items-center pl-3 rounded-md text-zinc-100 text-sm border border-zinc-800 bg-zinc-900 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                >
                    {balance && `${balance.formatted} ${balance.symbol}`}{" "}
                    {/* <span className="inline-flex items-center rounded-2xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 py-1 px-2"> */}
                    {/* <span className="inline-flex items-center rounded-sm border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 py-1 px-2"> */}
                    <span className="inline-flex items-center rounded-sm bg-gradient-to-tl from-zinc-800 to-zinc-800/30 py-2.5 px-2.5">
                        {/* Icon of selected wallet */}
                        <span className="mr-1">
                            {connector?.name === "MetaMask" && <MetaMaskIcon className="w-5 h-5" />}
                            {connector?.name === "Coinbase Wallet" && <CoinbaseWalletIcon className="w-5 h-5" />}
                            {connector?.name === "WalletConnect" && <WalletConnectIcon className="w-6 h-6 -m-.5" />}
                        </span>
                        {/* <span>{userSettingsState?.user?.username ?? shortenAddress(address)}</span> */}
                        <span>{userSettingsState?.user?.username ? "" : shortenAddress(address)}</span>
                        <span>{userSettingsState?.user?.username?.length > 8 ? shortenAddress(userSettingsState?.user?.username) : userSettingsState?.user?.username}</span>
                    </span>
                </button>

                <Dialog open={userSettingsState.isWalletStatusModalOpen} onOpenChange={(open) => dispatch(userSettingsSlice.actions.setWalletStatusModalOpen(open))}>
                    <DialogContent className="sm:max-w-[425px] lg:max-w-lg">
                        <BackgroundBeams />
                        <div className="relative z-10">
                            <div className="flex justify-center">
                                {connector?.name === "MetaMask" && <MetaMaskIcon className="w-24 h-24" />}
                                {connector?.name === "Coinbase Wallet" && <CoinbaseWalletIcon className="w-24 h-24" />}
                                {connector?.name === "WalletConnect" && <WalletConnectIcon className="w-28 h-2w-28 -m-5" />}
                            </div>

                            <div className="text-center">
                                <p className="text-zinc-200 text-xl flex items-center justify-center mb-1">
                                    {session.user?.name || shortenAddress(address)}
                                    <Button
                                        variant="ghost"
                                        className="!ml-2 !p-0 hover:!bg-transparent !inline-block !h-auto"
                                        onClick={() =>
                                            copyToClipboard(address ?? "").then(() =>
                                                toast({
                                                    title: "Copied",
                                                    description: "Address copied to clipboard",
                                                    duration: 3000,
                                                })
                                            )
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6 inline-block ml-1">
                                            <path className="fill-emerald-600/30" d="M128 128H48c-26.5 0-48 21.5-48 48V464c0 26.5 21.5 48 48 48H272c26.5 0 48-21.5 48-48V416H256v32H64V192h64V128z" />
                                            <path
                                                className="fill-emerald-600"
                                                d="M160 48c0-26.5 21.5-48 48-48H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48z"
                                            />
                                        </svg>
                                    </Button>
                                </p>
                                <p className="text-zinc-400 text-sm">
                                    {balance?.formatted} {balance?.symbol}
                                </p>
                            </div>
                            <div className="text-center">
                                <Button variant="secondary" className="!mt-10 w-full" onClick={async () => await disconnectWallet()}>
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            {!session && !address && (
                // <Button variant="soft" onClick={() => dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true))}>
                //     Connect Wallet
                // </Button>
                <ButtonWithMovingBorder onClick={() => dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true))} borderRadius="0.375rem" className={cn(buttonVariants({ variant: "soft", size: "default" }), 'bg-zinc-900')}>
                    Connect Wallet
                </ButtonWithMovingBorder>
            )}

            {address && (
                <button
                    onClick={() => dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true))}
                    // className="gap-x-3 inline-flex items-center pr-1 pl-3 py-1 rounded-full text-zinc-100 text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                    // className="gap-x-3 inline-flex items-center pr-1 pl-3 py-1 rounded-md text-zinc-100 text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                    className="gap-x-3 inline-flex items-center pl-3 rounded-md text-zinc-100 text-sm border border-zinc-800 bg-zinc-900 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                >
                    {balance && `${balance.formatted} ${balance.symbol}`}{" "}
                    {/* <span className="inline-flex items-center rounded-2xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 py-1 px-2"> */}
                    {/* <span className="inline-flex items-center rounded-sm border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 py-1 px-2"> */}
                    <span className="inline-flex items-center rounded-sm bg-gradient-to-tl from-zinc-800 to-zinc-800/30 py-2.5 px-2.5">
                        {/* Icon of selected wallet */}
                        <span className="mr-1">
                            {connector?.name === "MetaMask" && <MetaMaskIcon className="w-5 h-5" />}
                            {connector?.name === "Coinbase Wallet" && <CoinbaseWalletIcon className="w-5 h-5" />}
                            {connector?.name === "WalletConnect" && <WalletConnectIcon className="w-6 h-6 -m-.5" />}
                        </span>
                        <span>{shortenAddress(address)}</span>
                    </span>
                </button>
            )}

            <Dialog open={userSettingsState.isWalletConnectorModalOpen} onOpenChange={(open) => dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(open))}>
                <DialogContent className="sm:max-w-[425px] lg:max-w-2xl">
                    <BackgroundBeams />
                    <div className="relative z-10 space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                {!address && 'Connect Wallet'}
                                {address && !userSettingsState.usedReferralCode && !userExists && "Access by invitation"}
                                {address && connector && userExists && !isLoading && <div className="text-center mb-8">Sign in</div>}
                                {connector && isLoading && (userSettingsState.usedReferralCode || userExists) && <div className="text-center mb-8">{connector?.name} loading...</div>}
                                {/* {connector && isLoading && userSettingsState.usedReferralCode && ""} */}
                            </DialogTitle>
                            {/* <DialogDescription>Choose your wallet.</DialogDescription> */}
                        </DialogHeader>
                        {/* Choose wallet connector */}
                        {!address && (
                            <div className="">
                                <p className="text-zinc-400 text-sm mb-2">Supported chains:</p>
                                <div className="flex flex-wrap gap-4 mb-10">
                                    {supportedChains.map((chain) => (
                                        <Badge key={chain} variant="zinc">
                                            {chain}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-zinc-400 text-sm mb-2">Use one of the following wallets to connect to the dApp:</p>
                                <div className="space-y-4">
                                    {filteredConnectors.map((connector) => {
                                        let icon;
                                        switch (connector.name) {
                                            case "MetaMask":
                                                icon = <MetaMaskIcon className="w-8 h-8" />;
                                                break;
                                            case "Coinbase Wallet":
                                                icon = <CoinbaseWalletIcon className="w-8 h-8 rounded-full" />;
                                                break;
                                            case "WalletConnect":
                                                icon = <WalletConnectIcon className="w-12 h-12 -m-2" />;
                                                break;
                                            default:
                                                icon = null;
                                        }
                                        return (
                                            <button
                                                key={connector.id}
                                                className="w-full flex rounded-md py-2 px-3 border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 items-center gap-2 text-zinc-200 group"
                                                onClick={() => handleConnect(connector.id)}
                                            >
                                                {icon}
                                                <span>{connector.name}</span>
                                                <ChevronRightIcon className="w-5 h-5 text-zinc-200 group-hover:text-zinc-100 ml-auto" />
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-zinc-400 mt-10 pb-3">
                                    By using OmniWin, you agree to our{" "}
                                    <a className="!underline-none text-zinc-200 hover:text-white" href="/terms-of-use" target="_blank">
                                        Terms of Service
                                    </a>{" "}
                                    and our{" "}
                                    <a className="!underline-none text-zinc-200 hover:text-white" href="/privacy-policy" target="_blank">
                                        Privacy Policy
                                    </a>
                                    .
                                </p>
                            </div>
                        )}
                        {/* Referral code form after used a connector */}
                        {address && !userSettingsState.usedReferralCode && !userExists && <AccessFormByInvitation />}
                        {/* Sign modal content */}
                        {address && connector && userExists && (
                            <>
                                <div className="text-center">
                                    <div className="bg-zinc-800 p-4 animate-bounce inline-block rounded-full">
                                        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path className="opacity-40" d="M0 80C0 53.5 21.5 32 48 32H432c26.5 0 48 21.5 48 48V96v32 8.6c-9.4-5.4-20.3-8.6-32-8.6l-64 0v0H48C21.5 128 0 106.5 0 80z" />
                                            <path
                                                className="fill-jade-600"
                                                d="M48 128H96v0l352 0c.4 0 .9 0 1.3 0c11.2 .2 21.6 3.6 30.7 8.9v-.3c19.1 11.1 32 31.7 32 55.4V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V240 192 80c0 26.5 21.5 48 48 48zM416 336a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {!isLoading && <>
                                        <p className="text-lg text-zinc-200 text-center xl:px-20">Omniwin Dapp needs to connect to your wallet</p>
                                        <p className="text-zinc-400 text-sm mb-2 text-center xl:px-20">Sign this message to prove you own this wallet and proceed. Canceling will disconnect you.</p>
                                    </>}
                                {isLoading && <p className="text-zinc-400 text-sm mb-2 text-center xl:px-20">Sign the message in your {connector.name} wallet to proceed.</p>}

                                {!isLoading && 
                                    <div className="flex gap-6">
                                        <Button variant="outline" className="!mt-10 w-full" onClick={async () => await disconnectWallet()}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" className="!mt-10 w-full" onClick={async () => await signWithEthereum()}>
                                            Sign
                                        </Button>
                                    </div>}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default WalletConnect;
