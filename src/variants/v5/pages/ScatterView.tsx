import ScatterPlot from '@/components/ScatterPlot'
import { Model } from '@/types/model'
import { formatPrice, calculateAverageBenchmark } from '@/utils/formatters'
import { organicTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const paidModels = models.filter(m => m.pricing.input > 0)
const freeModels = models.filter(m => m.pricing.input === 0)
const avgInputPrice = (paidModels.reduce((s, m) => s + m.pricing.input, 0) / paidModels.length)
const cheapest = [...paidModels].sort((a, b) => a.pricing.input - b.pricing.input)[0]
const mostExpensive = [...paidModels].sort((a, b) => b.pricing.input - a.pricing.input)[0]

function getScoreTier(score: number): string {
  if (score >= 90) return 'v5-score-excellent'
  if (score >= 80) return 'v5-score-good'
  if (score >= 60) return 'v5-score-moderate'
  return 'v5-score-low'
}

function ScatterView() {
  return (
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <div className="v5-float-up">
        <h1 className="v5-heading v5-heading-lg" style={{ marginBottom: '0.15rem' }}>
          The Landscape
        </h1>
        <p className="v5-annotation" style={{ fontSize: '1.05rem' }}>
          mapping price against performance — finding the fertile ground 🍃
        </p>
      </div>

      {/* ====== STATS ====== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 v5-float-up-d1">
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ color: '#D4A574' }}>
              {formatPrice(avgInputPrice)}
            </div>
            <div className="v5-stat-label">avg input per 1M tokens</div>
          </div>
        </div>
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ color: '#2D5016' }}>
              {formatPrice(cheapest.pricing.input)}
            </div>
            <div className="v5-stat-label">most affordable paid</div>
          </div>
        </div>
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ color: '#C4623D' }}>
              {formatPrice(mostExpensive.pricing.input)}
            </div>
            <div className="v5-stat-label">premium tier</div>
          </div>
        </div>
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ color: '#6B8F4E' }}>
              {freeModels.length}
            </div>
            <div className="v5-stat-label">free wildflowers 🌿</div>
          </div>
        </div>
      </div>

      {/* ====== SCATTER CHART ====== */}
      <div className="v5-card v5-float-up-d2" style={{ overflow: 'hidden' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="v5-section-title" style={{ marginBottom: 0 }}>
            <span className="icon">🍃</span>
            Terrain Map
          </div>
          <span className="v5-badge v5-badge-moss">interactive</span>
        </div>
        <p className="v5-annotation" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          up and to the left = best value. the sweet spot of the ecosystem.
        </p>
        <div className="v5-chart-container v5-grow-up">
          <ScatterPlot models={models} theme={organicTheme} />
        </div>
      </div>

      {/* ====== VALUE RANKINGS + GUIDE ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 v5-float-up-d3">
        {/* Best value */}
        <div className="v5-card v5-card-accent" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="px-5 pt-4 pb-2" style={{ borderBottom: '1px solid rgba(212, 196, 168, 0.35)' }}>
            <div className="v5-section-title" style={{ marginBottom: 0 }}>
              <span className="icon">🌱</span>
              Best Value
            </div>
            <p className="v5-annotation" style={{ fontSize: '0.8rem' }}>
              most intelligence per dollar — the heartiest seedlings
            </p>
          </div>
          <div className="overflow-x-auto" style={{ maxHeight: '320px' }}>
            <table className="v5-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Model</th>
                  <th className="text-right">Avg</th>
                  <th className="text-right">$/1M</th>
                  <th className="text-right">Ratio</th>
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
                    <tr key={item.model.id} className={i < 3 ? 'v5-row-top' : ''}>
                      <td>
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', color: i < 3 ? '#2D5016' : '#B8A88A' }}>
                          {i + 1}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#3E2723', fontSize: '0.78rem' }}>{item.model.name}</span>
                        <br />
                        <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.72rem', color: '#B8A88A' }}>{item.model.provider}</span>
                      </td>
                      <td className={`text-right ${getScoreTier(item.avg)}`}>{item.avg.toFixed(1)}</td>
                      <td className="text-right" style={{ color: '#8B7355', fontSize: '0.75rem' }}>{formatPrice(item.model.pricing.input)}</td>
                      <td className="text-right v5-score-excellent" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
                        {item.ratio.toFixed(0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reading guide */}
        <div className="v5-card">
          <div className="v5-section-title">
            <span className="icon">📖</span>
            Field Guide
          </div>
          <div className="space-y-3.5">
            {[
              { label: 'X-Axis', desc: 'Input price per 1M tokens on a log scale. Further left means more affordable.', annotation: 'cheap is to the left →' },
              { label: 'Y-Axis', desc: 'Selected benchmark score. Higher means stronger capability.', annotation: 'smarter is up there ↑' },
              { label: 'Sweet Spot', desc: 'Upper-left quadrant represents high capability at low cost — the lush valley of the landscape.', annotation: 'the garden of eden ✿' },
              { label: 'Circle Size', desc: 'Represents parameter count where known. Bigger models, bigger circles.', annotation: 'big trees, deep roots 🌳' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: '0.85rem', fontWeight: 700, color: '#3E2723' }}>
                    {item.label}
                  </span>
                </div>
                <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.78rem', color: '#5D4E37', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
                <p className="v5-annotation" style={{ fontSize: '0.78rem', marginTop: '0.15rem' }}>
                  {item.annotation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScatterView
