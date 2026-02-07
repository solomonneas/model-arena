import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './pages/Home'
import RadarView from './pages/RadarView'
import TimelineView from './pages/TimelineView'
import ScatterView from './pages/ScatterView'
import ComparisonView from './pages/ComparisonView'
import BarChartView from './pages/BarChartView'
import './styles.css'

const navItems = [
  { to: '/5', label: 'Ecosystem', icon: '🌿', end: true },
  { to: '/5/radar', label: 'Radar', icon: '🌸', end: false },
  { to: '/5/timeline', label: 'Timeline', icon: '🌱', end: false },
  { to: '/5/scatter', label: 'Scatter', icon: '🍃', end: false },
  { to: '/5/comparison', label: 'Compare', icon: '🌾', end: false },
  { to: '/5/charts', label: 'Charts', icon: '📊', end: false },
]

function WaveDivider() {
  return (
    <div className="v5-wave-divider">
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 20C200 8 300 32 500 20C700 8 900 32 1200 20V40H0Z"
          fill="#F5EFE6"
          fillOpacity="0.6"
        />
        <path
          d="M0 25C150 15 350 35 600 22C850 9 1050 30 1200 25"
          stroke="#D4C4A8"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  )
}

function V5App() {
  return (
    <div className="v5-organic min-h-screen flex flex-col">
      {/* ====== NAVIGATION ====== */}
      <nav className="v5-nav">
        <div className="flex items-center max-w-6xl mx-auto px-2">
          <Link
            to="/"
            className="text-xs text-[#B8A88A] hover:text-[#2D5016] transition-all duration-500 mr-3 flex-shrink-0"
            style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem' }}
          >
            ← back to variants
          </Link>

          <div className="w-px h-5 bg-[#D4C4A8] mx-2" />

          <span
            className="mr-4 flex-shrink-0"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#2D5016',
              letterSpacing: '-0.01em',
            }}
          >
            Model Arena
          </span>

          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `v5-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
          <Route path="charts" element={<BarChartView />} />
        </Routes>
      </main>

      {/* ====== WAVE DIVIDER ====== */}
      <WaveDivider />

      {/* ====== FOOTER ====== */}
      <footer className="v5-footer">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: '#B8A88A' }}>
            grown with care 🌱
          </span>
          <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '0.7rem', color: '#D4C4A8' }}>
            Model Arena — Variant 5: Organic
          </span>
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#B8A88A' }}>
            living data 🌿
          </span>
        </div>
      </footer>
    </div>
  )
}

export default V5App
