import { useState } from 'react'

export function useVote(initialScore, initialVoteState = 0) {
  const [voteState, setVoteState] = useState(initialVoteState)
  const [score, setScore] = useState(initialScore)

  const vote = (dir) => {
    if (voteState === dir) {
      // Clicking same direction = undo vote
      setVoteState(0)
      setScore(initialScore)
    } else {
      // Delta: e.g. going from downvote(-1) to upvote(1) = +2
      const delta = dir - voteState
      setVoteState(dir)
      setScore(initialScore + delta)
    }
  }

  return { score, voteState, vote }
}
