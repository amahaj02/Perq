import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-4 py-16 sm:px-6">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">404</div>
      <h1 className="mt-3 text-4xl font-semibold text-foreground">That page is not part of the current Perq frontend.</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        That route is no longer active. Use the current catalog and insights surfaces instead.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/cards" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
          Open catalog
        </Link>
        <Link href="/" className="rounded-xl border border-border/60 px-4 py-2 text-sm text-foreground">
          Return home
        </Link>
      </div>
    </main>
  )
}
