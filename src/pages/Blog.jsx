import ResourceCard from '../components/ResourceCard'

const samplePosts = [
  { id: 1, title: 'How we built the COSS quiz', date: '2025-11-20' },
  { id: 2, title: 'Reflections from the annual meeting', date: '2025-10-11' },
]

export default function Blog() {
  return (
    <section className="container">
      <h2>COSS Blog</h2>
      <p>Latest articles and updates from the society, ordered by date.</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {samplePosts.map((p) => (
          <article key={p.id} className="card">
            <h3>{p.title}</h3>
            <p style={{ color: 'var(--muted)' }}>{p.date}</p>
            <p>Summary of the article. Click to read more.</p>
          </article>
        ))}
      </div>
    </section>
  )
}
