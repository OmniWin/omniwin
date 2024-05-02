import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";
import { Button } from "@/components/ui/button";

import image1 from "@/public/images/banner/1.jpg";
import image2 from "@/public/images/banner/2.jpg";
import image3 from "@/public/images/banner/3.jpg";
import image4 from "@/public/images/banner/4.jpg";
import image5 from "@/public/images/banner/5.jpg";
import image6 from "@/public/images/banner/6.jpg";
import image7 from "@/public/images/banner/7.jpg";
import Link from "next/link";

export default function PromoBanner() {
    return (
        <div className="relative overflow-hidden bg-zinc-800/70 rounded-xl">
            <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
                <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                    <div className="sm:max-w-xl">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
                            NFT Raffles Made Easy:
                            <br />
                            Sell Smarter, Not Harder
                        </h1>
                        <p className="mt-5 text-xl text-zinc-400">Sell NFTs fast with raffles. Engage buyers, amplify excitement. Dive in now!</p>
                    </div>
                    <div>
                        <div className="mt-10">
                            {/* Decorative image grid */}
                            <div aria-hidden="true" className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                    <div className="flex items-center space-x-6 lg:space-x-8">
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <CustomImageWithFallback
                                                    width={300} // Placeholder width for aspect ratio calculation
                                                    height={300} // Placeholder height for aspect ratio calculation
                                                    // src="/images/banner/1.jpg"
                                                    src={image1}
                                                    placeholder="blur"
                                                    alt="NFT Raffles"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <CustomImageWithFallback
                                                    width={300} // Placeholder width for aspect ratio calculation
                                                    height={300} // Placeholder height for aspect ratio calculation
                                                    // src="/images/banner/2.jpg"
                                                    src={image2}
                                                    placeholder="blur"
                                                    alt="NFT Raffles"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <CustomImageWithFallback
                                                    width={300} // Placeholder width for aspect ratio calculation
                                                    height={300} // Placeholder height for aspect ratio calculation
                                                    // src="/images/banner/3.jpg"
                                                    src={image3}
                                                    placeholder="blur"
                                                    alt="NFT Raffles"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <CustomImageWithFallback
                                                    width={300} // Placeholder width for aspect ratio calculation
                                                    height={300} // Placeholder height for aspect ratio calculation
                                                    // src="/images/banner/4.jpg"
                                                    src={image4}
                                                    placeholder="blur"
                                                    alt="NFT Raffles"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <CustomImageWithFallback
                                                    width={300} // Placeholder width for aspect ratio calculation
                                                    height={300} // Placeholder height for aspect ratio calculation
                                                    // src="/images/banner/5.jpg"
                                                    src={image5}
                                                    placeholder="blur"
                                                    alt="NFT Raffles"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <CustomImageWithFallback
                                                    width={300} // Placeholder width for aspect ratio calculation
                                                    height={300} // Placeholder height for aspect ratio calculation
                                                    // src="/images/banner/6.jpg"
                                                    src={image6}
                                                    placeholder="blur"
                                                    alt="NFT Raffles"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <CustomImageWithFallback
                                                    width={300} // Placeholder width for aspect ratio calculation
                                                    height={300} // Placeholder height for aspect ratio calculation
                                                    // src="/images/banner/7.jpg"
                                                    src={image7}
                                                    placeholder="blur"
                                                    alt="NFT Raffles"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button variant="primary" size="xl">
                                Create raffle
                            </Button>
                            <div className="block md:inline-block mt-2 ">
                                <Link href="/raffles">
                                    <Button variant="soft" size="xl" className="md:ml-3">
                                        Explore
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
