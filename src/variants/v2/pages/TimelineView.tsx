import Timeline from '@/components/Timeline'
import { synthwaveTheme } from '../theme'
import modelsData from '../../../../data/models.json'

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

function TimelineView() {
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl uppercase v2-glow-cyan"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          TIMELINE
        </h1>
        <p className="text-xs text-[#4A4A6A] mt-2 uppercase tracking-wider v2-cursor">
          MODEL RELEASE DATES // CAPABILITY SCORES OVER TIME
        </p>
        <div className="v2-separator" />
      </div>

      {/* CHART */}
      <TerminalWindow title="viz://temporal-analysis — release chronology">
        <div className="border-b border-[#1A1A2E] pb-2 mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#4A4A6A]">
            <span className="text-[#39FF14]">●</span> SCATTER: DATE × AVG BENCHMARK // DOT SIZE = PARAM COUNT
          </span>
        </div>
        <div className="v2-chart-container v2-sweep-reveal">
          <Timeline models={modelsData.models} theme={synthwaveTheme} />
        </div>
      </TerminalWindow>

      <div className="h-6" />

      {/* INFO */}
      <TerminalWindow title="sys://data-notes — chart legend">
        <div className="text-xs uppercase tracking-[0.2em] text-[#FF00FF] mb-3 v2-glow-magenta">
          DATA NOTES //
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#7A7AAA]">
          <div className="border-l border-[#00FFD4] pl-3">
            <span className="text-[#00FFD4] font-bold">Y-AXIS:</span> Average across all benchmarks (MMLU, HumanEval, MATH, GSM8K, GPQA, HellaSwag, ARC, TruthfulQA)
          </div>
          <div className="border-l border-[#FF00FF] pl-3">
            <span className="text-[#FF00FF] font-bold">DOT SIZE:</span> Proportional to parameter count. Unknown params = default size.
          </div>
          <div className="border-l border-[#39FF14] pl-3">
            <span className="text-[#39FF14] font-bold">LINES:</span> Connect models within the same family (GPT, Claude, Gemini, etc.)
          </div>
        </div>
      </TerminalWindow>
    </div>
  )
}

export default TimelineView
