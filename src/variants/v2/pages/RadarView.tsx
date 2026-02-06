import { useState } from 'react'
import { Model } from '@/types/model'
import RadarChart from '@/components/RadarChart'
import { synthwaveTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

function TerminalWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="v2-terminal">
      <div className="v2-terminal-bar">
        <span className="v2-terminal-dot red" />
        <span className="v2-terminal-dot yellow" />
        <span className="v2-terminal-dot green" />
        <span className="v2-terminal-title">{title}</span>
      </div>
      <div className="v2-terminal-body">
        {children}
      </div>
    </div>
  )
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
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl uppercase v2-glow-cyan"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          RADAR COMPARISON
        </h1>
        <p className="text-xs text-[#4A4A6A] mt-2 uppercase tracking-wider v2-cursor">
          SELECT UP TO 4 MODELS // MMLU · HUMANEVAL · MATH · GSM8K · GPQA
        </p>
        <div className="v2-separator" />
      </div>

      {/* RADAR CHART */}
      {selectedModels.length > 0 && (
        <TerminalWindow title={`viz://radar-overlay — ${selectedModels.length} models loaded`}>
          <div className="flex items-center justify-between mb-4 border-b border-[#1A1A2E] pb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#4A4A6A]">
              <span className="text-[#39FF14]">●</span> MULTI-AXIS OVERLAY // {selectedModels.length} MODELS ACTIVE
            </span>
            <button
              onClick={() => setSelectedModels([])}
              className="v2-btn-magenta v2-btn text-xs"
            >
              CLEAR ALL
            </button>
          </div>
          <div className="v2-chart-container v2-sweep-reveal">
            <RadarChart models={selectedModelDetails} theme={synthwaveTheme} />
          </div>
        </TerminalWindow>
      )}

      {selectedModels.length === 0 && (
        <div className="v2-terminal mb-6">
          <div className="v2-terminal-bar">
            <span className="v2-terminal-dot red" />
            <span className="v2-terminal-dot yellow" />
            <span className="v2-terminal-dot green" />
            <span className="v2-terminal-title">viz://radar-overlay — awaiting input</span>
          </div>
          <div className="v2-terminal-body">
            <div className="border border-[#2A2A4E] p-12 text-center">
              <div className="text-[#4A4A6A] text-xs uppercase tracking-[0.3em]">
                <span className="text-[#FF00FF]">⚠</span> NO MODELS SELECTED
              </div>
              <div className="text-[#2A2A4E] text-xs mt-2 uppercase tracking-wider v2-cursor">
                SELECT FROM THE GRID BELOW
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-4" />

      {/* MODEL SELECTION */}
      <TerminalWindow title="db://model-selector — choose targets">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-sm uppercase v2-glow-cyan"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            SELECT MODELS
          </h2>
          <span className="text-xs text-[#FF00FF]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {selectedModels.length}/4
          </span>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="SEARCH MODELS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="v2-input w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[28rem] overflow-y-auto">
          {filteredModels.map((model) => {
            const isSelected = selectedModels.includes(model.id)
            const canSelect = selectedModels.length < 4 || isSelected

            return (
              <button
                key={model.id}
                onClick={() => canSelect && handleModelSelect(model.id)}
                disabled={!canSelect}
                className={`v2-model-select-btn ${isSelected ? 'selected' : ''} ${
                  !canSelect ? 'opacity-30 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-[#00FFD4]">{model.name}</div>
                    <div className="text-xs text-[#4A4A6A]">{model.provider}</div>
                  </div>
                  {isSelected && (
                    <span className="text-[#FF00FF] font-bold text-lg leading-none" style={{ textShadow: '0 0 8px rgba(255,0,255,0.5)' }}>×</span>
                  )}
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#2A2A4E]">MMLU</span>
                    <span className="text-[#7A7AAA]">{model.benchmarks.MMLU.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2A2A4E]">HUMANEVAL</span>
                    <span className="text-[#7A7AAA]">{model.benchmarks.HumanEval.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2A2A4E]">MATH</span>
                    <span className="text-[#7A7AAA]">{model.benchmarks.MATH.toFixed(1)}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </TerminalWindow>
    </div>
  )
}

export default RadarView
