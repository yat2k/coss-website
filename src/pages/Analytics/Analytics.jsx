import { useState, useEffect } from 'react'
import './Analytics.css'

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : '/api'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // First check if server is available
        const healthResponse = await fetch(`${API_BASE}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (!healthResponse.ok) {
          throw new Error('Backend server is not responding')
        }

        // Then fetch analytics
        const response = await fetch(`${API_BASE}/analytics/summary`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }
        const data = await response.json()
        setAnalytics(data)
        setError(null)
      } catch (err) {
        console.error('Analytics fetch error:', err)
        setError(err.message || 'Could not connect to analytics server')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <section className="container"><p>Loading analytics...</p></section>
  if (error) return (
    <section className="container">
      <div className="error-container">
        <h2>Analytics Unavailable</h2>
        <p className="error">{error}</p>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Make sure the backend server is running: <code>node server.js</code>
        </p>
      </div>
    </section>
  )
  
  if (!analytics) return <section className="container"><p>No analytics data yet</p></section>

  return (
    <section className="container analytics-page">
      <h2>Analytics Dashboard</h2>

      <div className="analytics-grid">
        {/* Quick Stats */}
        <div className="analytics-card stats-card">
          <h3>Overview</h3>
          <div className="stat-item">
            <span className="stat-label">Total Sessions</span>
            <span className="stat-value">{analytics.totalSessions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Page Views</span>
            <span className="stat-value">{analytics.totalPageViews}</span>
          </div>
          {analytics.totalSessions > 0 && (
            <div className="stat-item">
              <span className="stat-label">Avg Views per Session</span>
              <span className="stat-value">{(analytics.totalPageViews / analytics.totalSessions).toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Quiz Stats */}
        <div className="analytics-card quiz-stats-card">
          <h3>Quiz Engagement</h3>
          <div className="stat-item">
            <span className="stat-label">Quiz Starts</span>
            <span className="stat-value">{analytics.quizStats.starts}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Quiz Completions</span>
            <span className="stat-value">{analytics.quizStats.completions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">{analytics.quizStats.completionRate}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Answers Submitted</span>
            <span className="stat-value">{analytics.quizStats.answersSubmitted}</span>
          </div>
        </div>
      </div>

      {/* Page Views Breakdown */}
      {Object.keys(analytics.pageViewsByPage).length > 0 && (
        <div className="analytics-card">
          <h3>Page Views by Page</h3>
          <div className="page-views-table">
            <table>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.pageViewsByPage)
                  .sort((a, b) => b[1] - a[1])
                  .map(([page, count]) => (
                    <tr key={page}>
                      <td className="page-name">{page || '/'}</td>
                      <td className="page-count">{count}</td>
                      <td className="page-percentage">
                        {((count / analytics.totalPageViews) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      {analytics.recentSessions.length > 0 && (
        <div className="analytics-card">
          <h3>Recent Sessions</h3>
          <div className="sessions-list">
            {analytics.recentSessions.map((session) => (
              <div key={session.sessionId} className="session-item">
                <div className="session-info">
                  <span className="session-id">{session.sessionId.substring(0, 20)}...</span>
                  <span className="session-events">Events: {session.eventsCount}</span>
                </div>
                <div className="session-times">
                  <span className="session-time">First: {new Date(session.firstSeen).toLocaleString()}</span>
                  <span className="session-time">Last: {new Date(session.lastSeen).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="analytics-footer">
        <p>Analytics auto-refreshes every 30 seconds</p>
      </div>
    </section>
  )
}
