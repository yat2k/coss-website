import DailyQuiz from '../../components/DailyQuiz/DailyQuiz'
import './DukeElder.css'

export default function DukeElder() {
  return (
    <section className="container dukeElder-container">
      <div className="dukeElder-content">
        <h2>Duke Elder Resources</h2>
        
        <article className="card">
          <h3>What is the Duke Elder Exam?</h3>
          <p>The Duke Elder Undergraduate Prize Examination is widely regarded as the most prestigious ophthalmology exam available to medical students. Run annually by the Royal College of Ophthalmologists, it attracts candidates from across the UK and increasingly from overseas.</p>
          
          <p>The exam is a virtual, 2-hour, 90-question multiple-choice examination with a syllabus extending well beyond undergraduate teaching. Questions cover clinical ophthalmology alongside ocular physiology, anatomy, pharmacology, basic science, statistics, pathology, embryology, genetics, and socioeconomic medicine relevant to ophthalmology.</p>
          
          <p>The 2026 exam will be held on <strong>Wednesday 9 September 2026 at 2:30pm</strong>, delivered online and proctored via webcam.</p>
        </article>

        <article className="card">
          <h3>Useful Resources</h3>
          <ul style={{ marginBottom: 0 }}>
            <li>
              <a href="https://www.rcophth.ac.uk/examinations/duke-elder-undergraduate-prize-examination/" target="_blank" rel="noreferrer">
                RCOphth Official Page
              </a>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Exam dates, eligibility, and registration</p>
            </li>
          </ul>
        </article>
      </div>

      <aside className="dukeElder-quiz">
        <DailyQuiz />
      </aside>
    </section>
  )
}
