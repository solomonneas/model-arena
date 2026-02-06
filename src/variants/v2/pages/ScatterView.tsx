import ScatterPlot from '@/components/ScatterPlot'
import { Model } from '@/types/model'
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

function ScatterView() {
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl uppercase v2-glow-cyan"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          PRICE × PERFORMANCE
        </h1>
        <p className="text-xs text-[#4A4A6A] mt-2 uppercase tracking-wider v2-cursor">
          COST PER 1M TOKENS (LOG) vs BENCHMARK SCORE // {models.length} MODELS
        </p>
        <div className="v2-separator" />
      </div>

      {/* CHART */}
      <TerminalWindow title="viz://price-performance — cost analysis matrix">
        <div className="v2-chart-container v2-sweep-reveal">
          <ScatterPlot models={models} theme={synthwaveTheme} />
        </div>
      </TerminalWindow>

      <div className="h-6" />

      {/* DATA LEGEND */}
      <TerminalWindow title="sys://chart-legend — reading guide">
        <div className="text-xs uppercase tracking-[0.2em] text-[#FF00FF] mb-3 v2-glow-magenta">
          READING THE CHART //
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#7A7AAA]">
          <div className="border-l border-[#00FFD4] pl-3">
            <span className="text-[#00FFD4] font-bold">X-AXIS:</span> Input price per 1M tokens. Logarithmic scale. Left = cheap.
          </div>
          <div className="border-l border-[#00FFD4] pl-3">
            <span className="text-[#00FFD4] font-bold">Y-AXIS:</span> Benchmark score (selectable). Up = better.
          </div>
          <div className="border-l border-[#FF00FF] pl-3">
            <span className="text-[#FF00FF] font-bold">DOT SIZE:</span> Parameter count. Bigger = more params.
          </div>
          <div className="border-l border-[#FF00FF] pl-3">
            <span className="text-[#FF00FF] font-bold">DASHED LINE:</span> Pareto frontier — best price-to-performance ratio.
          </div>
          <div className="border-l border-[#39FF14] pl-3">
            <span className="text-[#39FF14] font-bold">TOP-LEFT:</span> Sweet spot. High performance, low cost.
          </div>
          <div className="border-l border-[#39FF14] pl-3">
            <span className="text-[#39FF14] font-bold">FREE MODELS:</span> Excluded (can't plot $0 on log scale).
          </div>
        </div>
      </TerminalWindow>
    </div>
  )
}

export default ScatterView
