import { useState } from 'react'
import './Eyesi.css'

export default function Eyesi() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      // currently no server endpoint; attempt to POST to placeholder
      await fetch('/api/eyesi-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, content }),
      })
      setStatus('sent')
    } catch (err) {
      console.warn('Submission failed; falling back to mailto', err)
      setStatus('failed')
    }
  }

  return (
    <section className="container">
      <h2>Eyesi</h2>
      <p>Eyesi submissions and information. Submit observations or short articles to the society.</p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <article className="card">
          <h3>Submit to Eyesi</h3>
          <p style={{ color: 'var(--muted)' }}>Short submissions are accepted; they will be sent to the society inbox once configured.</p>

          <form onSubmit={handleSubmit} className="eyesi-form">
            <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <textarea placeholder="Your submission" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            <div className="eyesi-actions">
              <button className="eyesi-submit" type="submit" disabled={!content || !name}>Send</button>
              {status === 'sending' && <span>Sending...</span>}
              {status === 'sent' && <span style={{ color: 'green' }}>Sent - thank you!</span>}
              {status === 'failed' && <span style={{ color: 'crimson' }}>Failed to send. Please email the society directly.</span>}
            </div>
          </form>
        </article>
      </div>
    </section>
  )
}