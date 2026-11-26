"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { btnGold, inputClass } from "@/components/ui/fields";

export default function LoginView() {
  const router = useRouter();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    if (!email.includes("@") || password.length < 8) {
      setError("Use a valid email and a password of at least 8 characters.");
      return;
    }
    router.push("/account");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:px-8 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-5xl">Sign in</h1>
        <p className="mt-4 text-sm leading-7 text-[#40564e]">
          Customers use this door for profile, addresses, and orders. Agent and owner consoles are separate.
        </p>
        <form onSubmit={submit} className="mt-8 grid max-w-md gap-4">
          <label className="text-xs font-semibold">Email
            <input name="email" type="email" autoComplete="email" required className={`${inputClass} mt-1.5`} placeholder="asha@example.com" />
          </label>
          <label className="text-xs font-semibold">Password
            <input name="password" type="password" autoComplete="current-password" required minLength={8} className={`${inputClass} mt-1.5`} />
          </label>
          {error ? <p className="text-sm text-[#8a3d24]">{error}</p> : null}
          <button type="submit" className={btnGold}>Continue to account</button>
        </form>
        <p className="mt-6 text-sm">
          Want to sell? <Link href="/apply" className="font-semibold text-[#a36545]">Apply as Agent</Link>
        </p>
      </div>
      <aside className="h-fit rounded-[28px] bg-[#123024] p-6 text-[#f6f1e6]">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#e8b77e]">PREVIEW THE CONSOLES</p>
        <h2 className="mt-3 font-display text-3xl">Owner and agent</h2>
        <p className="mt-3 text-sm leading-6 text-[#d5ddd6]">These screens use sample records. No password is issued from the public application.</p>
        <div className="mt-6 grid gap-3">
          <Link href="/admin" className="inline-flex min-h-11 items-center rounded-full bg-[#e8b77e] px-4 text-sm font-semibold text-[#173c37]">Superadmin dashboard</Link>
          <Link href="/agent" className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-sm font-semibold">Agent dashboard</Link>
          <Link href="/activate" className="text-sm font-semibold text-[#e8b77e]">Open a setup link</Link>
        </div>
      </aside>
    </div>
  );
}
