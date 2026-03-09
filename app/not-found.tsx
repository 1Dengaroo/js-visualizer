import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center font-[var(--font-dm-sans)]"
      style={{ background: "var(--warm-bg-gradient)" }}
    >
      <div className="text-center px-4">
        <p
          className="text-7xl font-extrabold tracking-tighter"
          style={{ color: "var(--accent-purple)" }}
        >
          404
        </p>
        <h1
          className="text-xl font-semibold mt-3"
          style={{ color: "var(--warm-text)" }}
        >
          Page not found
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--warm-muted)" }}>
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--btn-primary)" }}
        >
          Back to QuFlow
        </Link>
      </div>
    </div>
  );
}
