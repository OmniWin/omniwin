import ChallengesHeader from "@/app/components/Challenges/Header";
import ProgressBar from "@/app/components/Ui/ProgressBar";
import { Bars3Icon, UserGroupIcon, NewspaperIcon, PlayIcon, XMar, HeartIconk, PlayI, UserGroupIconconIcon, CheckIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/app/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const challenges = [
    {
        name: "Omniwin Connect",
        href: "#",
        description:
            "Begin your Adventure today! Where your interactions lead to rewards! Link up, follow, tweet, and show your Omniwin love. Each task is a step towards unlocking the full Omniwin experience. Ready for the challenge?",
        icon: PlayIcon,
        completed: true,
        currentStep: 6,
        totalSteps: 6,
    },
    {
        name: "Referral Program",
        href: "#",
        description: "Activate users with your unique invite code.",
        icon: UserGroupIcon,
        completed: false,
        currentStep: 1,
        totalSteps: 6,
    },
    {
        name: "Raffle Player",
        href: "#",
        description: "Complete the sale of approved lots.",
        icon: NewspaperIcon,
        completed: false,
        currentStep: 0,
        totalSteps: 6,
    },
    {
        name: "Omniwin Connect",
        href: "#",
        description:
            "Begin your Adventure today! Where your interactions lead to rewards! Link up, follow, tweet, and show your Omniwin love. Each task is a step towards unlocking the full Omniwin experience. Ready for the challenge?",
        icon: PlayIcon,
        completed: false,
        currentStep: 0,
        totalSteps: 6,
    },
    {
        name: "Referral Program",
        href: "#",
        description: "Activate users with your unique invite code..",
        icon: UserGroupIcon,
        completed: false,
        currentStep: 0,
        totalSteps: 6,
    },
    {
        name: "Raffle Player",
        href: "#",
        description: "Complete the sale of approved lots.",
        icon: NewspaperIcon,
        completed: false,
        currentStep: 0,
        totalSteps: 6,
    },
    {
        name: "Omniwin Connect",
        href: "#",
        description:
            "Begin your Adventure today! Where your interactions lead to rewards! Link up, follow, tweet, and show your Omniwin love. Each task is a step towards unlocking the full Omniwin experience. Ready for the challenge?",
        icon: PlayIcon,
        completed: false,
        currentStep: 0,
        totalSteps: 6,
    },
    {
        name: "Referral Program",
        href: "#",
        description: "Activate users with your unique invite code..",
        icon: UserGroupIcon,
        completed: false,
        currentStep: 0,
        totalSteps: 6,
    },
    {
        name: "Raffle Player",
        href: "#",
        description: "Complete the sale of approved lots.",
        icon: NewspaperIcon,
        completed: false,
        currentStep: 0,
        totalSteps: 6,
    },
];

const challengesCollors = [
    "stroke-emerald-400 fill-emerald-400/10",
    "stroke-blood-400 fill-blood-400/10",
    "stroke-lemon-400 fill-lemon-400/10",
    "stroke-water-400 fill-water-400/10",
    "stroke-sky-400 fill-sky-400/10",
    "stroke-violet-400 fill-violet-400/10",
    "stroke-fuchsia-400 fill-fuchsia-400/10",
    "stroke-orange-400 fill-orange-400/10",
    "stroke-indigo-400 fill-indigo-400/10",
    "stroke-teal-400 fill-teal-400/10",
    "stroke-rose-400 fill-rose-400/10",
    "stroke-lime-400 fill-lime-400/10",
    "stroke-amber-400 fill-amber-400/10",
];

export default function List() {
    return (
        <>
            <ChallengesHeader />
            <section className="relative z-20 mx-auto -mt-32 max-w-md sm:max-w-3xl lg:max-w-7xl lg:px-8" aria-labelledby="contact-heading">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-20 xl:grid-cols-3 lg:gap-x-8">
                    {challenges.map((challenge, key) => (
                        <div
                            key={challenge.name}
                            className="flex flex-col rounded-2xl border border-zinc-800 bg-gradient-to-tl from-zinc-900 to-zinc-800/30 shadow-xl hover:bg-zinc-800/50 group transition-all ease-in-out duration-300"
                        >
                            <div className="relative flex-1 px-6 pb-8 pt-16 md:px-8">
                                {/* <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-emerald-600/5 p-5 shadow-lg group-hover:bg-emerald-600/20 transition-all ease-in-out duration-300">
                                    <challenge.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div> */}
                                <div className="absolute top-0 -translate-y-1/2 transform w-16 h-16 flex items-center justify-center">
                                    <challenge.icon className={classNames("h-6 w-6 text-emerald-400 relative z-10 -top-1", challengesCollors[key])} aria-hidden="true" />
                                    <svg className="w-16 h-16 absolute top-0" width="1135" height="1027" viewBox="0 0 1135 1027" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            className={classNames("stroke-[40]", challengesCollors[key])}
                                            d="M898.366 20.0234H567.5H236.634C200.429 20.0234 166.16 36.3692 143.376 64.5055L47.0795 183.423C15.004 223.033 11.4501 278.584 38.2165 321.959L425.248 949.143C447.104 984.561 485.751 1006.12 527.369 1006.12H607.631C649.25 1006.12 687.896 984.561 709.752 949.143L1096.78 321.959C1123.55 278.584 1120 223.033 1087.92 183.423L991.624 64.5055C968.84 36.3692 934.571 20.0234 898.366 20.0234Z"
                                        />
                                    </svg>
                                </div>

                                {/* <div className="absolute top-0 inline-block -translate-y-1/2 transform rounded-xl bg-emerald-600/5 p-5 shadow-lg group-hover:bg-emerald-600/20 transition-all ease-in-out duration-300">
                                    <challenge.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div> */}
                                <h3 className="text-xl font-medium text-zinc-50 flex items-center gap-2">
                                    {challenge.name}
                                    {challenge.completed && (
                                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">Completed</span>
                                    )}
                                </h3>
                                <p className="mt-4 text-base text-zinc-300 line-clamp-2" title={challenge.description}>
                                    {challenge.description}
                                </p>
                                {challenge.currentStep > 0 && (
                                    <>
                                        <div className="mt-8">
                                            <ProgressBar
                                                value={challenge.currentStep}
                                                maxValue={challenge.totalSteps}
                                                size="small"
                                                color="emerald-400"
                                                labelOutside
                                                labelOutsideText={
                                                    challenge.totalSteps - challenge.currentStep != 0
                                                        ? `${challenge.totalSteps - challenge.currentStep} more step${challenge.totalSteps - challenge.currentStep !== 1 ? "s" : ""} to go`
                                                        : "Completed"
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="rounded-bl-2xl rounded-br-2xl bg-zinc-800/30 p-6 md:px-8">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div>
                                            {!challenge.completed && !(challenge.currentStep > 0) && (
                                                <a href={challenge.href} className="text-base font-medium text-emerald-400 hover:text-emerald-500 group/action">
                                                    Start challenge
                                                    <span className="group-hover/action:translate-x-1 transition-all ease-in-out duration-300 inline-block ml-2" aria-hidden="true">
                                                        {" "}
                                                        &rarr;
                                                    </span>
                                                </a>
                                            )}

                                            {challenge.currentStep > 0 && (
                                                <>
                                                    <button className="text-base font-medium text-emerald-400 hover:text-emerald-500 group/action">
                                                        View {!challenge.completed && "rest of"} challenge
                                                        <span className="group-hover/action:translate-x-1 transition-all ease-in-out duration-300 inline-block ml-2" aria-hidden="true">
                                                            {" "}
                                                            &rarr;
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit profile</DialogTitle>
                                            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">test</div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                {/* {
                                    challenge.currentStep > 0 && challenge.completed && <>
                                        <p className="text-base font-medium text-emerald-400 hover:text-emerald-500 inline-flex gap-2">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            Completed
                                        </p>
                                    </>
                                } */}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
