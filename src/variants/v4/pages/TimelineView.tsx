import Timeline from '@/components/Timeline'
import { Model } from '@/types/model'
import { calculateAverageBenchmark } from '@/utils/formatters'
import { nocTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const dateRange = {
  earliest: [...models].sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())[0],
  latest: [...models].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())[0],
}

const providers = [...new Set(models.map(m => m.provider))]
const avgScore = (models.reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) / models.length).toFixed(1)

function TimelineView() {
  return (
    <div className="space-y-3">
      {/* ====== HEADER ====== */}
      <div className="v4-panel v4-fade-in">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">▸</span>
            TIMELINE ANALYSIS — RELEASE CHRONOLOGY & EVOLUTION
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="v4-status-dot v4-status-dot--green" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                {models.length} MODELS
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="v4-status-dot v4-status-dot--blue" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                {providers.length} PROVIDERS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ====== QUICK STATS ====== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 v4-fade-in-delay-1">
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value v4-stat-value--blue" style={{ fontSize: '1.1rem' }}>
              {dateRange.earliest.release_date}
            </div>
            <div className="v4-stat-label">EARLIEST RELEASE</div>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value v4-stat-value--green" style={{ fontSize: '1.1rem' }}>
              {dateRange.latest.release_date}
            </div>
            <div className="v4-stat-label">LATEST RELEASE</div>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value v4-stat-value--amber">{avgScore}%</div>
            <div className="v4-stat-label">MEAN AVG SCORE</div>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-stat">
            <div className="v4-stat-value" style={{ color: '#E2E8F0' }}>{dateRange.latest.name}</div>
            <div className="v4-stat-label" style={{ fontSize: '0.55rem' }}>MOST RECENT</div>
          </div>
        </div>
      </div>

      {/* ====== TIMELINE CHART ====== */}
      <div className="v4-panel v4-fade-in-delay-2">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">◉</span>
            TEMPORAL SCATTER — AVG SCORE vs RELEASE DATE
          </div>
          <div className="v4-panel-badge">INTERACTIVE</div>
        </div>
        <div className="v4-panel-body">
          <div className="v4-chart-container">
            <Timeline models={modelsData.models} theme={nocTheme} />
          </div>
        </div>
      </div>

      {/* ====== LEGEND PANELS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 v4-fade-in-delay-3">
        <div className="v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">Y-AXIS</div>
          </div>
          <div className="v4-panel-body">
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#94A3B8', lineHeight: '1.6' }}>
              Aggregate mean across all 8 benchmarks (MMLU, HumanEval, MATH, GSM8K, GPQA, HellaSwag, ARC, TruthfulQA).
              Higher = stronger overall capability.
            </p>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">CIRCLE SIZE</div>
          </div>
          <div className="v4-panel-body">
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#94A3B8', lineHeight: '1.6' }}>
              Proportional to parameter count. Models with undisclosed architecture render at default radius.
              MoE models use active parameter count.
            </p>
          </div>
        </div>
        <div className="v4-panel">
          <div className="v4-panel-header">
            <div className="v4-panel-title">CONNECTION LINES</div>
          </div>
          <div className="v4-panel-body">
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#94A3B8', lineHeight: '1.6' }}>
              Trace model family evolution (GPT, Claude, Gemini, etc). Shows capability progression within each lineage over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineView
