import { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVote } from '../hooks/useVote'
import { formatNumber } from '../data/sampleData'

const PostCard = memo(function PostCard({ post }) {
  const navigate = useNavigate()
  const { score, voteState, vote } = useVote(post.score)
  const [imgError, setImgError] = useState(false)

  const handleCardClick = () => navigate(`/post/${post.id}`)
  const showImage = post.image && !imgError

  return (
    <div className="post-card-mobile" onClick={handleCardClick}>

      <div className="pcm-meta">
        <Link
          to={`/r/${post.subreddit.replace('r/', '')}`}
          className="pcm-subreddit"
          onClick={e => e.stopPropagation()}
        >
          {post.subreddit}
        </Link>
        <span className="pcm-dot">•</span>
        <span className="pcm-author">u/{post.author}</span>
        <span className="pcm-dot">•</span>
        <span className="pcm-time">{post.timeAgo}</span>
      </div>

      <div className="pcm-title">
        {post.flair && <span className="post-flair">{post.flair}</span>}
        {post.title}
      </div>

      {showImage && (
        <div className="pcm-image-wrap">
          <img
            src={post.image}
            alt={post.title}
            className="pcm-image"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {!showImage && post.body && (
        <p className="pcm-body-preview">{post.body}</p>
      )}

      <div className="pcm-actions">
        <div className="pcm-vote-group" onClick={e => e.stopPropagation()}>
          <button
            className={`pcm-vote-btn ${voteState === 1 ? 'voted-up' : ''}`}
            onClick={() => vote(1)}
          >▲</button>
          <span className={`pcm-score ${voteState === 1 ? 'voted-up' : voteState === -1 ? 'voted-down' : ''}`}>
            {formatNumber(score)}
          </span>
          <button
            className={`pcm-vote-btn ${voteState === -1 ? 'voted-down' : ''}`}
            onClick={() => vote(-1)}
          >▼</button>
        </div>

        <Link
          to={`/post/${post.id}`}
          className="pcm-action-btn"
          onClick={e => e.stopPropagation()}
        >
          💬 {formatNumber(post.numComments)}
        </Link>

        <button className="pcm-action-btn" onClick={e => e.stopPropagation()}>
          🔗 Share
        </button>

        <button className="pcm-action-btn" onClick={e => e.stopPropagation()}>
          ⭐ Save
        </button>
      </div>
    </div>
  )
})

export default PostCard