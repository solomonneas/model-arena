import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from '@/pages/Home'
import RadarView from '@/pages/RadarView'
import TimelineView from '@/pages/TimelineView'
import ScatterView from '@/pages/ScatterView'
import ComparisonView from '@/pages/ComparisonView'

function V2App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-sm text-gray-400 hover:text-gray-200">
                ← Variants
              </Link>
              <h1 className="text-xl font-bold text-purple-400">
                Model Arena
              </h1>
              <div className="hidden md:flex space-x-4">
                <NavLink
                  to="/2"
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/2/radar"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Radar Chart
                </NavLink>
                <NavLink
                  to="/2/timeline"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Timeline
                </NavLink>
                <NavLink
                  to="/2/scatter"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Scatter Plot
                </NavLink>
                <NavLink
                  to="/2/comparison"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-purple-900/50 text-purple-300'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Comparison Table
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-custom py-8">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="container-custom py-6">
          <p className="text-center text-sm text-gray-400">
            Variant 2: Dark Neon — Model Arena
          </p>
        </div>
      </footer>
    </div>
  )
}

export default V2App
