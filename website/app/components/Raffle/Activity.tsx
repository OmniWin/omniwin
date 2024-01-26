// import { classNames } from "@/app/utils";
import { ArrowTopRightOnSquareIcon, TicketIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/solid";

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
    {
        user: {
            name: "Lindsay Walton",
            imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "3 hours ago",
        dateTime: "2023-01-23T09:00",
    },
    {
        user: {
            name: "Courtney Henry",
            imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "12 hours ago",
        dateTime: "2023-01-23T00:00",
    },
    {
        user: {
            name: "Courtney Henry",
            imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "2 days ago",
        dateTime: "2023-01-21T13:00",
    },
    {
        user: {
            name: "Michael Foster",
            imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "5 days ago",
        dateTime: "2023-01-18T12:34",
    },
    {
        user: {
            name: "Courtney Henry",
            imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "1 week ago",
        dateTime: "2023-01-16T15:54",
    },
    {
        user: {
            name: "Michael Foster",
            imageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "1 week ago",
        dateTime: "2023-01-16T11:31",
    },
    {
        user: {
            name: "Whitney Francis",
            imageUrl: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        tickets: 15,
        date: "2 weeks ago",
        dateTime: "2023-01-09T08:45",
    },
];

export default function Activity() {
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
                        {activityItems.map((item) => (
                            <tr key={item.user.name} className="hover:bg-zinc-800">
                                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                                    <div className="flex items-center gap-x-4">
                                        <img src={item.user.imageUrl} alt="" className="h-8 w-8 rounded-full bg-zinc-800" />
                                        <div className="truncate text-sm font-medium leading-6 text-white">{item.user.name}</div>
                                    </div>
                                </td>
                                <td className="hidden py-4 pl-0 pr-8 text-right text-sm leading-6 text-zinc-400 md:table-cell lg:pr-20">
                                    <div className="inline-flex items-center gap-2">
                                        <TicketIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
                                        <span className="text-zinc-100">{item.tickets}</span>
                                    </div>
                                </td>
                                <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-zinc-400 sm:table-cell sm:pr-6 lg:pr-8">
                                    <a href="#" className="inline-flex items-center gap-2 hover:text-zinc-200">
                                        <time dateTime={item.dateTime}>{item.date}</time>
                                        <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
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
