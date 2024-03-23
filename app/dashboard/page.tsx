import { ModeToggle } from "@/app/components/dark-mode-toggle";

export default async function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ModeToggle />
    </main>
  );
}
