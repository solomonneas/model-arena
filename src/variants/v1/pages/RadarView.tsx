import { useState } from 'react'
import { Model } from '@/types/model'
import RadarChart from '@/components/RadarChart'
import { brutalistTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

function RadarView() {
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

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

  const selectedModelDetails = models.filter((m) => selectedModels.includes(m.id))

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* HEADER */}
      <div className="border-b-2 border-[#FF6600] pb-3 mb-6">
        <h1 className="font-['Archivo_Black'] text-3xl uppercase">RADAR COMPARISON</h1>
        <p className="text-xs text-[#B0B0B0] mt-1 uppercase tracking-wider">
          SELECT UP TO 4 MODELS // MMLU · HUMANEVAL · MATH · GSM8K · GPQA
        </p>
      </div>

      {/* RADAR CHART */}
      {selectedModels.length > 0 && (
        <div className="v1-chart-container mb-6">
          <div className="flex items-center justify-between mb-4 border-b border-[#333] pb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0]">
              MULTI-AXIS OVERLAY // {selectedModels.length} MODELS
            </span>
            <button
              onClick={() => setSelectedModels([])}
              className="text-xs text-[#FF6600] uppercase tracking-wider hover:bg-[#FF6600] hover:text-black px-2 py-1"
            >
              CLEAR
            </button>
          </div>
          <RadarChart models={selectedModelDetails} theme={brutalistTheme} />
        </div>
      )}

      {selectedModels.length === 0 && (
        <div className="border-2 border-[#333] p-12 mb-6 text-center">
          <div className="text-[#B0B0B0] text-xs uppercase tracking-[0.3em]">
            NO MODELS SELECTED
          </div>
          <div className="text-[#555] text-xs mt-2 uppercase tracking-wider">
            SELECT FROM THE GRID BELOW
          </div>
        </div>
      )}

      {/* MODEL SELECTION */}
      <div className="border-2 border-white p-4">
        <div className="flex items-center justify-between border-b-2 border-[#FF6600] pb-2 mb-4">
          <h2 className="font-['Archivo_Black'] text-lg uppercase">SELECT MODELS</h2>
          <span className="text-xs text-[#FF6600]">{selectedModels.length}/4</span>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="SEARCH MODELS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="v1-input w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 max-h-[28rem] overflow-y-auto">
          {filteredModels.map((model) => {
            const isSelected = selectedModels.includes(model.id)
            const canSelect = selectedModels.length < 4 || isSelected

            return (
              <button
                key={model.id}
                onClick={() => canSelect && handleModelSelect(model.id)}
                disabled={!canSelect}
                className={`v1-model-select-btn ${isSelected ? 'selected' : ''} ${
                  !canSelect ? 'opacity-30 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-white">{model.name}</div>
                    <div className="text-xs text-[#B0B0B0]">{model.provider}</div>
                  </div>
                  {isSelected && (
                    <span className="text-[#FF6600] font-bold text-lg leading-none">×</span>
                  )}
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#555]">MMLU</span>
                    <span className="text-[#B0B0B0]">{model.benchmarks.MMLU.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555]">HUMANEVAL</span>
                    <span className="text-[#B0B0B0]">{model.benchmarks.HumanEval.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555]">MATH</span>
                    <span className="text-[#B0B0B0]">{model.benchmarks.MATH.toFixed(1)}</span>
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
