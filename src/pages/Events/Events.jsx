import { useState } from 'react'
import './Events.css'

const EVENTS = [
  { name: 'ARVO Annual Meeting', dates: '3-7 May 2026', dateRange: [{ month: 5, days: [3, 4, 5, 6, 7] }], url: 'https://www.arvo.org/annual-meeting' },
  { name: 'RCOphth Annual Congress', dates: '18-21 May 2026', dateRange: [{ month: 5, days: [18, 19, 20, 21] }], url: 'https://www.rcophth.ac.uk/events-courses/annual-congress/' },
  { name: 'EGS Congress', dates: '30 May-2 Jun 2026', dateRange: [{ month: 5, days: [30, 31] }, { month: 6, days: [1, 2] }], url: 'https://egscongress.org/' },
  { name: 'BOPSS Annual Meeting', dates: '17-19 Jun 2026', dateRange: [{ month: 6, days: [17, 18, 19] }], url: 'https://www.bopss.co.uk/meetings/bopss-2026-sheffield/' },
  { name: 'WOC 2026', dates: '26-29 Jun 2026', dateRange: [{ month: 6, days: [26, 27, 28, 29] }], url: 'https://icowoc.org/' },
  { name: 'Oxford Ophthalmological Congress', dates: '6-8 Jul 2026', dateRange: [{ month: 7, days: [6, 7, 8] }], url: 'https://www.ooc.uk.com/' },
  { name: 'BEECS Annual Meeting', dates: 'TBC - Sep 2026', dateRange: [], url: 'https://beecs.co.uk/' },
  { name: 'ESCRS Congress', dates: '11-15 Sep 2026', dateRange: [{ month: 9, days: [11, 12, 13, 14, 15] }], url: 'https://congress.escrs.org/' },
  { name: 'EURETINA Congress', dates: '1-4 Oct 2026', dateRange: [{ month: 10, days: [1, 2, 3, 4] }], url: 'https://euretina.org/vienna-2026/' },
  { name: 'AAO Annual Meeting', dates: '9-12 Oct 2026', dateRange: [{ month: 10, days: [9, 10, 11, 12] }], url: 'https://www.aao.org/annual-meeting' },
  { name: 'BIPOSA Annual Meeting', dates: 'TBC - Oct 2026', dateRange: [], url: 'https://biposa.org/' },
  { name: 'BEAVRS Annual Meeting', dates: '5-6 Nov 2026', dateRange: [{ month: 11, days: [5, 6] }], url: 'https://beavrs.org/' },
]

function getEventForDate(month, day) {
  return EVENTS.find(event =>
    event.dateRange.some(dr => dr.month === month && dr.days.includes(day))
  )
}

function CalendarMonth({ month, year, onPrevMonth, onNextMonth }) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const [hoveredDate, setHoveredDate] = useState(null)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const dates = []
  for (let i = 0; i < firstDay; i++) {
    dates.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i)
  }

  return (
    <div className="calendar-month">
      <div className="calendar-header">
        <h3 className="month-title">{monthNames[month - 1]} {year}</h3>
        <div className="nav-buttons">
          <button className="nav-prev" onClick={onPrevMonth} aria-label="Previous month">
            &larr;
          </button>
          <button className="nav-next" onClick={onNextMonth} aria-label="Next month">
            &rarr;
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {dayNames.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-days">
        {dates.map((day, idx) => {
          const event = day ? getEventForDate(month, day) : null
          const isToday = new Date().getMonth() === month - 1 && new Date().getDate() === day

          return (
            <div
              key={idx}
              className={`calendar-day ${event ? 'has-event' : ''} ${isToday ? 'today' : ''}`}
              onMouseEnter={() => day && setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
              onClick={() => event && window.open(event.url, '_blank')}
            >
              {day && <span className="day-number">{day}</span>}

              {event && hoveredDate === day && (
                <div className="event-tooltip">
                  <div className="tooltip-name">{event.name}</div>
                  <div className="tooltip-dates">{event.dates}</div>
                  <a href={event.url} target="_blank" rel="noreferrer" className="tooltip-link" onClick={(e) => e.stopPropagation()}>
                    Visit Website &rarr;
                  </a>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Events() {
  const currentMonth = new Date().getMonth() + 1
  const [displayMonth, setDisplayMonth] = useState(currentMonth)

  const handlePrevMonth = () => {
    setDisplayMonth(prev => prev === 1 ? 12 : prev - 1)
  }

  const handleNextMonth = () => {
    setDisplayMonth(prev => prev === 12 ? 1 : prev + 1)
  }

  return (
    <section className="events container">
      <div className="events-header">
        <h1>2026 Ophthalmology Events Calendar</h1>
        <div className="events-intro-note">
          <p>
            Open to all medical students: sign up{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSexh8AUTE2oQnO0miQc_Jsatsu7km8DVbC0By1jWjOLVBxNUg/viewform?usp=sharing&ouid=100344064518740497400"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>{' '}
            for our FREE Duke Elder Lecture series - led by top 20 rank holders in the 2025 exam!
          </p>
        </div>
        <p>Hover over highlighted dates to see event details. Click to visit the event website.</p>
      </div>

      <div className="calendar-container">
        <CalendarMonth month={displayMonth} year={2026} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} />
      </div>

      <div className="conference-signup">
        <h2>Attending a conference?</h2>
        <p>If you're planning to attend any of the conferences listed above, log in with your Cambridge email and add your CRSID to our attendance sheet - so other Cambridge students going to the same meeting can reach out.</p>
        <a href="https://docs.google.com/spreadsheets/d/1ymg_CaayTVk66uSac85zZSHCMXtCvmYY7WPFIx1jcf0/edit?usp=sharing" className="signup-link" target="_blank" rel="noreferrer">Sign up here &rarr;</a>
      </div>
    </section>
  )
}