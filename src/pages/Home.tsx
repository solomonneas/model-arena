import { Link } from 'react-router-dom'
import { useModels } from '@/hooks/useModels'

function Home() {
  const { models, providerCount, maxContext } = useModels()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LLM Benchmark Visualizations
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore and compare {models.length} large language models across multiple
          benchmarks with interactive D3.js visualizations
        </p>
      </div>

      {/* Visualization Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/comparison" className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Comparison</h2>
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600">
            Interactive sortable table with filters, search, and detailed comparisons
          </p>
        </Link>

        <Link to="/radar" className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Radar Chart</h2>
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600">
            Compare models across multiple benchmark dimensions with interactive radar charts
          </p>
        </Link>

        <Link to="/timeline" className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Timeline</h2>
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">
            Visualize model releases over time and track performance improvements
          </p>
        </Link>

        <Link to="/scatter" className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Scatter Plot</h2>
            <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-gray-600">
            Explore relationships between benchmarks, pricing, and model characteristics
          </p>
        </Link>
      </div>

      {/* Models Overview */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Models Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Parameters</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">MMLU</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">HumanEval</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Context</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-4 font-medium text-gray-900">{model.name}</td>
                  <td className="py-3 px-4 text-gray-600">{model.provider}</td>
                  <td className="py-3 px-4 text-gray-600">{model.parameters}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{model.benchmarks.MMLU.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right text-gray-900">{model.benchmarks.HumanEval.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-gray-600">{(model.context_window / 1000).toFixed(0)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{models.length}</div>
          <div className="text-gray-600">Models</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {providerCount}
          </div>
          <div className="text-gray-600">Providers</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">8</div>
          <div className="text-gray-600">Benchmarks</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {maxContext / 1000}K
          </div>
          <div className="text-gray-600">Max Context</div>
        </div>
      </div>
    </div>
  )
}

export default Home
