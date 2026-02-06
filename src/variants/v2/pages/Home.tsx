import { Link } from 'react-router-dom'
import { Model } from '@/types/model'
import { formatNumber } from '@/utils/formatters'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

// Pre-compute stats
const providers = [...new Set(models.map(m => m.provider))]
const benchmarkKeys = ['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA', 'HellaSwag', 'ARC', 'TruthfulQA']
const maxContext = Math.max(...models.map(m => m.context_window))
const avgMMLU = (models.reduce((s, m) => s + m.benchmarks.MMLU, 0) / models.length).toFixed(1)
const topModel = [...models].sort((a, b) => b.benchmarks.MMLU - a.benchmarks.MMLU)[0]
const cheapestModel = [...models].filter(m => m.pricing.input > 0).sort((a, b) => a.pricing.input - b.pricing.input)[0]

function TerminalWindow({ title, children, accent = 'cyan' }: {
  title: string
  children: React.ReactNode
  accent?: 'cyan' | 'magenta' | 'green'
}) {
  const accentColors = {
    cyan: { dot: '#00FFD4', border: 'border-[#00FFD4]/20' },
    magenta: { dot: '#FF00FF', border: 'border-[#FF00FF]/20' },
    green: { dot: '#39FF14', border: 'border-[#39FF14]/20' },
  }
  const { dot } = accentColors[accent]

  return (
    <div className="v2-terminal">
      <div className="v2-terminal-bar">
        <span className="v2-terminal-dot red" />
        <span className="v2-terminal-dot yellow" />
        <span className="v2-terminal-dot green" />
        <span className="v2-terminal-title">{title}</span>
        <span style={{ color: dot, fontSize: '0.6rem', fontFamily: "'Orbitron', sans-serif" }}>●</span>
      </div>
      <div className="v2-terminal-body">
        {children}
      </div>
    </div>
  )
}

