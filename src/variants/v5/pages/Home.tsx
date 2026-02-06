import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Model } from '@/types/model'
import { formatPrice, calculateAverageBenchmark } from '@/utils/formatters'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const providers = [...new Set(models.map(m => m.provider))]
const topModels = [...models].sort((a, b) => calculateAverageBenchmark(b.benchmarks) - calculateAverageBenchmark(a.benchmarks))
const topModel = topModels[0]
const avgScore = (models.reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) / models.length)
const latestModels = [...models].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()).slice(0, 5)
const freeModels = models.filter(m => m.pricing.input === 0)

const providerColors: Record<string, string> = {
  'OpenAI': '#2D5016',
  'Anthropic': '#C4623D',
  'Google': '#7EB8DA',
  'Meta': '#6B8F4E',
  'Mistral AI': '#D4A574',
  'DeepSeek': '#8B6F47',
  'Alibaba': '#A67B5B',
  'Moonshot': '#B8860B',
}

function getScoreTier(score: number): string {
  if (score >= 90) return 'v5-score-excellent'
  if (score >= 80) return 'v5-score-good'
  if (score >= 60) return 'v5-score-moderate'
  return 'v5-score-low'
}

// Animated counter
function useAnimatedCounter(target: number, duration: number = 1000, decimals: number = 0) {
  const [value, setValue] = useState(0)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // spring-like ease
      const eased = 1 - Math.pow(1 - progress, 4)
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

// SVG blob background for the ecosystem
function BlobBackground() {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.06 }}>
      <ellipse cx="400" cy="300" rx="350" ry="250" fill="#2D5016" />
      <ellipse cx="250" cy="200" rx="120" ry="100" fill="#6B8F4E" />
      <ellipse cx="550" cy="420" rx="150" ry="110" fill="#7EB8DA" />
      <ellipse cx="600" cy="180" rx="100" ry="80" fill="#C4623D" />
    </svg>
  )
}

