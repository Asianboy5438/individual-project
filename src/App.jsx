import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import './App.css'

// React.lazy: code-split non-critical pages (Lab 13)
const SubredditPage = lazy(() => import('./pages/SubredditPage'))
const PostPage = lazy(() => import('./pages/PostPage'))
const PostLayout = lazy(() => import('./pages/PostLayout'))
const SubmitPage = lazy(() => import('./pages/SubmitPage'))

const LoadingFallback = () => (
  <div className="loading-screen">
    <div className="loading-spinner" />
    <span>Loading...</span>
  </div>
)

export default function App() {
  // Context API (Lab 11): darkMode from global context, no prop drilling
  const { darkMode } = useAppContext()

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <main className="page-content">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Lab 9: Basic routes */}
            <Route path="/" element={<Home />} />

            {/* Lab 10: Dynamic route — subreddit name as URL param */}
            <Route path="/r/:subreddit" element={<SubredditPage />} />

            {/* Lab 10: Nested route — PostLayout provides shared "back" UI */}
            <Route path="/post/:postId" element={<PostLayout />}>
              <Route index element={<PostPage />} />
            </Route>

            {/* Submit form page */}
            <Route path="/submit" element={<SubmitPage />} />

            {/* Lab 9: Catch-all for unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}
