import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <p className="text-[11px] tracking-[0.32em] uppercase text-mute">404</p>
        <h1 className="font-display mt-3 text-5xl">This page has been folded away</h1>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Return home
        </Link>
      </div>
    </div>
  );
}
