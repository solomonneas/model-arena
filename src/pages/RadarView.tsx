import { useEffect, useState } from 'react'
import { Model } from '@/types/model'
import RadarChart from '@/components/RadarChart'
import modelsData from '../../data/models.json'

function RadarView() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setModels(modelsData.models)
  }, [])

  const handleModelSelect = (modelId: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId)
      } else if (prev.length < 4) {
        return [...prev, modelId]
      }
      return prev
    })
  }

  const selectedModelDetails = models.filter((m) =>
    selectedModels.includes(m.id)
  )

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Radar Chart Comparison
        </h1>
        <p className="text-gray-600">
          Compare up to 4 models across 5 key benchmarks: MMLU, HumanEval, MATH,
          GSM8K, and GPQA
        </p>
      </div>

      {/* Radar Chart */}
      {selectedModels.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Multi-Dimensional Comparison
            </h2>
            {selectedModels.length > 0 && (
              <button
                onClick={() => setSelectedModels([])}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear selection
              </button>
            )}
          </div>

          <RadarChart models={selectedModelDetails} />
        </div>
      )}

      {/* Model Selection */}
      <div className="card">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Select Models to Compare
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Choose up to 4 models ({selectedModels.length}/4 selected)
          </p>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search models by name or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Model Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {filteredModels.map((model) => {
            const isSelected = selectedModels.includes(model.id)
            const canSelect = selectedModels.length < 4 || isSelected

            return (
              <button
                key={model.id}
                onClick={() => canSelect && handleModelSelect(model.id)}
                disabled={!canSelect}
                className={`
                  text-left p-4 rounded-lg border-2 transition-all
                  ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : canSelect
                      ? 'border-gray-200 hover:border-primary-300 bg-white'
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {model.name}
                    </h3>
                    <p className="text-xs text-gray-600">{model.provider}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 ml-2">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Key Benchmarks Preview */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">MMLU</span>
                    <span className="font-medium text-gray-900">
                      {model.benchmarks.MMLU.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">HumanEval</span>
                    <span className="font-medium text-gray-900">
                      {model.benchmarks.HumanEval.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">MATH</span>
                    <span className="font-medium text-gray-900">
                      {model.benchmarks.MATH.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RadarView
