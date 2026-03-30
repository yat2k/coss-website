import { Link } from 'react-router-dom'
import './Header.css'
import logo from '../../assets/COSS-logo.jpg'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Cambridge Ophthalmology Student Society">
          <img src={logo} alt="COSS logo" className="brand-logo" />
        </Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>

          <div className="nav-item nav-dropdown">
            <Link to="/resources" className="nav-link">Resources ▾</Link>
            <ul className="dropdown-menu" aria-label="Resources submenu">
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
