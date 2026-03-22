import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
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
