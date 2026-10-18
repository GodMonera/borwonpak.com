"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type GalleryItem = { src: string; caption: string; w: number; h: number };

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((current) =>
        current === null
          ? null
          : (current + delta + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Stop the page scrolling behind the lightbox.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full overflow-hidden rounded-lg border border-line"
            >
              <Image
                src={item.src}
                alt={item.caption}
                width={item.w}
                height={item.h}
                sizes="(max-width: 640px) 50vw, 33vw"
                className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[open].caption}
          onClick={close}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-6"
        >
          <Image
            src={items[open].src}
            alt={items[open].caption}
            width={items[open].w}
            height={items[open].h}
            className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
          />
          <p className="text-center text-sm text-white/80">
            {items[open].caption}
          </p>
          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => step(-1)}
              className="rounded-md border border-white/30 px-4 py-2 text-sm text-white hover:border-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-md border border-white/30 px-4 py-2 text-sm text-white hover:border-white"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="rounded-md border border-white/30 px-4 py-2 text-sm text-white hover:border-white"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
