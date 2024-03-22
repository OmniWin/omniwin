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
import { Badge } from "@/components/ui/badge";
import MetaMaskIcon from "../Icons/MetaMask";
import WalletConnectIcon from "../Icons/WalletConnect";
import CoinbaseWalletIcon from "../Icons/Coinbase";
import AccessFormByInvitation from "../User/AccessFormByInvitation";

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
    // const { disconnect } = useDisconnect();
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
                    await disconnect()
                }
            }
        },
    });
    const { address, connector } = useAccount();
    const { data: balance } = useBalance({ address });

    const supportedChains = ["Ethereum", "Binance Smart Chain", "Polygon", "Goerli", "Polygon Mumbai"];

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
        if (userSettingsState.usedReferralCode && !session && connector && !userExists && address) {
            // Open the wallet connector modal if the user has a referral code and is not connected
            !userSettingsState.isWalletConnectorModalOpen && dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true));
            signWithEthereum();
        }

        if (userExists && !session && connector && address) {
            signWithEthereum();
        }
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

    const disconnect = async () => {
        dispatch(userSettingsSlice.actions.setUser({}))
        // dispatch(userSettingsSlice.actions.setUsedReferralCode(''))
        dispatch(userSettingsSlice.actions.setWalletStatusModalOpen(false))
        await siweConfig.signOut();
    }

    if (!isMounted) {
        return <div>Loading...</div>;
    }

    if (session) {
        return (
            <>
                <button
                    onClick={() => dispatch(userSettingsSlice.actions.setWalletStatusModalOpen(true))}
                    className="gap-x-3 inline-flex items-center pr-1 pl-3 py-1 rounded-full text-zinc-100 text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                >
                    {balance && `${balance.formatted} ${balance.symbol}`}{" "}
                    <span className="inline-flex items-center rounded-2xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 py-1 px-2">
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
                        <DialogHeader>
                            {/* <DialogTitle className="text-white">Connected as {session.user?.name || shortenAddress(address)}</DialogTitle>
                            <DialogDescription>Choose your wallet.</DialogDescription> */}
                            <div className="flex justify-center">
                                {connector?.name === "MetaMask" && <MetaMaskIcon className="w-24 h-24" />}
                                {connector?.name === "Coinbase Wallet" && <CoinbaseWalletIcon className="w-24 h-24" />}
                                {connector?.name === "WalletConnect" && <WalletConnectIcon className="w-28 h-2w-28 -m-5" />}
                            </div>

                            <div className="text-center">
                                <p className="text-zinc-200 text-xl flex items-center justify-center mb-1">
                                    {session.user?.name || shortenAddress(address)}
                                    <Button variant="ghost" className="!ml-2 !p-0 hover:!bg-transparent !inline-block !h-auto" onClick={() => copyToClipboard(address ?? '').then(() => toast({
                                        title: "Copied",
                                        description: "Address copied to clipboard",
                                        duration: 3000,
                                    }))}>
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
                                <Button variant="secondary" className="!mt-10 w-full" onClick={async () => await disconnect()}>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 mr-2">
                                        <path
                                            className="opacity-40"
                                            d="M199.7 60.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96l0-256c0-53 43-96 96-96l64 0c17.7 0 32 14.3 32 32z"
                                        />
                                        <path
                                            className="fill-emerald-600/40"
                                            d="M508.4 225.5L385.7 102.7c-6.4-6.4-15-9.9-24-9.9c-18.7 0-33.9 15.2-33.9 33.9l0 62.1-128 0c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32l128 0 0 62.1c0 18.7 15.2 33.9 33.9 33.9c9 0 17.6-3.6 24-9.9L508.4 280.1c7.2-7.2 11.3-17.1 11.3-27.3s-4.1-20.1-11.3-27.3z"
                                        />
                                    </svg> */}
                                    Disconnect
                                </Button>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            {!session && !address && (
                <Button variant="soft" onClick={() => dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true))}>
                    Connect Wallet
                </Button>
            )}

            {address && (
                <button
                    onClick={() => dispatch(userSettingsSlice.actions.setWalletConnectorModalOpen(true))}
                    className="gap-x-3 inline-flex items-center pr-1 pl-3 py-1 rounded-full text-zinc-100 text-sm border border-zinc-800 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 relative"
                >
                    {balance && `${balance.formatted} ${balance.symbol}`}{" "}
                    <span className="inline-flex items-center rounded-2xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 py-1 px-2">
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
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {!address && 'Connect Wallet'}
                            {address && !userSettingsState.usedReferralCode && !userExists && "Access by invitation"}
                            {/* {connector && isLoading && userSettingsState.usedReferralCode && ""} */}
                        </DialogTitle>
                        {/* <DialogDescription>Choose your wallet.</DialogDescription> */}
                    </DialogHeader>
                    {address && !userSettingsState.usedReferralCode && !userExists && <AccessFormByInvitation />}
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
                    {/* Loading metamask sign */}
                    {connector && isLoading && (userSettingsState.usedReferralCode || userExists) && (
                        <div className="flex flex-col items-center justify-center space-y-10">
                            <div className="flex items-center gap-x-2">
                                <svg aria-hidden="true" className="inline w-8 h-8 text-zinc-400 animate-spin fill-jade-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <p className="text-zinc-100 text-xl">{connector?.name} loading...</p>
                            </div>

                            <p className="text-zinc-400">Sign the message in your MetaMask to sign in safely.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default WalletConnect;
