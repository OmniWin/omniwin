"use client";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";
import UserProgressCard from "@/app/components/User/ProgressCard";
import UserProgress from "@/app/components/User/Progress";

import { classNames, tiers } from "@/app/utils";

const profile = {
    name: "Ricardo Cooper",
    imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    about: `
        Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.
        Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.
    `,
    fields: {
        Phone: "(555) 123-4567",
        Email: "ricardocooper@example.com",
        Title: "Senior Front-End Developer",
        Team: "Product Development",
        Location: "San Francisco",
        Sits: "Oasis, 4th floor",
        Salary: "$145,000",
        Birthday: "June 8, 1990",
    },
};

export default function UserHeader() {
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
                <div className="bg-gradient-to-t from-zinc-900 to-transparent border-b border-zinc-800">
                    <div className="mx-auto max-w-5xl 2xl:max-w-7xl 3xl:max-w-8xl px-4 sm:px-6 lg:px-8 relative z-[2] py-10">
                        <div className="sm:flex sm:space-x-5 items-center flex-wrap">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center space-y-3 flex-col text-zinc-400 mr-5">
                                    <Link href="https://twitter.com/omniwin" className="hover:text-white transition-all duration-300">
                                        <FontAwesomeIcon icon={faTwitter} className="h-4 w-4" />
                                    </Link>
                                    <Link href="https://discord.gg/omniwin" className="hover:text-white transition-all duration-300">
                                        <FontAwesomeIcon icon={faDiscord} className="h-4 w-4" />
                                    </Link>
                                    <Link href="https://t.me/omniwin" className="hover:text-white transition-all duration-300">
                                        <FontAwesomeIcon icon={faTelegram} className="h-4 w-4" />
                                    </Link>
                                </div>
                                {/* <img className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" src="/images/banner/7.jpg" alt="" /> */}
                                <CustomImageWithFallback
                                    width={128} // Placeholder width for aspect ratio calculation
                                    height={128} // Placeholder height for aspect ratio calculation
                                    src="/images/banner/7.jpg"
                                    alt=""
                                    containerClass="flex items-center !w-auto !sm:w-full"
                                    className="h-24 w-24 rounded-full ring-4 ring-zinc-800 sm:h-32 sm:w-32"
                                />
                                <div className="ml-5 sm:hidden">
                                    <h1 className="truncate text-2xl font-bold text-zinc-100">{profile.name}</h1>
                                    <time className="block text-sm font-medium text-zinc-400">Joined on 17.03.2024</time>
                                </div>
                            </div>
                            <div className="mt-6 sm:mt-0 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:space-x-6 sm:pb-1">
                                <div className="mt-6 sm:mt-0 min-w-0 flex-1 2xl:block">
                                    <div className="hidden sm:block">
                                        <h1 className="truncate text-2xl font-bold text-zinc-100">{profile.name}</h1>
                                        <time className="block text-sm font-medium text-zinc-400">Joined on 17.03.2024</time>
                                    </div>
                                    <UserProgress className="space-y-3 mt-4 max-w-sm" />
                                    {/* <div className="space-y-3 mt-4 max-w-sm">
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={classNames("flex items-center text-xs gap-1 py-1.5 px-2.5 rounded")}
                                                style={{ backgroundColor: tiers[1].lowOpacityColor, color: tiers[1].color, borderColor: tiers[1].color }}
                                            >
                                                <CustomImageWithFallback src="/images/tier/2.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                                                <span>Tier 2</span>
                                            </div>
                                            <p className="text-zinc-400 text-sm">2500 left</p>
                                            <div
                                                className={classNames("flex items-center text-xs gap-1 py-1.5 px-2.5 rounded")}
                                                style={{ backgroundColor: tiers[0].lowOpacityColor, color: tiers[0].color, borderColor: tiers[0].color }}
                                            >
                                                <CustomImageWithFallback src="/images/tier/1.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                                                <span>Tier 1</span>
                                            </div>
                                        </div>
                                        <Progress value={20} className="h-2" />
                                    </div> */}
                                </div>
                                {/* <div className="bg-zinc-900 rounded-[18px] p-px flex flex-col border border-transparent transition-all ease-in-out duration-300 hover:translate-y-[-4px] min-w-[160px]">
                                    <div
                                        className={classNames(
                                            "flex flex-col h-full rounded-2xl border-2 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 stroke-emerald-400 fill-emerald-400/10 border-emerald-400",
                                        )}
                                    >
                                        <div className="relative flex-1 px-6 pb-6 pt-8 md:px-8 text-center">
                                            <div className="absolute top-0 -translate-y-1/2 transform w-16 h-16 flex items-center justify-center left-1/2 -translate-x-1/2">
                                                <svg className="h-6 w-6 fill-emerald-400 relative z-10 -top-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                    <path
                                                        d="M176.9 48c6.4 160.7 44.3 231.4 71.8 261.7c13.7 15.1 25.9 21.4 33.1 24.1c2.6 1 4.7 1.5 6.1 1.9c1.4-.3 3.5-.9 6.1-1.9c7.2-2.7 19.4-9 33.1-24.1c27.5-30.3 65.5-101 71.8-261.7H176.9zM176 0H400c26.5 0 48.1 21.8 47.1 48.2c-.2 5.3-.4 10.6-.7 15.8H552c13.3 0 24 10.7 24 24c0 108.5-45.9 177.7-101.4 220.6c-53.9 41.7-115.7 57.6-149.5 63.7c-4.7 2.5-9.1 4.5-13.1 6.1V464h80c13.3 0 24 10.7 24 24s-10.7 24-24 24H288 184c-13.3 0-24-10.7-24-24s10.7-24 24-24h80V378.4c-4-1.6-8.4-3.6-13.1-6.1c-33.8-6-95.5-22-149.5-63.7C45.9 265.7 0 196.5 0 88C0 74.7 10.7 64 24 64H129.6c-.3-5.2-.5-10.4-.7-15.8C127.9 21.8 149.5 0 176 0zM390.8 302.6c18.1-8 36.8-18.4 54.4-32c40.6-31.3 75.9-80.2 81.9-158.6H442.7c-9.1 90.1-29.2 150.3-51.9 190.6zm-260-32c17.5 13.6 36.3 24 54.4 32c-22.7-40.3-42.8-100.5-51.9-190.6H48.9c6 78.4 41.3 127.3 81.9 158.6zM295.2 102.5l14.5 29.3c1.2 2.4 3.4 4 6 4.4l32.4 4.7c6.6 1 9.2 9 4.4 13.6l-23.4 22.8c-1.9 1.8-2.7 4.5-2.3 7.1l5.5 32.2c1.1 6.5-5.7 11.5-11.6 8.4l-29-15.2c-2.3-1.2-5.1-1.2-7.4 0l-29 15.2c-5.9 3.1-12.7-1.9-11.6-8.4l5.5-32.2c.4-2.6-.4-5.2-2.3-7.1l-23.4-22.8c-4.7-4.6-2.1-12.7 4.4-13.6l32.4-4.7c2.6-.4 4.9-2 6-4.4l14.5-29.3c2.9-5.9 11.4-5.9 14.3 0z"
                                                    />
                                                </svg>

                                                <svg className="w-16 h-16 absolute top-0 z-[1]" width="1135" height="1027" viewBox="0 0 1135 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        className={classNames("stroke-[40] stroke-emerald-400 fill-emerald-400/10 border-emerald-800")}
                                                        d="M898.366 20.0234H567.5H236.634C200.429 20.0234 166.16 36.3692 143.376 64.5055L47.0795 183.423C15.004 223.033 11.4501 278.584 38.2165 321.959L425.248 949.143C447.104 984.561 485.751 1006.12 527.369 1006.12H607.631C649.25 1006.12 687.896 984.561 709.752 949.143L1096.78 321.959C1123.55 278.584 1120 223.033 1087.92 183.423L991.624 64.5055C968.84 36.3692 934.571 20.0234 898.366 20.0234Z"
                                                    />
                                                </svg>
                                                <svg className="w-[66px] h-[66px] absolute top-0" width="1135" height="1027" viewBox="0 0 1135 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        className={classNames("fill-zinc-900")}
                                                        d="M898.366 20.0234H567.5H236.634C200.429 20.0234 166.16 36.3692 143.376 64.5055L47.0795 183.423C15.004 223.033 11.4501 278.584 38.2165 321.959L425.248 949.143C447.104 984.561 485.751 1006.12 527.369 1006.12H607.631C649.25 1006.12 687.896 984.561 709.752 949.143L1096.78 321.959C1123.55 278.584 1120 223.033 1087.92 183.423L991.624 64.5055C968.84 36.3692 934.571 20.0234 898.366 20.0234Z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="mt-4 text-xl text-zinc-200 line-clamp-2 flex items-center gap-2">
                                                <CustomImageWithFallback src="/images/tier/2.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                                                <span>Tier 2</span>
                                            </div>
                                            <p className="mt-4 text-base text-zinc-400 line-clamp-2">
                                                Rank
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 rounded-[18px] p-px flex flex-col border border-transparent transition-all ease-in-out duration-300 hover:translate-y-[-4px] min-w-[160px]">
                                    <div
                                        className={classNames(
                                            "flex flex-col h-full rounded-2xl border-2 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 stroke-emerald-400 fill-emerald-400/10 border-emerald-400",
                                        )}
                                    >
                                        <div className="relative flex-1 px-6 pb-6 pt-8 md:px-8 text-center">
                                            <div className="absolute top-0 -translate-y-1/2 transform w-16 h-16 flex items-center justify-center left-1/2 -translate-x-1/2">
                                                <svg className="h-6 w-6 fill-emerald-400 relative z-10 -top-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                    <path
                                                        d="M176 48h96V157.7c0 24.3 13.5 44.9 32.3 55.9C352.1 241.4 384 293 384 351.9c-64.4-.9-94.8-12.3-122.5-22.7c-23.8-9-45.7-17.2-85.5-17.2c-55.8 0-92.3 16.1-111.5 27.9c4-53.9 34.8-100.4 79.2-126.3c18.8-11 32.3-31.6 32.3-55.9V48zM320 157.7V48h8c13.3 0 24-10.7 24-24s-10.7-24-24-24H304 144 120C106.7 0 96 10.7 96 24s10.7 24 24 24h8V157.7c0 6-3.3 11.4-8.5 14.4C57.6 208.2 16 275.2 16 352c0 56 22.1 106.9 58.2 144.3C84.5 507 99.3 512 114.2 512H333.8c15 0 29.7-5 40.1-15.7C409.9 458.9 432 408 432 352c0-76.8-41.6-143.8-103.5-179.9c-5.2-3-8.5-8.4-8.5-14.4z"
                                                    />
                                                </svg>
                                                <svg className="w-16 h-16 absolute top-0 z-[1]" width="1135" height="1027" viewBox="0 0 1135 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        className={classNames("stroke-[40] stroke-emerald-400 fill-emerald-400/10 border-emerald-800")}
                                                        d="M898.366 20.0234H567.5H236.634C200.429 20.0234 166.16 36.3692 143.376 64.5055L47.0795 183.423C15.004 223.033 11.4501 278.584 38.2165 321.959L425.248 949.143C447.104 984.561 485.751 1006.12 527.369 1006.12H607.631C649.25 1006.12 687.896 984.561 709.752 949.143L1096.78 321.959C1123.55 278.584 1120 223.033 1087.92 183.423L991.624 64.5055C968.84 36.3692 934.571 20.0234 898.366 20.0234Z"
                                                    />
                                                </svg>
                                                <svg className="w-[66px] h-[66px] absolute top-0" width="1135" height="1027" viewBox="0 0 1135 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        className={classNames("fill-zinc-900")}
                                                        d="M898.366 20.0234H567.5H236.634C200.429 20.0234 166.16 36.3692 143.376 64.5055L47.0795 183.423C15.004 223.033 11.4501 278.584 38.2165 321.959L425.248 949.143C447.104 984.561 485.751 1006.12 527.369 1006.12H607.631C649.25 1006.12 687.896 984.561 709.752 949.143L1096.78 321.959C1123.55 278.584 1120 223.033 1087.92 183.423L991.624 64.5055C968.84 36.3692 934.571 20.0234 898.366 20.0234Z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="mt-4 text-xl text-zinc-200 line-clamp-2">
                                                23,000
                                            </p>
                                            <p className="mt-4 text-base text-zinc-400 line-clamp-2">
                                                XP
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-zinc-900 rounded-[18px] p-px flex flex-col border border-transparent transition-all ease-in-out duration-300 hover:translate-y-[-4px] min-w-[160px]">
                                    <div
                                        className={classNames(
                                            "flex flex-col h-full rounded-2xl border-2 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300 stroke-emerald-400 fill-emerald-400/10 border-emerald-400",
                                        )}
                                    >
                                        <div className="relative flex-1 px-6 pb-6 pt-8 md:px-8 text-center">
                                            <div className="absolute top-0 -translate-y-1/2 transform w-16 h-16 flex items-center justify-center left-1/2 -translate-x-1/2">
                                                <svg className="h-6 w-6 fill-emerald-400 relative z-10 -top-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                    <path
                                                        d="M353.8 54.1l52.3 7.5c9.3 1.4 13.2 12.9 6.4 19.8l-38 36.6 9 52.1c1.4 9.3-8.2 16.5-16.8 12.2l-46.6-24.4-46.9 24.8c-8.6 4.3-18.3-2.9-16.8-12.2l9-52.1-38-37c-6.8-6.8-2.9-18.3 6.4-19.8l52.3-7.5L309.8 6.3c4.3-8.6 16.5-8.3 20.4 0l23.6 47.8zM272 304V464h96V304H272zm-48 0c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H272c-26.5 0-48-21.5-48-48V304zM48 368v96h96V368H48zM0 368c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V368zm592 32H496v64h96V400zm-96-48h96c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H496c-26.5 0-48-21.5-48-48V400c0-26.5 21.5-48 48-48z"
                                                    />
                                                </svg>
                                                <svg className="w-16 h-16 absolute top-0 z-[1]" width="1135" height="1027" viewBox="0 0 1135 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        className={classNames("stroke-[40] stroke-emerald-400 fill-emerald-400/10 border-emerald-800")}
                                                        d="M898.366 20.0234H567.5H236.634C200.429 20.0234 166.16 36.3692 143.376 64.5055L47.0795 183.423C15.004 223.033 11.4501 278.584 38.2165 321.959L425.248 949.143C447.104 984.561 485.751 1006.12 527.369 1006.12H607.631C649.25 1006.12 687.896 984.561 709.752 949.143L1096.78 321.959C1123.55 278.584 1120 223.033 1087.92 183.423L991.624 64.5055C968.84 36.3692 934.571 20.0234 898.366 20.0234Z"
                                                    />
                                                </svg>
                                                <svg className="w-[66px] h-[66px] absolute top-0" width="1135" height="1027" viewBox="0 0 1135 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        className={classNames("fill-zinc-900")}
                                                        d="M898.366 20.0234H567.5H236.634C200.429 20.0234 166.16 36.3692 143.376 64.5055L47.0795 183.423C15.004 223.033 11.4501 278.584 38.2165 321.959L425.248 949.143C447.104 984.561 485.751 1006.12 527.369 1006.12H607.631C649.25 1006.12 687.896 984.561 709.752 949.143L1096.78 321.959C1123.55 278.584 1120 223.033 1087.92 183.423L991.624 64.5055C968.84 36.3692 934.571 20.0234 898.366 20.0234Z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="mt-4 text-xl text-zinc-200 line-clamp-2">
                                                234
                                            </p>
                                            <p className="mt-4 text-base text-zinc-400 line-clamp-2">
                                                Position
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <UserProgressCard />
                        </div>
                        {/* <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                            <h1 className="truncate text-2xl font-bold text-zinc-100">{profile.name}</h1>
                        </div> */}
                        <p className="text-zinc-400 mt-10">{profile.about}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
