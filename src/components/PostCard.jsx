import { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVote } from '../hooks/useVote'
import { formatNumber } from '../data/sampleData'

const PostCard = memo(function PostCard({ post }) {
  const navigate = useNavigate()
  const { score, voteState, vote } = useVote(post.score)

  const handleCardClick = () => {
    navigate(`/post/${post.id}`)
  }

  return (
    <div className="post-card" onClick={handleCardClick}>
      {/* Vote column */}
      <div className="vote-col">
        <button
          className={`vote-btn up ${voteState === 1 ? 'voted-up' : ''}`}
          onClick={(e) => { e.stopPropagation(); vote(1) }}
          title="Upvote"
        >▲</button>
        <span className={`vote-count ${voteState === 1 ? 'voted-up' : voteState === -1 ? 'voted-down' : ''}`}>
          {formatNumber(score)}
        </span>
        <button
          className={`vote-btn down ${voteState === -1 ? 'voted-down' : ''}`}
          onClick={(e) => { e.stopPropagation(); vote(-1) }}
          title="Downvote"
        >▼</button>
      </div>

      {/* Post content */}
      <div className="post-body">
        <div className="post-meta">
          {/* Link (React Router): navigate to subreddit without page reload */}
          <Link
            to={`/r/${post.subreddit.replace('r/', '')}`}
            className="subreddit-link"
            onClick={(e) => e.stopPropagation()}
          >
            {post.subreddit}
          </Link>
          <span>•</span>
          <span>Posted by u/{post.author}</span>
          <span>•</span>
          <span>{post.timeAgo}</span>
        </div>

        <div className="post-title">
          {post.flair && <span className="post-flair">{post.flair}</span>}
          {post.title}
        </div>

        {post.body && <p className="post-preview-text">{post.body}</p>}

        <div className="post-actions">
          <Link
            to={`/post/${post.id}`}
            className="action-btn"
            onClick={(e) => e.stopPropagation()}
          >
            💬 {formatNumber(post.numComments)} Comments
          </Link>
          <button className="action-btn" onClick={(e) => e.stopPropagation()}>🔗 Share</button>
          <button className="action-btn" onClick={(e) => e.stopPropagation()}>⭐ Save</button>
        </div>
      </div>
    </div>
  )
})

export default PostCard