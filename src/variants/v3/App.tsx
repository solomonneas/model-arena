import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './pages/Home'
import RadarView from './pages/RadarView'
import TimelineView from './pages/TimelineView'
import ScatterView from './pages/ScatterView'
import ComparisonView from './pages/ComparisonView'
import BarChartView from './pages/BarChartView'
import './styles.css'

const navItems = [
  { to: '/3', label: 'Home', end: true },
  { to: '/3/comparison', label: 'Compendium', end: false },
  { to: '/3/radar', label: 'Radar', end: false },
  { to: '/3/timeline', label: 'Chronicle', end: false },
  { to: '/3/scatter', label: 'Value', end: false },
  { to: '/3/charts', label: 'Charts', end: false },
]

function V3App() {
  return (
    <div className="v3-editorial min-h-screen flex flex-col">
      {/* ====== NAVIGATION ====== */}
      <nav className="v3-nav sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Left: back link */}
            <Link
              to="/"
              className="v3-label text-xs hover:text-[#C9A96E] transition-colors duration-400"
              style={{ textDecoration: 'none', fontSize: '0.6rem', letterSpacing: '0.15em' }}
            >
              ← Variants
            </Link>

            {/* Center: site title */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link
                to="/3"
                className="v3-headline text-base md:text-lg tracking-wide"
                style={{ textDecoration: 'none', letterSpacing: '0.15em', fontWeight: 400 }}
              >
                Model Arena
              </Link>
            </div>

            {/* Right: nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `v3-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile nav */}
            <div className="flex md:hidden items-center gap-4">
              {navItems.slice(0, 3).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `v3-nav-link ${isActive ? 'active' : ''}`
                  }
                  style={{ fontSize: '0.6rem' }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
          <Route path="charts" element={<BarChartView />} />
        </Routes>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="v3-footer">
        <div className="max-w-6xl mx-auto px-8 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="v3-label" style={{ fontSize: '0.55rem', letterSpacing: '0.3em' }}>
              Variant III · Luxury Editorial
            </div>
            <div
              className="v3-headline text-sm"
              style={{ fontWeight: 400, letterSpacing: '0.1em' }}
            >
              Model Arena
            </div>
            <div className="v3-label" style={{ fontSize: '0.55rem', letterSpacing: '0.3em' }}>
              LLM Benchmark Visualizations
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default V3App
