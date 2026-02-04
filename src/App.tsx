import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import RadarView from './pages/RadarView'
import TimelineView from './pages/TimelineView'
import ScatterView from './pages/ScatterView'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-primary-600">
                  Model Arena
                </h1>
                <div className="hidden md:flex space-x-4">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/radar"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Radar Chart
                  </NavLink>
                  <NavLink
                    to="/timeline"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Timeline
                  </NavLink>
                  <NavLink
                    to="/scatter"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Scatter Plot
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container-custom py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/radar" element={<RadarView />} />
            <Route path="/timeline" element={<TimelineView />} />
            <Route path="/scatter" element={<ScatterView />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="container-custom py-6">
            <p className="text-center text-sm text-gray-600">
              Model Arena - Interactive LLM Benchmark Visualizations
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
