export default function PromoBanner() {
  return (
      <div className="overflow-hidden pt-32 sm:pt-14 my-10 rounded-xl">
          <div className="bg-zinc-800 rounded-xl">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="relative pb-16 pt-48 sm:pb-24">
                      <div>
                          <h2 id="sale-heading" className="text-4xl font-bold tracking-tight text-zinc-100 xs:text-lg sm:text-xl xl:text-4xl">
                              Sell NFTs Faster
                              <br />
                              Easy Raffles, Quicker Cash!
                          </h2>
                          <div className="mt-6 text-base">
                              <button type="button" className="font-semibold text-zinc-100 group hover:text-zinc-200">
                                  Create raffle
                                  <span className="ml-2 inline-block transform transition-all ease-in-out group-hover:translate-x-1" aria-hidden="true"> &rarr;</span>
                              </button>
                          </div>
                      </div>

                      <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                          <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                              <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                                  <div className="flex-shrink-0">
                                      <img className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72" src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/1.png" alt="" />
                                  </div>

                                  <div className="mt-6 flex-shrink-0 sm:mt-0">
                                      <img className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72" src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/2.png" alt="" />
                                  </div>
                              </div>
                              <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                                  <div className="flex-shrink-0">
                                      <img className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72" src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/3.png" alt="" />
                                  </div>

                                  <div className="mt-6 flex-shrink-0 sm:mt-0">
                                      <img className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72" src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/4.png" alt="" />
                                  </div>
                              </div>
                              <div className="flex space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 lg:space-y-8">
                                  <div className="flex-shrink-0">
                                      <img className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72" src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/5.png" alt="" />
                                  </div>

                                  <div className="mt-6 flex-shrink-0 sm:mt-0">
                                      <img className="h-64 w-64 rounded-lg object-cover md:h-72 md:w-72" src="https://cloudflare-ipfs.com/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/6.png" alt="" />
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
