import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import EventPage from './pages/EventPage'
import Resources from './pages/Resources'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Diseases from './pages/Diseases'
import OSCE from './pages/OSCE'
import DukeElder from './pages/DukeElder'
import Eyesi from './pages/Eyesi'

function App() {
  return (
    <BrowserRouter>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
