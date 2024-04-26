import Articles from "@/app/components/articles";
import Players from "@/app/components/players";

export default async function Page() {
  return (
    <>
      <main className="w-full max-w-5xl">
        <div className=" flex flex-col gap-2">
          <h3 className="text-4xl font-bold">Explore</h3>
          <p>
            This page will showcase Top Trenders, News Articles, and list
            notable players.
          </p>
        </div>

        <Players />
        <Articles />
      </main>
    </>
  );
}
