import { useEffect, useState } from 'react'
import { Model } from '@/types/model'
import ComparisonTable from '@/components/ComparisonTable'
import modelsData from '../../data/models.json'

function ComparisonView() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  useEffect(() => {
    setModels(modelsData.models)
  }, [])

  const handleModelSelect = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId)
      } else {
        return [...prev, modelId]
      }
    })
  }

  const selectedModelDetails = models.filter(m => selectedModels.includes(m.id))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Model Comparison Table
        </h1>
        <p className="text-gray-600">
          Compare {models.length} language models across benchmarks, parameters, and pricing.
          Click rows to select models for detailed comparison.
        </p>
      </div>

      {/* Comparison Table */}
      <ComparisonTable
        models={models}
        onModelSelect={handleModelSelect}
        selectedModels={selectedModels}
      />

      {/* Selected Models Detail */}
      {selectedModels.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Selected Models ({selectedModels.length})
            </h2>
            <button
              onClick={() => setSelectedModels([])}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear selection
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedModelDetails.map(model => (
              <div
                key={model.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{model.name}</h3>
                    <p className="text-sm text-gray-600">{model.provider}</p>
                  </div>
                  <button
                    onClick={() => handleModelSelect(model.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Parameters:</span>
                    <span className="font-medium text-gray-900">{model.parameters}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Context:</span>
                    <span className="font-medium text-gray-900">
                      {(model.context_window / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MMLU:</span>
                    <span className="font-medium text-gray-900">
                      {model.benchmarks.MMLU.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Price:</span>
                    <span className="font-medium text-gray-900">
                      {model.pricing.input === 0 && model.pricing.output === 0
                        ? 'Free'
                        : `$${((model.pricing.input + model.pricing.output) / 2).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ComparisonView
