"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center font-[var(--font-dm-sans)]"
      style={{ background: "var(--warm-bg-gradient)" }}
    >
      <div className="text-center px-4">
        <p
          className="text-5xl font-extrabold tracking-tighter"
          style={{ color: "var(--destructive)" }}
        >
          Error
        </p>
        <h1
          className="text-xl font-semibold mt-3"
          style={{ color: "var(--warm-text)" }}
        >
          Something went wrong
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--warm-muted)" }}>
          An unexpected error occurred. Try again or reload the page.
        </p>
        <button
          onClick={reset}
          className="inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--btn-primary)" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
