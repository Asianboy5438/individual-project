import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AppProvider } from './context/appContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* HashRouter: works on GitHub Pages without server config (per slides) */}
    <HashRouter>
      {/* AppProvider wraps everything so all routes can access global state */}
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </StrictMode>
)
