import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from './pages/Home'
import RadarView from './pages/RadarView'
import TimelineView from './pages/TimelineView'
import ScatterView from './pages/ScatterView'
import ComparisonView from './pages/ComparisonView'
import BarChartView from './pages/BarChartView'
import DocsPage from '@/pages/DocsPage'
import './styles.css'

const navItems = [
  { to: '/1', label: 'HOME', end: true, tour: 'model-cards' },
  { to: '/1/comparison', label: 'TABLE', end: false, tour: 'comparison-table' },
  { to: '/1/radar', label: 'RADAR', end: false, tour: 'radar-chart' },
  { to: '/1/timeline', label: 'TIMELINE', end: false, tour: '' },
  { to: '/1/scatter', label: 'SCATTER', end: false, tour: 'scatter-plot' },
  { to: '/1/bars', label: 'BARS', end: false, tour: 'bar-chart' },
  { to: '/1/docs', label: 'DOCS', end: false, tour: '' },
]

function V1App() {
  return (
    <div className="v1-brutalist min-h-screen flex flex-col">
      {/* ====== NAVIGATION ====== */}
      <nav className="v1-nav">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12 gap-0">
            {/* Back link */}
            <Link
              to="/"
              data-tour="variant-picker"
              className="text-[#555] hover:text-[#FFF] hover:bg-transparent text-xs uppercase tracking-[0.15em] mr-4 shrink-0"
            >
              ← VARIANTS
            </Link>

            {/* Divider */}
            <span className="pipe text-[#333] mx-2 select-none">│</span>

            {/* Site title */}
            <span className="text-[#FF6600] font-bold text-xs uppercase tracking-[0.2em] mr-4 shrink-0 font-['Archivo_Black']">
              MODEL ARENA
            </span>

            <span className="pipe text-[#333] mx-2 select-none">│</span>

            {/* Nav items */}
            <div className="flex items-center overflow-x-auto" data-tour="chart-nav">
              {navItems.map((item, i) => (
                <div key={item.to} className="flex items-center shrink-0">
                  {i > 0 && <span className="pipe text-[#333] mx-2 select-none">|</span>}
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `px-2 py-1 ${isActive ? 'active text-[#FF6600]' : ''}`
                    }
                    {...(item.tour ? { 'data-tour': item.tour } : {})}
                  >
                    {item.label}
                  </NavLink>
                </div>
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
          <Route path="bars" element={<BarChartView />} />
          <Route path="docs" element={<DocsPage />} />
        </Routes>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="v1-footer mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
            <span className="text-[#555]">
              VARIANT 01 // BRUTALIST / RAW CONCRETE
            </span>
            <span className="text-[#333]">
              MODEL ARENA — LLM BENCHMARK VISUALIZATIONS
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default V1App
