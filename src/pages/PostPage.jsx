import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useVote } from '../hooks/useVote'
import Comment from '../components/Comment'
import { posts, commentsByPost, subreddits, formatNumber } from '../data/sampleData'

export default function PostPage() {
  // Dynamic route: extracts :postId from URL
  const { postId } = useParams()

  const [loading, setLoading] = useState(true)
  // Local state: comment text is scoped only to this page (Lab 11 reflection: doesn't need Context)
  const [commentText, setCommentText] = useState('')
  const [localComments, setLocalComments] = useState([])

  // Find post from our mock data
  const post = posts.find(p => p.id === postId)
  const subData = post ? subreddits.find(s => s.id === post.subreddit) : null

  // useVote: reusable voting logic, same hook as PostCard
  const { score, voteState, vote } = useVote(post?.score || 0)

  // useEffect: simulate fetching post + comments when postId changes
  useEffect(() => {
    setLoading(true)
    setLocalComments([])
    const timer = setTimeout(() => {
      setLocalComments(commentsByPost[postId] || [])
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer) // cleanup
  }, [postId]) // re-runs only when postId changes

  const handleSubmitComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    const newComment = {
      id: `new-${Date.now()}`,
      author: 'you',
      score: 1,
      timeAgo: 'just now',
      body: trimmed,
      replies: [],
    }
    setLocalComments(prev => [newComment, ...prev])
    setCommentText('')
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
        <h2>Post not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>This post may have been removed.</p>
        <Link to="/" className="btn btn-fill" style={{ textDecoration: 'none' }}>Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="feed-layout">
      <div className="feed-main">
        {/* Full post */}
        <div className="post-full">
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Vote column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '32px' }}>
              <button className={`vote-btn up ${voteState === 1 ? 'voted-up' : ''}`} onClick={() => vote(1)}>▲</button>
              <span className={`vote-count ${voteState === 1 ? 'voted-up' : voteState === -1 ? 'voted-down' : ''}`}>
                {formatNumber(score)}
              </span>
              <button className={`vote-btn down ${voteState === -1 ? 'voted-down' : ''}`} onClick={() => vote(-1)}>▼</button>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div className="post-meta" style={{ marginBottom: '8px' }}>
                <Link to={`/r/${post.subreddit.replace('r/', '')}`} className="subreddit-link">{post.subreddit}</Link>
                <span>•</span>
                <span>Posted by u/{post.author}</span>
                <span>•</span>
                <span>{post.timeAgo}</span>
              </div>

              <h1 className="post-full-title">
                {post.flair && <span className="post-flair">{post.flair}</span>}
                {post.title}
              </h1>

              {post.body && <p className="post-full-body">{post.body}</p>}

              <div className="post-actions">
                <span className="action-btn">💬 {formatNumber(post.numComments)} Comments</span>
                <button className="action-btn">🔗 Share</button>
                <button className="action-btn">⭐ Save</button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="comments-section">
          <h3 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {formatNumber(post.numComments)} Comments
          </h3>

          {/* Comment input */}
          <div className="comment-input-box">
            <textarea
              placeholder="What are your thoughts?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-fill"
                disabled={!commentText.trim()}
                onClick={handleSubmitComment}
              >
                Comment
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <div className="loading-spinner" />
            </div>
          ) : localComments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
              No comments yet. Be the first!
            </div>
          ) : (
            localComments.map(comment => <Comment key={comment.id} comment={comment} />)
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="feed-sidebar">
        {subData && (
          <div className="sidebar-card">
            <div style={{ height: '48px', background: subData.color, borderRadius: '4px 4px 0 0' }} />
            <div className="sidebar-card-body">
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', fontFamily: "'Syne', sans-serif" }}>{subData.display}</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{subData.description}</p>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{formatNumber(subData.members)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Members</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#46d160' }}>● {formatNumber(subData.online)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Online</div>
                </div>
              </div>
              <Link to={`/r/${subData.name}`} className="btn btn-fill" style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Visit Community
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
