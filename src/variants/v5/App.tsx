import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from '@/pages/Home'
import RadarView from '@/pages/RadarView'
import TimelineView from '@/pages/TimelineView'
import ScatterView from '@/pages/ScatterView'
import ComparisonView from '@/pages/ComparisonView'

function V5App() {
  return (
    <div className="min-h-screen bg-gray-950 text-cyan-400 font-mono">
      {/* Navigation */}
      <nav className="bg-black border-b border-cyan-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-xs text-gray-500 hover:text-cyan-400">
                [← variants]
              </Link>
              <h1 className="text-lg font-bold text-cyan-300">
                &gt; model_arena
              </h1>
              <div className="hidden md:flex space-x-2">
                <NavLink
                  to="/5"
                  end
                  className={({ isActive }) =>
                    `px-3 py-1 rounded text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700'
                        : 'text-gray-500 hover:text-cyan-400 border border-transparent'
                    }`
                  }
                >
                  ~/home
                </NavLink>
                <NavLink
                  to="/5/radar"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700'
                        : 'text-gray-500 hover:text-cyan-400 border border-transparent'
                    }`
                  }
                >
                  ~/radar
                </NavLink>
                <NavLink
                  to="/5/timeline"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700'
                        : 'text-gray-500 hover:text-cyan-400 border border-transparent'
                    }`
                  }
                >
                  ~/timeline
                </NavLink>
                <NavLink
                  to="/5/scatter"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700'
                        : 'text-gray-500 hover:text-cyan-400 border border-transparent'
                    }`
                  }
                >
                  ~/scatter
                </NavLink>
                <NavLink
                  to="/5/comparison"
                  className={({ isActive }) =>
                    `px-3 py-1 rounded text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700'
                        : 'text-gray-500 hover:text-cyan-400 border border-transparent'
                    }`
                  }
                >
                  ~/compare
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-cyan-800/50 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-xs text-gray-600">
            // variant_5: terminal — model_arena v0.1.0
          </p>
        </div>
      </footer>
    </div>
  )
}

export default V5App