function Home() {
  return (
    <div>
      {/* MEGA HEADER */}
      <div className="mb-8 relative">
        <div className="v2-mega-number">{models.length}</div>
        <div
          className="text-xs uppercase tracking-[0.3em] text-[#4A4A6A] mt-2 v2-cursor"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          FRONTIER AI MODELS INDEXED // {providers.length} PROVIDERS // {benchmarkKeys.length} BENCHMARKS
        </div>

        {/* Floating readout */}
        <div
          className="v2-readout hidden md:block"
          style={{ top: '10px', right: '0' }}
        >
          LAST SCAN: 2026.02.06
        </div>
      </div>

      <div className="v2-separator" />

      {/* STAT GRID */}
      <TerminalWindow title="sys://core-metrics — data readout">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          <div className="v2-stat">
            <div className="v2-stat-number">{models.length}</div>
            <div className="v2-stat-label">MODELS</div>
          </div>
          <div className="v2-stat">
            <div className="v2-stat-number">{providers.length}</div>
            <div className="v2-stat-label">PROVIDERS</div>
          </div>
          <div className="v2-stat">
            <div className="v2-stat-number">{benchmarkKeys.length}</div>
            <div className="v2-stat-label">BENCHMARKS</div>
          </div>
          <div className="v2-stat">
            <div className="v2-stat-number">{formatNumber(maxContext)}</div>
            <div className="v2-stat-label">MAX CONTEXT</div>
          </div>
          <div className="v2-stat">
            <div className="v2-stat-number" style={{ color: '#FF00FF', textShadow: '0 0 10px rgba(255,0,255,0.5)' }}>
              {avgMMLU}%
            </div>
            <div className="v2-stat-label">AVG MMLU</div>
          </div>
          <div className="v2-stat">
            <div className="v2-stat-number" style={{ color: '#39FF14', textShadow: '0 0 10px rgba(57,255,20,0.5)' }}>
              {topModel.benchmarks.MMLU.toFixed(1)}%
            </div>
            <div className="v2-stat-label">TOP MMLU</div>
          </div>
          <div className="v2-stat">
            <div className="v2-stat-number">${cheapestModel.pricing.input.toFixed(2)}</div>
            <div className="v2-stat-label">CHEAPEST INPUT</div>
          </div>
          <div className="v2-stat">
            <div className="v2-stat-number" style={{ color: '#FF00FF', textShadow: '0 0 10px rgba(255,0,255,0.5)' }}>
              {models.filter(m => m.pricing.input === 0).length}
            </div>
            <div className="v2-stat-label">FREE MODELS</div>
          </div>
        </div>
      </TerminalWindow>

      <div className="h-6" />

      {/* NAVIGATION GRID */}
      <TerminalWindow title="nav://system-modules — access points" accent="magenta">
        <div className="text-xs uppercase tracking-[0.2em] text-[#4A4A6A] mb-4">
          <span className="text-[#39FF14]">&gt;</span> SELECT MODULE TO ACCESS_
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/2/comparison"
            className="block border border-[#2A2A4E] p-4 hover:border-[#00FFD4] group"
            style={{ textDecoration: 'none', background: '#0D0D14', transition: 'all 0.15s ease' }}
          >
            <div className="font-bold text-sm uppercase text-[#00FFD4] group-hover:v2-glow-cyan" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              TABLE
            </div>
            <div className="text-xs text-[#4A4A6A] mt-1">RAW DATA STREAM</div>
            <div className="text-[#2A2A4E] text-xs mt-2 group-hover:text-[#00FFD4]">→ ACCESS</div>
          </Link>
          <Link
            to="/2/radar"
            className="block border border-[#2A2A4E] p-4 hover:border-[#FF00FF] group"
            style={{ textDecoration: 'none', background: '#0D0D14', transition: 'all 0.15s ease' }}
          >
            <div className="font-bold text-sm uppercase text-[#FF00FF]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              RADAR
            </div>
            <div className="text-xs text-[#4A4A6A] mt-1">MULTI-AXIS OVERLAY</div>
            <div className="text-[#2A2A4E] text-xs mt-2 group-hover:text-[#FF00FF]">→ ACCESS</div>
          </Link>
          <Link
            to="/2/timeline"
            className="block border border-[#2A2A4E] p-4 hover:border-[#39FF14] group"
            style={{ textDecoration: 'none', background: '#0D0D14', transition: 'all 0.15s ease' }}
          >
            <div className="font-bold text-sm uppercase text-[#39FF14]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              TIMELINE
            </div>
            <div className="text-xs text-[#4A4A6A] mt-1">TEMPORAL ANALYSIS</div>
            <div className="text-[#2A2A4E] text-xs mt-2 group-hover:text-[#39FF14]">→ ACCESS</div>
          </Link>
          <Link
            to="/2/scatter"
            className="block border border-[#2A2A4E] p-4 hover:border-[#00FFD4] group"
            style={{ textDecoration: 'none', background: '#0D0D14', transition: 'all 0.15s ease' }}
          >
            <div className="font-bold text-sm uppercase text-[#00FFD4]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              SCATTER
            </div>
            <div className="text-xs text-[#4A4A6A] mt-1">COST × PERFORMANCE</div>
            <div className="text-[#2A2A4E] text-xs mt-2 group-hover:text-[#00FFD4]">→ ACCESS</div>
          </Link>
        </div>
      </TerminalWindow>

      <div className="h-6" />

      {/* FULL MODEL TABLE */}
      <TerminalWindow title="db://models — full index dump">
        <div className="flex items-baseline justify-between mb-4">
          <h2
            className="text-sm uppercase v2-glow-cyan"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            ALL MODELS
          </h2>
          <span className="text-xs text-[#4A4A6A]">{models.length} ENTRIES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="v2-table">
            <thead>
              <tr>
                <th>MODEL</th>
                <th>PROVIDER</th>
                <th>PARAMS</th>
                <th>CTX</th>
                <th>MMLU</th>
                <th>HUMANEVAL</th>
                <th>MATH</th>
                <th>GSM8K</th>
                <th>IN $/1M</th>
                <th>OUT $/1M</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td className="font-bold whitespace-nowrap text-[#00FFD4]">{model.name}</td>
                  <td className="text-[#FF00FF]">{model.provider}</td>
                  <td className="text-[#4A4A6A]">{model.parameters}</td>
                  <td className="text-right">{formatNumber(model.context_window)}</td>
                  <td className="text-right">{model.benchmarks.MMLU.toFixed(1)}</td>
                  <td className="text-right">{model.benchmarks.HumanEval.toFixed(1)}</td>
                  <td className="text-right">{model.benchmarks.MATH.toFixed(1)}</td>
                  <td className="text-right">{model.benchmarks.GSM8K.toFixed(1)}</td>
                  <td className="text-right">
                    {model.pricing.input === 0
                      ? <span className="text-[#39FF14]">FREE</span>
                      : `$${model.pricing.input.toFixed(2)}`}
                  </td>
                  <td className="text-right">
                    {model.pricing.output === 0
                      ? <span className="text-[#39FF14]">FREE</span>
                      : `$${model.pricing.output.toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TerminalWindow>

      <div className="h-6" />

      {/* PROVIDERS */}
      <div className="border-t border-[#1A1A2E] pt-4">
        <div className="text-xs uppercase tracking-[0.2em] text-[#4A4A6A] mb-3">
          <span className="text-[#39FF14]">&gt;</span> REGISTERED PROVIDERS //
        </div>
        <div className="flex flex-wrap gap-2">
          {providers.map(p => {
            const count = models.filter(m => m.provider === p).length
            return (
              <span
                key={p}
                className="border border-[#2A2A4E] px-3 py-1 text-xs uppercase tracking-wider text-[#7A7AAA] hover:border-[#00FFD4] hover:text-[#00FFD4]"
                style={{ transition: 'all 0.15s ease' }}
              >
                {p} <span className="text-[#FF00FF]">[{count}]</span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home
