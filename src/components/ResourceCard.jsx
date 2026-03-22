import { Link } from 'react-router-dom'
import './ResourceCard.css'

export default function ResourceCard({ to, title, description, image, badge }) {
  return (
    <Link to={to} className="resource-card">
      <div className="rc-image" style={{ backgroundImage: `url(${image})` }} />
      <div className="rc-body">
        <div className="rc-title">
          {badge && <span className="rc-badge">{badge}</span>}
          <h3>{title}</h3>
        </div>
        <p className="rc-desc">{description}</p>
      </div>
    </Link>
  )
}
