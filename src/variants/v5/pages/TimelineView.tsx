import Timeline from '@/components/Timeline'
import { Model } from '@/types/model'
import { calculateAverageBenchmark, formatDate } from '@/utils/formatters'
import { organicTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const providers = [...new Set(models.map(m => m.provider))]
const avgScore = (models.reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) / models.length).toFixed(1)
const sortedByDate = [...models].sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
const earliest = sortedByDate[0]
const latest = sortedByDate[sortedByDate.length - 1]

const providerColors: Record<string, string> = organicTheme.colors.providerColors

function TimelineView() {
  return (
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <div className="v5-float-up">
        <h1 className="v5-heading v5-heading-lg" style={{ marginBottom: '0.15rem' }}>
          Growth Rings
        </h1>
        <p className="v5-annotation" style={{ fontSize: '1.05rem' }}>
          watching the ecosystem evolve over the seasons — each dot a new life 🌱
        </p>
      </div>

      {/* ====== STATS ====== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 v5-float-up-d1">
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ fontSize: '1.1rem', color: '#7EB8DA' }}>
              {formatDate(earliest.release_date)}
            </div>
            <div className="v5-stat-label">first seed planted</div>
          </div>
        </div>
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ fontSize: '1.1rem', color: '#2D5016' }}>
              {formatDate(latest.release_date)}
            </div>
            <div className="v5-stat-label">latest bloom</div>
          </div>
        </div>
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ color: '#C4623D' }}>
              {avgScore}%
            </div>
            <div className="v5-stat-label">mean garden score</div>
          </div>
        </div>
        <div className="v5-card">
          <div className="v5-stat">
            <div className="v5-stat-value" style={{ fontSize: '1rem', color: '#6B8F4E' }}>
              {latest.name}
            </div>
            <div className="v5-stat-label">freshest arrival</div>
          </div>
        </div>
      </div>

      {/* ====== TIMELINE CHART ====== */}
      <div className="v5-card v5-float-up-d2" style={{ overflow: 'hidden' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="v5-section-title" style={{ marginBottom: 0 }}>
            <span className="icon">🌿</span>
            Seasonal Growth
          </div>
          <span className="v5-badge v5-badge-moss">interactive</span>
        </div>
        <p className="v5-annotation" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          each circle is a model — watch how the ecosystem grew stronger over time
        </p>
        <div className="v5-chart-container v5-grow-up">
          <Timeline models={modelsData.models} theme={organicTheme} />
        </div>
      </div>

      {/* ====== LEGEND / INSIGHTS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 v5-float-up-d3">
        <div className="v5-card">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '1.1rem' }}>📏</span>
            <span className="v5-heading v5-heading-sm">Y-Axis</span>
          </div>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.78rem', color: '#5D4E37', lineHeight: 1.7 }}>
            Aggregate mean across all 8 benchmarks. Higher on the chart means a stronger, healthier model.
          </p>
          <p className="v5-annotation" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
            think of it as how tall the tree grew ↑
          </p>
        </div>
        <div className="v5-card">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '1.1rem' }}>⭕</span>
            <span className="v5-heading v5-heading-sm">Circle Size</span>
          </div>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.78rem', color: '#5D4E37', lineHeight: 1.7 }}>
            Proportional to parameter count. Larger circles = bigger models. Unknown architectures use default size.
          </p>
          <p className="v5-annotation" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
            the bigger the fruit, the more nutrients inside 🍎
          </p>
        </div>
        <div className="v5-card">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '1.1rem' }}>🌿</span>
            <span className="v5-heading v5-heading-sm">Provider Colors</span>
          </div>
          <div className="space-y-1.5 mt-1">
            {providers.slice(0, 6).map(provider => (
              <div key={provider} className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: providerColors[provider] || '#8B7355' }} />
                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.75rem', color: '#5D4E37' }}>
                  {provider}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineView
