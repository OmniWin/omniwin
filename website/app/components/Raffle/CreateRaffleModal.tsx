// TODO:
// Pas 1: Select Raffle Type [NFT, Token]
// Pas 2: Listare NFTs/Tokens -> Selectare NFT [selector de blockchain ca sa stim de unde luam NFT-urile]
// Pas 3: Forma pentru: min funds, lista preturi, deadline (max 30 days)

import { CheckIcon } from "@heroicons/react/24/solid";

import BNB from "@/public/images/coins/BNB.svg";
import ETH from "@/public/images/coins/ETH.svg";
import MATIC from "@/public/images/coins/MATIC.svg";
import USDT from "@/public/images/coins/USDT.svg";
import USDC from "@/public/images/coins/USDC.svg";
import { Calendar as CalendarIcon } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { classNames, tokensContracts } from "@/app/utils";
import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import CustomImageWithFallback from "../CustomImageWithFallback";
import { Input } from "@/components/ui/input";
import { useAccount, useNetwork, useBalance } from "wagmi";
// import { ethers } from 'ethers';
import { AlertError } from "../Ui/AlertError";
import { useToast } from "@/components/ui/use-toast";

import useOwnerOf from "@/app/hooks/useOwnerOf";
import useBalanceOf from "@/app/hooks/useBalanceOf";
import useDecimalsOf from "@/app/hooks/useDecimalsOf";

