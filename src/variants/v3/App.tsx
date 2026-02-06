import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from '@/pages/Home'
import RadarView from '@/pages/RadarView'
import TimelineView from '@/pages/TimelineView'
import ScatterView from '@/pages/ScatterView'
import ComparisonView from '@/pages/ComparisonView'

function V3App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-10">
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 tracking-wide uppercase">
                ← Variants
              </Link>
              <h1 className="text-lg font-light tracking-widest text-gray-900 uppercase">
                Model Arena
              </h1>
              <div className="hidden md:flex space-x-6">
                <NavLink
                  to="/3"
                  end
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm tracking-wide transition-colors duration-200 ${
                      isActive
                        ? 'text-emerald-600 border-b-2 border-emerald-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/3/radar"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm tracking-wide transition-colors duration-200 ${
                      isActive
                        ? 'text-emerald-600 border-b-2 border-emerald-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`
                  }
                >
                  Radar
                </NavLink>
                <NavLink
                  to="/3/timeline"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm tracking-wide transition-colors duration-200 ${
                      isActive
                        ? 'text-emerald-600 border-b-2 border-emerald-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`
                  }
                >
                  Timeline
                </NavLink>
                <NavLink
                  to="/3/scatter"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm tracking-wide transition-colors duration-200 ${
                      isActive
                        ? 'text-emerald-600 border-b-2 border-emerald-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`
                  }
                >
                  Scatter
                </NavLink>
                <NavLink
                  to="/3/comparison"
                  className={({ isActive }) =>
                    `px-2 py-1 text-sm tracking-wide transition-colors duration-200 ${
                      isActive
                        ? 'text-emerald-600 border-b-2 border-emerald-500'
                        : 'text-gray-500 hover:text-gray-900'
                    }`
                  }
                >
                  Compare
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-12">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <p className="text-center text-xs text-gray-400 tracking-widest uppercase">
            Variant 3: Minimal Zen — Model Arena
          </p>
        </div>
      </footer>
    </div>
  )
}

export default V3App
