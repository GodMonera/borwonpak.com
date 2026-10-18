"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print border border-line px-4 py-2 text-sm font-medium transition hover:border-brass hover:text-brass"
    >
      {label}
    </button>
  );
}
