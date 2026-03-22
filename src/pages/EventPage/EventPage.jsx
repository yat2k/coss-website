import { useParams, Link } from 'react-router-dom'
import events from '../../content/events.json'

export default function EventPage() {
  const { id } = useParams()
  const event = events.find((e) => String(e.id) === String(id))

  if (!event) return (
    <section className="container">
      <h2>Event not found</h2>
      <p>Sorry, we couldn't find that event.</p>
      <Link to="/events">Back to events</Link>
    </section>
  )

  return (
    <article className="container event-page">
      <h2>{event.title}</h2>
      <p className="muted">{event.date}</p>
      <div dangerouslySetInnerHTML={{ __html: event.content }} />
      <p><Link to="/events">Back to events</Link></p>
    </article>
  )
}
