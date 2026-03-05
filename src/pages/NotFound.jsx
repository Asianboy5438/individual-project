import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found" style={{ paddingTop: '60px' }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or was removed.</p>
      {/* Link: navigate home without reload */}
      <Link to="/" className="btn btn-fill" style={{ textDecoration: 'none', display: 'inline-block' }}>
        🏠 Go Home
      </Link>
    </div>
  )
}
