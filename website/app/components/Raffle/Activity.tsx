// import { classNames } from "@/app/utils";
import { ArrowTopRightOnSquareIcon, TicketIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/solid";
import { RaffleParticipantsResponse, LinkType, RaffleActivityResponse, RaffleActivity } from "@/app/types";
import { ExplorerLink } from "@/app/components/Common/TransactionExplorerLink"
import { shortenAddress } from "@/app/utils";
import { fetchRaffleActivity } from '../../services/raffleService';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import useEventSourceListener from '@/app/hooks/useSSE';
//import eventData
import { EventData } from '@/app/types/index';

export default function Activity({ lotId, initialActivity }: { lotId: string, initialActivity: RaffleActivity[] }) {
    const limit = 10;

    const {
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
        isFetchingPreviousPage,
        ...result
    } = useInfiniteQuery({
        queryKey: ['activity', lotId],
        queryFn: ({ pageParam }) => fetchRaffleActivity(lotId, limit, pageParam),
        //@ts-ignore
        getNextPageParam: (_, allPages) => {
            const totalItemsFetched = allPages.reduce((total, page) => total + page.items.length, 0);

            return totalItemsFetched;
        },
        initialData: () => ({
            pages: [{
                items: initialActivity,
            }] as { items: RaffleActivity[] }[],
            pageParams: [undefined],
        }),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    const observer = useRef<IntersectionObserver | null>(null);
    const lastParticipantRef = useCallback((node: Element | null) => {
        if (isFetchingNextPage) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observer.current.observe(node);
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const queryClient = useQueryClient();
    const handleEvent = (eventData: EventData[]) => {
        for (let i = 0; i < eventData.length; i++) {
            const eventData_ = eventData[i];


            if (eventData_.nft_id === parseInt(lotId)) {
                console.log("Activity event received", eventData_)
                queryClient.setQueryData(['activity', lotId], (oldData: {
                    pages: { items: RaffleActivity[], nextCursor: string | null }[],
                    pageParams: (string | null | undefined)[],
                } | undefined) => {
                    console.log("oldData", oldData)
                    if (!oldData || oldData.pages.length === 0) {
                        return {
                            pages: [{
                                items: eventData_.participants.map(participant => ({
                                    recipient: participant.recipient,
                                    amount: participant.tickets,
                                    created_at: new Date().toISOString(),
                                })),
                                nextCursor: null, // Initialize nextCursor as appropriate
                            }],
                            pageParams: [undefined], // Initial pageParams with the first entry as undefined
                        };
                    }

                    // Prepend new items to the first page's items
                    const firstPageUpdatedItems = [
                        ...eventData_.participants.map(participant => ({
                            block: participant.block,
                            recipient: participant.recipient,
                            tickets: participant.tickets,
                            bonus: participant.bonus,
                            total_bonus: participant.total_bonus,
                            total_tickets: participant.total_tickets,
                            tokens_spent: participant.total_tokens_spent,
                            created_at: new Date().toISOString(),
                            username: participant.username,
                            transaction_hash: participant.transaction_hash
                        })),
                        ...oldData.pages[0].items
                    ];


                    const updatedFirstPage = { ...oldData.pages[0], items: firstPageUpdatedItems };
                    const newPages = [updatedFirstPage, ...oldData.pages.slice(1)];

                    return {
                        ...oldData,
                        pages: newPages,
                    };
                });
            }
        }
    };

    useEventSourceListener(handleEvent);


    return (
        <div className="bg-zinc-900 mt-10">
            <h2 className="flex items-center gap-2 text-md lg:text-xl text-zinc-100 font-semibold mt-8 mb-5">
                <QueueListIcon className="h-7 w-7 text-zinc-400" aria-hidden="true" />
                <span>Latest activity</span>
            </h2>
            <div className="border border-zinc-800 rounded-xl overflow-auto max-h-80">
                <table className="w-full whitespace-nowrap text-left">
                    <colgroup>
                        <col className="w-full sm:w-4/12" />
                        <col className="lg:w-4/12" />
                        <col className="lg:w-2/12" />

                    </colgroup>
                    <thead className="border-b border-white/10 text-sm leading-6 text-white">
                        <tr>
                            <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                                Player
                            </th>
                            <th scope="col" className="hidden py-2 pl-0 pr-8 text-right font-semibold md:table-cell lg:pr-20">
                                Tickets
                            </th>
                            <th scope="col" className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                                Purchased at
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {result.data?.pages.map((page, pageIndex) => (
                            page.items.map((participant, participantIndex) => {
                                // Check if the current participant is the last item in the last page
                                const isLastParticipant = pageIndex === result.data.pages.length - 1 && participantIndex === page.items.length - 1;
                                return (
                                    <tr
                                        key={`${pageIndex}-${participantIndex}`}
                                        ref={isLastParticipant ? lastParticipantRef : null} // Attach the ref to the last item
                                        className="hover:bg-zinc-800"
                                    >
                                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                                            <div className="flex items-center gap-x-4">
                                                <img src={""} alt="" className="h-8 w-8 rounded-full bg-zinc-800" />
                                                <div className="truncate text-sm font-medium leading-6 text-white">{shortenAddress(participant.recipient)}</div>
                                            </div>
                                        </td>
                                        <td className="hidden py-4 pl-0 pr-8 text-right text-sm leading-6 text-zinc-400 md:table-cell lg:pr-20">
                                            <div className="inline-flex items-center gap-2">
                                                <TicketIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                                                <span className="text-zinc-100">{participant.tickets}</span>
                                            </div>
                                        </td>
                                        <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-zinc-400 sm:table-cell sm:pr-6 lg:pr-8">
                                            <a href="#" className="inline-flex items-center gap-2 hover:text-zinc-200">
                                                <time dateTime={participant.created_at}>{new Date(participant.created_at).toLocaleDateString()}</time>
                                                <ExplorerLink network="Ethereum" identifier={participant.transaction_hash} linkType={LinkType.tx}>
                                                    <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
                                                </ExplorerLink>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
