import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import Sidebar from '../components/Sidebar'
import { posts } from '../data/sampleData'

const SORT_OPTIONS = [
  { key: 'hot', label: '🔥 Hot' },
  { key: 'new', label: '✨ New' },
  { key: 'top', label: '📈 Top' },
  { key: 'rising', label: '🚀 Rising' },
]

export default function Home() {
  const [sort, setSort] = useState('hot')
  const [loading, setLoading] = useState(true)

  // Reads query from URL
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  // Simulates data loading (in real app: fetch from API)
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer) // cleanup — prevents memory leak
  }, [])

  // Stable sort setter — prevents PostCard children re-renders
  const handleSort = useCallback((key) => {
    setSort(key)
  }, [])

  // Only recalculates when sort or searchQuery changes
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        p => p.title.toLowerCase().includes(q) ||
             p.body.toLowerCase().includes(q) ||
             p.subreddit.toLowerCase().includes(q)
      )
    }

    if (sort === 'new') result.sort((a, b) => parseInt(b.id) - parseInt(a.id))
    else if (sort === 'top') result.sort((a, b) => b.score - a.score)
    else if (sort === 'rising') result.sort((a, b) => b.numComments - a.numComments)
    // 'hot' uses default order

    return result
  }, [sort, searchQuery])

  return (
    <div className="feed-layout">
      <div className="feed-main">
        {/* Sort bar */}
        <div className="sort-bar">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className={`sort-btn ${sort === opt.key ? 'active' : ''}`}
              onClick={() => handleSort(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search indicator */}
        {searchQuery && (
          <div style={{ padding: '8px 12px', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Showing results for: <strong style={{ color: 'var(--text-primary)' }}>{searchQuery}</strong>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="loading-screen" style={{ minHeight: '300px' }}>
            <div className="loading-spinner" />
            <span>Loading posts...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No results found</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Try a different search term</div>
          </div>
        ) : (
          // React.memo on PostCard: stable props mean no unnecessary re-renders
          filteredPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>

      <aside className="feed-sidebar">
        <Sidebar />
      </aside>
    </div>
  )
}