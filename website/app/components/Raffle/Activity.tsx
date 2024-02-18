// import { classNames } from "@/app/utils";
import { ArrowTopRightOnSquareIcon, TicketIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/solid";
import { RaffleParticipantsResponse, LinkType, RaffleResponse } from "@/app/types";
import { ExplorerLink } from "@/app/components/Common/TransactionExplorerLink"
import { shortenAddress } from "@/app/utils";
import { fetchRaffleActivity } from '../../services/raffleService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useEventSourceListener from '@/app/hooks/useSSE';
type ActivityItem = {
    user: {
        name: string;
        imageUrl: string;
    };
    tickets: number;
    date: string;
    dateTime: string;
};
const activityItems: ActivityItem[] = [
    {
        user: {
            name: "Michael Foster",
            imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "45 minutes ago",
        dateTime: "2023-01-23T11:00",
    },
];

export default function Activity({ lotId, initialActivity }: { lotId: string, initialActivity: RaffleResponse['data']['participants'] }) {
    const { data: participants, isLoading: participantsIsLoading, error: participantsError } = useQuery<RaffleParticipantsResponse['data'], Error>({
        queryKey: ['activity', lotId],
        queryFn: () => fetchRaffleActivity(lotId, '10', '0')
    });

    console.log(initialActivity)

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


    if (participantsIsLoading) {
        return <div>Loading...</div>;
    }

    if (participantsError) {
        return <div>Error: {participantsError.message}</div>;
    }

    return (
        <div className="bg-zinc-900 mt-10">
            <h2 className="flex items-center gap-2 text-md lg:text-xl text-zinc-100 font-semibold mt-8 mb-5">
                <QueueListIcon className="h-7 w-7 text-zinc-400" aria-hidden="true" />
                <span>Latest activity</span>
            </h2>
            <div className="border border-zinc-800 rounded-xl mt-">
                <table className="w-full whitespace-nowrap text-left">
                    <colgroup>
                        <col className="w-full sm:w-4/12" />
                        <col className="lg:w-4/12" />
                        <col className="lg:w-2/12" />
                        {/* <col className="lg:w-1/12" />
                        <col className="lg:w-1/12" /> */}
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
                        {participants && participants.items.map((item) => (
                            <tr key={item.recipient} className="hover:bg-zinc-800">
                                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                                    <div className="flex items-center gap-x-4">
                                        <img src={""} alt="" className="h-8 w-8 rounded-full bg-zinc-800" />
                                        <div className="truncate text-sm font-medium leading-6 text-white">{shortenAddress(item.recipient)}</div>
                                    </div>
                                </td>
                                <td className="hidden py-4 pl-0 pr-8 text-right text-sm leading-6 text-zinc-400 md:table-cell lg:pr-20">
                                    <div className="inline-flex items-center gap-2">
                                        <TicketIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                                        <span className="text-zinc-100">{item.amount}</span>
                                    </div>
                                </td>
                                <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-zinc-400 sm:table-cell sm:pr-6 lg:pr-8">
                                    <a href="#" className="inline-flex items-center gap-2 hover:text-zinc-200">
                                        <time dateTime={item.created_at}>{item.created_at}</time>

                                        <ExplorerLink network="Ethereum" identifier={item.transaction_hash} linkType={LinkType.tx}>
                                            <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
                                        </ExplorerLink>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
