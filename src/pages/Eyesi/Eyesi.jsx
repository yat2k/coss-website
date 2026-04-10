import './Eyesi.css'

export default function Eyesi() {
  return (
    <section className="container">
      <h2>Eyesi</h2>
      <p>
        The EyeSi Surgical Simulator (VRmagic) is a virtual reality training platform used
        worldwide to teach and assess intraocular surgery.
      </p>

      <div className="eyesi-content">
        <article className="card">
          <h3>What it offers</h3>
          <p>It provides modules for:</p>
          <ul className="eyesi-list">
            <li>Cataract surgery</li>
            <li>Vitreoretinal surgery</li>
            <li>Microscope and instrument handling</li>
            <li>Complication management</li>
          </ul>
        </article>

        <article className="card">
          <h3>EyeSi in Cambridge</h3>
          <p>The Addenbrookes EyeSi simulator provides modules for Cataract.</p>
          <p>
            EyeSi falls under the &ldquo;Evidence of ophthalmology simulation training&rdquo;
            {' '}in the Commitment to Specialty category for application to ophthalmology
            specialty training.
          </p>
          <p>
            The EyeSi in Addenbrookes is free to use for University of Cambridge students.
            You will need to have received an induction before using the EyeSi simulator in
            Cambridge. Please fill in the form, accessed with your Cambridge email, if you
            are interested in arranging an induction.
          </p>

          <div className="eyesi-cta">
            <a
              href="https://forms.gle/wkmnGkKTZBX3SuNG7"
              target="_blank"
              rel="noreferrer"
              className="cta-link"
            >
              Sign up here! &rarr;
            </a>
          </div>
        </article>

        <article className="card">
          <h3>EyeSi in the Royal College of Ophthalmologists (RCOphth)</h3>
          <p>
            You will need to have received an induction before using the EyeSi simulator at
            RCOphth. Slots for the EyeSi simulator at the college in London are offered on a
            first come, first served basis.
          </p>
          <p>
            You will need an RCOphth account to book slots and, typically, slots are released
            at the start of each month. Getting membership for the RCOphth reduces the booking
            fee slightly.
          </p>

          <div className="eyesi-fees">
            <div className="eyesi-fees-header">Booking fees</div>
            <div className="eyesi-fees-grid eyesi-fees-grid--header">
              <div>Members</div>
              <div>Non-members</div>
            </div>
            <div className="eyesi-fees-grid">
              <div data-label="Members">£20 for half a day</div>
              <div data-label="Non-members">£50 for half a day</div>
            </div>
            <div className="eyesi-fees-grid">
              <div data-label="Members">£40 for a full day</div>
              <div data-label="Non-members">£75 for a full day</div>
            </div>
          </div>

          <p>
            Find more information on the RCOphth website{' '}
            <a
              href="https://ihub.rcophth.ac.uk/RCO/RCO/Simulator_Booking.aspx?hkey=0d179126-af22-499d-a64f-9a7cafee8289"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  )
}
