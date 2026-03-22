import DailyQuiz from '../components/DailyQuiz'

export default function DukeElder() {
  return (
    <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1rem' }}>
      <div>
        <h2>Duke Elder Resources</h2>
        <p>Curated Duke Elder material and commentary. This area contains text resources, chapter links and curated notes.</p>
        <article className="card">
          <h3>Duke Elder — Highlights</h3>
          <p style={{ color: 'var(--muted)' }}>Collection of selected chapters and summaries for trainees.</p>
        </article>
      </div>

      <aside>
        <DailyQuiz />
      </aside>
    </section>
  )
}
