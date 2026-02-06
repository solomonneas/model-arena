import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VariantPicker from './pages/VariantPicker'
import V1App from './variants/v1/App'
import V2App from './variants/v2/App'
import V3App from './variants/v3/App'
import V4App from './variants/v4/App'
import V5App from './variants/v5/App'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VariantPicker />} />
        <Route path="/1/*" element={<V1App />} />
        <Route path="/2/*" element={<V2App />} />
        <Route path="/3/*" element={<V3App />} />
        <Route path="/4/*" element={<V4App />} />
        <Route path="/5/*" element={<V5App />} />
      </Routes>
    </Router>
  )
}

export default App
