import type { ReactNode } from "react";

export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#173c37]/55 p-4 sm:items-center" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-[#fbfaf6] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-3xl text-[#173c37]">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center text-xl text-[#173c37]">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
