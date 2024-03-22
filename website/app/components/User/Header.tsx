"use client";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";
import UserProgressCard from "@/app/components/User/ProgressCard";
import UserProgress from "@/app/components/User/Progress";
import { Button } from "@/components/ui/button";

// import { classNames, tiers } from "@/app/utils";
import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";

import { format } from "date-fns";
import { useState, useEffect } from "react";
import { classNames } from "@/app/utils";

export default function UserHeader() {
    // const dispatch = useDispatch();
    const userSettingsState = useSelector(selectUserSettingsState);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <>
            <div className="pt-16 -mt-3 md:-mt-12 -mx-3 md:-mx-12 overflow-hidden shadow shadow-zinc-900 bg-gradient-to-tr from-zinc-800 to-zinc-800/5 relative">
                {/* <img className="h-32 w-full object-cover lg:h-48" src={profile.coverImageUrl} alt="" /> */}
                <div
                    className="w-full object-cover h-full pt-20 opacity-60 absolute left-0 top-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1003%26quot%3b)' fill='none'%3e%3cpath d='M956.8178222442295 315.12372132562143L1027.1352148794213 331.3577705679741 1016.3275924253544 217.76465699401044z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M487.1247279136658 144.59574574068617L542.2954141985165 210.34560932654506 613.3348664348795 94.71464810633955z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M100.18282778021143 245.44549706610965L66.26767475544105 195.16421495044833 7.803328094334248 271.1775855454345z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M588.451%2c623.863C625.405%2c621.85%2c647.65%2c587.523%2c666.358%2c555.591C685.369%2c523.141%2c707.622%2c485.235%2c688.714%2c452.725C669.859%2c420.306%2c625.912%2c419.866%2c588.451%2c421.639C554.926%2c423.226%2c521.807%2c433.444%2c503.381%2c461.497C483.009%2c492.512%2c477.091%2c532.094%2c494.312%2c564.963C512.724%2c600.105%2c548.837%2c626.021%2c588.451%2c623.863' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M1512.2298500642876 130.20228802803575L1472.5709787060373-8.104632773154464 1334.264057904847 31.55423858509579 1373.9229292630973 169.861159386286z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M113.994%2c482.866C134.114%2c483.814%2c157.023%2c481.604%2c167.201%2c464.223C177.444%2c446.731%2c167.946%2c425.76%2c157.665%2c408.29C147.583%2c391.159%2c133.862%2c374.441%2c113.994%2c373.813C93.262%2c373.157%2c74.928%2c387.016%2c65.262%2c405.368C56.216%2c422.543%2c58.485%2c443.153%2c68.818%2c459.586C78.483%2c474.957%2c95.857%2c482.011%2c113.994%2c482.866' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M1055.2469826395825 520.2205675673598L1178.6855848321018 531.0200459006915 1189.4850631654335 407.5814437081722 1066.0464609729142 396.7819653748405z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M33.72999072854489 19.894305227396217L91.68986800076839 124.45669171615828 196.25225448953043 66.49681444393478 138.29237721730695-38.06557204482728z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M578.75%2c167.371C605.57%2c168.503%2c633.847%2c161.528%2c648.284%2c138.897C663.684%2c114.755%2c663.948%2c82.558%2c648.043%2c58.745C633.494%2c36.963%2c604.944%2c34.642%2c578.75%2c34.791C552.919%2c34.938%2c524.243%2c37.463%2c510.809%2c59.526C497.001%2c82.204%2c504.541%2c110.96%2c518.693%2c133.425C531.83%2c154.279%2c554.125%2c166.331%2c578.75%2c167.371' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M388.70475929705134 130.3730218694741L536.3067079246887 159.2099441191055 495.6812646603157 34.177686193897586z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1292.319%2c568.473C1343.994%2c567.984%2c1395.985%2c549.823%2c1422.528%2c505.483C1449.723%2c460.055%2c1445.334%2c403.1%2c1418.713%2c357.333C1392.248%2c311.833%2c1344.873%2c278.669%2c1292.319%2c281.625C1243.583%2c284.366%2c1213.306%2c328.328%2c1188.365%2c370.288C1162.617%2c413.607%2c1134.364%2c463.36%2c1157.773%2c507.987C1182.254%2c554.659%2c1239.618%2c568.971%2c1292.319%2c568.473' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M543.7095725410779 291.19857228651404L528.7996430861376 459.76937986950304 663.9428717625001 399.5997378375753z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M581.3354031713579 257.5918620729199L723.2493919679282 300.97932257621204 624.7228636746501 115.67787327634963z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M981.915%2c416.176C1030.69%2c418.093%2c1077.805%2c395.233%2c1103.411%2c353.675C1130.303%2c310.031%2c1134.812%2c254.446%2c1108.775%2c210.286C1083.1%2c166.74%2c1032.347%2c144.137%2c981.915%2c147.613C936.703%2c150.729%2c903.577%2c185.995%2c882.112%2c225.908C861.977%2c263.347%2c856.158%2c307.089%2c875.904%2c344.734C897.119%2c385.18%2c936.278%2c414.383%2c981.915%2c416.176' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M1042.058%2c401.528C1056.477%2c401.166%2c1071.345%2c396.1%2c1078.113%2c383.362C1084.578%2c371.195%2c1078.622%2c357.343%2c1071.936%2c345.296C1064.966%2c332.736%2c1056.371%2c319.605%2c1042.058%2c318.392C1025.931%2c317.026%2c1010.108%2c325.412%2c1001.902%2c339.362C993.587%2c353.497%2c993.827%2c371.48%2c1002.725%2c385.255C1010.976%2c398.029%2c1026.856%2c401.91%2c1042.058%2c401.528' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1074.1800393642895-44.46063601518339L973.7946585659071 25.829964345896308 1044.0852589269866 126.21534514427881 1144.4706397253692 55.924744783199124z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M357.3756345103982 459.4516068860371L240.22327702904767 409.72338147561896 307.64740909998005 576.6039643673876z' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M66.363%2c309.644C99.562%2c310.262%2c135.03%2c304.202%2c153.147%2c276.375C172.702%2c246.339%2c173.893%2c205.416%2c153.338%2c176.055C134.871%2c149.676%2c98.449%2c149.691%2c66.363%2c152.407C39.911%2c154.646%2c16.461%2c166.878%2c1.634%2c188.899C-15.52%2c214.376%2c-29.51%2c246.174%2c-14.998%2c273.244C0.047%2c301.31%2c34.525%2c309.051%2c66.363%2c309.644' fill='rgba(16%2c 185%2c 129%2c 0.34)' class='triangle-float2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1003'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cstyle%3e %40keyframes float1 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-10px%2c 0)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float1 %7b animation: float1 5s infinite%3b %7d %40keyframes float2 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-5px%2c -5px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float2 %7b animation: float2 4s infinite%3b %7d %40keyframes float3 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(0%2c -10px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float3 %7b animation: float3 6s infinite%3b %7d %3c/style%3e%3c/defs%3e%3c/svg%3e")`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                ></div>
                {isMounted && (
                    <div className="bg-gradient-to-t from-zinc-900 to-transparent border-b border-zinc-800">
                        <div className="mx-auto max-w-5xl 2xl:max-w-7xl 3xl:max-w-8xl px-4 sm:px-6 lg:px-8 relative z-[2] py-10">
                            <div className="sm:flex sm:space-x-5 items-center flex-wrap">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center space-y-3 flex-col text-zinc-400 mr-5">
                                        <Button
                                            variant="link"
                                            className={classNames([
                                                "p-0 !inline-block !h-auto !text-zinc-400 hover:!text-zinc-100",
                                            ])}
                                            // !Object.keys(userSettingsState?.user?.twitter ?? {}).length && "!cursor-not-allowed !pointer-events-none",
                                            title={!Object.keys(userSettingsState?.user?.twitter ?? {}).length ? "Twitter not connected" : ""}
                                        >
                                            <Link href={userSettingsState.user.twitter ?? '#'} className="hover:text-white transition-all duration-300">
                                                <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="link"
                                            className={classNames([
                                                "p-0 !inline-block !h-auto !text-zinc-400 hover:!text-zinc-100",
                                            ])}
                                            // !Object.keys(userSettingsState?.user?.discord ?? {}).length && "!cursor-not-allowed !pointer-events-none",
                                            title={!Object.keys(userSettingsState?.user?.discord ?? {}).length ? "Discord not connected" : ""}
                                        >
                                            <Link href={userSettingsState.user.discord ?? '#'} className="hover:text-white transition-all duration-300">
                                                <FontAwesomeIcon icon={faDiscord} className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="link"
                                            className={classNames([
                                                "p-0 !inline-block !h-auto !text-zinc-400 hover:!text-zinc-100",
                                            ])}
                                            // !Object.keys(userSettingsState?.user?.telegram ?? {}).length && "!cursor-not-allowed !pointer-events-none",
                                            title={!Object.keys(userSettingsState?.user?.telegram ?? {}).length ? "Telegram not connected" : ""}
                                        >
                                            <Link href={userSettingsState.user.telegram ?? '#'} className="hover:text-white transition-all duration-300">
                                                <FontAwesomeIcon icon={faTelegram} className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                    {/* <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src="/images/banner/7.jpg" alt="" /> */}
                                    <CustomImageWithFallback
                                        width={128} // Placeholder width for aspect ratio calculation
                                        height={128} // Placeholder height for aspect ratio calculation
                                        // src="/images/banner/7.jpg"
                                        src={`/images/uploads/avatars/${userSettingsState?.user?.avatar}`}
                                        alt=""
                                        containerClass="flex items-center !w-auto !sm:w-full"
                                        className="h-24 w-24 rounded-xl ring-4 ring-zinc-800 sm:h-32 sm:w-32"
                                    />
                                    <div className="ml-5 sm:hidden">
                                        <h1 className="truncate text-2xl font-bold text-zinc-100">{userSettingsState?.user?.username ?? userSettingsState?.user?.address}</h1>
                                        {userSettingsState?.user?.created_at && (
                                            <time className="block text-sm font-medium text-zinc-400">Joined on {format(new Date(userSettingsState?.user?.created_at), "MMMM d, yyyy")}</time>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 sm:mt-0 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:space-x-6 sm:pb-1">
                                    <div className="mt-6 sm:mt-0 min-w-0 flex-1 2xl:block">
                                        <div className="hidden sm:block">
                                            <h1 className="truncate text-2xl font-bold text-zinc-100">{userSettingsState?.user?.username ?? userSettingsState?.user?.address}</h1>
                                            {userSettingsState?.user?.created_at && (
                                                <time className="block text-sm font-medium text-zinc-400">Joined on {format(new Date(userSettingsState?.user?.created_at), "MMMM d, yyyy")}</time>
                                            )}
                                        </div>
                                        <UserProgress className="space-y-3 mt-4 max-w-sm" />
                                    </div>
                                </div>
                                <UserProgressCard />
                            </div>
                            <p className="text-zinc-400 mt-10">{userSettingsState?.user?.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
