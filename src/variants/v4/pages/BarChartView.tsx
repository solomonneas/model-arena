import { useState } from 'react'
import { Model } from '@/types/model'
import BarChart from '@/components/BarChart'
import { nocTheme } from '../theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

type ChartMode = 'benchmark' | 'context' | 'pricing' | 'output_price'

const MODE_OPTIONS: Array<{ value: ChartMode; label: string }> = [
  { value: 'benchmark', label: 'BENCHMARK' },
  { value: 'context', label: 'CONTEXT' },
  { value: 'pricing', label: 'INPUT $' },
  { value: 'output_price', label: 'OUTPUT $' },
]

function BarChartView() {
  const [mode, setMode] = useState<ChartMode>('benchmark')
  const [selectedBenchmark, setSelectedBenchmark] = useState('MMLU')

  return (
    <div>
      {/* HEADER PANEL */}
      <div className="v4-panel mb-3">
        <div className="v4-panel-header">
          <span className="v4-panel-title">◉ BAR CHARTS — RANKED DATA VISUALIZATION</span>
        </div>
        <div className="p-3">
          {/* MODE TABS */}
          <div className="flex items-center gap-1 mb-3">
            <span
              className="text-xs mr-2"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: '#64748B', fontSize: '0.6rem' }}
            >
              MODE:
            </span>
            {MODE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value)}
                className={`px-3 py-1 text-xs uppercase transition-colors ${
                  mode === opt.value
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-[#0B1426] text-[#64748B] hover:text-[#94A3B8] border border-[#1E3A5F]'
                }`}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.05em',
                  borderRadius: '2px',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* BENCHMARK SELECTOR */}
          {mode === 'benchmark' && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: '#64748B', fontSize: '0.6rem' }}
              >
                BENCHMARK:
              </span>
              <select
                value={selectedBenchmark}
                onChange={(e) => setSelectedBenchmark(e.target.value)}
                className="text-xs px-2 py-1 border border-[#1E3A5F] focus:border-[#3B82F6] outline-none"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundColor: '#0B1426',
                  color: '#E2E8F0',
                  fontSize: '0.65rem',
                  borderRadius: '2px',
                }}
              >
                {BENCHMARK_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CHART PANEL */}
      <div className="v4-panel mb-3">
        <div className="v4-panel-header">
          <span className="v4-panel-title">
            {mode === 'benchmark' && `▸ ${BENCHMARK_OPTIONS.find(o => o.value === selectedBenchmark)?.label || selectedBenchmark}`}
            {mode === 'context' && '▸ CONTEXT WINDOW (K TOKENS)'}
            {mode === 'pricing' && '▸ INPUT PRICE ($/1M TOKENS)'}
            {mode === 'output_price' && '▸ OUTPUT PRICE ($/1M TOKENS)'}
          </span>
          <span
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#22C55E' }}
          >
            ● LIVE
          </span>
        </div>
        <div className="p-3">
          <BarChart
            models={models}
            theme={nocTheme}
            mode={mode}
            benchmarkField={selectedBenchmark}
            maxModels={15}
            sortDirection="desc"
          />
        </div>
      </div>

      {/* PRICING COMPARISON PANELS */}
      {(mode === 'pricing' || mode === 'output_price') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="v4-panel">
            <div className="v4-panel-header">
              <span className="v4-panel-title">▸ LOWEST INPUT COST</span>
              <span
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#22C55E' }}
              >
                ASC
              </span>
            </div>
            <div className="p-3">
              <BarChart
                models={models}
                theme={nocTheme}
                mode="pricing"
                maxModels={10}
                sortDirection="asc"
              />
            </div>
          </div>
          <div className="v4-panel">
            <div className="v4-panel-header">
              <span className="v4-panel-title">▸ LOWEST OUTPUT COST</span>
              <span
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#22C55E' }}
              >
                ASC
              </span>
            </div>
            <div className="p-3">
              <BarChart
                models={models}
                theme={nocTheme}
                mode="output_price"
                maxModels={10}
                sortDirection="asc"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BarChartView
