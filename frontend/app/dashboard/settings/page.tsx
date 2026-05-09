export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Methodology</h2>
        <p className="text-sm text-muted-foreground">A quick reference for how Perq organizes and presents card information.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Frontend structure',
            body: 'The Next.js app is the primary frontend, with shared card models used across the explorer, detail pages, and insight surfaces.',
          },
          {
            title: 'Navigation model',
            body: 'Public routes focus on card discovery and detail pages, while the insights area groups reward maps, benefit views, and comparison signals.',
          },
          {
            title: 'Data source',
            body: 'The backend now connects to Supabase Postgres and can feed the frontend catalog progressively as more issuer and reward detail moves into the database.',
          },
        ].map((note) => (
          <div key={note.title} className="rounded-[2rem] border border-border/50 bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">{note.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