// Ecosystem layout — circular arrangement of model bubbles
function EcosystemView() {
  const [hoveredModel, setHoveredModel] = useState<Model | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Arrange models in a circular/organic layout
  const bubbles = useMemo(() => {
    const sorted = [...models].sort((a, b) => calculateAverageBenchmark(b.benchmarks) - calculateAverageBenchmark(a.benchmarks))
    const centerX = 50 // percentage
    const centerY = 50

    return sorted.map((model, i) => {
      const avg = calculateAverageBenchmark(model.benchmarks)
      // Place top models closer to center
      const tier = i < 6 ? 0 : i < 15 ? 1 : 2
      const radiusBase = tier === 0 ? 12 : tier === 1 ? 28 : 40
      const angleSpread = tier === 0 ? 6 : tier === 1 ? 9 : sorted.length - 15
      const angleIdx = tier === 0 ? i : tier === 1 ? i - 6 : i - 15
      const angle = (angleIdx / angleSpread) * Math.PI * 2 + (tier * 0.4)

      // Add organic randomness
      const jitterX = Math.sin(i * 7.3) * 3
      const jitterY = Math.cos(i * 5.7) * 3
      const radius = radiusBase + Math.sin(i * 3.1) * 4

      const x = centerX + Math.cos(angle) * radius + jitterX
      const y = centerY + Math.sin(angle) * radius + jitterY

      // Size based on score
      const size = Math.max(38, Math.min(70, avg * 0.7))

      return { model, x, y, size, avg }
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden v5-bloom-in"
      style={{ height: '500px' }}
    >
      <BlobBackground />

      {bubbles.map(({ model, x, y, size, avg }, i) => {
        const color = providerColors[model.provider] || '#8B7355'
        const isHovered = hoveredModel?.id === model.id

        return (
          <div
            key={model.id}
            className="v5-ecosystem-bubble"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              transform: `translate(-50%, -50%)${isHovered ? ' scale(1.15)' : ''}`,
              background: `radial-gradient(circle at 35% 35%, ${color}20, ${color}40)`,
              borderColor: `${color}60`,
              animationDelay: `${i * 0.04}s`,
              zIndex: isHovered ? 20 : 1,
            }}
            onMouseEnter={() => setHoveredModel(model)}
            onMouseLeave={() => setHoveredModel(null)}
          >
            <span
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: size > 50 ? '0.55rem' : '0.45rem',
                fontWeight: 700,
                color: color,
                textAlign: 'center',
                lineHeight: 1.1,
                maxWidth: `${size - 8}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {model.name.length > 10 ? model.name.split(' ').slice(-1)[0] : model.name}
            </span>
          </div>
        )
      })}

      {/* Tooltip */}
      {hoveredModel && (
        <div
          className="absolute z-30 pointer-events-none v5-card"
          style={{
            left: '50%',
            bottom: '12px',
            transform: 'translateX(-50%)',
            padding: '0.8rem 1rem',
            minWidth: '240px',
            animation: 'v5-floatUp 0.3s ease forwards',
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '0.95rem', color: '#3E2723' }}>
              {hoveredModel.name}
            </span>
            <span className={`${getScoreTier(calculateAverageBenchmark(hoveredModel.benchmarks))}`} style={{ fontFamily: "'Fraunces', serif", fontSize: '1.1rem', fontWeight: 700 }}>
              {calculateAverageBenchmark(hoveredModel.benchmarks).toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-3" style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.72rem', color: '#8B7355' }}>
            <span>{hoveredModel.provider}</span>
            <span>·</span>
            <span>{hoveredModel.parameters}</span>
            <span>·</span>
            <span>{hoveredModel.pricing.input === 0 ? '🌿 Free' : formatPrice(hoveredModel.pricing.input) + '/1M'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Home() {
  const modelCount = useAnimatedCounter(models.length, 800)
  const providerCount = useAnimatedCounter(providers.length, 800)
  const avgScoreDisplay = useAnimatedCounter(avgScore, 1000, 1)

  return (
    <div className="space-y-8">
      {/* ====== HERO ====== */}
      <div className="text-center v5-float-up" style={{ marginTop: '0.5rem' }}>
        <h1 className="v5-heading v5-heading-lg" style={{ marginBottom: '0.25rem' }}>
          The AI Ecosystem
        </h1>
        <p className="v5-annotation" style={{ fontSize: '1.2rem' }}>
          a living garden of language models, growing & evolving ✿
        </p>
      </div>

      {/* ====== STATS ROW ====== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 v5-float-up-d1">
        {[
          { value: modelCount, label: 'models in the garden', color: '#2D5016' },
          { value: providerCount, label: 'provider species', color: '#C4623D' },
          { value: `${avgScoreDisplay}%`, label: 'average bloom score', color: '#6B8F4E' },
          { value: `${freeModels.length}`, label: 'open-source wildflowers', color: '#7EB8DA' },
        ].map((stat, i) => (
          <div key={i} className="v5-card">
            <div className="v5-stat">
              <div className="v5-stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="v5-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ====== ECOSYSTEM VIEW ====== */}
      <div className="v5-card v5-float-up-d2" style={{ padding: '1rem', overflow: 'hidden' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="v5-section-title" style={{ marginBottom: 0 }}>
            <span className="icon">🌍</span>
            Model Ecosystem
          </div>
          <span className="v5-annotation" style={{ fontSize: '0.9rem' }}>
            hover to explore — bigger = stronger ✦
          </span>
        </div>
        <EcosystemView />
      </div>

      {/* ====== TOP PERFORMERS + SIDEBAR ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 v5-float-up-d3">
        {/* LEFT: Top performers table */}
        <div className="lg:col-span-2 v5-card v5-card-accent" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: 'rgba(212, 196, 168, 0.35)' }}>
            <div className="flex items-center justify-between">
              <div className="v5-section-title" style={{ marginBottom: 0 }}>
                <span className="icon">🌲</span>
                Tallest Trees
              </div>
              <span className="v5-badge v5-badge-green">Top 10</span>
            </div>
            <p className="v5-annotation" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
              the highest-performing models by aggregate score
            </p>
          </div>
          <div className="overflow-x-auto" style={{ maxHeight: '380px' }}>
            <table className="v5-table">
              <thead>
                <tr>
                  <th style={{ width: '28px' }}>#</th>
                  <th>Model</th>
                  <th>Provider</th>
                  <th className="text-right">Avg</th>
                  <th className="text-right">MMLU</th>
                  <th className="text-right">Code</th>
                  <th className="text-right">Math</th>
                  <th className="text-right">GPQA</th>
                </tr>
              </thead>
              <tbody>
                {topModels.slice(0, 10).map((model, i) => {
                  const avg = calculateAverageBenchmark(model.benchmarks)
                  const color = providerColors[model.provider] || '#8B7355'
                  return (
                    <tr key={model.id} className={i < 3 ? 'v5-row-top' : ''}>
                      <td>
                        <span style={{
                          fontFamily: "'Caveat', cursive",
                          fontSize: '1rem',
                          color: i < 3 ? '#2D5016' : '#B8A88A',
                          fontWeight: i < 3 ? 700 : 400,
                        }}>
                          {i + 1}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#3E2723' }}>{model.name}</span>
                      </td>
                      <td>
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-1.5"
                          style={{ background: color }}
                        />
                        <span style={{ color: '#8B7355', fontSize: '0.75rem' }}>{model.provider}</span>
                      </td>
                      <td className={`text-right font-bold ${getScoreTier(avg)}`}>{avg.toFixed(1)}</td>
                      <td className={`text-right ${getScoreTier(model.benchmarks.MMLU)}`}>{model.benchmarks.MMLU.toFixed(1)}</td>
                      <td className={`text-right ${getScoreTier(model.benchmarks.HumanEval)}`}>{model.benchmarks.HumanEval.toFixed(1)}</td>
                      <td className={`text-right ${getScoreTier(model.benchmarks.MATH)}`}>{model.benchmarks.MATH.toFixed(1)}</td>
                      <td className={`text-right ${getScoreTier(model.benchmarks.GPQA)}`}>{model.benchmarks.GPQA.toFixed(1)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-4">
          {/* Leading bloom */}
          <div className="v5-card v5-card-accent">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '1.2rem' }}>🏆</span>
              <span className="v5-heading v5-heading-sm">Leading Bloom</span>
            </div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1rem', color: '#3E2723' }}>
                  {topModel.name}
                </div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.9rem', color: '#8B7355' }}>
                  {topModel.provider} · {topModel.parameters}
                </div>
              </div>
              <div className="v5-stat-value" style={{ fontSize: '1.6rem', color: '#2D5016' }}>
                {calculateAverageBenchmark(topModel.benchmarks).toFixed(1)}
              </div>
            </div>
            <div className="space-y-1.5 mt-3">
              {['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA'].map(key => (
                <div key={key} className="flex items-center gap-2">
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.8rem', color: '#B8A88A', width: '65px', flexShrink: 0 }}>{key}</span>
                  <div className="flex-1 v5-minibar">
                    <div className="v5-minibar-fill" style={{
                      width: `${topModel.benchmarks[key]}%`,
                      background: topModel.benchmarks[key] >= 90 ? '#2D5016' : topModel.benchmarks[key] >= 80 ? '#6B8F4E' : '#C4623D',
                    }} />
                  </div>
                  <span className={getScoreTier(topModel.benchmarks[key])} style={{ fontSize: '0.75rem', width: '35px', textAlign: 'right' }}>
                    {topModel.benchmarks[key].toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent sprouts */}
          <div className="v5-card v5-card-sky">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '1.1rem' }}>🌱</span>
              <span className="v5-heading v5-heading-sm">Recent Sprouts</span>
            </div>
            <div className="space-y-2">
              {latestModels.map((model, i) => (
                <div key={model.id} className="flex items-center justify-between">
                  <div>
                    <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#3E2723' }}>
                      {model.name}
                    </div>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', color: '#B8A88A' }}>
                      {model.provider}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.68rem', color: '#8B7355' }}>
                    {model.release_date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== PROVIDER MEADOW + QUICK LINKS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 v5-float-up-d4">
        {/* Provider distribution */}
        <div className="v5-card">
          <div className="v5-section-title">
            <span className="icon">🌻</span>
            Provider Meadow
          </div>
          <div className="space-y-2.5">
            {providers.map(provider => {
              const count = models.filter(m => m.provider === provider).length
              const pct = (count / models.length) * 100
              const providerAvg = models.filter(m => m.provider === provider).reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) / count
              const color = providerColors[provider] || '#8B7355'

              return (
                <div key={provider} className="flex items-center gap-2.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#5D4E37', width: '75px', flexShrink: 0 }}>
                    {provider}
                  </span>
                  <div className="flex-1 v5-minibar" style={{ height: '7px' }}>
                    <div className="v5-minibar-fill" style={{ width: `${pct}%`, background: color, opacity: 0.7 }} />
                  </div>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#8B7355', width: '20px', textAlign: 'right' }}>
                    {count}
                  </span>
                  <span className={getScoreTier(providerAvg)} style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.72rem', width: '38px', textAlign: 'right' }}>
                    {providerAvg.toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick navigation */}
        <div className="v5-card">
          <div className="v5-section-title">
            <span className="icon">🗺️</span>
            Explore the Garden
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/5/comparison', icon: '🌾', label: 'Compare', desc: 'Full model comparison field' },
              { to: '/5/radar', icon: '🌸', label: 'Radar', desc: 'Multi-axis capability petals' },
              { to: '/5/timeline', icon: '🌱', label: 'Timeline', desc: 'Growth over the seasons' },
              { to: '/5/scatter', icon: '🍃', label: 'Scatter', desc: 'Price vs performance landscape' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="v5-card group"
                style={{ padding: '1rem', borderRadius: '0.75rem' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                  <span style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#3E2723',
                  }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#8B7355' }}>
                  {item.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
