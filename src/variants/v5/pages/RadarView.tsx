import { useState } from 'react'
import { Model } from '@/types/model'
import RadarChart from '@/components/RadarChart'
import { calculateAverageBenchmark } from '@/utils/formatters'
import { organicTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const providerColors: Record<string, string> = organicTheme.colors.providerColors

function getScoreTier(score: number): string {
  if (score >= 90) return 'v5-score-excellent'
  if (score >= 80) return 'v5-score-good'
  if (score >= 60) return 'v5-score-moderate'
  return 'v5-score-low'
}

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
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <div className="v5-float-up">
        <h1 className="v5-heading v5-heading-lg" style={{ marginBottom: '0.15rem' }}>
          Radar Blossoms
        </h1>
        <p className="v5-annotation" style={{ fontSize: '1.05rem' }}>
          overlay capability petals — select up to 4 models to compare their shape ✿
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ====== RADAR CHART ====== */}
        <div className="lg:col-span-2 v5-card v5-float-up-d1" style={{ overflow: 'hidden' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="v5-section-title" style={{ marginBottom: 0 }}>
              <span className="icon">🌸</span>
              Petal Overlay
            </div>
            <div className="flex items-center gap-2">
              <span className="v5-badge v5-badge-green">{selectedModels.length}/4</span>
              {selectedModels.length > 0 && (
                <button onClick={() => setSelectedModels([])} className="v5-btn" style={{ fontSize: '0.7rem' }}>
                  clear all
                </button>
              )}
            </div>
          </div>

          {selectedModels.length > 0 ? (
            <div className="v5-chart-container flex justify-center">
              <RadarChart models={selectedModelDetails} theme={organicTheme} />
            </div>
          ) : (
            <div className="v5-empty-state">
              <div className="icon">🌱</div>
              <div className="title">Waiting for seeds…</div>
              <div className="subtitle">select models below to watch them bloom</div>
            </div>
          )}
        </div>

        {/* ====== SELECTED DETAIL ====== */}
        <div className="v5-card v5-float-up-d2">
          <div className="v5-section-title">
            <span className="icon">🔍</span>
            Selected Detail
          </div>

          {selectedModelDetails.length > 0 ? (
            <div className="space-y-3">
              {selectedModelDetails.map((model, index) => {
                const avg = calculateAverageBenchmark(model.benchmarks)
                const color = providerColors[model.provider] || '#8B7355'

                return (
                  <div
                    key={model.id}
                    className="v5-card"
                    style={{
                      padding: '0.75rem',
                      borderLeft: `4px solid ${color}`,
                      borderRadius: '0.65rem',
                      animation: `v5-floatUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s forwards`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '0.88rem', color: '#3E2723' }}>
                          {model.name}
                        </div>
                        <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.8rem', color: '#8B7355' }}>
                          {model.provider}
                        </div>
                      </div>
                      <div className={getScoreTier(avg)} style={{ fontFamily: "'Fraunces', serif", fontSize: '1.15rem', fontWeight: 700 }}>
                        {avg.toFixed(1)}
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA'].map(key => (
                        <div key={key} className="text-center">
                          <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.65rem', color: '#B8A88A' }}>
                            {key.length > 4 ? key.substring(0, 4) : key}
                          </div>
                          <div className={getScoreTier(model.benchmarks[key])} style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.72rem', fontWeight: 700 }}>
                            {model.benchmarks[key].toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="v5-empty-state" style={{ padding: '2rem 0.5rem' }}>
              <div className="icon" style={{ fontSize: '2rem' }}>🌿</div>
              <div className="subtitle">no models selected yet</div>
            </div>
          )}
        </div>
      </div>

      {/* ====== MODEL GARDEN (ROSTER) ====== */}
      <div className="v5-card v5-float-up-d3">
        <div className="flex items-center justify-between mb-3">
          <div className="v5-section-title" style={{ marginBottom: 0 }}>
            <span className="icon">🌻</span>
            Model Garden
          </div>
          <input
            type="text"
            placeholder="search the garden…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="v5-input"
            style={{ width: '200px' }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 max-h-[30rem] overflow-y-auto pr-1">
          {filteredModels.map((model) => {
            const isSelected = selectedModels.includes(model.id)
            const canSelect = selectedModels.length < 4 || isSelected
            const avg = calculateAverageBenchmark(model.benchmarks)
            const color = providerColors[model.provider] || '#8B7355'

            return (
              <button
                key={model.id}
                onClick={() => canSelect && handleModelSelect(model.id)}
                disabled={!canSelect}
                className={`v5-model-select ${isSelected ? 'selected' : ''} ${!canSelect ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="text-left">
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.73rem', fontWeight: 700, color: isSelected ? '#2D5016' : '#3E2723' }}>
                      {model.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                      <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.7rem', color: '#B8A88A' }}>
                        {model.provider}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ color: '#2D5016', fontSize: '0.9rem' }}>✕</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.7rem', color: '#B8A88A' }}>avg</span>
                  <span className={getScoreTier(avg)} style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.73rem', fontWeight: 700 }}>
                    {avg.toFixed(1)}
                  </span>
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
