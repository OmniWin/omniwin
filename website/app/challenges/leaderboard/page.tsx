import ChallengesHeader from "@/app/components/Challenges/Header";
import CustomImageWithFallback from "@/app/components/Raffle/CustomImageWithFallback";

import { classNames, shortenAddress } from "@/app/utils";

const participants = [
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 2,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 3,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 4,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
    {
        place: 1,
        recipient: "0x4d3f7f3e0a1f3e3e0a1f3e0a1f3e0a1f3e0a1f3e",
        totalPoints: 100,
        imageUrl: "/images/banner/1.jpg",
    },
];

const tier = [
    "/images/tier/1.png",
    "/images/tier/2.png",
    "/images/tier/3.png",
    "/images/tier/4.png",
    "/images/tier/5.png",
    "/images/tier/6.png",
    "/images/tier/7.png",
    "/images/tier/8.png",
    "/images/tier/9.png",
    "/images/tier/10.png",
];

const tierColors = [
    "bg-gradient-to-r from-[#e52a5f38] to-transparent",
    "bg-gradient-to-r from-[#fba21342] to-transparent",
    "bg-gradient-to-r from-[#c41b1e38] to-transparent",
    "bg-gradient-to-r from-[#e536e541] to-transparent",
    "bg-gradient-to-r from-[#01d8e33a] to-transparent",
    "bg-gradient-to-r from-[#51a6323d] to-transparent",
    "bg-gradient-to-r from-[#5768e833] to-transparent",
    "bg-gradient-to-r from-[#caa64b42] to-transparent",
    "bg-gradient-to-r from-[#8d8d8d4f] to-transparent",
    "bg-gradient-to-r from-[#f68b623b] to-transparent",
];

export default function Leaderboard() {
    return (
        <>
            <ChallengesHeader />
            <section className="relative z-10 mx-auto -mt-36 max-w-md sm:max-w-3xl lg:max-w-7xl lg:px-8 pb-20" aria-labelledby="contact-heading">
                <div className="border border-zinc-800 rounded-xl bg-zinc-900">
                    <table className="w-full whitespace-nowrap text-left">
                        <colgroup>
                            {/* <col className="w-full sm:w-4/12" /> */}
                            <col className="w-full sm:w-[2%]" />
                            <col className="w-full sm:w-[2%]" />
                            <col className="lg:w-4/12" />
                            <col className="lg:w-2/12" />
                            {/* <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" /> */}
                        </colgroup>
                        <thead className="border-b border-white/10 text-sm leading-6 text-white">
                            <tr>
                                <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8 text-center">
                                    Tier
                                </th>
                                <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8 text-center">
                                    Place
                                </th>
                                <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                                    Player
                                </th>
                                <th scope="col" className="hidden py-2 pl-0 pr-8 text-right font-semibold md:table-cell">
                                    Total Points
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {participants.map((item, key) => (
                                <tr key={item.recipient} className={classNames("hover:bg-zinc-800/60")}>
                                    <td className={classNames("py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-center", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(key) && tierColors[key])}>
                                        <div className="text-sm font-medium leading-6 text-white">
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(key) ? (
                                                <CustomImageWithFallback
                                                    src={tier[key]}
                                                    alt=""
                                                    className="mx-auto object-cover inset-0 !w-auto !max-h-[36px]"
                                                    width={32}
                                                    height={32}
                                                    sizes="100%"
                                                    style={{
                                                        objectFit: "cover",
                                                        width: "100%",
                                                    }}
                                                />
                                            ) : (
                                                item.place
                                            )}
                                        </div>
                                    </td>
                                    <td className={classNames("py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-center")}>
                                        <div className="text-sm font-medium leading-6 text-white">{item.place}</div>
                                    </td>
                                    <td className="hidden py-4 pl-4 sm:pl-8 pr-8 text-right text-sm leading-6 text-zinc-400 md:table-cell">
                                        <div className="flex items-center gap-x-4">
                                            <div className="flex">
                                                <CustomImageWithFallback src={(item as any).imageUrl} alt="" className="h-8 w-8 rounded-full bg-zinc-800" width={60} height={60} />
                                            </div>
                                            <div className="truncate text-sm font-medium leading-6 text-white">{shortenAddress(item.recipient)}</div>
                                        </div>
                                    </td>
                                    <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-zinc-400 sm:table-cell sm:pr-6 lg:pr-8">
                                        <div className="truncate text-sm font-medium leading-6 text-white">{item.totalPoints}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
