import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Model } from '@/types/model'
import { formatNumber, formatPrice, calculateAverageBenchmark } from '@/utils/formatters'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const providers = [...new Set(models.map(m => m.provider))]
const benchmarkKeys = ['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA', 'HellaSwag', 'ARC', 'TruthfulQA']
const maxContext = Math.max(...models.map(m => m.context_window))
const topModels = [...models].sort((a, b) => calculateAverageBenchmark(b.benchmarks) - calculateAverageBenchmark(a.benchmarks))
const topModel = topModels[0]
const avgScore = (models.reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) / models.length)
const latestModels = [...models].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()).slice(0, 5)
const cheapestPaid = [...models].filter(m => m.pricing.input > 0).sort((a, b) => a.pricing.input - b.pricing.input)[0]

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 800, decimals: number = 0) {
  const [value, setValue] = useState(0)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
      setValue(eased * target)
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick)
      }
    }
    ref.current = requestAnimationFrame(tick)
    return () => { if (ref.current) cancelAnimationFrame(ref.current) }
  }, [target, duration])

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()
}

// Get tier class for a score
function getScoreTier(score: number): string {
  if (score >= 90) return 'v4-cell-excellent'
  if (score >= 80) return 'v4-cell-good'
  if (score >= 60) return 'v4-cell-moderate'
  return 'v4-cell-low'
}

// Get tier row class based on average
function getRowTier(model: Model): string {
  const avg = calculateAverageBenchmark(model.benchmarks)
  if (avg >= 90) return 'tier-1'
  if (avg >= 80) return 'tier-2'
  return 'tier-3'
}

// Score bar component
function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="v4-minibar" style={{ width: '60px' }}>
      <div className="v4-minibar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  )
}

