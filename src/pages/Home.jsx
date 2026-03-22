import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import site from '../content/site.json'
import DailyQuiz from '../components/DailyQuiz/DailyQuiz'
import './Home.css'

export default function Home() {
  const headingRef = useRef(null)
  const [headingOffset, setHeadingOffset] = useState(0)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return

    function update() {
      const style = getComputedStyle(el)
      const marginBottom = parseFloat(style.marginBottom) || 0
      const offset = el.offsetHeight + marginBottom
      setHeadingOffset(offset)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section className="home container">
      <div className="home-grid">
        <div className="home-main">
          <h1 ref={headingRef}>{site.title}</h1>
          <p>{site.description1}</p>
          <p>{site.description2}</p>
          <p>
            {(() => {
              const needle = 'Events'
              const str = site.description3 || ''
              const idx = str.indexOf(needle)
              if (idx === -1) return str
              return (
                <>
                  {str.slice(0, idx)}
                  <Link to="/events">{needle}</Link>
                  {str.slice(idx + needle.length)}
                </>
              )
            })()}
          </p>
        </div>

        <DailyQuiz topOffset={headingOffset} />
      </div>
    </section>
  )
}
