"use client";

// import { classNames } from "@/app/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// import { Link } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames, tiers } from "@/app/utils";

import ProgressBar from "@/app/components/Ui/ProgressBar";
import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";
import RankInfoModal from "./RankInfoModal";
import UserProgressCard from "@/app/components/User/ProgressCard";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

// const tabs = [
//     { name: "Challenges", href: "/challenges/list" },
//     { name: "Leaderboard", href: "/challenges/leaderboard" },
// ];

export default function ChallengesHeader() {
    const path = usePathname();

    return (
        // <div className="relative pb-36 -mt-3 md:-mt-12 -mx-3 md:-mx-12 pt-12 bg-gradient-to-r from-zinc-500/10 to-zinc-400/10">
        // <div className="relative pb-36 sm:px-12 -mt-3 md:-mt-12 -mx-3 md:-mx-12 pt-20 bg-zinc-800/50">
        <div className="relative pb-32 sm:px-12 -mt-3 md:-mt-12 -mx-3 md:-mx-12 pt-20 bg-gradient-to-tl overflow-hidden shadow shadow-zinc-900 from-transparent to-zinc-900">
            {/* <div className="relative pb-36"> */}
            <div className="hidden md:block absolute left-0 -top-20 right-0 w-full h-full rotate-180 scale-x-[-1] bg-gradient-to-tl from-transparent to-zinc-800 overflow-hidden">
                <div className="w-full h-full absolute left-0 top-0 bg-gradient-to-tr from-zinc-800 to-zinc-800/5 z-[1]"></div>
                <svg className="absolute left-0 bottom-20 right-0 w-full h-auto" xmlns="http://www.w3.org/2000/svg" version="1.1" height="700" viewBox="0 0 2560 700">
                    <g mask='url("#SvgjsMask1062")' fill="none">
                        <path d="M-37.81 537.57L-37.81 537.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-37.81 537.57L77.82 516.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-37.81 537.57L-59.54 683.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-59.54 683.93L-59.54 683.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-59.54 683.93L84.55 707.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-59.54 683.93L-83.92 837.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-59.54 683.93L77.82 516.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-59.54 683.93L192.09 696.89" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-59.54 683.93L230.89 819.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-83.92 837.7L-83.92 837.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M-83.92 837.7L84.55 707.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M77.82 516.7L77.82 516.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M77.82 516.7L248.17 556.94" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M77.82 516.7L84.55 707.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M77.82 516.7L192.09 696.89" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M84.55 707.54L84.55 707.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M84.55 707.54L192.09 696.89" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M248.17 556.94L248.17 556.94" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M248.17 556.94L349.79 489.85" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M248.17 556.94L192.09 696.89" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M192.09 696.89L192.09 696.89" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M192.09 696.89L230.89 819.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M230.89 819.8L230.89 819.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M230.89 819.8L412.49 811.45" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M230.89 819.8L84.55 707.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M230.89 819.8L371.36 696.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M230.89 819.8L248.17 556.94" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M230.89 819.8L520.96 813.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M349.79 489.85L349.79 489.85" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M349.79 489.85L535.46 519.09" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M349.79 489.85L371.36 696.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M349.79 489.85L192.09 696.89" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M371.36 696.9L371.36 696.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M371.36 696.9L412.49 811.45" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M371.36 696.9L192.09 696.89" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M371.36 696.9L248.17 556.94" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M371.36 696.9L559.4 710.69" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M412.49 811.45L412.49 811.45" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M412.49 811.45L520.96 813.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M412.49 811.45L559.4 710.69" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M412.49 811.45L658.63 794.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M535.46 519.09L535.46 519.09" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M535.46 519.09L649.72 412.09" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M535.46 519.09L711.26 508.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M535.46 519.09L559.4 710.69" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M535.46 519.09L659.47 671.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M559.4 710.69L559.4 710.69" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M559.4 710.69L659.47 671.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M559.4 710.69L520.96 813.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M559.4 710.69L658.63 794.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M520.96 813.91L520.96 813.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M520.96 813.91L658.63 794.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M520.96 813.91L371.36 696.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M649.72 412.09L649.72 412.09" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M649.72 412.09L711.26 508.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M649.72 412.09L800.39 395.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M649.72 412.09L794.49 512.37" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M711.26 508.01L711.26 508.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M711.26 508.01L794.49 512.37" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M711.26 508.01L800.39 395.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M711.26 508.01L659.47 671.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M659.47 671.3L659.47 671.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M659.47 671.3L658.63 794.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M659.47 671.3L520.96 813.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M659.47 671.3L859.1 670.66" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M658.63 794.54L658.63 794.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M658.63 794.54L846.03 841.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M658.63 794.54L859.1 670.66" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M800.39 395.8L800.39 395.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M800.39 395.8L794.49 512.37" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M794.49 512.37L794.49 512.37" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M794.49 512.37L859.1 670.66" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M859.1 670.66L859.1 670.66" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M859.1 670.66L956.3 668.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M859.1 670.66L846.03 841.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M859.1 670.66L953.23 853.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M859.1 670.66L1011.57 525.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M846.03 841.3L846.03 841.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M846.03 841.3L953.23 853.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M974.74 400.63L974.74 400.63" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M974.74 400.63L1011.57 525.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M974.74 400.63L1126.03 372.43" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M974.74 400.63L800.39 395.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M974.74 400.63L794.49 512.37" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M974.74 400.63L1161.56 557.34" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M974.74 400.63L956.3 668.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1011.57 525.13L1011.57 525.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1011.57 525.13L956.3 668.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1011.57 525.13L1161.56 557.34" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M956.3 668.16L956.3 668.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M956.3 668.16L1124.25 647.98" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M956.3 668.16L953.23 853.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M956.3 668.16L846.03 841.3" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M953.23 853.7L953.23 853.7" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M953.23 853.7L1124.25 647.98" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M953.23 853.7L658.63 794.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M953.23 853.7L1011.57 525.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1126.03 372.43L1126.03 372.43" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1126.03 372.43L1265.77 364.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1126.03 372.43L1251.11 256.81" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1126.03 372.43L1161.56 557.34" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1161.56 557.34L1161.56 557.34" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1161.56 557.34L1248.79 534.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1161.56 557.34L1124.25 647.98" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1124.25 647.98L1124.25 647.98" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1124.25 647.98L1270.4 648.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1124.25 647.98L1011.57 525.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1251.11 256.81L1251.11 256.81" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1251.11 256.81L1265.77 364.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1251.11 256.81L1416.66 237.19" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1251.11 256.81L1419.91 378.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1265.77 364.61L1265.77 364.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1265.77 364.61L1419.91 378.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1265.77 364.61L1248.79 534.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1265.77 364.61L1416.66 237.19" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1265.77 364.61L1161.56 557.34" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1248.79 534.68L1248.79 534.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1248.79 534.68L1270.4 648.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1248.79 534.68L1124.25 647.98" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1248.79 534.68L1444.83 558.97" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1248.79 534.68L1126.03 372.43" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1270.4 648.41L1270.4 648.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1270.4 648.41L1161.56 557.34" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1300.45 822.32L1300.45 822.32" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1300.45 822.32L1399.94 799.95" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1300.45 822.32L1270.4 648.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1300.45 822.32L1445.54 696.5" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1300.45 822.32L1124.25 647.98" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1300.45 822.32L1553.31 837.79" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1300.45 822.32L1248.79 534.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1416.66 237.19L1416.66 237.19" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1416.66 237.19L1544.03 248.26" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1416.66 237.19L1419.91 378.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1416.66 237.19L1542.94 85.09" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1419.91 378.13L1419.91 378.13" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1419.91 378.13L1592.67 376.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1419.91 378.13L1544.03 248.26" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1419.91 378.13L1444.83 558.97" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1444.83 558.97L1444.83 558.97" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1444.83 558.97L1547.95 557.36" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1444.83 558.97L1445.54 696.5" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1444.83 558.97L1588.11 641.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1444.83 558.97L1270.4 648.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1445.54 696.5L1445.54 696.5" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1445.54 696.5L1399.94 799.95" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1445.54 696.5L1588.11 641.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1445.54 696.5L1547.95 557.36" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1399.94 799.95L1399.94 799.95" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1399.94 799.95L1553.31 837.79" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1399.94 799.95L1270.4 648.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1603.6 -76.12L1603.6 -76.12" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1603.6 -76.12L1718.67 -42.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1603.6 -76.12L1542.94 85.09" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1603.6 -76.12L1702.1 97.23" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1603.6 -76.12L1873.95 -41.71" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1603.6 -76.12L1866.38 109.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1603.6 -76.12L1544.03 248.26" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1542.94 85.09L1542.94 85.09" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1542.94 85.09L1702.1 97.23" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1542.94 85.09L1544.03 248.26" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1542.94 85.09L1718.67 -42.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1544.03 248.26L1544.03 248.26" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1544.03 248.26L1592.67 376.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1544.03 248.26L1705.91 367.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1592.67 376.9L1592.67 376.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1592.67 376.9L1705.91 367.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1592.67 376.9L1709.6 510.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1592.67 376.9L1547.95 557.36" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1592.67 376.9L1755.26 260.19" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1547.95 557.36L1547.95 557.36" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1547.95 557.36L1588.11 641.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1588.11 641.1L1588.11 641.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1588.11 641.1L1740.38 687.39" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1553.31 837.79L1553.31 837.79" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1553.31 837.79L1710.67 806.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1553.31 837.79L1445.54 696.5" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1553.31 837.79L1588.11 641.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1553.31 837.79L1740.38 687.39" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1718.67 -42.57L1718.67 -42.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1718.67 -42.57L1702.1 97.23" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1718.67 -42.57L1873.95 -41.71" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1718.67 -42.57L1866.38 109.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1718.67 -42.57L1990.2 90.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1702.1 97.23L1702.1 97.23" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1755.26 260.19L1755.26 260.19" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1755.26 260.19L1705.91 367.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1755.26 260.19L1857.38 381.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1755.26 260.19L1702.1 97.23" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1755.26 260.19L1866.38 109.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1705.91 367.68L1705.91 367.68" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1705.91 367.68L1709.6 510.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1705.91 367.68L1857.38 381.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1709.6 510.41L1709.6 510.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1709.6 510.41L1857.67 538.04" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1740.38 687.39L1740.38 687.39" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1740.38 687.39L1710.67 806.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1740.38 687.39L1709.6 510.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1740.38 687.39L1857.67 538.04" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1740.38 687.39L1906.64 790.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1710.67 806.76L1710.67 806.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1873.95 -41.71L1873.95 -41.71" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1873.95 -41.71L1866.38 109.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1873.95 -41.71L1990.2 90.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1873.95 -41.71L2053.99 -97.25" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1873.95 -41.71L1702.1 97.23" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1866.38 109.57L1866.38 109.57" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1866.38 109.57L1990.2 90.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1866.38 109.57L1702.1 97.23" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1866.38 109.57L2045.8 205.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1857.38 381.93L1857.38 381.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1857.38 381.93L1857.67 538.04" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1857.38 381.93L2052.41 368.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1857.67 538.04L1857.67 538.04" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1857.67 538.04L2025.32 540.24" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1906.64 790.54L1906.64 790.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1906.64 790.54L2047.69 804.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1906.64 790.54L2000.16 651.55" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2053.99 -97.25L2053.99 -97.25" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2053.99 -97.25L2208.37 -59.56" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2053.99 -97.25L1990.2 90.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2053.99 -97.25L2183.32 81.73" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1990.2 90.99L1990.2 90.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1990.2 90.99L2045.8 205.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M1990.2 90.99L2183.32 81.73" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2045.8 205.41L2045.8 205.41" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2045.8 205.41L2206.92 230.51" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2045.8 205.41L2052.41 368.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2045.8 205.41L2183.32 81.73" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2045.8 205.41L2176.96 352.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2052.41 368.99L2052.41 368.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2052.41 368.99L2176.96 352.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2052.41 368.99L2025.32 540.24" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2025.32 540.24L2025.32 540.24" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2025.32 540.24L2000.16 651.55" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2025.32 540.24L2212.26 550.21" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2000.16 651.55L2000.16 651.55" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2000.16 651.55L2047.69 804.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2047.69 804.01L2047.69 804.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2047.69 804.01L2205.58 661.35" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2047.69 804.01L2025.32 540.24" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2208.37 -59.56L2208.37 -59.56" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2208.37 -59.56L2335.85 -89.62" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2208.37 -59.56L2183.32 81.73" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2208.37 -59.56L2312.23 80.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2208.37 -59.56L2462.7 -108.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2183.32 81.73L2183.32 81.73" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2183.32 81.73L2312.23 80.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2183.32 81.73L2206.92 230.51" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2183.32 81.73L2336.56 239.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2206.92 230.51L2206.92 230.51" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2206.92 230.51L2176.96 352.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2206.92 230.51L2336.56 239.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2206.92 230.51L2312.23 80.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2206.92 230.51L2353.98 373.78" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2176.96 352.91L2176.96 352.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2176.96 352.91L2353.98 373.78" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2212.26 550.21L2212.26 550.21" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2212.26 550.21L2205.58 661.35" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2212.26 550.21L2176.96 352.91" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2212.26 550.21L2353.98 373.78" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2212.26 550.21L2000.16 651.55" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2205.58 661.35L2205.58 661.35" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2205.58 661.35L2318.88 814.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2205.58 661.35L2000.16 651.55" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2205.58 661.35L2025.32 540.24" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2335.85 -89.62L2335.85 -89.62" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2335.85 -89.62L2462.7 -108.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2312.23 80.61L2312.23 80.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2312.23 80.61L2444.83 88.44" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2312.23 80.61L2336.56 239.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2312.23 80.61L2335.85 -89.62" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2336.56 239.52L2336.56 239.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2336.56 239.52L2353.98 373.78" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2336.56 239.52L2482.04 215.84" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2353.98 373.78L2353.98 373.78" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2353.98 373.78L2472.11 352.07" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2318.88 814.99L2318.88 814.99" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2318.88 814.99L2452.79 827.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2318.88 814.99L2499.19 704.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2318.88 814.99L2047.69 804.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2462.7 -108.53L2462.7 -108.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2462.7 -108.53L2657.59 -96.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2462.7 -108.53L2444.83 88.44" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2462.7 -108.53L2596.57 48.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2462.7 -108.53L2312.23 80.61" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2444.83 88.44L2444.83 88.44" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2444.83 88.44L2482.04 215.84" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2444.83 88.44L2596.57 48.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2444.83 88.44L2336.56 239.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2482.04 215.84L2482.04 215.84" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2482.04 215.84L2591.42 246.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2482.04 215.84L2472.11 352.07" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2482.04 215.84L2616.51 367.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2482.04 215.84L2596.57 48.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2472.11 352.07L2472.11 352.07" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2472.11 352.07L2616.51 367.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2472.11 352.07L2591.42 246.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2447.52 549.03L2447.52 549.03" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2447.52 549.03L2596.82 514.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2499.19 704.52L2499.19 704.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2499.19 704.52L2620.6 683.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2499.19 704.52L2452.79 827.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2499.19 704.52L2447.52 549.03" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2452.79 827.53L2452.79 827.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2452.79 827.53L2645.08 846.04" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2452.79 827.53L2620.6 683.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2657.59 -96.54L2657.59 -96.54" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2657.59 -96.54L2596.57 48.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2657.59 -96.54L2780.91 50.88" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2596.57 48.16L2596.57 48.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2591.42 246.53L2591.42 246.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2591.42 246.53L2616.51 367.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2591.42 246.53L2747.95 222.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2616.51 367.76L2616.51 367.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2616.51 367.76L2742.26 355.56" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2596.82 514.93L2596.82 514.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2596.82 514.93L2616.51 367.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2596.82 514.93L2620.6 683.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2596.82 514.93L2775.81 498.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2596.82 514.93L2472.11 352.07" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2620.6 683.9L2620.6 683.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2620.6 683.9L2645.08 846.04" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2645.08 846.04L2645.08 846.04" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2645.08 846.04L2808.96 832.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2645.08 846.04L2499.19 704.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2645.08 846.04L2788.24 699.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2780.91 50.88L2780.91 50.88" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2780.91 50.88L2747.95 222.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2780.91 50.88L2596.57 48.16" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2780.91 50.88L2591.42 246.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2780.91 50.88L2742.26 355.56" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2747.95 222.76L2747.95 222.76" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2747.95 222.76L2742.26 355.56" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2742.26 355.56L2742.26 355.56" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2742.26 355.56L2775.81 498.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2742.26 355.56L2591.42 246.53" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2742.26 355.56L2596.82 514.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2775.81 498.01L2775.81 498.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2788.24 699.8L2788.24 699.8" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2788.24 699.8L2808.96 832.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2788.24 699.8L2620.6 683.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2788.24 699.8L2775.81 498.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2788.24 699.8L2596.82 514.93" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2808.96 832.1L2808.96 832.1" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2808.96 832.1L2620.6 683.9" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2808.96 832.1L2499.19 704.52" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <path d="M2808.96 832.1L2775.81 498.01" stroke="rgba(52, 211, 153, 0.08)" strokeWidth="1.5"></path>
                        <circle r="5" cx="-37.81" cy="537.57" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="-59.54" cy="683.93" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="-83.92" cy="837.7" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="77.82" cy="516.7" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="84.55" cy="707.54" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="248.17" cy="556.94" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="192.09" cy="696.89" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="230.89" cy="819.8" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="349.79" cy="489.85" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="371.36" cy="696.9" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="412.49" cy="811.45" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="535.46" cy="519.09" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="559.4" cy="710.69" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="520.96" cy="813.91" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="649.72" cy="412.09" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="711.26" cy="508.01" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="659.47" cy="671.3" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="658.63" cy="794.54" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="800.39" cy="395.8" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="794.49" cy="512.37" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="859.1" cy="670.66" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="846.03" cy="841.3" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="974.74" cy="400.63" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1011.57" cy="525.13" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="956.3" cy="668.16" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="953.23" cy="853.7" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1126.03" cy="372.43" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1161.56" cy="557.34" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1124.25" cy="647.98" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1251.11" cy="256.81" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1265.77" cy="364.61" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1248.79" cy="534.68" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1270.4" cy="648.41" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1300.45" cy="822.32" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1416.66" cy="237.19" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1419.91" cy="378.13" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1444.83" cy="558.97" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1445.54" cy="696.5" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1399.94" cy="799.95" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1603.6" cy="-76.12" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1542.94" cy="85.09" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1544.03" cy="248.26" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1592.67" cy="376.9" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1547.95" cy="557.36" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1588.11" cy="641.1" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1553.31" cy="837.79" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1718.67" cy="-42.57" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1702.1" cy="97.23" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1755.26" cy="260.19" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1705.91" cy="367.68" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1709.6" cy="510.41" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1740.38" cy="687.39" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1710.67" cy="806.76" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1873.95" cy="-41.71" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1866.38" cy="109.57" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1857.38" cy="381.93" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1857.67" cy="538.04" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1906.64" cy="790.54" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2053.99" cy="-97.25" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="1990.2" cy="90.99" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2045.8" cy="205.41" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2052.41" cy="368.99" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2025.32" cy="540.24" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2000.16" cy="651.55" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2047.69" cy="804.01" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2208.37" cy="-59.56" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2183.32" cy="81.73" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2206.92" cy="230.51" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2176.96" cy="352.91" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2212.26" cy="550.21" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2205.58" cy="661.35" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2335.85" cy="-89.62" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2312.23" cy="80.61" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2336.56" cy="239.52" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2353.98" cy="373.78" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2318.88" cy="814.99" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2462.7" cy="-108.53" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2444.83" cy="88.44" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2482.04" cy="215.84" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2472.11" cy="352.07" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2447.52" cy="549.03" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2499.19" cy="704.52" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2452.79" cy="827.53" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2657.59" cy="-96.54" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2596.57" cy="48.16" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2591.42" cy="246.53" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2616.51" cy="367.76" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2596.82" cy="514.93" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2620.6" cy="683.9" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2645.08" cy="846.04" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2780.91" cy="50.88" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2747.95" cy="222.76" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2742.26" cy="355.56" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2775.81" cy="498.01" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2788.24" cy="699.8" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <circle r="5" cx="2808.96" cy="832.1" fill="rgba(52, 211, 153, 0.08)"></circle>
                        <path d="M-39.18 826.51L-39.18 826.51" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-39.18 826.51L58.83 796.46" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-39.18 826.51L-62.43 674.67" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-39.18 826.51L82.05 684.22" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-39.18 826.51L245.28 809.88" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M254 557.44L254 557.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M254 557.44L255.87 643.6" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M254 557.44L362.15 644.92" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M254 557.44L82.05 684.22" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M254 557.44L245.28 809.88" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M551.95 539.46L551.95 539.46" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M551.95 539.46L640.58 542.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M551.95 539.46L506.41 675.79" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M551.95 539.46L362.15 644.92" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M551.95 539.46L834.3 534.08" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M551.95 539.46L254 557.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M551.95 539.46L525.91 843.57" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M651.6 855.89L651.6 855.89" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M651.6 855.89L525.91 843.57" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M651.6 855.89L844 856.04" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M651.6 855.89L506.41 675.79" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1710.03 500.03L1710.03 500.03" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1710.03 500.03L1702.04 369.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1710.03 500.03L1564.2 532.96" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1710.03 500.03L1747.51 667.04" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1710.03 500.03L1581.46 368.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1710.03 500.03L1856.09 364.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1710.03 500.03L1908.47 527.86" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1890.38 226.47L1890.38 226.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1890.38 226.47L2002.07 259.87" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1890.38 226.47L1856.09 364.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1890.38 226.47L2030.41 109.34" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1890.38 226.47L2030.39 384.39" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1890.38 226.47L1702.04 369.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1890.38 226.47L2140.19 347.8" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2002.07 259.87L2002.07 259.87" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2002.07 259.87L2030.39 384.39" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2002.07 259.87L2030.41 109.34" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2002.07 259.87L2140.19 347.8" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2002.07 259.87L1856.09 364.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2002.07 259.87L2165.24 76.3" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1992.51 684.48L1992.51 684.48" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1992.51 684.48L1844.02 666.24" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1992.51 684.48L1999.59 516.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1992.51 684.48L2164.71 684.11" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2361.18 520.31L2361.18 520.31" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2361.18 520.31L2319.42 644.08" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2361.18 520.31L2494.47 510.33" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2361.18 520.31L2314.98 384.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2361.18 520.31L2182.58 522.53" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2361.18 520.31L2473.2 702.55" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2636.64 496.18L2636.64 496.18" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2636.64 496.18L2629.75 373.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2636.64 496.18L2494.47 510.33" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2636.64 496.18L2781.45 498.03" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2636.64 496.18L2772.06 395.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2636.64 496.18L2655.89 680.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2636.64 496.18L2503.17 349.95" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2772.06 395.32L2772.06 395.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2772.06 395.32L2781.45 498.03" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2772.06 395.32L2629.75 373.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2772.06 395.32L2785.93 250.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2772.06 395.32L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2772.06 395.32L2503.17 349.95" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2776.13 825.25L2776.13 825.25" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2776.13 825.25L2747.4 698.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2776.13 825.25L2655.89 680.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2776.13 825.25L2492.02 816.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2776.13 825.25L2473.2 702.55" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2776.13 825.25L2781.45 498.03" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2776.13 825.25L2636.64 496.18" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-62.43 674.67L-62.43 674.67" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-62.43 674.67L82.05 684.22" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-62.43 674.67L58.83 796.46" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M-62.43 674.67L255.87 643.6" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M82.05 684.22L82.05 684.22" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M82.05 684.22L58.83 796.46" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M58.83 796.46L58.83 796.46" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M58.83 796.46L245.28 809.88" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M58.83 796.46L255.87 643.6" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M58.83 796.46L254 557.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M255.87 643.6L255.87 643.6" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M255.87 643.6L362.15 644.92" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M245.28 809.88L245.28 809.88" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M245.28 809.88L255.87 643.6" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M245.28 809.88L362.15 644.92" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M245.28 809.88L82.05 684.22" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M245.28 809.88L525.91 843.57" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M362.15 644.92L362.15 644.92" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M506.41 675.79L506.41 675.79" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M506.41 675.79L362.15 644.92" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M506.41 675.79L525.91 843.57" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M506.41 675.79L640.58 542.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M525.91 843.57L525.91 843.57" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M525.91 843.57L362.15 644.92" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M640.58 542.45L640.58 542.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M834.3 534.08L834.3 534.08" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M834.3 534.08L832.49 674.74" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M834.3 534.08L1007.31 502.06" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M834.3 534.08L640.58 542.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M832.49 674.74L832.49 674.74" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M832.49 674.74L991.36 649.35" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M832.49 674.74L844 856.04" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M832.49 674.74L970.09 794.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M832.49 674.74L640.58 542.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M832.49 674.74L1007.31 502.06" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M844 856.04L844 856.04" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M844 856.04L970.09 794.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1007.31 502.06L1007.31 502.06" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1007.31 502.06L1130.53 491.76" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1007.31 502.06L991.36 649.35" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1007.31 502.06L1139.78 677.94" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M991.36 649.35L991.36 649.35" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M991.36 649.35L970.09 794.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M970.09 794.44L970.09 794.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M970.09 794.44L1094.17 796.65" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1130.53 491.76L1130.53 491.76" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1130.53 491.76L1284.7 526.43" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1130.53 491.76L1139.78 677.94" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1130.53 491.76L991.36 649.35" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1130.53 491.76L1245.42 706.81" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1139.78 677.94L1139.78 677.94" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1139.78 677.94L1245.42 706.81" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1139.78 677.94L1094.17 796.65" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1139.78 677.94L991.36 649.35" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1094.17 796.65L1094.17 796.65" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1094.17 796.65L1245.42 706.81" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1094.17 796.65L991.36 649.35" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1284.7 526.43L1284.7 526.43" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1284.7 526.43L1402.26 554.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1284.7 526.43L1245.42 706.81" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1284.7 526.43L1139.78 677.94" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1284.7 526.43L1007.31 502.06" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1284.7 526.43L1564.2 532.96" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1245.42 706.81L1245.42 706.81" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1245.42 706.81L1285.16 808.02" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1285.16 808.02L1285.16 808.02" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1285.16 808.02L1454.38 831.26" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1285.16 808.02L1094.17 796.65" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1285.16 808.02L1139.78 677.94" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1285.16 808.02L1557.48 811.67" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1285.16 808.02L1402.26 554.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1402.26 554.15L1402.26 554.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1402.26 554.15L1564.2 532.96" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1402.26 554.15L1544.03 666.97" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1402.26 554.15L1245.42 706.81" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1402.26 554.15L1581.46 368.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1454.38 831.26L1454.38 831.26" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1454.38 831.26L1557.48 811.67" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1454.38 831.26L1544.03 666.97" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1454.38 831.26L1245.42 706.81" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1454.38 831.26L1715.59 832.4" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1454.38 831.26L1402.26 554.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1581.46 368.23L1581.46 368.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1581.46 368.23L1702.04 369.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1581.46 368.23L1564.2 532.96" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1564.2 532.96L1564.2 532.96" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1564.2 532.96L1544.03 666.97" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1544.03 666.97L1544.03 666.97" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1544.03 666.97L1557.48 811.67" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1557.48 811.67L1557.48 811.67" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1557.48 811.67L1715.59 832.4" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1702.04 369.23L1702.04 369.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1702.04 369.23L1856.09 364.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1702.04 369.23L1564.2 532.96" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1747.51 667.04L1747.51 667.04" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1747.51 667.04L1844.02 666.24" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1747.51 667.04L1715.59 832.4" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1747.51 667.04L1544.03 666.97" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1747.51 667.04L1908.47 527.86" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1715.59 832.4L1715.59 832.4" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1715.59 832.4L1853.96 860.48" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1856.09 364.32L1856.09 364.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1856.09 364.32L1908.47 527.86" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1908.47 527.86L1908.47 527.86" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1908.47 527.86L1999.59 516.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1908.47 527.86L1844.02 666.24" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1908.47 527.86L1992.51 684.48" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1908.47 527.86L2030.39 384.39" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1844.02 666.24L1844.02 666.24" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1844.02 666.24L1853.96 860.48" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1853.96 860.48L1853.96 860.48" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1853.96 860.48L1989.22 861.89" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1853.96 860.48L1747.51 667.04" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1853.96 860.48L1992.51 684.48" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1853.96 860.48L1557.48 811.67" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2030.41 109.34L2030.41 109.34" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2030.41 109.34L2165.24 76.3" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2030.39 384.39L2030.39 384.39" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2030.39 384.39L2140.19 347.8" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2030.39 384.39L1999.59 516.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1999.59 516.23L1999.59 516.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1999.59 516.23L2182.58 522.53" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1999.59 516.23L1856.09 364.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1989.22 861.89L1989.22 861.89" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1989.22 861.89L1992.51 684.48" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1989.22 861.89L2195.74 842.39" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1989.22 861.89L1844.02 666.24" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1989.22 861.89L2164.71 684.11" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M1989.22 861.89L1715.59 832.4" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2182.71 -83.21L2182.71 -83.21" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2182.71 -83.21L2309.04 -81.69" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2182.71 -83.21L2165.24 76.3" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2182.71 -83.21L2292.44 54.5" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2165.24 76.3L2165.24 76.3" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2165.24 76.3L2292.44 54.5" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2140.19 347.8L2140.19 347.8" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2140.19 347.8L2314.98 384.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2140.19 347.8L2182.58 522.53" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2140.19 347.8L1999.59 516.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2140.19 347.8L2323.12 209.85" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2182.58 522.53L2182.58 522.53" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2182.58 522.53L2164.71 684.11" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2164.71 684.11L2164.71 684.11" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2164.71 684.11L2319.42 644.08" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2164.71 684.11L2195.74 842.39" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2164.71 684.11L2312.28 834.09" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2164.71 684.11L1999.59 516.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2195.74 842.39L2195.74 842.39" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2195.74 842.39L2312.28 834.09" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2309.04 -81.69L2309.04 -81.69" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2292.44 54.5L2292.44 54.5" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2292.44 54.5L2309.04 -81.69" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2292.44 54.5L2323.12 209.85" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2323.12 209.85L2323.12 209.85" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2323.12 209.85L2456.44 241.38" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2314.98 384.44L2314.98 384.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2314.98 384.44L2323.12 209.85" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2314.98 384.44L2182.58 522.53" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2314.98 384.44L2503.17 349.95" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2319.42 644.08L2319.42 644.08" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2319.42 644.08L2473.2 702.55" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2312.28 834.09L2312.28 834.09" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2312.28 834.09L2492.02 816.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2312.28 834.09L2319.42 644.08" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2312.28 834.09L2473.2 702.55" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2312.28 834.09L2361.18 520.31" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2440.96 -92.68L2440.96 -92.68" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2440.96 -92.68L2309.04 -81.69" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2440.96 -92.68L2461.1 99.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2440.96 -92.68L2292.44 54.5" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2440.96 -92.68L2646.93 -40.84" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2440.96 -92.68L2182.71 -83.21" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2440.96 -92.68L2165.24 76.3" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2461.1 99.47L2461.1 99.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2461.1 99.47L2456.44 241.38" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2461.1 99.47L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2461.1 99.47L2292.44 54.5" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2456.44 241.38L2456.44 241.38" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2456.44 241.38L2503.17 349.95" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2456.44 241.38L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2456.44 241.38L2314.98 384.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2456.44 241.38L2629.75 373.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2503.17 349.95L2503.17 349.95" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2503.17 349.95L2629.75 373.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2503.17 349.95L2494.47 510.33" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2503.17 349.95L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2494.47 510.33L2494.47 510.33" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2494.47 510.33L2629.75 373.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2494.47 510.33L2473.2 702.55" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2494.47 510.33L2314.98 384.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2473.2 702.55L2473.2 702.55" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2473.2 702.55L2492.02 816.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2473.2 702.55L2655.89 680.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2492.02 816.77L2492.02 816.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2646.93 -40.84L2646.93 -40.84" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2646.93 -40.84L2787.54 -40.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2646.93 -40.84L2811.3 42.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2646.93 -40.84L2461.1 99.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2646.93 -40.84L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2603.06 189.58L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2629.75 373.15L2629.75 373.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2655.89 680.44L2655.89 680.44" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2655.89 680.44L2747.4 698.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2655.89 680.44L2492.02 816.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2655.89 680.44L2781.45 498.03" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2787.54 -40.23L2787.54 -40.23" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2787.54 -40.23L2811.3 42.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2787.54 -40.23L2785.93 250.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2787.54 -40.23L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2787.54 -40.23L2440.96 -92.68" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2787.54 -40.23L2461.1 99.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2811.3 42.77L2811.3 42.77" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2811.3 42.77L2785.93 250.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2811.3 42.77L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2811.3 42.77L2772.06 395.32" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2811.3 42.77L2461.1 99.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2785.93 250.45L2785.93 250.45" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2785.93 250.45L2603.06 189.58" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2781.45 498.03L2781.45 498.03" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2781.45 498.03L2629.75 373.15" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2781.45 498.03L2747.4 698.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <path d="M2747.4 698.47L2747.4 698.47" stroke="hsla(158.10000000000002, 64.4%, 67%, 0.82)" strokeWidth="1.5"></path>
                        <circle r="25" cx="-39.18" cy="826.51" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="254" cy="557.44" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="551.95" cy="539.46" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="651.6" cy="855.89" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="1710.03" cy="500.03" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="1890.38" cy="226.47" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="2002.07" cy="259.87" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="1992.51" cy="684.48" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="2361.18" cy="520.31" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="2636.64" cy="496.18" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="2772.06" cy="395.32" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="25" cx="2776.13" cy="825.25" fill='url("#SvgjsRadialGradient1063")'></circle>
                        <circle r="5" cx="-62.43" cy="674.67" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="82.05" cy="684.22" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="58.83" cy="796.46" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="255.87" cy="643.6" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="245.28" cy="809.88" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="362.15" cy="644.92" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="506.41" cy="675.79" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="525.91" cy="843.57" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="640.58" cy="542.45" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="834.3" cy="534.08" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="832.49" cy="674.74" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="844" cy="856.04" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1007.31" cy="502.06" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="991.36" cy="649.35" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="970.09" cy="794.44" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1130.53" cy="491.76" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1139.78" cy="677.94" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1094.17" cy="796.65" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1284.7" cy="526.43" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1245.42" cy="706.81" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1285.16" cy="808.02" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1402.26" cy="554.15" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1454.38" cy="831.26" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1581.46" cy="368.23" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1564.2" cy="532.96" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1544.03" cy="666.97" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1557.48" cy="811.67" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1702.04" cy="369.23" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1747.51" cy="667.04" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1715.59" cy="832.4" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1856.09" cy="364.32" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1908.47" cy="527.86" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1844.02" cy="666.24" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1853.96" cy="860.48" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2030.41" cy="109.34" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2030.39" cy="384.39" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1999.59" cy="516.23" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="1989.22" cy="861.89" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2182.71" cy="-83.21" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2165.24" cy="76.3" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2140.19" cy="347.8" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2182.58" cy="522.53" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2164.71" cy="684.11" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2195.74" cy="842.39" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2309.04" cy="-81.69" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2292.44" cy="54.5" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2323.12" cy="209.85" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2314.98" cy="384.44" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2319.42" cy="644.08" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2312.28" cy="834.09" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2440.96" cy="-92.68" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2461.1" cy="99.47" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2456.44" cy="241.38" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2503.17" cy="349.95" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2494.47" cy="510.33" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2473.2" cy="702.55" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2492.02" cy="816.77" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2646.93" cy="-40.84" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2603.06" cy="189.58" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2629.75" cy="373.15" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2655.89" cy="680.44" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2787.54" cy="-40.23" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2811.3" cy="42.77" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2785.93" cy="250.45" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2781.45" cy="498.03" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                        <circle r="5" cx="2747.4" cy="698.47" fill="rgba(172, 237, 213, 0.9099999999999999)"></circle>
                    </g>
                    <defs>
                        <mask id="SvgjsMask1062">
                            <rect width="2560" height="700" fill="#ffffff"></rect>
                        </mask>
                        <radialGradient id="SvgjsRadialGradient1063">
                            <stop stopColor="#ffffff" offset="0.1"></stop>
                            <stop stopColor="rgba(52, 211, 153, 0.82)" offset="0.2"></stop>
                            <stop stopColor="rgba(52, 211, 153, 0)" offset="1"></stop>
                        </radialGradient>
                    </defs>
                </svg>
            </div>
            <div className="relative mx-auto px-6 pb-32 sm:max-w-3xl lg:max-w-7xl lg:px-8 z-10">
                <div className="flex justify-between flex-wrap">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl inline-flex items-center gap-2">
                            <span className="text-emerald-400 uppercase">Season 1</span> Quests
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg text-zinc-300">
                            Earn points through in-app activities and quests. The more active you are, the more challenges you complete, the more points you'll accumulate. Top the leaderboard and secure exclusive prizes
                            for your efforts.
                        </p>
                    </div>
                    <div className="h-full w-full lg:w-auto">
                        <UserProgressCard />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 sm:gap-12 xl:gap-16 mt-12 w-full">
                    <div className="space-y-3 min-h-[76px]">
                        <p className="max-w-3xl text-lg text-zinc-300">Status</p>
                        <Badge form="round" variant="blue">
                            In progress
                        </Badge>
                    </div>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="space-y-3 min-h-[76px] text-left">
                                    <p className="max-w-3xl text-lg text-zinc-300">S1 Ending in</p>
                                    <Badge form="round" variant="lemon">
                                        TBU
                                    </Badge>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>To be updated</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {/* <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="space-y-3 min-h-[76px] text-left">
                                    <p className="max-w-3xl text-lg text-zinc-300">Points</p>
                                    <p className="text-md text-zinc-100">1,000</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Your points</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider> */}
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="space-y-3 min-h-[76px] text-left">
                                    <p className="max-w-3xl text-lg text-zinc-300">S1 XP points</p>
                                    <p className="text-md text-zinc-100">100,000</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Season 1 total XP points</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="space-y-3 min-h-[76px] min-w-[50%] md:min-w-[33%] w-full lg:w-auto">
                        <p className="max-w-3xl text-lg text-zinc-300">S1 Progress</p>
                        {/* <Badge form="round" variant="blood">100 000</Badge> */}
                        {/* <ProgressBar value={1} maxValue={9} size="default" color="emerald-400" labelOutside labelOutsideText={"8 more quests to go"} /> */}
                        <div className="!-mt-1">
                            <ProgressBar value={1} maxValue={9} size="default" color="emerald-400" labelOutside labelOutsideText={""} />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    {path === "/challenges/list" && (
                        <Link href="/challenges/leaderboard">
                            <Button variant="primary">View leaderboard</Button>
                        </Link>
                    )}
                    {path === "/challenges/leaderboard" && (
                        <Link href="/challenges/list">
                            <Button variant="primary">View quests</Button>
                        </Link>
                    )}
                </div>
                {/* <div className="pt-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="block">
                            <nav className="flex">
                                <ul role="list" className="flex min-w-full flex-none gap-x-6 text-md font-semibold leading-6 text-gray-400">
                                    {tabs.map((tab) => (
                                        <li key={tab.name}>
                                            <Link
                                                href={tab.href}
                                                className={classNames(path === tab.href ? "bg-emerald-100/10 text-emerald-400" : "text-zinc-400 hover:text-zinc-300", "rounded-md px-4 py-3 font-medium")}
                                            >
                                                {tab.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