export default function CreateRaffleModal() {
    const [steps, setSteps] = useState([
        { id: "01", name: "Raffle Type", description: "Choose the raffle type.", href: "#", status: "current" },
        { id: "02", name: "Prize", description: "Set a prize.", href: "#", status: "upcoming" },
        { id: "03", name: "Raffle Data", description: "Fill the raffle data.", href: "#", status: "upcoming" },
    ]);

    const dispatch = useDispatch();
    const userStoreStates = useSelector(selectUserSettingsState);

    const { address, connector } = useAccount();
    const { chain } = useNetwork();
    // TODO: Reput address
    // const { data: balance } = useBalance({ address });
    const { data: balance } = useBalance({ address: "0xE0bb5f1167Bd3e7D7986459c19261C0aFa2db41e" });

    const { toast } = useToast();

    const [raffleType, setRaffleType] = useState<string | null>(null);
    const [formChain, setFormChain] = useState<string>("ethereum");
    const [nfts, setNfts] = useState<any[]>([]);
    const [nft, setNft] = useState<any | null>(null);
    const [tokens, setTokens] = useState<any[]>([
        {
            id: "01",
            name: "BNB",
            image: BNB,
        },
        {
            id: "04",
            name: "USDT",
            image: USDT,
        },
        {
            id: "05",
            name: "USDC",
            image: USDC,
        },
    ]);
    const [token, setToken] = useState<any | null>(null);
    const [tokenAmount, setTokenAmount] = useState<string | null>(null);
    const [minFunds, setMinFunds] = useState<number | string | null>(null);
    const [priceList, setPriceList] = useState<number[]>([]);
    const [deadline, setDeadline] = useState<number | string | null>(null);
    const [isTokenAndAmountConfirmed, setIsTokenAndAmountConfirmed] = useState<boolean | null>(null);

    const [isOwner, setIsOwner] = useState(false);
    const { data: ownerAddress, refetch, isError: isErrorOwnershipCheck, isLoading } = useOwnerOf(nft?.contract, nft?.identifier);
    // TODO: Reput address
    // const { data: balance, refetch: refetchBalance, isError: isErrorBalance, isLoading: isLoadingBalance } = useBalanceOf(token?.address, address);
    const { data: balanceToken, refetch: refetchBalance, isError: isErrorBalance, isLoading: isLoadingBalance } = useBalanceOf(token?.contract, "0xE0bb5f1167Bd3e7D7986459c19261C0aFa2db41e");
    const { data: decimals, refetch: refetchDecimals, isError: isErrorDecimals, isLoading: isLoadingDecimals, error: decimalError } = useDecimalsOf(token?.contract);

    const currentStep = steps.find((step) => step.status === "current");

    const confirmTokenAndAmountHandler = () => {
        if (token?.contract) {
            refetchBalance(); // Trigger a fetch with the new inputs
            refetchDecimals(); // Trigger a fetch with the new inputs
            // Check if the user has enough balance
            const amount = parseFloat(tokenAmount ?? "") * Math.pow(10, decimals ?? 18);
            console.log(balanceToken, tokenAmount, amount, BigInt(amount), connector, chain);
            if (balanceToken && tokenAmount && balanceToken < BigInt(amount)) {
                setIsTokenAndAmountConfirmed(false);
                toast({
                    title: "Error",
                    description: "You don't have enough balance to create this raffle.",
                    variant: "error",
                    duration: 3000,
                });
                return;
            }
        } else {
            // Check if the user has enough balance
            const amount = parseFloat(tokenAmount ?? "") * Math.pow(10, 18);
            console.log(balance, tokenAmount, amount, BigInt(amount), connector, chain);
            if (balance && tokenAmount && balance?.value < BigInt(amount)) {
                setIsTokenAndAmountConfirmed(false);
                toast({
                    title: "Error",
                    description: "You don't have enough balance to create this raffle.",
                    variant: "error",
                    duration: 3000,
                });
                return;
            }
        }

        setIsTokenAndAmountConfirmed(true);
    };

    // If raffle type is selected, show the next step
    if (raffleType) {
        steps[0].status = "complete";
        steps[1].status = "current";
    }

    // If nft or token is selected, show the next step
    if ((nft && isOwner && !isErrorOwnershipCheck) || (token && tokenAmount && isTokenAndAmountConfirmed)) {
        steps[1].status = "complete";
        steps[2].status = "current";
    }

    const changeStep = (stepId: string) => {
        const stepIndex = steps.findIndex((step) => step.id === stepId);
        const currentStepIndex = steps.findIndex((step) => step.status === "current");

        if (stepIndex > currentStepIndex) {
            return;
        }

        if (currentStep?.id === "02" || stepIndex === 0) {
            setRaffleType(null);
            // setFormChain(null);
            // setNfts([]);
        }

        if (currentStep?.id === "03" || stepIndex === 0) {
            setTokenAmount(null);
            setToken(null);
            setNft(null);
            setDeadline(null);
            setPriceList([]);
            setMinFunds(null);
            setIsTokenAndAmountConfirmed(null);
        }

        steps.forEach((step, index) => {
            if (index < stepIndex) {
                step.status = "complete";
            } else if (index === stepIndex) {
                step.status = "current";
            } else {
                step.status = "upcoming";
            }
        });

        setSteps([...steps]);
    };

    const fetchUserNftsCollection = async () => {
        if (!formChain) {
            return;
        }
        try {
            const domain = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${domain}/v1/user/wallet/nfts?chain=${formChain}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            setNfts(data.data.filter((nft: any) => nft.image_url && nft.token_standard === "erc721" && nft.identifier && nft.contract));
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const checkOwnership = async () => {
        if (!nft.contract || !nft.identifier) {
            toast({
                title: "Error",
                description: "Please enter both a valid NFT Contract Address and a Token ID.",
                variant: "error",
                duration: 3000,
            });
            return;
        }
        refetch(); // Trigger a fetch with the new inputs
    };

    // If the chain is changed, fetch the nfts from the selected chain
    useEffect(() => {
        fetchUserNftsCollection();
        setNft(null);
        setToken(null);
        setTokenAmount(null);

        if (formChain) {
            setTokens([
                {
                    name: formChain.toUpperCase(),
                    image: formChain === "ethereum" ? ETH : formChain === "matic" ? MATIC : BNB,
                },
                ...(tokensContracts[formChain as keyof typeof tokensContracts] || []),
            ]);
        }
    }, [formChain]);

    // If the nft is selected, check ownership
    useEffect(() => {
        if (nft) checkOwnership();
    }, [nft]);

    // If the token is selected, check balance
    useEffect(() => {
        refetchBalance(); // Trigger a fetch with the new inputs
        setIsTokenAndAmountConfirmed(null);
    }, [token, tokenAmount]);

    useEffect(() => {
        if (raffleType === "nft" && nft) {
            //TODO: Reput the check
            // if (ownerAddress === address) {
            if (ownerAddress === "0xE0bb5f1167Bd3e7D7986459c19261C0aFa2db41e") {
                setIsOwner(true);
            } else {
                setIsOwner(false);
                toast({
                    title: "Error",
                    description: "You are not the owner of this NFT.",
                    variant: "error",
                    duration: 3000,
                });
            }
        }
    }, [ownerAddress]);

    return (
        <>
            <Dialog open={userStoreStates.isCreateRaffleModalOpen} onOpenChange={(e) => dispatch(userSettingsSlice.actions.setCreateRaffleModalOpen(e))}>
                <DialogContent className="sm:max-w-[425px] lg:max-w-4xl 2xl:max-w-5xl text-zinc-100 max-h-full">
                    <DialogHeader className="space-y-5">
                        <DialogTitle className="text-zinc-100">Create Raffle</DialogTitle>
                        <DialogDescription>Follow the steps to create a new raffle. You can activate the raffle on other chains after you create it.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 lg:mt-8 bg-zinc-900 rounded-b-lg">
                        <div className="lg:border-b lg:border-t rounded-lg lg:border-zinc-800 bg-zinc-950">
                            <nav className="mx-auto max-w-7xl" aria-label="Progress">
                                <ol role="list" className="overflow-hidden rounded-lg lg:flex lg:rounded-md lg:border-l lg:border-r lg:border-zinc-800">
                                    {steps.map((step, stepIdx) => (
                                        <li key={step.id} className="relative overflow-hidden lg:flex-1" onClick={() => changeStep(step.id)}>
                                            <div
                                                className={classNames(
                                                    stepIdx === 0 ? "rounded-t-md border-b-0" : "",
                                                    stepIdx === steps.length - 1 ? "rounded-b-md border-t-0" : "",
                                                    "overflow-hidden border border-zinc-800 lg:border-0"
                                                )}
                                            >
                                                {step.status === "complete" ? (
                                                    <div className="group cursor-pointer">
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-zinc-800 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                                                        <span className={classNames(stepIdx !== 0 ? "lg:pl-9" : "", "flex items-start px-6 py-5 text-sm font-medium")}>
                                                            <span className="flex-shrink-0">
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600">
                                                                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                                                </span>
                                                            </span>
                                                            <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                                <span className="text-sm font-medium">{step.name}</span>
                                                                <span className="text-sm font-medium text-zinc-500">{step.description}</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                ) : step.status === "current" ? (
                                                    <div aria-current="step">
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-emerald-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                                                        <span className={classNames(stepIdx !== 0 ? "lg:pl-9" : "", "flex items-start px-6 py-5 text-sm font-medium")}>
                                                            <span className="flex-shrink-0">
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-400">
                                                                    <span className="text-emerald-400">{step.id}</span>
                                                                </span>
                                                            </span>
                                                            <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                                <span className="text-sm font-medium text-emerald-400">{step.name}</span>
                                                                <span className="text-sm font-medium text-zinc-500">{step.description}</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="group">
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-zinc-800 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                                                        <span className={classNames(stepIdx !== 0 ? "lg:pl-9" : "", "flex items-start px-6 py-5 text-sm font-medium")}>
                                                            <span className="flex-shrink-0">
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-zinc-800">
                                                                    <span className="text-zinc-500">{step.id}</span>
                                                                </span>
                                                            </span>
                                                            <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                                <span className="text-sm font-medium text-zinc-300">{step.name}</span>
                                                                <span className="text-sm font-medium text-zinc-500">{step.description}</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                )}

                                                {stepIdx !== 0 ? (
                                                    <>
                                                        {/* Separator */}
                                                        <div className="absolute inset-0 left-0 top-0 hidden w-3 lg:block" aria-hidden="true">
                                                            <svg className="h-full w-full text-zinc-800" viewBox="0 0 12 82" fill="none" preserveAspectRatio="none">
                                                                <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                                                            </svg>
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </div>

                        <div className="my-6 p-4">
                            {currentStep?.id === "01" && (
                                <>
                                    <p>
                                        Choose the raffle type.
                                        <br />
                                        <span className="text-zinc-500">You can create a raffle with ERC-20 tokens or NFTs.</span>
                                    </p>
                                    <div className="mt-4 flex items-center justify-center">
                                        <div className="flex items-center gap-2 lg:gap-4 w-full">
                                            <div className="w-1/3 h-full">
                                                <Card onClick={() => setRaffleType("token")} className="hover:!border-emerald-400 cursor-pointer">
                                                    <CardContent className="flex flex-col items-center justify-center group px-0">
                                                        <CardHeader className="text-zinc-400 px-0 group-hover:text-emerald-400">ERC-20</CardHeader>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-12 w-12 fill-zinc-700">
                                                            <path
                                                                className="opacity-40"
                                                                d="M144 512c79.5 0 144-114.6 144-256S223.5 0 144 0S0 114.6 0 256S64.5 512 144 512zm-8-64c-20.5 0-36.7-10.5-48.2-22.6C76.5 413.4 67.7 397.7 61 381c-13.4-33.6-21-77.8-21-125s7.6-91.4 21-125c6.7-16.7 15.4-32.4 26.8-44.4C99.3 74.5 115.5 64 136 64s36.7 10.5 48.2 22.6c11.4 12 20.1 27.7 26.8 44.4c13.4 33.6 21 77.8 21 125s-7.6 91.4-21 125c-6.7 16.7-15.4 32.4-26.8 44.4C172.7 437.5 156.5 448 136 448zm64-192c0-88.4-28.7-160-64-160s-64 71.6-64 160s28.7 160 64 160s64-71.6 64-160z"
                                                            />
                                                            <path
                                                                className="fill-emerald-400"
                                                                d="M330.6 48C309.6 17.8 283.8 0 256 0H226.1c15.6 13.2 29.3 29.7 40.9 48h63.7zM313.3 176h64.3c-6-36.2-15.9-68.9-28.7-96H284.3c13.2 28.4 23 60.9 29 96zm68.4 128c1.5-15.5 2.2-31.6 2.2-48s-.8-32.5-2.2-48H317.6c1.6 15.7 2.4 31.7 2.4 48s-.8 32.3-2.4 48h64.1zM284.3 432H349c12.8-27.1 22.7-59.8 28.7-96H313.3c-6 35.1-15.9 67.6-29 96zM267 464c-11.5 18.3-25.2 34.8-40.9 48H256c27.9 0 53.6-17.8 74.6-48H267zM136 448c20.5 0 36.7-10.5 48.2-22.6c11.4-12 20.1-27.7 26.8-44.4c13.4-33.6 21-77.8 21-125s-7.6-91.4-21-125c-6.7-16.7-15.4-32.4-26.8-44.4C172.7 74.5 156.5 64 136 64s-36.7 10.5-48.2 22.6C76.5 98.6 67.7 114.3 61 131c-13.4 33.6-21 77.8-21 125s7.6 91.4 21 125c6.7 16.7 15.4 32.4 26.8 44.4C99.3 437.5 115.5 448 136 448zm64-192c0 88.4-28.7 160-64 160s-64-71.6-64-160s28.7-160 64-160s64 71.6 64 160z"
                                                            />
                                                        </svg>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <div className="w-1/3 h-full">
                                                <Card onClick={() => setRaffleType("nft")} className="hover:!border-emerald-400 cursor-pointer">
                                                    <CardContent className="flex flex-col items-center justify-center group px-0">
                                                        <CardHeader className="text-zinc-400 px-0 group-hover:text-emerald-400">ERC-721</CardHeader>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-12 w-12 fill-zinc-700">
                                                            <path
                                                                className="opacity-40"
                                                                d="M260.9 495.5c-22.3 12.9-49.7 12.9-72 0L36 407.2C13.7 394.4 0 370.6 0 344.9V168.3c0-25.7 13.7-49.5 36-62.4L188.9 17.7c22.3-12.9 49.7-12.9 72 0l152.9 88.3c22.3 12.9 36 36.6 36 62.4V344.9c0 25.7-13.7 49.5-36 62.4L260.9 495.5zM95.8 170.6c-2.8-7.1-10.3-11.2-17.9-9.8s-13 8-13 15.7v160c0 8.8 7.2 16 16 16s16-7.2 16-16V259.7l33.1 82.9c2.8 7.1 10.3 11.2 17.9 9.8s13-8 13-15.7v-160c0-8.8-7.2-16-16-16s-16 7.2-16 16v76.9L95.8 170.6zm97.1 5.9v80 80c0 8.8 7.2 16 16 16s16-7.2 16-16v-64h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32v-48h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-48c-8.8 0-16 7.2-16 16zm112-16c-8.8 0-16 7.2-16 16s7.2 16 16 16h16v144c0 8.8 7.2 16 16 16s16-7.2 16-16v-144h16c8.8 0 16-7.2 16-16s-7.2-16-16-16h-64z"
                                                            />
                                                            <path
                                                                className="fill-emerald-400"
                                                                d="M77.9 160.9c7.5-1.5 15 2.6 17.9 9.8l33.1 82.9V176.6c0-8.8 7.2-16 16-16s16 7.2 16 16v160c0 7.7-5.4 14.3-13 15.7s-15-2.6-17.9-9.8L96.9 259.7v76.9c0 8.8-7.2 16-16 16s-16-7.2-16-16v-160c0-7.7 5.4-14.3 13-15.7zm115 15.7c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v48h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v64c0 8.8-7.2 16-16 16s-16-7.2-16-16v-80-80zm112-16h64c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16v144c0 8.8-7.2 16-16 16s-16-7.2-16-16v-144h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                                                            />
                                                        </svg>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <div className="w-1/3 h-full">
                                                <TooltipProvider delayDuration={100}>
                                                    <Tooltip>
                                                        <TooltipTrigger className="w-full">
                                                            <Card className="hover:!border-zinc-700 cursor-not-allowed opacity-40 relative">
                                                                <CardContent className="flex flex-col items-center justify-center group px-0">
                                                                    <Badge variant="secondary" className="hidden lg:block absolute right-3 top-3">
                                                                        <span className="text-xs">Soon</span>
                                                                    </Badge>
                                                                    <CardHeader className="text-zinc-400 px-0 flex flex-row gap-1">
                                                                        RWA
                                                                        <Badge variant="secondary" className="inline-block lg:hidden text-xs">
                                                                            <span className="text-xs">Soon</span>
                                                                        </Badge>
                                                                    </CardHeader>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-12 w-12 fill-zinc-700">
                                                                        <path
                                                                            className="opacity-40"
                                                                            d="M23.9 147.8L67 212.4c8.4 12.6 21.1 21.9 35.7 26L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l16.1-18.8c8.6-10 10.2-24.3 3.9-36L241.4 .4c4.8-.3 9.7-.4 14.6-.4c97.3 0 182 54.3 225.3 134.3l-70.2 30.1c-15.3 6.6-23 23.7-17.8 39.5l17.6 52.9c3.2 9.6 10.7 17.1 20.2 20.2l76.6 25.5C485.9 421.7 381.5 512 256 512C114.6 512 0 397.4 0 256c0-38.6 8.6-75.3 23.9-108.2z"
                                                                        />
                                                                        <path
                                                                            className="fill-emerald-400"
                                                                            d="M241.5 .4C145 5.8 62.7 64.7 23.9 147.8L67 212.4c8.4 12.6 21.1 21.9 35.7 26L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l16.1-18.8c8.6-10 10.2-24.3 3.9-36L241.5 .4zM481.3 134.3l-70.2 30.1c-15.3 6.6-23 23.7-17.8 39.5l17.6 52.9c3.2 9.6 10.7 17.1 20.2 20.2l76.6 25.5c2.8-15.1 4.2-30.7 4.2-46.6c0-44-11.1-85.5-30.7-121.7z"
                                                                        />
                                                                    </svg>
                                                                </CardContent>
                                                            </Card>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Coming soon!</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {currentStep?.id === "02" && (
                                <div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-zinc-200">{raffleType === "nft" ? "NFT" : "Token"} List</p>
                                        <Select value={formChain} onValueChange={(value: any) => setFormChain(value)}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select Chain" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ethereum">
                                                    <div className="flex items-center gap-2 w-full">
                                                        <CustomImageWithFallback
                                                            className="!w-auto !max-h-[18px]"
                                                            containerClass="!inline-block !w-[18px] !h-[18px]"
                                                            width={18}
                                                            height={18}
                                                            sizes="100%"
                                                            src={ETH}
                                                            alt="ETH"
                                                        />
                                                        <span>ETH</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="bsc">
                                                    <div className="flex items-center gap-2 w-full">
                                                        <CustomImageWithFallback
                                                            className="!w-auto !max-h-[18px]"
                                                            containerClass="!inline-block !w-[18px] !h-[18px]"
                                                            width={18}
                                                            height={18}
                                                            sizes="100%"
                                                            src={BNB}
                                                            alt="BNB"
                                                        />
                                                        <span>BSC</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="matic">
                                                    <div className="flex items-center gap-2 w-full">
                                                        <CustomImageWithFallback
                                                            className="!w-auto !max-h-[18px]"
                                                            containerClass="!inline-block !w-[18px] !h-[18px]"
                                                            width={18}
                                                            height={18}
                                                            sizes="100%"
                                                            src={MATIC}
                                                            alt="MATIC"
                                                        />
                                                        <span>Matic</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {nft && !isOwner && (
                                        <div className="my-3">
                                            <AlertError title="Error" description={isErrorOwnershipCheck ? "Please enter a valid NFT Contract Address and a Token ID." : "You are not the owner of this NFT."} />
                                        </div>
                                    )}
                                    {raffleType === "nft" && (
                                        <div className="grid grid-cols-2 lg:grid-cols-3 items-center gap-4 max-h-64 lg:max-h-72 xl:max-h-96 overflow-auto mt-4 no-scrollbar">
                                            {nfts.map((nft, index) => (
                                                <article
                                                    key={`nft${index}`}
                                                    className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-4 lg:px-8 pb-8 pt-32 sm:pt-48 lg:pt-52 h-full bg-zinc-800 cursor-pointer"
                                                    onClick={() => setNft(nft)}
                                                >
                                                    <div className="absolute inset-0 -z-10">
                                                        <CustomImageWithFallback
                                                            src={nft.image_url}
                                                            alt={nft.name ?? "-"}
                                                            width={100}
                                                            height={100}
                                                            className="h-full w-full object-cover min-h-[inherit]"
                                                            containerClass="min-h-[inherit]"
                                                            sizes="100%"
                                                            style={{
                                                                objectFit: "cover",
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-900/80 via-zinc-900/40" />
                                                    <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-zinc-900/10" />

                                                    <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-xs lg:text-sm leading-6 text-zinc-300">
                                                        <div className="-ml-4 flex items-center gap-x-4">
                                                            <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                                                                <circle cx={1} cy={1} r={1} />
                                                            </svg>
                                                            <div className="flex gap-x-2.5 capitalize">{nft.collection.replace(/-/g, " ")}</div>
                                                        </div>
                                                    </div>
                                                    <h3 className="mt-2 lg:mt-3 text-sm lg:text-lg font-semibold leading-6 text-white">
                                                        <span className="absolute inset-0" />
                                                        {nft?.name ?? "-"}
                                                    </h3>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                    {raffleType === "token" && (
                                        <>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-4 max-h-72 lg:max-h-96 overflow-auto mt-4">
                                                {tokens.map((mapToken, index) => (
                                                    <Card
                                                        onClick={() => setToken(mapToken)}
                                                        key={`token${index}${mapToken.image}`}
                                                        className={classNames(
                                                            `hover:!border-emerald-400 cursor-pointer`,
                                                            token && token.name === mapToken.name && "!border-emerald-400",
                                                            token && token.name !== mapToken.name && "opacity-40"
                                                        )}
                                                    >
                                                        <CardContent className="flex flex-col items-center justify-center group px-0">
                                                            <CardHeader className="text-zinc-400 px-0 group-hover:text-emerald-400">{mapToken.name}</CardHeader>
                                                            <CustomImageWithFallback
                                                                key={`img${index}${mapToken.image}${Math.random()}`}
                                                                className="!w-auto !max-h-[48px]"
                                                                containerClass="!inline-block !w-[48px] !h-[48px]"
                                                                width={48}
                                                                height={48}
                                                                sizes="100%"
                                                                src={mapToken.image}
                                                                alt={mapToken.name}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                <Card
                                                    className={classNames(
                                                        `hover:!border-emerald-400 cursor-pointer`,
                                                        token && token.name === "Custom Token" && "!border-emerald-400",
                                                        token && token.name !== "Custom Token" && "opacity-40"
                                                    )}
                                                >
                                                    <CardContent className="flex flex-col items-center justify-center group">
                                                        <CardHeader className="text-zinc-400 px-0 group-hover:text-emerald-400">CUSTOM TOKEN</CardHeader>

                                                        <Input
                                                            variant="backgroundBottomBorder"
                                                            size="lg"
                                                            label=""
                                                            id="customToken"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="0xa2b4c5d6e7f8..."
                                                            className="!text-sm rounded-lg focus:border-emerald-400"
                                                            onChange={(e) => setToken({ name: "Custom Token", image: null, address: e.target.value })}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <div className="mt-4 grid grid-cols-6 items-center gap-2 w-full">
                                                <div className="col-span-5">
                                                    <Input
                                                        variant="insetLabel"
                                                        size="lg"
                                                        label="Amount"
                                                        id="tokenAmount"
                                                        type="number"
                                                        autoComplete="off"
                                                        placeholder="1000"
                                                        className={classNames("[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none")}
                                                        parentClassName={classNames(isTokenAndAmountConfirmed === false && "border-blood-600 !ring-blood-600")}
                                                        onChange={(e) => setTokenAmount(e.target.value)}
                                                    />
                                                </div>
                                                <Button
                                                    variant="soft"
                                                    onClick={() => {
                                                        confirmTokenAndAmountHandler();
                                                    }}
                                                    className="col-span-1 h-full"
                                                >
                                                    Confirm
                                                </Button>
                                            </div>
                                            {isTokenAndAmountConfirmed === false && <p className="mt-2 text-sm text-blood-600">You don't have enough balance to create this raffle.</p>}
                                        </>
                                    )}
                                </div>
                            )}
                            {currentStep?.id === "03" && (
                                <>
                                    <div className="space-y-4">
                                        <div>
                                            <Input
                                                variant="insetLabel"
                                                size="lg"
                                                label="Minimum funds"
                                                id="minFunds"
                                                type="number"
                                                autoComplete="off"
                                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                onChange={(e) => setMinFunds(e.target.value)}
                                            />
                                            {/* {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>} */}
                                        </div>
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !deadline && "text-muted-foreground")}>
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                            {/* <Input
                                                variant="insetLabel"
                                                size="lg"
                                                label="Deadline"
                                                id="deadline"
                                                type="datetime-local"
                                                autoComplete="off"
                                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                onChange={(e) => setDeadline(e.target.value)}
                                            /> */}
                                            {/* {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>} */}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
