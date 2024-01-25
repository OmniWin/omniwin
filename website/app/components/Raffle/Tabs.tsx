const tabs = [
    { name: "Overview", href: "#", current: true },
    { name: "Activity", href: "#", current: false },
    { name: "Settings", href: "#", current: false },
    { name: "Collaborators", href: "#", current: false },
    { name: "Notifications", href: "#", current: false },
];

export default function Tabs() {
    return (
        <div className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <nav className="flex border-b border-white/10 py-4">
                    <ul role="list" className="flex min-w-full flex-none gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400">
                        {tabs.map((tab) => (
                            <li key={tab.name}>
                                <a href={tab.href} className={tab.current ? "text-indigo-400" : ""}>
                                    {tab.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
