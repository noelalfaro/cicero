import Articles from "@/app/components/articles";
import Players from "@/app/components/players";

export default async function Page() {
  return (
    <>
      <main className="w-full max-w-5xl">
        <div className=" flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Explore</h3>
          <p>
            This table will be set to showcase the top trenders. Green Badges
            indicate they're trending upwards, while red indicates trending
            downwards
          </p>
        </div>

        <Players />
        <Articles />
      </main>
    </>
  );
}
