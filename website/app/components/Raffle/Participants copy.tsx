import { ArrowTopRightOnSquareIcon, TicketIcon } from "@heroicons/react/24/outline";
import { ListBulletIcon, QueueListIcon } from "@heroicons/react/24/solid";
import { RaffleParticipantsResponse, LinkType, Participants } from "@/app/types";
import { shortenAddress } from "@/app/utils";
import { ExplorerLink } from "@/app/components/Common/TransactionExplorerLink"
import { fetchRaffleEntrants } from '../../services/raffleService';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import useEventSourceListener from '@/app/hooks/useSSE';
import React, { useRef, useEffect, useCallback, useState } from 'react';


type ActivityItem = {
    user: {
        name: string;
        imageUrl: string;
    };
    tickets: number;
    date: string;
    dateTime: string;
};

export default function Participants({ lotId, initialParticipants }: { lotId: string, initialParticipants: Participants[] }) {

    const sortedParticipants = initialParticipants.sort((a, b) => b.total_tickets - a.total_tickets);
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
        queryKey: ['participants', lotId],
        //@ts-ignore
        queryFn: ({ pageParam = 0 }) => {
            return fetchRaffleEntrants(lotId, limit, pageParam);
        },
        //@ts-ignore
        getNextPageParam: (_, allPages) => {
            const totalItemsFetched = allPages.reduce((total, page) => total + page.items.length, 0);

            return totalItemsFetched;
        },
        initialData: () => ({
            pages: [{
                items: sortedParticipants
            }] as { items: Participants[] }[],
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
        participants: Participants[];
        // participants: { bonus: number, recipient: string, tickets: number }[];
        tickets_bought: number;
    }[]) => {
        for (let i = 0; i < eventData.length; i++) {
            const eventData_ = eventData[i];

            if (eventData_.nft_id === parseInt(lotId)) {
                queryClient.setQueryData(['activity', lotId], (oldData: { pages: { items: Participants[] }[], pageParams: (string | undefined)[] } | undefined) => {

                    // const updatedItems = eventData_.participants.map(participant => ({
                    //     recipient: participant.recipient,
                    //     total_tickets: participant.tickets,
                    // }));

                    if (!oldData) {
                        // If there's no old data, create the initial structure
                        return {
                            pages: [{
                                items: eventData_.participants.map(participant => ({
                                    recipient: participant.recipient,
                                    total_tickets: participant.total_tickets,
                                })).sort((a, b) => b.total_tickets - a.total_tickets)
                            }],
                            pageParams: [undefined] // Assuming your initial pageParam is undefined
                        };
                    }

                    // Flag to check if the participant was updated
                    let participantUpdated = false;

                    // Iterate through all pages to find and update the participant if exists
                    const updatedPages = oldData.pages.map(page => {
                        const updatedItems = page.items.map(item => {
                            const foundParticipant = eventData_.participants.find(participant => participant.recipient === item.recipient);
                            if (foundParticipant) {
                                participantUpdated = true; // Mark as updated
                                // Return the updated participant info
                                return { ...item, total_tickets: foundParticipant.total_tickets };
                            }
                            // Return the item as is if not found
                            return item;
                        });

                        return { ...page, items: updatedItems };
                    });


                    // Calculate total participants across all pages
                    const totalParticipants = oldData ? oldData.pages.reduce((acc, page) => acc + page.items.length, 0) : 0;
                    const maxCapacityUpToCurrentPage = oldData.pages.length * limit;

                    // If the participant was not found and updated, add it to the page if page is not full => no more results in DB
                    if (!participantUpdated && totalParticipants < maxCapacityUpToCurrentPage) {
                        eventData_.participants.forEach(newParticipant => {
                            // Add the new participant to the last page's items
                            const lastPageIndex = updatedPages.length - 1;
                            updatedPages[lastPageIndex].items.push({
                                max_id_ticket: newParticipant.max_id_ticket,
                                block: newParticipant.block,
                                recipient: newParticipant.recipient,
                                total_tickets: newParticipant.total_tickets,
                                total_bonus: newParticipant.total_bonus,
                                total_tokens_spent: newParticipant.total_tokens_spent,
                                username: newParticipant.username,
                            });
                        });
                    }

                    // Sort the last page after adding new participants to maintain order
                    updatedPages[updatedPages.length - 1].items.sort((a, b) => b.total_tickets - a.total_tickets);

                    return {
                        ...oldData,
                        pages: updatedPages,
                        // pageParams remains unchanged unless your logic for fetching next pages is affected by these updates
                    };
                });
            }
        }
    };

    useEventSourceListener(handleEvent);

    return (
        <div className="bg-zinc-900 mt-10">
            <h2 className="flex items-center gap-2 text-md lg:text-xl text-zinc-100 font-semibold mt-8 mb-5">
                <ListBulletIcon className="h-7 w-7 text-zinc-400" aria-hidden="true" />
                <span>Participants</span>
            </h2>
            <div className="border border-zinc-800 rounded-xl  overflow-auto max-h-80">
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
                                                <span className="text-zinc-100">{participant.total_tickets}</span>
                                            </div>
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
