import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'
import logo from '../../assets/COSS-logo.jpg'

export default function Header() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
    setIsResourcesOpen(false)
  }, [location.pathname])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Cambridge Ophthalmology Student Society">
          <img src={logo} alt="COSS logo" className="brand-logo" />
        </Link>

        <button
          type="button"
          className={`nav-toggle ${isMenuOpen ? 'is-open' : ''}`}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-navigation" className={isMenuOpen ? 'is-open' : ''}>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>

          <div className={`nav-item nav-dropdown ${isResourcesOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="nav-link nav-dropdown-trigger"
              aria-expanded={isResourcesOpen}
              aria-controls="resources-submenu"
              onClick={() => setIsResourcesOpen((open) => !open)}
            >
              <span>Resources</span>
              <span className="nav-caret" aria-hidden="true">
                {isResourcesOpen ? '^' : 'v'}
              </span>
            </button>

            <ul id="resources-submenu" className="dropdown-menu" aria-label="Resources submenu">
              <li><Link to="/resources">All Resources</Link></li>
              <li><Link to="/resources/blog">Blog</Link></li>
              <li><Link to="/resources/diseases">Diseases of the Week</Link></li>
              <li><Link to="/resources/osce">OSCE Resources</Link></li>
              <li><Link to="/resources/duke-elder">Duke Elder</Link></li>
              <li><Link to="/resources/eyesi">Eyesi</Link></li>
            </ul>
          </div>

          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
