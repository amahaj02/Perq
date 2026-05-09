export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Project Notes</h2>
        <p className="text-sm text-muted-foreground">This section replaces faux account settings with actual implementation context.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Frontend source of truth',
            body: 'The Next.js app is the primary frontend. Shared typed mock data keeps the UI coherent while backend work stays intentionally out of scope.',
          },
          {
            title: 'Routing direction',
            body: 'Public routes focus on card discovery and detail pages. Dashboard routes act as a project lab instead of pretending there is a signed-in product account.',
          },
          {
            title: 'Next backend step',
            body: 'If needed later, the local data model can be swapped for Supabase or CSV-backed loaders without changing the UI hierarchy again.',
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
