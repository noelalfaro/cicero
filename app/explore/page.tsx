import Players from "@/app/components/players";

export default async function Page() {
  return (
    <>
      <main className="w-full max-w-5xl">
        <h1 className="mb-2 mt-2 text-xl font-bold">Explore</h1>
        <Players />
      </main>
    </>
  );
}
