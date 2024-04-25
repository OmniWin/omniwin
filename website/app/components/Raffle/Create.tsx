// TODO:
// Pas 1: Select Raffle Type [NFT, Token]
// Pas 2: Listare NFTs/Tokens -> Selectare NFT [selector de blockchain ca sa stim de unde luam NFT-urile]
// Pas 3: Forma pentru: min funds, lista preturi, deadline (max 30 days)

import { CheckIcon } from "@heroicons/react/24/solid";

import BNB from "@/public/images/coins/BNB.svg";
import ETH from "@/public/images/coins/ETH.svg";
import MATIC from "@/public/images/coins/MATIC.svg";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { classNames } from "@/app/utils";

import { useState } from "react";

export default function CreateRaffleModal() {
    const [steps, setSteps] = useState([
        { id: "01", name: "Raffle Type", description: "Vitae sed mi luctus laoreet.", href: "#", status: "complete" },
        { id: "02", name: "Prize", description: "Cursus semper viverra.", href: "#", status: "current" },
        { id: "03", name: "Raffle Data", description: "Penatibus eu quis ante.", href: "#", status: "upcoming" },
    ]);

    const [raffleType, setRaffleType] = useState<string | null>(null);
    const [chain, setChain] = useState<string | null>(null);

    const currentStep = steps.find((step) => step.status === "current");

    return (
        <>
            <Dialog>
                {/* open={open} onOpenChange={setOpen}  */}
                <DialogContent className="sm:max-w-[425px] lg:max-w-2xl text-zinc-100">
                    <DialogHeader className="space-y-5">
                        <DialogTitle className="text-zinc-100">Create Raffle</DialogTitle>
                        {/* <DialogDescription>{challenge.description}</DialogDescription> */}
                    </DialogHeader>
                    <div className="px-4">
                        <div className="lg:border-b lg:border-t lg:border-gray-200">
                            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Progress">
                                <ol role="list" className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
                                    {steps.map((step, stepIdx) => (
                                        <li key={step.id} className="relative overflow-hidden lg:flex-1">
                                            <div
                                                className={classNames(
                                                    stepIdx === 0 ? "rounded-t-md border-b-0" : "",
                                                    stepIdx === steps.length - 1 ? "rounded-b-md border-t-0" : "",
                                                    "overflow-hidden border border-gray-200 lg:border-0"
                                                )}
                                            >
                                                {step.status === "complete" ? (
                                                    <a href={step.href} className="group">
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                                                        <span className={classNames(stepIdx !== 0 ? "lg:pl-9" : "", "flex items-start px-6 py-5 text-sm font-medium")}>
                                                            <span className="flex-shrink-0">
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                                                                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                                                </span>
                                                            </span>
                                                            <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                                <span className="text-sm font-medium">{step.name}</span>
                                                                <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                ) : step.status === "current" ? (
                                                    <a href={step.href} aria-current="step">
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                                                        <span className={classNames(stepIdx !== 0 ? "lg:pl-9" : "", "flex items-start px-6 py-5 text-sm font-medium")}>
                                                            <span className="flex-shrink-0">
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                                                                    <span className="text-indigo-600">{step.id}</span>
                                                                </span>
                                                            </span>
                                                            <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                                <span className="text-sm font-medium text-indigo-600">{step.name}</span>
                                                                <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <a href={step.href} className="group">
                                                        <span className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full" aria-hidden="true" />
                                                        <span className={classNames(stepIdx !== 0 ? "lg:pl-9" : "", "flex items-start px-6 py-5 text-sm font-medium")}>
                                                            <span className="flex-shrink-0">
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                                                                    <span className="text-gray-500">{step.id}</span>
                                                                </span>
                                                            </span>
                                                            <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                                                                <span className="text-sm font-medium text-gray-500">{step.name}</span>
                                                                <span className="text-sm font-medium text-gray-500">{step.description}</span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                )}

                                                {stepIdx !== 0 ? (
                                                    <>
                                                        {/* Separator */}
                                                        <div className="absolute inset-0 left-0 top-0 hidden w-3 lg:block" aria-hidden="true">
                                                            <svg className="h-full w-full text-gray-300" viewBox="0 0 12 82" fill="none" preserveAspectRatio="none">
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

                        {currentStep?.id === "01" && (
                            <div className="flex items-center gap-4">
                                <div>
                                    <Card onClick={() => setRaffleType("Token")}>
                                        <CardContent>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-12 w-12">
                                                <path
                                                    className="opacity-40"
                                                    d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM256 96a160 160 0 1 1 0 320 160 160 0 1 1 0-320zm0 352a192 192 0 1 0 0-384 192 192 0 1 0 0 384zm24-264c0-13.3-10.7-24-24-24s-24 10.7-24 24V328c0 13.3 10.7 24 24 24s24-10.7 24-24V184z"
                                                />
                                                <path className="text-emerald-400" d="M256 96a160 160 0 1 1 0 320 160 160 0 1 1 0-320zm0 352a192 192 0 1 0 0-384 192 192 0 1 0 0 384z" />
                                            </svg>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div>
                                    <Card onClick={() => setRaffleType("NFT")}>
                                        <CardContent>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path
                                                    className="opacity-40"
                                                    d="M260.9 495.5c-22.3 12.9-49.7 12.9-72 0L36 407.2C13.7 394.4 0 370.6 0 344.9V168.3c0-25.7 13.7-49.5 36-62.4L188.9 17.7c22.3-12.9 49.7-12.9 72 0l152.9 88.3c22.3 12.9 36 36.6 36 62.4V344.9c0 25.7-13.7 49.5-36 62.4L260.9 495.5zM95.8 170.6c-2.8-7.1-10.3-11.2-17.9-9.8s-13 8-13 15.7v160c0 8.8 7.2 16 16 16s16-7.2 16-16V259.7l33.1 82.9c2.8 7.1 10.3 11.2 17.9 9.8s13-8 13-15.7v-160c0-8.8-7.2-16-16-16s-16 7.2-16 16v76.9L95.8 170.6zm97.1 5.9v80 80c0 8.8 7.2 16 16 16s16-7.2 16-16v-64h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32v-48h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-48c-8.8 0-16 7.2-16 16zm112-16c-8.8 0-16 7.2-16 16s7.2 16 16 16h16v144c0 8.8 7.2 16 16 16s16-7.2 16-16v-144h16c8.8 0 16-7.2 16-16s-7.2-16-16-16h-64z"
                                                />
                                                <path
                                                    className="text-emerald-400"
                                                    d="M77.9 160.9c7.5-1.5 15 2.6 17.9 9.8l33.1 82.9V176.6c0-8.8 7.2-16 16-16s16 7.2 16 16v160c0 7.7-5.4 14.3-13 15.7s-15-2.6-17.9-9.8L96.9 259.7v76.9c0 8.8-7.2 16-16 16s-16-7.2-16-16v-160c0-7.7 5.4-14.3 13-15.7zm115 15.7c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v48h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v64c0 8.8-7.2 16-16 16s-16-7.2-16-16v-80-80zm112-16h64c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16v144c0 8.8-7.2 16-16 16s-16-7.2-16-16v-144h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                                                />
                                            </svg>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {currentStep?.id === "02" && raffleType === "Token" && (
                            <div>
                                <div className="flex items-center justify-between">
                                    <p>NFTs List</p>

                                    <Select>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Chain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="eth">
                                                <img src={ETH.src} alt="ETH" className="h-6 w-6" />
                                                ETH
                                            </SelectItem>
                                            <SelectItem value="bsc">
                                                <img src={BNB.src} alt="BNB" className="h-6 w-6" />
                                                BSC
                                            </SelectItem>
                                            <SelectItem value="matic">
                                                <img src={MATIC.src} alt="MATIC" className="h-6 w-6" />
                                                Matic
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-wrap items-center gap-4"></div>
                            </div>
                        )}
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
