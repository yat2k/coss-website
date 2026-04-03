import { useState, useEffect } from 'react'
import './DailyQuiz.css'
import allQuestions from '../../content/questions.json'
import { endpoints } from '../../utils/api'

// Simple analytics tracking - more robust than hooks
function trackAnalyticsEvent(eventType, page, data = {}) {
  try {
    if (typeof window === 'undefined') return
    
    let sessionId = localStorage.getItem('coss_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('coss_session_id', sessionId)
    }

    const payload = {
      sessionId,
      eventType,
      page: page || 'daily-quiz',
      data,
    }

    fetch(endpoints.ANALYTICS_TRACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {}) // silently fail
  } catch {
    // ignore analytics errors
  }
}

// Use the first five questions from the content pool
const DAILY_COUNT = 5
const STREAK_KEY = 'coss_daily_quiz_streak'
const UK_TIME_ZONE = 'Europe/London'

function getUkDateKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: UK_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formatter.format(date)
}

function addDaysToDateKey(dateKey, days) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const utcDate = new Date(Date.UTC(year, month - 1, day))
  utcDate.setUTCDate(utcDate.getUTCDate() + days)
  return getUkDateKey(utcDate)
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

function getResolvedStreak(stored, today = getUkDateKey()) {
  const safeStreak = Number(stored?.streak) || 0
  const lastAttempt = stored?.lastAttempt || null

  if (!lastAttempt) {
    return { streak: 0, lastAttempt: null, isTodayComplete: false }
  }

  if (lastAttempt === today) {
    return { streak: safeStreak, lastAttempt, isTodayComplete: true }
  }

  if (addDaysToDateKey(lastAttempt, 1) === today) {
    return { streak: safeStreak, lastAttempt, isTodayComplete: false }
  }

  return { streak: 0, lastAttempt, isTodayComplete: false }
}

export default function DailyQuiz({ questionData, topOffset = 0 }) {
  const pool = questionData ? [questionData] : allQuestions || []
  const daily = pool.slice(0, DAILY_COUNT)

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [streak, setStreak] = useState(0)
  const [streakUpdatedThisSession, setStreakUpdatedThisSession] = useState(false)
  const [answers, setAnswers] = useState(() => Array(DAILY_COUNT).fill(null))
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set())
  const [quizStarted, setQuizStarted] = useState(false)

  function updateStreakIfNeeded() {
    if (streakUpdatedThisSession) return
    const today = getUkDateKey()
    const stored = loadStreakFromStorage()
    const resolved = getResolvedStreak(stored, today)
    const last = resolved.lastAttempt

    if (last === today) {
      setStreak(resolved.streak)
      setStreakUpdatedThisSession(true)
      return
    }

    const newStreak = last && addDaysToDateKey(last, 1) === today
      ? resolved.streak + 1
      : 1

    const toSave = { streak: newStreak, lastAttempt: today }
    saveStreakToStorage(toSave)
    setStreak(newStreak)
    setStreakUpdatedThisSession(true)
  }

  useEffect(() => {
    function syncStreakState() {
      const today = getUkDateKey()
      const stored = loadStreakFromStorage()
      const resolved = getResolvedStreak(stored, today)

      setStreak(resolved.streak)
      setStreakUpdatedThisSession(resolved.isTodayComplete)

      if (resolved.streak !== (Number(stored?.streak) || 0)) {
        saveStreakToStorage({
          streak: resolved.streak,
          lastAttempt: resolved.lastAttempt,
        })
      }
    }

    syncStreakState()
    const intervalId = window.setInterval(syncStreakState, 60000)

    return () => window.clearInterval(intervalId)
  }, [])

  // Track quiz start
  useEffect(() => {
    if (!quizStarted && daily.length > 0) {
      trackAnalyticsEvent('quiz_start', 'daily-quiz', { questionCount: daily.length })
      setQuizStarted(true)
    }
  }, [daily.length, quizStarted])

  // reset answers length when daily set changes
  useEffect(() => {
    setAnswers(Array(daily.length).fill(null))
  }, [daily.length])

  useEffect(() => {
    // reset if questionData changes or pool changes
    setIndex(0)
    setScore(0)
    setFinished(false)
  }, [questionData])

  const q = daily[index]
  const isCurrentQuestionAnswered = answeredQuestions.has(index)

  function selectChoice(choiceId) {
    // Don't allow changing answer if already answered
    if (isCurrentQuestionAnswered) return

    setAnswers((prev) => {
      const copy = prev.slice()
      copy[index] = choiceId
      return copy
    })

    // Mark this question as answered
    setAnsweredQuestions((prev) => new Set([...prev, index]))

    // Track individual answer submission
    trackAnalyticsEvent('quiz_answer_submit', 'daily-quiz', { questionIndex: index, questionId: q?.id })
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
        fetch(endpoints.SUBMIT_QUIZ, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId: r.questionId, gotItRight: r.gotItRight }),
        })
          .then((resp) => (resp.ok ? resp.json() : null))
          .catch(() => null)
      )
      await Promise.all(sends)
    } catch {
      console.warn('Could not send quiz results to server')
    }

    // update streak only when all questions answered
    updateStreakIfNeeded()

    // Track quiz completion
    trackAnalyticsEvent('quiz_complete', 'daily-quiz', { score: correctCount, totalQuestions: daily.length })

    setFinished(true)
  }

  function restart() {
    setIndex(0)
    setScore(0)
    setFinished(false)
    setAnsweredQuestions(new Set())
    setQuizStarted(false)
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
                  <label
                    className={`dq-choice ${
                      isCurrentQuestionAnswered && c.id === q.answerId ? 'correct' : ''
                    } ${
                      isCurrentQuestionAnswered &&
                      answers[index] === c.id &&
                      c.id !== q.answerId
                        ? 'incorrect'
                        : ''
                    } ${isCurrentQuestionAnswered ? 'locked' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${q.id}`}
                      value={c.id}
                      checked={answers[index] === c.id}
                      onChange={() => selectChoice(c.id)}
                      disabled={isCurrentQuestionAnswered}
                    />
                    <span className="dq-choice-text">{c.text}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="dq-actions">
              <button
                className="dq-retry"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
              >
                Previous
              </button>

              {index + 1 < daily.length ? (
                <button className="dq-submit" onClick={() => setIndex((i) => i + 1)} disabled={!isCurrentQuestionAnswered}>
                  Next
                </button>
              ) : (
                <button className="dq-submit" onClick={finalSubmit} disabled={!isCurrentQuestionAnswered}>
                  Submit Quiz
                </button>
              )}
            </div>

            {/* show explanation after answered */}
            {isCurrentQuestionAnswered && q.explanation && (
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
