const sample = [
  { id: 1, title: 'Diabetic Retinopathy — overview', date: '2025-11-24' },
  { id: 2, title: 'Glaucoma screening tips', date: '2025-11-17' },
]

export default function Diseases() {
  return (
    <section className="container">
      <h2>Diseases of the Week</h2>
      <p>Short articles on an eye condition each week, ordered by date.</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {sample.map((s) => (
          <article key={s.id} className="card">
            <h3>{s.title}</h3>
            <p style={{ color: 'var(--muted)' }}>{s.date}</p>
            <p>Brief summary and links to further reading.</p>
          </article>
        ))}
      </div>
    </section>
  )
}
