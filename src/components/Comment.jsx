import { useState } from "react";
import { useVote } from '../hooks/useVote';
import { formatNumber } from '../data/sampleData';

export default function Comment({ comment, depth = 0 }) {
  const { score, voteState, vote } = useVote(comment.score)
  const [collapsed, setCollapsed] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  return (
    <div className="comment" style={{ marginLeft: depth > 0 ? '16px' : '0' }}>
      <div className="comment-header">
        <span className="comment-author">u/{comment.author}</span>
        <span className="comment-time">{comment.timeAgo}</span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px' }}
        >
          [{collapsed ? '+' : '−'}]
        </button>
      </div>

      {!collapsed && (
        <>
          <p className="comment-body">{comment.body}</p>
          <div className="comment-actions">
            <button className={`vote-btn up ${voteState === 1 ? 'voted-up' : ''}`} onClick={() => vote(1)}>▲</button>
            <span className="comment-score" style={{ color: voteState === 1 ? 'var(--upvote)' : voteState === -1 ? 'var(--downvote)' : 'var(--text-secondary)' }}>
              {formatNumber(score)}
            </span>
            <button className={`vote-btn down ${voteState === -1 ? 'voted-down' : ''}`} onClick={() => vote(-1)}>▼</button>
            <button className="action-btn" onClick={() => setShowReply(!showReply)}>💬 Reply</button>
          </div>

          {showReply && (
            <div className="comment-input-box" style={{ marginTop: '8px' }}>
              <textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ minHeight: '60px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-fill"
                  style={{ fontSize: '12px', padding: '4px 14px' }}
                  onClick={() => { setShowReply(false); setReplyText('') }}
                >
                  Reply
                </button>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: '12px', padding: '4px 14px' }}
                  onClick={() => { setShowReply(false); setReplyText('') }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Recursive: render nested replies */}
          {comment.replies?.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              {comment.replies.map(reply => (
                <Comment key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
