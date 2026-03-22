export default function OSCE() {
  return (
    <section className="container">
      <h2>OSCE Resources</h2>
      <p>PDFs, checklists and practice stations for OSCE preparation.</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <article className="card">
          <h3>Clinical skills checklist (PDF)</h3>
          <p style={{ color: 'var(--muted)' }}>Open embedded PDF or download to view the checklist.</p>
          <div style={{ border: '1px solid rgba(0,0,0,0.06)', padding: '0.5rem', borderRadius:6 }}>
            <p><em>PDF placeholder:</em></p>
            <iframe title="osce-pdf" src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" style={{ width: '100%', height: 400, border: 0 }} />
          </div>
        </article>
      </div>
    </section>
  )
}
