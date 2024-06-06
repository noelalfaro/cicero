import Articles from "@/app/components/articles";
import Players from "@/app/components/players";
import Search from "@/app/components/search";
import ExploreTableSkeleton from "@/app/components/skeletons";
import { Suspense } from "react";

export default async function Page() {
  return (
    <>
      <main className="w-full ">
        <div className=" flex flex-col gap-2">
          <h3 className="text-4xl font-bold">Explore</h3>
          <p>
            This page will showcase Top Trenders, News Articles, and list
            notable players.
          </p>
        </div>

        {/* <Search placeholder="Search for Players" /> */}
        <Suspense fallback={<ExploreTableSkeleton />}>
          <Players />
        </Suspense>

        <Articles />
      </main>
    </>
  );
}
