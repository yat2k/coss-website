import { useState, useEffect } from 'react'
import './DailyQuiz.css'
import allQuestions from '../../content/questions.json'

// Use the first five questions from the content pool
const DAILY_COUNT = 5

export default function DailyQuiz({ questionData, topOffset = 0 }) {
  const pool = questionData ? [questionData] : allQuestions || []
  const daily = pool.slice(0, DAILY_COUNT)

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [remoteStats, setRemoteStats] = useState(null)
  const [streak, setStreak] = useState(0)
  const [streakUpdatedThisSession, setStreakUpdatedThisSession] = useState(false)
  const [answers, setAnswers] = useState(() => Array(DAILY_COUNT).fill(null))

  const STREAK_KEY = 'coss_daily_quiz_streak'

  function formatDateOnly(d) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  function loadStreakFromStorage() {
    try {
      const raw = localStorage.getItem(STREAK_KEY)
      if (!raw) return { streak: 0, lastAttempt: null }
      return JSON.parse(raw)
    } catch (e) {
      console.warn('Failed to load streak', e)
      return { streak: 0, lastAttempt: null }
    }
  }

  function saveStreakToStorage(data) {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save streak', e)
    }
  }

  // Determine streak update based on calendar days.
  // - If last attempt is today: no change
  // - If last attempt is yesterday: increment streak
  // - Otherwise: reset to 1
  function updateStreakIfNeeded() {
    if (streakUpdatedThisSession) return
    const now = new Date()
    const today = formatDateOnly(now)
    const stored = loadStreakFromStorage()
    const last = stored.lastAttempt

    if (last === today) {
      // already attempted today
      setStreak(stored.streak || 0)
      setStreakUpdatedThisSession(true)
      return
    }

    let newStreak = 1
    if (last) {
      const lastDate = new Date(last + 'T00:00:00')
      const nextDay = new Date(lastDate)
      nextDay.setDate(lastDate.getDate() + 1)
      const nextDayStr = formatDateOnly(nextDay)
      if (nextDayStr === today) {
        newStreak = (stored.streak || 0) + 1
      }
    }

    const toSave = { streak: newStreak, lastAttempt: today }
    saveStreakToStorage(toSave)
    setStreak(newStreak)
    setStreakUpdatedThisSession(true)
  }

  useEffect(() => {
    const s = loadStreakFromStorage()
    setStreak(s.streak || 0)
  }, [])

  // reset answers length when daily set changes
  useEffect(() => {
    setAnswers(Array(daily.length).fill(null))
  }, [daily.length])

  useEffect(() => {
    // reset if questionData changes or pool changes
    setIndex(0)
    setSelected(null)
    setSubmitted(false)
    setScore(0)
    setFinished(false)
  }, [questionData])

  const q = daily[index]

  function selectChoice(choiceId) {
    setAnswers((prev) => {
      const copy = prev.slice()
      copy[index] = choiceId
      return copy
    })
  }

  async function finalSubmit() {
    // ensure all answered
    if (answers.some((a) => a == null)) return

    // compute score locally
    let correctCount = 0
    const results = daily.map((question, i) => {
      const gotItRight = answers[i] === question.answerId
      if (gotItRight) correctCount++
      return { questionId: question.id, gotItRight }
    })

    setScore(correctCount)

    // send each result to backend (fire in parallel)
    try {
      const sends = results.map((r) =>
        fetch('http://localhost:3001/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: r.questionId, gotItRight: r.gotItRight }),
        })
          .then((resp) => (resp.ok ? resp.json() : null))
          .catch(() => null)
      )
      const responses = await Promise.all(sends)
      setRemoteStats(responses)
    } catch (err) {
      console.warn('Could not send quiz results to server', err)
    }

    // update streak only when all questions answered
    updateStreakIfNeeded()

    setFinished(true)
  }

  function next() {
    const nextIndex = index + 1
    if (nextIndex >= daily.length) {
      setFinished(true)
    } else {
      setIndex(nextIndex)
      setSelected(null)
      setSubmitted(false)
      setRemoteStats(null)
    }
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setSubmitted(false)
    setScore(0)
    setFinished(false)
  }

  const style = topOffset ? { marginTop: `${topOffset}px` } : undefined

  return (
    <aside className="daily-quiz" style={style}>
      <h3 className="dq-title">Daily Quiz</h3>
      <p className="dq-current">Current Streak: {streak}</p>
      <div className="dq-card">
        {!finished && q ? (
          <>
            <p className="dq-progress">Question {index + 1} of {daily.length}</p>
            <p className="dq-question">{q.question}</p>
            <ul className="dq-choices">
              {q.choices.map((c) => (
                <li key={c.id}>
                  <label className={`dq-choice ${answers[index] !== null && c.id === q.answerId ? 'correct' : ''} ${answers[index] !== null && answers[index] === c.id && c.id !== q.answerId ? 'incorrect' : ''}`}>
                    <input
                      type="radio"
                      name={`quiz-${q.id}`}
                      value={c.id}
                      checked={answers[index] === c.id}
                      onChange={() => selectChoice(c.id)}
                    />
                    <span className="dq-choice-text">{c.text}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="dq-actions">
              <button className="dq-retry" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
                Previous
              </button>

              {index + 1 < daily.length ? (
                <button className="dq-submit" onClick={() => setIndex((i) => i + 1)}>
                  Next
                </button>
              ) : (
                <button className="dq-submit" onClick={finalSubmit} disabled={answers.some((a) => a == null)}>
                  Submit Quiz
                </button>
              )}
            </div>

            {/* show explanation while reviewing or if answered */}
            {answers[index] != null && q.explanation && (
              <p className="dq-explanation">{q.explanation}</p>
            )}
          </>
        ) : (
          <div className="dq-summary">
            <p>Your score: {score} / {daily.length}</p>
            <div className="dq-streak-badge">🔥 Streak: <span className="dq-streak-number">{streak}</span></div>
            <button className="dq-restart" onClick={() => {
              restart()
              setAnswers(Array(daily.length).fill(null))
              setStreakUpdatedThisSession(false)
            }}>
              Retake
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
