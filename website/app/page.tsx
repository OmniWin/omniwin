/* Components */
// import { Counter } from "./components/Counter/Counter";
import { Trending } from "./components/Home/Trending";
// import { FeaturedList } from "./components/Home/FeaturedList";
import { PaidContests } from "./components/Home/PaidContests";
import { RaffleList } from "./components/Home/RaffleList";
import PromoBanner from "./components/Home/PromoBanner";

export default function IndexPage() {
    // return <Counter />;
    return (
        <>
            <div className="flex flex-col gap-y-20">
                <PromoBanner />
                <section>
                    <Trending />
                </section>
                {/* <section>
                <FeaturedList />
            </section> */}
                <section>
                    <PaidContests />
                </section>
                {/* <section>
                <RaffleList />
            </section> */}
            </div>
        </>
    );
}
