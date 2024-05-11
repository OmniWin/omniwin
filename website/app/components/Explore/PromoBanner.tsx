import CustomImageWithFallback from "@/app/components/CustomImageWithFallback";

export default function PromoBanner() {
    return (
        <div className="overflow-hidden pt-32 sm:pt-14 my-10 rounded-xl">
            {/* <div className="overflow-hidden pt-32 sm:pt-14 my-10 rounded-xl mx-auto max-w-7xl"> */}
            <div className="bg-zinc-800 rounded-xl">
                {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> */}
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative pb-16 pt-48 sm:pb-24">
                        <div>
                            <h2 id="sale-heading" className="text-4xl font-bold tracking-tight text-zinc-100 xs:text-lg sm:text-xl xl:text-4xl">
                                Sell NFTs Faster
                                <br />
                                <span className="text-emerald-400">Easy</span> Raffles, <span className="text-emerald-400">Quicker</span> Cash!
                            </h2>
                            <div className="mt-6 text-base">
                                <button type="button" className="font-semibold text-emerald-400 group hover:text-emerald-500">
                                    Create raffle
                                    <span className="ml-2 inline-block transform transition-all ease-in-out group-hover:translate-x-1" aria-hidden="true">
                                        {" "}
                                        &rarr;
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                            <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                                <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                                    <div className="flex-shrink-0">
                                        <CustomImageWithFallback
                                            width={300} // Placeholder width for aspect ratio calculation
                                            height={300} // Placeholder height for aspect ratio calculation
                                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                                            src="/images/banner/1.jpg"
                                            alt=""
                                        />
                                    </div>

                                    <div className="mt-6 flex-shrink-0 sm:mt-0">
                                        <CustomImageWithFallback
                                            width={300} // Placeholder width for aspect ratio calculation
                                            height={300} // Placeholder height for aspect ratio calculation
                                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                                            src="/images/banner/2.jpg"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                                    <div className="flex-shrink-0">
                                        <CustomImageWithFallback
                                            width={300} // Placeholder width for aspect ratio calculation
                                            height={300} // Placeholder height for aspect ratio calculation
                                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                                            src="/images/banner/3.jpg"
                                            alt=""
                                        />
                                    </div>

                                    <div className="mt-6 flex-shrink-0 sm:mt-0">
                                        <CustomImageWithFallback
                                            width={300} // Placeholder width for aspect ratio calculation
                                            height={300} // Placeholder height for aspect ratio calculation
                                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                                            src="/images/banner/4.jpg"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                                    <div className="flex-shrink-0">
                                        <CustomImageWithFallback
                                            width={300} // Placeholder width for aspect ratio calculation
                                            height={300} // Placeholder height for aspect ratio calculation
                                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                                            src="/images/banner/5.jpg"
                                            alt=""
                                        />
                                    </div>

                                    <div className="mt-6 flex-shrink-0 sm:mt-0">
                                        <CustomImageWithFallback
                                            width={300} // Placeholder width for aspect ratio calculation
                                            height={300} // Placeholder height for aspect ratio calculation
                                            className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72"
                                            src="/images/banner/6.jpg"
                                            alt=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
