import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16">
      <p className="font-mono text-sm text-marigold">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        ไม่พบหน้านี้ / Page not found
      </h1>
      <p className="mt-3 max-w-md text-muted">
        หน้าที่คุณกำลังหาอาจถูกย้ายหรือไม่เคยมีอยู่
        <br />
        The page you were looking for has moved, or never existed.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/th"
          className="rounded-md border border-line px-4 py-2 text-sm transition hover:border-marigold hover:text-marigold"
        >
          หน้าแรก
        </Link>
        <Link
          href="/en"
          className="rounded-md border border-line px-4 py-2 text-sm transition hover:border-marigold hover:text-marigold"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
