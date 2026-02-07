import { useState } from 'react'
import { Model } from '@/types/model'
import RadarChart from '@/components/RadarChart'
import { calculateAverageBenchmark } from '@/utils/formatters'
import { nocTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

function getScoreTier(score: number): string {
  if (score >= 90) return 'v4-cell-excellent'
  if (score >= 80) return 'v4-cell-good'
  if (score >= 60) return 'v4-cell-moderate'
  return 'v4-cell-low'
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
    <div className="space-y-3">
      {/* ====== HEADER BAR ====== */}
      <div className="v4-panel v4-fade-in">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">◎</span>
            RADAR ANALYSIS — MULTI-AXIS CAPABILITY OVERLAY
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
              SELECTED
            </span>
            <span className="v4-panel-badge">{selectedModels.length}/4</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* ====== RADAR CHART PANEL ====== */}
        <div className="lg:col-span-2 v4-panel v4-fade-in-delay-1">
          <div className="v4-panel-header">
            <div className="v4-panel-title">
              <span className="icon">◉</span>
              OVERLAY VIEW
            </div>
            {selectedModels.length > 0 && (
              <button onClick={() => setSelectedModels([])} className="v4-btn" style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}>
                CLEAR ALL
              </button>
            )}
          </div>
          <div className="v4-panel-body">
            {selectedModels.length > 0 ? (
              <div className="v4-chart-container flex justify-center">
                <RadarChart models={selectedModelDetails} theme={nocTheme} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div style={{ fontSize: '2rem', color: '#1E3A5F', marginBottom: '0.75rem' }}>◎</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 600, color: '#475569', letterSpacing: '0.1em' }}>
                  AWAITING TARGET SELECTION
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#334155', marginTop: '0.25rem' }}>
                  Select up to 4 models from the roster below
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====== SELECTED MODELS DETAIL ====== */}
        <div className="v4-panel v4-fade-in-delay-2">
          <div className="v4-panel-header">
            <div className="v4-panel-title">
              <span className="icon">▤</span>
              SELECTED DETAIL
            </div>
          </div>
          <div className="v4-panel-body">
            {selectedModelDetails.length > 0 ? (
              <div className="space-y-3">
                {selectedModelDetails.map((model, index) => {
                  const avg = calculateAverageBenchmark(model.benchmarks)
                  const colors = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444']
                  const color = nocTheme.colors.providerColors[model.provider] || colors[index]
                  return (
                    <div key={model.id} className="border border-[#1E3A5F] rounded p-2" style={{ borderLeftColor: color, borderLeftWidth: '3px' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0' }}>
                            {model.name}
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                            {model.provider}
                          </div>
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 700 }} className={getScoreTier(avg)}>
                          {avg.toFixed(1)}
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {(['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA'] as const).map(key => (
                          <div key={key} className="text-center">
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#475569' }}>{key.substring(0, 4)}</div>
                            <div className={`${getScoreTier(model.benchmarks[key])}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>
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
              <div className="flex flex-col items-center justify-center py-8">
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#334155' }}>
                  NO TARGETS SELECTED
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== MODEL ROSTER ====== */}
      <div className="v4-panel v4-fade-in-delay-3">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">≡</span>
            MODEL ROSTER
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="v4-input"
              style={{ width: '180px' }}
            />
          </div>
        </div>
        <div className="v4-panel-body">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-[28rem] overflow-y-auto pr-1">
            {filteredModels.map((model) => {
              const isSelected = selectedModels.includes(model.id)
              const canSelect = selectedModels.length < 4 || isSelected
              const avg = calculateAverageBenchmark(model.benchmarks)

              return (
                <button
                  key={model.id}
                  onClick={() => canSelect && handleModelSelect(model.id)}
                  disabled={!canSelect}
                  className={`v4-model-card ${isSelected ? 'selected' : ''} ${!canSelect ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 600, color: isSelected ? '#3B82F6' : '#E2E8F0' }}>
                        {model.name}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#475569' }}>
                        {model.provider}
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ color: '#3B82F6', fontSize: '0.75rem', fontWeight: 700 }}>✕</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#475569' }}>AVG</span>
                    <span className={getScoreTier(avg)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem' }}>
                      {avg.toFixed(1)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RadarView
