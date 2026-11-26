import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl text-[#173c37]">Page not found</h1>
      <p className="mt-3 text-sm text-[#58655d]">That address is not part of the store.</p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#178a45] px-5 text-sm font-semibold text-white">
        Back home
      </Link>
    </main>
  );
}
