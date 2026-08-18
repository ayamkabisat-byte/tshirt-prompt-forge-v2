import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import BenchmarkLab from './BenchmarkLab.jsx'
import './styles.css'
import './benchmark.css'

const benchmarkMode = new URLSearchParams(window.location.search).get('benchmark') === '1'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {benchmarkMode ? (
      <BenchmarkLab />
    ) : (
      <>
        <App />
        <a className="benchmark-launch" href="?benchmark=1">Phase D Benchmark Lab</a>
      </>
    )}
  </StrictMode>,
)