function Home() {
  const modelCount = useAnimatedCounter(models.length, 600)
  const providerCount = useAnimatedCounter(providers.length, 600)
  const benchCount = useAnimatedCounter(benchmarkKeys.length, 600)
  const avgScoreDisplay = useAnimatedCounter(avgScore, 800, 1)
  const maxCtxDisplay = useAnimatedCounter(maxContext / 1000, 700, 0)

  return (
    <div className="space-y-3">
      {/* ====== KEY METRICS ROW ====== */}
      <div className="v4-fade-in">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { value: modelCount, label: 'MODELS TRACKED', color: '#3B82F6' },
            { value: providerCount, label: 'PROVIDERS', color: '#22C55E' },
            { value: benchCount, label: 'BENCHMARKS', color: '#F59E0B' },
            { value: avgScoreDisplay, label: 'AVG SCORE', color: '#3B82F6', suffix: '%' },
            { value: `${maxCtxDisplay}K`, label: 'MAX CONTEXT', color: '#22C55E' },
          ].map((stat, i) => (
            <div key={i} className="v4-panel">
              <div className="v4-stat">
                <div className="v4-stat-value" style={{ color: stat.color }}>
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="v4-stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====== MAIN DASHBOARD GRID ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 v4-fade-in-delay-1">
        {/* LEFT: TOP PERFORMERS PANEL */}
        <div className="lg:col-span-2 v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">
              <span className="icon">▲</span>
              TOP PERFORMERS — AGGREGATE SCORE
            </div>
            <div className="v4-panel-badge">LIVE</div>
          </div>
          <div className="v4-panel-body p-0">
            <div className="overflow-x-auto" style={{ maxHeight: '320px' }}>
              <table className="v4-table">
                <thead>
                  <tr>
                    <th style={{ width: '28px' }}>#</th>
                    <th>MODEL</th>
                    <th>PROVIDER</th>
                    <th className="text-right">AVG</th>
                    <th className="text-right">MMLU</th>
                    <th className="text-right">HUMAN</th>
                    <th className="text-right">MATH</th>
                    <th className="text-right">GSM8K</th>
                    <th className="text-right">GPQA</th>
                    <th>PERF</th>
                  </tr>
                </thead>
                <tbody>
                  {topModels.slice(0, 10).map((model, i) => {
                    const avg = calculateAverageBenchmark(model.benchmarks)
                    return (
                      <tr key={model.id} className={getRowTier(model)}>
                        <td style={{ color: '#475569', fontWeight: 600 }}>{i + 1}</td>
                        <td className="whitespace-nowrap font-semibold" style={{ color: '#E2E8F0' }}>{model.name}</td>
                        <td style={{ color: '#64748B' }}>{model.provider}</td>
                        <td className={`text-right font-bold ${getScoreTier(avg)}`}>{avg.toFixed(1)}</td>
                        <td className={`text-right ${getScoreTier(model.benchmarks.MMLU)}`}>{model.benchmarks.MMLU.toFixed(1)}</td>
                        <td className={`text-right ${getScoreTier(model.benchmarks.HumanEval)}`}>{model.benchmarks.HumanEval.toFixed(1)}</td>
                        <td className={`text-right ${getScoreTier(model.benchmarks.MATH)}`}>{model.benchmarks.MATH.toFixed(1)}</td>
                        <td className={`text-right ${getScoreTier(model.benchmarks.GSM8K)}`}>{model.benchmarks.GSM8K.toFixed(1)}</td>
                        <td className={`text-right ${getScoreTier(model.benchmarks.GPQA)}`}>{model.benchmarks.GPQA.toFixed(1)}</td>
                        <td>
                          <ScoreBar value={avg} color={avg >= 90 ? '#22C55E' : avg >= 80 ? '#3B82F6' : '#F59E0B'} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: SIDEBAR PANELS */}
        <div className="space-y-3">
          {/* LEADER PANEL */}
          <div className="v4-panel">
            <div className="v4-panel-header">
              <div className="v4-panel-title">
                <span className="icon">★</span>
                LEADER
              </div>
              <span className="v4-status-dot v4-status-dot--green" />
            </div>
            <div className="v4-panel-body">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#E2E8F0' }}>
                    {topModel.name}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#64748B' }}>
                    {topModel.provider} — {topModel.parameters}
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', fontWeight: 700, color: '#22C55E' }}>
                  {calculateAverageBenchmark(topModel.benchmarks).toFixed(1)}
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                {['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA'].map(key => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B', width: '70px' }}>{key}</span>
                    <div className="flex-1"><ScoreBar value={topModel.benchmarks[key]} color={getScoreTier(topModel.benchmarks[key]).includes('excellent') ? '#22C55E' : '#3B82F6'} /></div>
                    <span className={`${getScoreTier(topModel.benchmarks[key])}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', width: '38px', textAlign: 'right' }}>
                      {topModel.benchmarks[key].toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BEST VALUE PANEL */}
          <div className="v4-panel">
            <div className="v4-panel-header">
              <div className="v4-panel-title">
                <span className="icon">$</span>
                BEST VALUE
              </div>
              <span className="v4-status-dot v4-status-dot--amber" />
            </div>
            <div className="v4-panel-body">
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 600, color: '#E2E8F0' }}>
                    {cheapestPaid.name}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#64748B' }}>
                    {cheapestPaid.provider}
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#F59E0B' }}>
                    {formatPrice(cheapestPaid.pricing.input)}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#64748B' }}>
                    PER 1M TOKENS
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>AVG SCORE</span>
                <div className="flex-1"><ScoreBar value={calculateAverageBenchmark(cheapestPaid.benchmarks)} color="#F59E0B" /></div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#F59E0B' }}>
                  {calculateAverageBenchmark(cheapestPaid.benchmarks).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* LATEST RELEASES PANEL */}
          <div className="v4-panel">
            <div className="v4-panel-header">
              <div className="v4-panel-title">
                <span className="icon">◆</span>
                RECENT RELEASES
              </div>
            </div>
            <div className="v4-panel-body p-0">
              {latestModels.map((model, i) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between px-3 py-1.5"
                  style={{
                    borderBottom: i < latestModels.length - 1 ? '1px solid rgba(30,58,95,0.4)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#E2E8F0' }}>
                      {model.name}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#475569' }}>
                      {model.provider}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                    {model.release_date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== PROVIDER DISTRIBUTION + NAVIGATION ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 v4-fade-in-delay-2">
        {/* PROVIDER DISTRIBUTION */}
        <div className="v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">
              <span className="icon">⊞</span>
              PROVIDER DISTRIBUTION
            </div>
          </div>
          <div className="v4-panel-body">
            <div className="space-y-2">
              {providers.map(provider => {
                const count = models.filter(m => m.provider === provider).length
                const pct = (count / models.length) * 100
                const providerAvg = models.filter(m => m.provider === provider).reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) / count
                return (
                  <div key={provider} className="flex items-center gap-2">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#94A3B8', width: '80px', flexShrink: 0 }}>
                      {provider}
                    </span>
                    <div className="flex-1 v4-minibar">
                      <div className="v4-minibar-fill" style={{ width: `${pct}%`, background: '#3B82F6' }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#64748B', width: '20px', textAlign: 'right' }}>
                      {count}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', width: '45px', textAlign: 'right' }} className={getScoreTier(providerAvg)}>
                      {providerAvg.toFixed(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* QUICK NAV PANEL */}
        <div className="v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">
              <span className="icon">▷</span>
              MODULES
            </div>
          </div>
          <div className="v4-panel-body">
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/4/comparison', icon: '≡', label: 'DATA TABLE', desc: 'Full model comparison matrix' },
                { to: '/4/radar', icon: '◎', label: 'RADAR', desc: 'Multi-axis capability overlay' },
                { to: '/4/timeline', icon: '▸', label: 'TIMELINE', desc: 'Release chronology & evolution' },
                { to: '/4/scatter', icon: '⬡', label: 'SCATTER', desc: 'Price vs performance analysis' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block p-3 border border-[#1E3A5F] rounded hover:border-[#3B82F6] hover:bg-[rgba(59,130,246,0.03)] transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: '#3B82F6', fontSize: '0.9rem' }}>{item.icon}</span>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', color: '#94A3B8' }} className="group-hover:text-[#3B82F6] transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#475569' }}>
                    {item.desc}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== FULL MODEL INDEX ====== */}
      <div className="v4-panel v4-fade-in-delay-3">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">≡</span>
            FULL MODEL INDEX
          </div>
          <div className="v4-panel-badge">{models.length} ENTRIES</div>
        </div>
        <div className="v4-panel-body p-0">
          <div className="overflow-x-auto" style={{ maxHeight: '400px' }}>
            <table className="v4-table">
              <thead>
                <tr>
                  <th>MODEL</th>
                  <th>PROVIDER</th>
                  <th>PARAMS</th>
                  <th className="text-right">CTX</th>
                  {benchmarkKeys.map(k => (
                    <th key={k} className="text-right">{k.length > 6 ? k.substring(0, 6) : k}</th>
                  ))}
                  <th className="text-right">IN $/1M</th>
                  <th className="text-right">OUT $/1M</th>
                </tr>
              </thead>
              <tbody>
                {topModels.map((model) => (
                  <tr key={model.id} className={getRowTier(model)}>
                    <td className="whitespace-nowrap font-semibold" style={{ color: '#E2E8F0' }}>{model.name}</td>
                    <td style={{ color: '#64748B' }}>{model.provider}</td>
                    <td style={{ color: '#475569', fontSize: '0.65rem' }}>{model.parameters}</td>
                    <td className="text-right">{formatNumber(model.context_window)}</td>
                    {benchmarkKeys.map(k => (
                      <td key={k} className={`text-right ${getScoreTier(model.benchmarks[k])}`}>
                        {model.benchmarks[k].toFixed(1)}
                      </td>
                    ))}
                    <td className="text-right" style={{ color: model.pricing.input === 0 ? '#22C55E' : '#94A3B8' }}>
                      {model.pricing.input === 0 ? 'FREE' : formatPrice(model.pricing.input)}
                    </td>
                    <td className="text-right" style={{ color: model.pricing.output === 0 ? '#22C55E' : '#94A3B8' }}>
                      {model.pricing.output === 0 ? 'FREE' : formatPrice(model.pricing.output)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
