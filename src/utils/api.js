// Centralized API configuration
export const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://coss-website.onrender.com'

export const endpoints = {
  ANALYTICS_TRACK: `${API_BASE}/analytics/track`,
  ANALYTICS_SUMMARY: `${API_BASE}/analytics/summary`,
  ANALYTICS_DETAILS: `${API_BASE}/analytics/details`,
  HEALTH: `${API_BASE}/health`,
  SUBMIT_QUIZ: `${API_BASE}/submit`,
  GET_STATS: (questionId) => `${API_BASE}/stats/${questionId}`,
}
