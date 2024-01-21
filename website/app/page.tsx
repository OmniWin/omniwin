/* Components */
// import { Counter } from "./components/Counter/Counter";
import { Trending } from "./components/Home/Trending";
import { FeaturedList } from "./components/Home/FeaturedList";
import { PaidContests } from "./components/Home/PaidContests";

export default function IndexPage() {
    // return <Counter />;
    return (
      <>
        <div className="flex flex-col gap-y-20">
            <section>
                <Trending />
            </section>
            <section>
                <FeaturedList />
            </section>
            <section>
                <PaidContests />
            </section>
        </div>
      </>
    );
}
