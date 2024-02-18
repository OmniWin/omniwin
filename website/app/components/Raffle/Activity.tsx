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

export default function Activity({ lotId, initialActivity }: { lotId: string, initialActivity: RaffleActivity[] }) {
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
        queryFn: ({ pageParam }) => fetchRaffleActivity(lotId, '10', pageParam),
        //@ts-ignore
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: () => ({
            pages: [{ items: initialActivity, nextCursor: initialActivity[initialActivity.length - 1].id_activity.toString() || null }] as RaffleActivityResponse['data'][],
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
    const handleEvent = (eventData: {
        nft_id: number;
        participants: { bonus: number, recipient: string, tickets: number }[];
        tickets_bought: number;
    }[]) => {
        for (let i = 0; i < eventData.length; i++) {
            const eventData_ = eventData[i];

            if (eventData_.nft_id === parseInt(lotId)) {
                queryClient.setQueryData(['activity', lotId], (oldData: RaffleParticipantsResponse['data'] | undefined) => {
                    const updatedItems = eventData_.participants.map(participant => ({
                        recipient: participant.recipient,
                        amount: participant.tickets,
                        created_at: new Date().toISOString(),
                    }));

                    if (!oldData) {
                        return {
                            items: updatedItems
                        };
                    }

                    return {
                        ...oldData,
                        items: [
                            ...updatedItems,
                            ...oldData.items
                        ]
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
                                                <span className="text-zinc-100">{participant.amount}</span>
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
