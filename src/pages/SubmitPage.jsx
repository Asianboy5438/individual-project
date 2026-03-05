import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { subreddits } from '../data/sampleData'

// Sanitization helpers 
const stripTags = (s) => String(s ?? '').replace(/<\/?[^>]+>/g, '')
const trimCollapse = (s) => String(s ?? '').trim().replace(/\s+/g, ' ')

const INITIAL_VALUES = { title: '', body: '', subreddit: '', flair: '' }
const INITIAL_ERRORS = { title: '', body: '', subreddit: '', flair: '', general: '' }

// Validation functions (called on blur and on submit)
const validateField = (name, value) => {
  switch (name) {
    case 'title':
      if (!value.trim()) return 'Title is required.'
      if (value.trim().length < 5) return 'Title must be at least 5 characters.'
      if (value.trim().length > 300) return 'Title must be 300 characters or fewer.'
      return ''
    case 'subreddit':
      if (!value) return 'Please choose a community.'
      return ''
    case 'body':
      if (value.length > 40000) return 'Post body cannot exceed 40,000 characters.'
      return ''
    default:
      return ''
  }
}

const validateAll = (values) => {
  return {
    title: validateField('title', values.title),
    body: validateField('body', values.body),
    subreddit: validateField('subreddit', values.subreddit),
    flair: '',
    general: '',
  }
}

export default function SubmitPage() {
  // Controlled form fields
  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()

  // onChange: update value + light validation (character count, instant feedback)
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error as user types (immediate positive feedback)
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // onBlur: validate field when user leaves it
  const handleBlur = (e) => {
    const { name, value } = e.target
    const errorMsg = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: errorMsg }))
  }

  // onSubmit: final gate — sanitize, validate all, submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Sanitize inputs before validation
    const sanitized = {
      title: trimCollapse(stripTags(values.title)),
      body: trimCollapse(stripTags(values.body)),
      subreddit: values.subreddit,
      flair: trimCollapse(stripTags(values.flair)),
    }

    // Validate all fields
    const newErrors = validateAll(sanitized)
    const hasErrors = Object.values(newErrors).some(e => e !== '')

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    // Prevent double submission
    if (submitting) return

    try {
      setSubmitting(true)

      // Simulate API call (in real app: await fetch('/api/posts', { method: 'POST', body: ... }))
      await new Promise(resolve => setTimeout(resolve, 800))

      setSuccessMessage('Post submitted successfully! Redirecting...')

      // Clear form after submission 
      setValues(INITIAL_VALUES)
      setErrors(INITIAL_ERRORS)

      // useNavigate with replace (Lab 10): prevent going back to empty form
      setTimeout(() => navigate('/', { replace: true }), 1500)

    } catch (err) {
      // catch: server/network error
      setErrors(prev => ({ ...prev, general: 'Something went wrong. Please try again.' }))
    } finally {
      setSubmitting(false)
    }
  }

  const titleLen = values.title.length
  const bodyLen = values.body.length

  return (
    <div className="form-page">
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
        Create a Post
      </h1>

      <div className="form-card">
        <div className="form-card-header">Post Details</div>

        {/* No <form> tag — using onSubmit handler pattern */}
        <div className="form-card-body">

          {/* Success message */}
          {successMessage && <div className="form-success">✅ {successMessage}</div>}

          {/* General error */}
          {errors.general && <div className="form-general-error">⚠️ {errors.general}</div>}

          {/* Community select — onChange validate (Lab 7) */}
          <div className="form-field">
            <label className="form-label">Community *</label>
            <select
              name="subreddit"
              value={values.subreddit}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.subreddit ? 'error' : ''}`}
              style={{ height: '40px', cursor: 'pointer' }}
            >
              <option value="">Choose a community...</option>
              {subreddits.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.display}</option>
              ))}
            </select>
            {errors.subreddit && <span className="form-error">⚠ {errors.subreddit}</span>}
          </div>

          {/* Title — onBlur validate (Lab 7) */}
          <div className="form-field">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              placeholder="An interesting title..."
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={300}
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {errors.title
                ? <span className="form-error">⚠ {errors.title}</span>
                : <span />
              }
              <span className={`char-count ${titleLen > 280 ? 'over' : ''}`}>{titleLen}/300</span>
            </div>
          </div>

          {/* Flair */}
          <div className="form-field">
            <label className="form-label">Flair (optional)</label>
            <input
              type="text"
              name="flair"
              placeholder="e.g. Discussion, Question, News..."
              value={values.flair}
              onChange={handleChange}
              maxLength={64}
              className="form-input"
            />
          </div>

          {/* Body — onBlur validate */}
          <div className="form-field">
            <label className="form-label">Body (optional)</label>
            <textarea
              name="body"
              placeholder="Share your thoughts, links, or details..."
              value={values.body}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={40000}
              className={`form-textarea ${errors.body ? 'error' : ''}`}
              style={{ minHeight: '160px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {errors.body
                ? <span className="form-error">⚠ {errors.body}</span>
                : <span />
              }
              <span className={`char-count ${bodyLen > 39000 ? 'over' : ''}`}>{bodyLen}/40,000</span>
            </div>
          </div>

          {/* Submit actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            {/* disabled if submitting — prevents duplicate submissions (Lab 7) */}
            <button
              className="btn btn-fill"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}