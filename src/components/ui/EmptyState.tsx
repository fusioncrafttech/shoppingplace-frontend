import Link from "next/link";

type EmptyStateProps = {
  title: string;
  text: string;
  action?: { href: string; label: string };
};

export default function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-[#d5d3c8] bg-[#f7f6f1] px-6 py-16 text-center">
      <h2 className="font-display text-3xl text-[#173c37]">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#58655d]">{text}</p>
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex min-h-11 items-center bg-[#173c37] px-5 text-sm font-semibold text-[#fbfaf6]"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
