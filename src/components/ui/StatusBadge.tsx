const tones: Record<string, string> = {
  Live: "bg-[#e5f2ea] text-[#1d5c42]",
  Active: "bg-[#e5f2ea] text-[#1d5c42]",
  Paid: "bg-[#e5f2ea] text-[#1d5c42]",
  Delivered: "bg-[#e5f2ea] text-[#1d5c42]",
  Eligible: "bg-[#e5f2ea] text-[#1d5c42]",
  Settled: "bg-[#e5f2ea] text-[#1d5c42]",
  Cleared: "bg-[#e5f2ea] text-[#1d5c42]",
  Confirmed: "bg-[#f8efd8] text-[#6d4e1d]",
  Submitted: "bg-[#f8efd8] text-[#6d4e1d]",
  "On hold": "bg-[#f8efd8] text-[#6d4e1d]",
  "Pending activation": "bg-[#f8efd8] text-[#6d4e1d]",
  "Pending approval": "bg-[#f8efd8] text-[#6d4e1d]",
  "Accepted — pending activation": "bg-[#f8efd8] text-[#6d4e1d]",
  Packed: "bg-[#e7eef6] text-[#234866]",
  Shipped: "bg-[#e7eef6] text-[#234866]",
  "Information requested": "bg-[#e7eef6] text-[#234866]",
  "Revision pending": "bg-[#e7eef6] text-[#234866]",
  "Return in progress": "bg-[#e7eef6] text-[#234866]",
  Blocked: "bg-[#f6e4dc] text-[#8a3d24]",
  Open: "bg-[#f6e4dc] text-[#8a3d24]",
  Rejected: "bg-[#f6e4dc] text-[#8a3d24]",
  Suspended: "bg-[#f6e4dc] text-[#8a3d24]",
  Cancelled: "bg-[#f6e4dc] text-[#8a3d24]",
  Returned: "bg-[#f6e4dc] text-[#8a3d24]",
  Refunded: "bg-[#f6e4dc] text-[#8a3d24]",
  Void: "bg-[#f6e4dc] text-[#8a3d24]",
  Expired: "bg-[#eeeae2] text-[#5c675f]",
  Unpaid: "bg-[#eeeae2] text-[#5c675f]",
  Draft: "bg-[#eeeae2] text-[#5c675f]",
  Unpublished: "bg-[#eeeae2] text-[#5c675f]",
  "Partially refunded": "bg-[#f8efd8] text-[#6d4e1d]",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap px-2 py-1 text-[11px] font-semibold ${tones[status] ?? "bg-[#eeeae2] text-[#5c675f]"}`}>
      {status}
    </span>
  );
}
