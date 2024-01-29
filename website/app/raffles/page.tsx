"use client";

/* Components */
import PromoBanner from "../components/Explore/PromoBanner";
import RaffleList from "../components/Explore/RaffleList";

// import { classNames } from "@/app/utils";


export default function ExploreRaffles() {

    return (
        <>
            <div className="mx-auto max-w-10xl relative z-10">
            {/* <div className="mx-auto max-w-7xl relative z-10"> */}
                <PromoBanner />
                <RaffleList />
            </div>
        </>
    );
}
