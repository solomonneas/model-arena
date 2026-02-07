import { Routes, Route, NavLink, Link } from 'react-router-dom'
import { Model } from '@/types/model'
import { calculateAverageBenchmark } from '@/utils/formatters'
import Home from './pages/Home'
import RadarView from './pages/RadarView'
import TimelineView from './pages/TimelineView'
import ScatterView from './pages/ScatterView'
import ComparisonView from './pages/ComparisonView'
import BarChartView from './pages/BarChartView'
import './styles.css'
import modelsData from '../../../data/models.json'

const models: Model[] = modelsData.models

const totalModels = models.length
const providers = [...new Set(models.map(m => m.provider))]
const avgScore = (models.reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) / models.length).toFixed(1)
const topModel = [...models].sort((a, b) => calculateAverageBenchmark(b.benchmarks) - calculateAverageBenchmark(a.benchmarks))[0]
const latestModel = [...models].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())[0]

const navItems = [
  { to: '/4', label: 'OVERVIEW', icon: '◉', end: true },
  { to: '/4/radar', label: 'RADAR', icon: '◎', end: false },
  { to: '/4/timeline', label: 'TIMELINE', icon: '▸', end: false },
  { to: '/4/scatter', label: 'SCATTER', icon: '⬡', end: false },
  { to: '/4/comparison', label: 'DATA TABLE', icon: '≡', end: false },
  { to: '/4/bars', label: 'BAR CHARTS', icon: '▥', end: false },
]

function V4App() {
  return (
    <div className="v4-noc min-h-screen flex flex-col">
      {/* ====== STATUS BAR ====== */}
      <div className="v4-status-bar">
        <div className="flex items-stretch overflow-x-auto">
          <div className="v4-status-item">
            <span className="v4-status-dot v4-status-dot--green" />
            <span className="v4-status-label">SYS</span>
            <span className="v4-status-value" style={{ color: '#22C55E' }}>NOMINAL</span>
          </div>
          <div className="v4-status-item">
            <span className="v4-status-label">MODELS</span>
            <span className="v4-status-value">{totalModels}</span>
          </div>
          <div className="v4-status-item">
            <span className="v4-status-label">PROVIDERS</span>
            <span className="v4-status-value">{providers.length}</span>
          </div>
          <div className="v4-status-item">
            <span className="v4-status-label">AVG SCORE</span>
            <span className="v4-status-value" style={{ color: '#3B82F6' }}>{avgScore}</span>
          </div>
          <div className="v4-status-item">
            <span className="v4-status-dot v4-status-dot--blue" />
            <span className="v4-status-label">TOP</span>
            <span className="v4-status-value">{topModel.name}</span>
          </div>
          <div className="v4-status-item">
            <span className="v4-status-dot v4-status-dot--amber" />
            <span className="v4-status-label">LATEST</span>
            <span className="v4-status-value">{latestModel.name}</span>
          </div>
          <div className="v4-status-item" style={{ marginLeft: 'auto', borderRight: 'none', borderLeft: '1px solid #1E3A5F' }}>
            <span className="v4-status-label">UPDATED</span>
            <span className="v4-status-value">{modelsData.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* ====== NAVIGATION ====== */}
      <nav className="v4-nav">
        <div className="flex items-center px-3">
          <Link
            to="/"
            className="text-xs text-[#475569] hover:text-[#3B82F6] transition-colors mr-3 py-2 flex-shrink-0"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}
          >
            ← VARIANTS
          </Link>

          <div className="w-px h-6 bg-[#1E3A5F] mr-2" />

          <span
            className="text-sm font-semibold tracking-wider mr-4 flex-shrink-0"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#3B82F6', letterSpacing: '0.15em' }}
          >
            MODEL ARENA
          </span>

          <div className="w-px h-6 bg-[#1E3A5F] mr-1" />

          <div className="flex items-stretch overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `v4-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* ====== MAIN CONTENT ====== */}
      <main className="flex-1 px-3 py-3">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
          <Route path="bars" element={<BarChartView />} />
        </Routes>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="v4-footer">
        <div className="flex items-center justify-between px-4">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#475569' }}>
            V4 // NOC DARK OPERATOR
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#475569' }}>
            MODEL ARENA — LLM BENCHMARK MONITOR
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#1E3A5F' }}>
            ■■■ SECURE ■■■
          </span>
        </div>
      </footer>
    </div>
  )
}

export default V4App
