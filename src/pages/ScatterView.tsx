import { useEffect, useState } from 'react'
import ScatterPlot from '@/components/ScatterPlot'
import { Model } from '@/types/model'
import modelsData from '../../data/models.json'

function ScatterView() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load models from JSON file
    const loadModels = async () => {
      try {
        setModels(modelsData.models)
      } catch (error) {
        console.error('Error loading models:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModels()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading models...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Price vs Performance</h1>
        <p className="text-gray-600">
          Explore the relationship between model pricing and benchmark performance
        </p>
      </div>

      <div className="card">
        <ScatterPlot models={models} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Understanding the Visualization</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>X-axis:</strong> Input price per 1M tokens (logarithmic scale)</li>
          <li>• <strong>Y-axis:</strong> Benchmark score (selectable)</li>
          <li>• <strong>Circle size:</strong> Model parameter count</li>
          <li>• <strong>Circle color:</strong> Model provider</li>
          <li>• <strong>Green dashed line:</strong> Pareto frontier showing models with the best price-to-performance ratio</li>
          <li>• <strong>Quadrants:</strong> Help identify value categories (e.g., "Cheap & Good" in top-left)</li>
        </ul>
      </div>
    </div>
  )
}

export default ScatterView
