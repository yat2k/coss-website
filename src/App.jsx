import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import { endpoints } from './utils/api'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Events from './pages/Events/Events'
import EventPage from './pages/EventPage/EventPage'
import Resources from './pages/Resources/Resources'
import Contact from './pages/Contact/Contact'
import Blog from './pages/Blog/Blog'
import Diseases from './pages/Diseases/Diseases'
import OSCE from './pages/OSCE/OSCE'
import DukeElder from './pages/DukeElder/DukeElder'
import Eyesi from './pages/Eyesi/Eyesi'
import Analytics from './pages/Analytics/Analytics'

// Simple analytics function without hook - more robust
function trackPageView(pathname) {
  try {
    if (typeof window === 'undefined') return
    
    let sessionId = localStorage.getItem('coss_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('coss_session_id', sessionId)
    }

    const payload = {
      sessionId,
      eventType: 'page_view',
      page: pathname,
      data: {},
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

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return (
    <div className="app-root">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/blog" element={<Blog />} />
          <Route path="/resources/diseases" element={<Diseases />} />
          <Route path="/resources/osce" element={<OSCE />} />
          <Route path="/resources/duke-elder" element={<DukeElder />} />
          <Route path="/resources/eyesi" element={<Eyesi />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
