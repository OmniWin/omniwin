export default function PromoBanner() {
    return (
        <div className="relative overflow-hidden bg-zinc-800 rounded-xl">
            <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
                <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                    <div className="sm:max-w-lg">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl">
                            Sell NFTs Faster
                            <br />
                            Easy Raffles, Quicker Cash!
                        </h1>
                        <p className="mt-4 text-xl text-zinc-400">This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care if you live or die.</p>
                    </div>
                    <div>
                        <div className="mt-10">
                            {/* Decorative image grid */}
                            <div aria-hidden="true" className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                    <div className="flex items-center space-x-6 lg:space-x-8">
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png" alt="" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/2.png" alt="" className="h-full w-full object-cover object-center" />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/3.png" alt="" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/4.png" alt="" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/5.png" alt="" className="h-full w-full object-cover object-center" />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/6.png" alt="" className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/6.png" alt="" className="h-full w-full object-cover object-center" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a href="#" className="inline-block rounded-md border border-transparent bg-emerald-600 px-8 py-3 text-center font-medium text-white hover:bg-emerald-700">
                                Create raffle
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
