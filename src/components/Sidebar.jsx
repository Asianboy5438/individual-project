import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { subreddits, formatNumber } from '../data/sampleData'

const Sidebar = memo(function Sidebar() {
  const { joinedSubs, toggleJoin } = useAppContext()

  return (
    <>
      {/* Home card */}
      <div className="sidebar-card">
        <div className="sidebar-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '32px' }}>🏠</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', fontFamily: "'Syne', sans-serif" }}>Home</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Your personal Reddit frontpage</div>
            </div>
          </div>
          <Link to="/submit" className="btn btn-fill" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Create Post
          </Link>
        </div>
      </div>

      {/* Top communities */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">🔥 Top Communities</div>
        <div className="sidebar-card-body" style={{ padding: '8px 12px' }}>
          {subreddits.map((sub, i) => (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: i < subreddits.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="community-rank">{i + 1}</span>
              {/* Link (React Router): navigate to subreddit */}
              <Link to={`/r/${sub.name}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textDecoration: 'none', color: 'inherit', minWidth: 0 }}>
                <div className="community-icon" style={{ background: sub.color }}>{sub.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="community-name">{sub.display}</div>
                  <div className="community-members">{formatNumber(sub.members)} members</div>
                </div>
              </Link>
              <button
                className={`join-btn ${joinedSubs.has(sub.id) ? 'joined' : 'not-joined'}`}
                onClick={() => toggleJoin(sub.id)}
              >
                {joinedSubs.has(sub.id) ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reddit rules */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">📜 Reddit Rules</div>
        <div className="sidebar-card-body">
          {['Remember the human', 'Behave like you would in real life', 'Look for the original source', 'Search for duplicates before posting', "Read the community's rules"].map((rule, i) => (
            <div key={i} style={{ padding: '6px 0', fontSize: '13px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, minWidth: '16px' }}>{i + 1}.</span>
              <span style={{ color: 'var(--text-secondary)' }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px 0', lineHeight: 1.9 }}>
        Help · About · Careers · Press · Blog · Rules · Privacy · Terms
        <br />Reddit Inc © 2025. All rights reserved.
      </div>
    </>
  )
})

export default Sidebar