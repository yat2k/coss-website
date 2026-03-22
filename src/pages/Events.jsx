import './Events.css'

export default function Events() {
  return (
    <section className="events container">
      <div className="events-grid">
        <main className="events-main">
          <h1>Upcoming Events</h1>
          <h2 className="section-heading section-heading--green">Cambridge Ophthalmology Society Events</h2>

          <section className="event-card">
            <h2>Specialty Trainee Symposium – February 2026</h2>
            <p>Explore training pathways, hear from specialty trainees, and get insider career advice.</p>
          </section>

          <section className="event-card">
            <h2>Duke Elder Lecture Series – March 2026 onwards</h2>
            <p>Our flagship lecture series supporting students preparing for the undergraduate ophthalmology exam.</p>
          </section>

          <h2 className="section-heading section-heading--blue">National &amp; International Ophthalmology Events</h2>

          <section className="event-card">
            <h3>UKNOS Conference – 15th–17th April 2026</h3>
            <p>National student ophthalmology conference with lectures, workshops, and networking opportunities.</p>
          </section>

          <section className="event-card">
            <h3>ARVO Annual Meeting – 1st–5th May 2026</h3>
            <p>Leading international vision science and research conference.</p>
          </section>

          <section className="event-card">
            <h3>RCOphth Congress – 10th–12th June 2026</h3>
            <p>UK-based professional congress featuring talks, workshops, and the latest research.</p>
          </section>
        </main>

        <aside className="events-side">
          <div className="side-card">
            <h4>Connect with Fellow Students</h4>
            <p>Planning to attend any events? Add your name and CRSid to our Google Sheet to find like-minded Cambridge students and coordinate attendance.</p>
            <p><a className="button" href="#" target="_blank" rel="noreferrer">Open events Google Sheet</a></p>
          </div>

          <div className="side-card">
            <h4>Stay Up to Date</h4>
            <p>Want to hear about upcoming events and opportunities from the Cambridge Ophthalmology Society? Sign up for our mailing list below!</p>
            <p>Join the Mailing List: Submit your details via our Google Form — simply fill out your name, email, level of training, and affiliated institution to stay in the loop.</p>
            <p><a className="button muted" href="#" target="_blank" rel="noreferrer">Open mailing list form</a></p>
          </div>
        </aside>
      </div>
    </section>
  )
}
