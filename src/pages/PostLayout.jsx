import { Outlet, useNavigate } from 'react-router-dom'

export default function PostLayout() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Shared layout UI — goes back one step in history */}
      <div style={{ paddingTop: '16px', marginBottom: '8px' }}>
        <button
          className="action-btn"
          style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </button>
      </div>

      {/* <Outlet /> renders the matched child route (PostPage) */}
      <Outlet />
    </div>
  )
}
