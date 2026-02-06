import ScatterPlot from '@/components/ScatterPlot'
import { Model } from '@/types/model'
import { formatPrice, calculateAverageBenchmark } from '@/utils/formatters'
import { nocTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const paidModels = models.filter(m => m.pricing.input > 0)
const avgInputPrice = (paidModels.reduce((s, m) => s + m.pricing.input, 0) / paidModels.length)
const cheapest = [...paidModels].sort((a, b) => a.pricing.input - b.pricing.input)[0]
const mostExpensive = [...paidModels].sort((a, b) => b.pricing.input - a.pricing.input)[0]
const freeModels = models.filter(m => m.pricing.input === 0)

function getScoreTier(score: number): string {
  if (score >= 90) return 'v4-cell-excellent'
  if (score >= 80) return 'v4-cell-good'
  if (score >= 60) return 'v4-cell-moderate'
  return 'v4-cell-low'
}

function ScatterView() {
  return (
    <div className="space-y-3">
      {/* ====== HEADER ====== */}
      <div className="v4-panel v4-fade-in">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">⬡</span>
            SCATTER ANALYSIS — PRICE vs PERFORMANCE
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="v4-status-dot v4-status-dot--green" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                {paidModels.length} PAID
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="v4-status-dot v4-status-dot--amber" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                {freeModels.length} FREE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== PRICING STATS ====== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 v4-fade-in-delay-1">
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value v4-stat-value--amber" style={{ fontSize: '1.25rem' }}>
              {formatPrice(avgInputPrice)}
            </div>
            <div className="v4-stat-label">AVG INPUT $/1M</div>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value v4-stat-value--green" style={{ fontSize: '1.25rem' }}>
              {formatPrice(cheapest.pricing.input)}
            </div>
            <div className="v4-stat-label">CHEAPEST PAID</div>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value v4-stat-value--red" style={{ fontSize: '1.25rem' }}>
              {formatPrice(mostExpensive.pricing.input)}
            </div>
            <div className="v4-stat-label">MOST EXPENSIVE</div>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value v4-stat-value--blue" style={{ fontSize: '1.25rem' }}>
              {freeModels.length}
            </div>
            <div className="v4-stat-label">FREE TIER MODELS</div>
          </div>
        </div>
      </div>

      {/* ====== SCATTER CHART ====== */}
      <div className="v4-panel v4-fade-in-delay-2">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">◉</span>
            PERFORMANCE vs COST — LOG SCALE
          </div>
          <div className="v4-panel-badge">INTERACTIVE</div>
        </div>
        <div className="v4-panel-body">
          <div className="v4-chart-container">
            <ScatterPlot models={models} theme={nocTheme} />
          </div>
        </div>
      </div>

      {/* ====== VALUE RANKINGS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 v4-fade-in-delay-3">
        {/* BEST VALUE */}
        <div className="v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">
              <span className="icon">▲</span>
              BEST VALUE — SCORE PER DOLLAR
            </div>
          </div>
          <div className="v4-panel-body p-0">
            <table className="v4-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>MODEL</th>
                  <th className="text-right">AVG</th>
                  <th className="text-right">$/1M IN</th>
                  <th className="text-right">RATIO</th>
                </tr>
              </thead>
              <tbody>
                {[...paidModels]
                  .map(m => ({
                    model: m,
                    avg: calculateAverageBenchmark(m.benchmarks),
                    ratio: calculateAverageBenchmark(m.benchmarks) / m.pricing.input,
                  }))
                  .sort((a, b) => b.ratio - a.ratio)
                  .slice(0, 8)
                  .map((item, i) => (
                    <tr key={item.model.id}>
                      <td style={{ color: '#475569', fontWeight: 600 }}>{i + 1}</td>
                      <td className="whitespace-nowrap" style={{ color: '#E2E8F0' }}>{item.model.name}</td>
                      <td className={`text-right ${getScoreTier(item.avg)}`}>{item.avg.toFixed(1)}</td>
                      <td className="text-right" style={{ color: '#94A3B8' }}>{formatPrice(item.model.pricing.input)}</td>
                      <td className="text-right v4-cell-excellent">{item.ratio.toFixed(0)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* READING GUIDE */}
        <div className="v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">
              <span className="icon">ℹ</span>
              READING GUIDE
            </div>
          </div>
          <div className="v4-panel-body space-y-3">
            {[
              { label: 'X-AXIS', desc: 'Input price per 1M tokens (log scale). Left = cheaper. Free-tier models excluded from chart.' },
              { label: 'Y-AXIS', desc: 'Selected benchmark score. Higher = better. Switch benchmarks using the dropdown.' },
              { label: 'SWEET SPOT', desc: 'Upper-left quadrant = high capability at low cost. The best intelligence per dollar.' },
              { label: 'PARETO LINE', desc: 'Dashed frontier connecting optimal models at each price point. Nothing above and left of this line.' },
              { label: 'CIRCLE SIZE', desc: 'Parameter count where known. Larger circles = bigger models.' },
            ].map((item) => (
              <div key={item.label} className="flex gap-2">
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#3B82F6', width: '85px', flexShrink: 0, letterSpacing: '0.05em' }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#94A3B8', lineHeight: '1.5' }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScatterView
