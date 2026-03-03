import { useRef, useLayoutEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useFetch } from '../hooks/useFetch'
import PostCard from '../components/PostCard'
import { subreddits, posts, formatNumber } from '../data/sampleData'

export default function SubredditPage() {
  // Dynamic route (Lab 10): extracts the :subreddit param from URL
  const { subreddit: subName } = useParams()

  // Context API (Lab 11): joinedSubs shared with Sidebar — same data, no duplication
  const { joinedSubs, toggleJoin } = useAppContext()

  const bannerRef = useRef(null)
  const headerRef = useRef(null)

  // Find subreddit data from our mock data
  const subData = subreddits.find(s => s.name === subName) || {
    id: `r/${subName}`,
    name: subName,
    display: `r/${subName}`,
    icon: '🌐',
    members: 1000,
    online: 50,
    color: '#ff4500',
    description: 'A Reddit community.',
    banner: 'linear-gradient(135deg, #ff4500, #ff8c69)',
    rules: ['Be civil', 'Stay on topic'],
  }

  // useFetch (Lab 14 / Lab 8): In a real app this would call an API
  // Here it simulates loading with our mock data
  const { loading } = useFetch(null) // null = no real URL; we use mock data below

  // Filter posts for this subreddit
  const subPosts = posts.filter(p => p.subreddit === subData.id)

  // useLayoutEffect (Lab 12): measures banner DOM size before browser paints
  // Adjusts header overlap so avatar sits correctly
  useLayoutEffect(() => {
    if (bannerRef.current && headerRef.current) {
      const bannerHeight = bannerRef.current.getBoundingClientRect().height
      // Could dynamically adjust avatar overlap based on actual rendered banner height
      headerRef.current.style.marginTop = '0px'
    }
  }, [subName])

  const isJoined = joinedSubs.has(subData.id)

  return (
    <div style={{ marginTop: 0, paddingTop: 0 }}>
      {/* Banner */}
      <div
        ref={bannerRef}
        className="subreddit-banner"
        style={{ background: subData.banner }}
      />

      {/* Header bar */}
      <div className="subreddit-header-bar" ref={headerRef}>
        <div className="subreddit-header-inner">
          <div className="subreddit-avatar" style={{ background: subData.color }}>
            {subData.icon}
          </div>
          <div>
            <h1 className="subreddit-name-heading">{subData.display}</h1>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>r/{subData.name}</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Context: join state synced globally */}
            <button
              className={`btn ${isJoined ? 'btn-outline' : 'btn-fill'}`}
              onClick={() => toggleJoin(subData.id)}
            >
              {isJoined ? 'Joined ✓' : 'Join'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="feed-layout">
        <div className="feed-main">
          <div className="sort-bar">
            {['🔥 Hot', '✨ New', '📈 Top'].map(s => (
              <button key={s} className="sort-btn">{s}</button>
            ))}
          </div>

          {subPosts.length > 0 ? (
            subPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No posts yet</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Be the first to post in {subData.display}!</div>
              <Link to="/submit" className="btn btn-fill" style={{ textDecoration: 'none' }}>Create Post</Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="feed-sidebar">
          <div className="sidebar-card">
            <div style={{ height: '48px', background: subData.color, borderRadius: '4px 4px 0 0' }} />
            <div className="sidebar-card-body">
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', fontFamily: "'Syne', sans-serif" }}>{subData.display}</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{subData.description}</p>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{formatNumber(subData.members)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Members</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#46d160' }}>● {formatNumber(subData.online)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Online</div>
                </div>
              </div>
              <hr style={{ borderColor: 'var(--border)', marginBottom: '12px' }} />
              <button className={`btn ${isJoined ? 'btn-outline' : 'btn-fill'}`} style={{ width: '100%' }} onClick={() => toggleJoin(subData.id)}>
                {isJoined ? 'Leave Community' : 'Join Community'}
              </button>
            </div>
          </div>

          {subData.rules && (
            <div className="sidebar-card">
              <div className="sidebar-card-header">📜 Community Rules</div>
              <div className="sidebar-card-body" style={{ padding: '8px 12px' }}>
                {subData.rules.map((rule, i) => (
                  <div key={i} style={{ padding: '8px 0', fontSize: '13px', borderBottom: i < subData.rules.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{i + 1}.</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}