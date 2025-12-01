import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import oguGif from './assets/ogu.gif'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <link rel="icon" href={oguGif} type="image/gif" />
    <App />
  </StrictMode>,
)
