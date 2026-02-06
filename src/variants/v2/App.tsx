import { Routes, Route, NavLink, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import RadarView from './pages/RadarView'
import TimelineView from './pages/TimelineView'
import ScatterView from './pages/ScatterView'
import ComparisonView from './pages/ComparisonView'
import './styles.css'

const navItems = [
  { to: '/2', label: 'HOME', end: true },
  { to: '/2/comparison', label: 'TABLE', end: false },
  { to: '/2/radar', label: 'RADAR', end: false },
  { to: '/2/timeline', label: 'TIMELINE', end: false },
  { to: '/2/scatter', label: 'SCATTER', end: false },
]

function V2App() {
  const [systemTime, setSystemTime] = useState('')
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setSystemTime(
        now.toLocaleTimeString('en-US', { hour12: false }) +
        '.' +
        String(now.getMilliseconds()).padStart(3, '0')
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="v2-synthwave min-h-screen flex flex-col">
      {/* ====== SYSTEM STATUS BAR ====== */}
      <div className="v2-status-bar">
        <div className="flex items-center gap-3">
          <span className="v2-status-dot" />
          <span className="text-[#39FF14]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            SYSTEM STATUS: ONLINE
          </span>
          <span className="text-[#2A2A4E]">│</span>
          <span>NODE: ARENA-01</span>
          <span className="text-[#2A2A4E]">│</span>
          <span>PROC: NOMINAL</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UPTIME: {formatUptime(uptime)}</span>
          <span className="text-[#2A2A4E]">│</span>
          <span className="text-[#FF00FF]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {systemTime}
          </span>
        </div>
      </div>

      {/* ====== NAVIGATION ====== */}
      <nav className="v2-nav">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12 gap-0">
            {/* Back link */}
            <Link
              to="/"
              className="text-[#4A4A6A] hover:text-[#FF00FF] text-xs uppercase tracking-[0.15em] mr-4 shrink-0"
              style={{ fontFamily: "'IBM Plex Mono', monospace", textDecoration: 'none' }}
            >
              ← VARIANTS
            </Link>

            <span className="text-[#2A2A4E] mx-2 select-none">│</span>

            {/* Site title */}
            <span
              className="text-[#FF00FF] font-bold text-xs uppercase tracking-[0.2em] mr-4 shrink-0 v2-glow-magenta"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              MODEL ARENA
            </span>

            <span className="text-[#2A2A4E] mx-2 select-none">│</span>

            {/* Nav tabs */}
            <div className="flex items-center overflow-x-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `v2-nav-tab ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
        </Routes>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="v2-footer mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
            <span className="text-[#4A4A6A]">
              VARIANT 02 // RETRO-FUTURISTIC / SYNTHWAVE TERMINAL
            </span>
            <span className="text-[#2A2A4E]">
              MODEL ARENA — LLM BENCHMARK VISUALIZATIONS
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default V2App
