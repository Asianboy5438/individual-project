import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appContext'

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useAppContext()
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      // Navigate to home with search query param
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <nav className="navbar">
      {/* Link (React Router): navigates to home without page reload */}
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">🤖</div>
        <span className="logo-text">reddit</span>
      </Link>

      <form className="navbar-search" onSubmit={handleSearch}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search Reddit"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>

      <div className="navbar-actions">
        {/* Context API: darkMode read from context, no prop needed */}
        <button className="btn-ghost" title="Toggle theme" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button className="btn-ghost">🔔</button>
        {/* Link to submit page (React Router) */}
        <Link to="/submit" className="btn btn-outline" style={{ textDecoration: 'none' }}>
          + Create Post
        </Link>
        <button className="btn btn-fill" onClick={() => alert('Login not implemented in demo')}>
          Log In
        </button>
      </div>
    </nav>
  )
}