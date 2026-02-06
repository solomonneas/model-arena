import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Home from '@/pages/Home'
import RadarView from '@/pages/RadarView'
import TimelineView from '@/pages/TimelineView'
import ScatterView from '@/pages/ScatterView'
import ComparisonView from '@/pages/ComparisonView'

function V4App() {
  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b-2 border-amber-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← Variants
              </Link>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Model Arena
              </h1>
              <div className="hidden md:flex space-x-4">
                <NavLink
                  to="/4"
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'text-gray-700 hover:bg-amber-50'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/4/radar"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'text-gray-700 hover:bg-amber-50'
                    }`
                  }
                >
                  Radar Chart
                </NavLink>
                <NavLink
                  to="/4/timeline"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'text-gray-700 hover:bg-amber-50'
                    }`
                  }
                >
                  Timeline
                </NavLink>
                <NavLink
                  to="/4/scatter"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'text-gray-700 hover:bg-amber-50'
                    }`
                  }
                >
                  Scatter Plot
                </NavLink>
                <NavLink
                  to="/4/comparison"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'text-gray-700 hover:bg-amber-50'
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
      <main className="max-w-6xl mx-auto px-6 py-10">
        <Routes>
          <Route index element={<Home />} />
          <Route path="radar" element={<RadarView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="scatter" element={<ScatterView />} />
          <Route path="comparison" element={<ComparisonView />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-amber-400 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-600 font-serif">
            Variant 4: Editorial — Model Arena
          </p>
        </div>
      </footer>
    </div>
  )
}

export default V4App
