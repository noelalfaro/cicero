"use client";

export default function SignOutButton({ signOut }: { signOut: () => void }) {
  return (
    <button
      className="text-neutral-300 hover:text-neutral-500"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  );
}
