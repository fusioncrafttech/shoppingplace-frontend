import Link from "next/link";

type EmptyStateProps = {
  title: string;
  text: string;
  action?: { href: string; label: string };
};

export default function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(28,28,28,0.04)] ring-1 ring-black/5">
      <h2 className="font-display text-4xl text-[#123024]">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#58655d]">{text}</p>
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#178a45] px-5 text-sm font-semibold text-white hover:bg-[#12753b]"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
