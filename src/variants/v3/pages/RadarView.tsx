import { useState } from 'react'
import { Model } from '@/types/model'
import RadarChart from '@/components/RadarChart'
import { editorialTheme } from '../theme'
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
      {/* ====== HERO ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 pt-16 md:pt-20 pb-8">
        <div className="v3-fade-in">
          <div className="v3-section-title mb-4">Capability Profiles</div>
          <h1 className="v3-headline" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Radar<br />
            <span className="italic font-normal" style={{ color: '#C9A96E' }}>Portraits</span>
          </h1>
          <p className="v3-subheadline max-w-xl mt-4" style={{ fontSize: '1.1rem' }}>
            Select up to four models to compose an elegant overlay of their performance
            across five critical dimensions.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider-gold" />
      </div>

      {/* ====== RADAR CHART ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8">
        {selectedModels.length > 0 ? (
          <div className="v3-scale-in">
            <div className="flex items-baseline justify-between mb-6">
              <div className="v3-section-title">
                {selectedModels.length} {selectedModels.length === 1 ? 'Model' : 'Models'} Selected
              </div>
              <button
                onClick={() => setSelectedModels([])}
                className="v3-btn"
              >
                Clear All
              </button>
            </div>
            <div className="v3-chart-container flex justify-center">
              <RadarChart models={selectedModelDetails} theme={editorialTheme} />
            </div>
            <div className="v3-chart-caption text-center max-w-2xl mx-auto">
              Multi-axis overlay comparing MMLU, HumanEval, MATH, GSM8K, and GPQA scores.
              Each axis represents normalized performance on a 0–100 scale.
            </div>
          </div>
        ) : (
          <div className="v3-fade-in-slow">
            <div className="border border-[#E8E2D8] py-20 px-8 text-center">
              <div
                className="v3-headline text-2xl md:text-3xl italic font-normal mb-4"
                style={{ color: '#C9A96E' }}
              >
                Awaiting Selection
              </div>
              <p className="v3-subheadline" style={{ fontSize: '1rem' }}>
                Choose from the curated list below to begin your comparison.
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider" />
      </div>

      {/* ====== MODEL SELECTION ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8 pb-16">
        <div className="v3-fade-in-delay-1">
          <div className="flex items-baseline justify-between mb-8">
            <div className="v3-section-title">Select Models</div>
            <div className="v3-label" style={{ fontSize: '0.55rem' }}>
              <span className="v3-gold-accent">{selectedModels.length}</span> / 4
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by name or laboratory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="v3-input w-full md:w-96"
            />
          </div>

          {/* Model grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[32rem] overflow-y-auto pr-2">
            {filteredModels.map((model) => {
              const isSelected = selectedModels.includes(model.id)
              const canSelect = selectedModels.length < 4 || isSelected

              return (
                <button
                  key={model.id}
                  onClick={() => canSelect && handleModelSelect(model.id)}
                  disabled={!canSelect}
                  className={`v3-model-btn ${isSelected ? 'selected' : ''} ${
                    !canSelect ? 'opacity-30 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        className="font-semibold text-sm"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: '#2D2D2D' }}
                      >
                        {model.name}
                      </div>
                      <div className="v3-label mt-0.5" style={{ fontSize: '0.55rem' }}>
                        {model.provider}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="v3-gold-accent text-lg leading-none">✕</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {['MMLU', 'HumanEval', 'MATH'].map(bench => (
                      <div key={bench} className="flex justify-between" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem' }}>
                        <span style={{ color: '#B8B0A4' }}>{bench}</span>
                        <span style={{ color: '#7A7A7A' }}>{model.benchmarks[bench].toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default RadarView
