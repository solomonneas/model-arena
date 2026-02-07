import { useState, useMemo } from 'react'
import { Model } from '@/types/model'
import { formatNumber, formatPrice, calculateAverageBenchmark } from '@/utils/formatters'
import { BENCHMARK_FIELDS } from '@/data/constants'
import modelsData from '../../../../data/models.json'

type SortField = 'name' | 'provider' | 'parameters' | 'context_window' | 'avg' |
  'MMLU' | 'HumanEval' | 'MATH' | 'GSM8K' | 'GPQA' | 'HellaSwag' | 'ARC' | 'TruthfulQA' |
  'price_input' | 'price_output'
type SortDirection = 'asc' | 'desc'

const models: Model[] = modelsData.models

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

function ComparisonView() {
  const [sortField, setSortField] = useState<SortField>('avg')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])

  const providers = useMemo(() => {
    return Array.from(new Set(models.map(m => m.provider))).sort()
  }, [])

  const filteredAndSortedModels = useMemo(() => {
    let filtered = [...models]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.provider.toLowerCase().includes(query)
      )
    }

    if (selectedProviders.length > 0) {
      filtered = filtered.filter(m => selectedProviders.includes(m.provider))
    }

    filtered.sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortField) {
        case 'name':
        case 'provider':
        case 'parameters':
          aVal = a[sortField].toLowerCase()
          bVal = b[sortField].toLowerCase()
          break
        case 'context_window':
          aVal = a.context_window
          bVal = b.context_window
          break
        case 'price_input':
          aVal = a.pricing.input
          bVal = b.pricing.input
          break
        case 'price_output':
          aVal = a.pricing.output
          bVal = b.pricing.output
          break
        case 'avg':
          aVal = calculateAverageBenchmark(a.benchmarks)
          bVal = calculateAverageBenchmark(b.benchmarks)
          break
        default:
          aVal = a.benchmarks[sortField as keyof Model['benchmarks']]
          bVal = b.benchmarks[sortField as keyof Model['benchmarks']]
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [searchQuery, selectedProviders, sortField, sortDirection])

  const top3ByBenchmark = useMemo(() => {
    const result: Record<string, Set<string>> = {}
    BENCHMARK_FIELDS.forEach(field => {
      const sorted = [...models].sort((a, b) => b.benchmarks[field] - a.benchmarks[field])
      result[field] = new Set(sorted.slice(0, 3).map(m => m.id))
    })
    const sortedAvg = [...models].sort((a, b) => calculateAverageBenchmark(b.benchmarks) - calculateAverageBenchmark(a.benchmarks))
    result['avg'] = new Set(sortedAvg.slice(0, 3).map(m => m.id))
    return result
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const toggleProvider = (provider: string) => {
    setSelectedProviders(prev =>
      prev.includes(provider) ? prev.filter(p => p !== provider) : [...prev, provider]
    )
  }

  const SortHeader = ({ field, label, className = '' }: { field: SortField; label: string; className?: string }) => (
    <th onClick={() => handleSort(field)} className={className}>
      <span className="flex items-center gap-0.5">
        {label}
        {sortField === field && (
          <span style={{ color: '#2D5016' }}>
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </th>
  )

  return (
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <div className="v5-float-up">
        <h1 className="v5-heading v5-heading-lg" style={{ marginBottom: '0.15rem' }}>
          The Field Guide
        </h1>
        <p className="v5-annotation" style={{ fontSize: '1.05rem' }}>
          a complete catalog of every species in the garden — sort, filter, and study 🌾
        </p>
      </div>

      {/* ====== FILTERS ====== */}
      <div className="v5-card v5-float-up-d1">
        <div className="flex items-center justify-between mb-3">
          <div className="v5-section-title" style={{ marginBottom: 0 }}>
            <span className="icon">🔍</span>
            Filters
          </div>
          <div className="flex items-center gap-2">
            <span className="v5-badge v5-badge-green">{filteredAndSortedModels.length}/{models.length}</span>
            {selectedProviders.length > 0 && (
              <button onClick={() => setSelectedProviders([])} className="v5-btn" style={{ fontSize: '0.7rem' }}>
                clear
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="search the field…"
            className="v5-input"
            style={{ width: '240px' }}
          />
          <div className="w-px h-5 bg-[#D4C4A8]" />
          <div className="flex flex-wrap gap-1.5">
            {providers.map(provider => {
              const color = providerColors[provider] || '#8B7355'
              const isActive = selectedProviders.includes(provider)
              return (
                <button
                  key={provider}
                  onClick={() => toggleProvider(provider)}
                  className={`v5-provider-tag ${isActive ? 'active' : ''}`}
                  style={isActive ? { background: color, borderColor: color } : {}}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: isActive ? '#FDFAF5' : color }}
                  />
                  {provider}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ====== THE TABLE ====== */}
      <div className="v5-card v5-float-up-d2" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="px-5 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(212, 196, 168, 0.35)' }}>
          <div className="flex items-center justify-between">
            <div className="v5-section-title" style={{ marginBottom: 0 }}>
              <span className="icon">🌾</span>
              Benchmark Garden
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#2D5016' }} />
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', color: '#8B7355' }}>≥90</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#6B8F4E' }} />
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', color: '#8B7355' }}>≥80</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C4623D' }} />
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', color: '#8B7355' }}>≥60</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4A574' }} />
                <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.78rem', color: '#8B7355' }}>&lt;60</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto" style={{ maxHeight: '70vh' }}>
          <table className="v5-table">
            <thead>
              <tr>
                <SortHeader field="name" label="Model" />
                <SortHeader field="provider" label="Provider" />
                <SortHeader field="parameters" label="Params" />
                <SortHeader field="context_window" label="Context" className="text-right" />
                <SortHeader field="avg" label="Avg" className="text-right" />
                {BENCHMARK_FIELDS.map(field => (
                  <SortHeader key={field} field={field} label={field.length > 7 ? field.substring(0, 6) : field} className="text-right" />
                ))}
                <SortHeader field="price_input" label="In $" className="text-right" />
                <SortHeader field="price_output" label="Out $" className="text-right" />
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedModels.map((model) => {
                const avg = calculateAverageBenchmark(model.benchmarks)
                const isTopAvg = top3ByBenchmark['avg']?.has(model.id)
                const color = providerColors[model.provider] || '#8B7355'

                return (
                  <tr key={model.id} className={isTopAvg ? 'v5-row-top' : ''}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#3E2723' }}>
                        {isTopAvg && <span style={{ color: '#2D5016', marginRight: '3px' }}>🌿</span>}
                        {model.name}
                      </span>
                    </td>
                    <td>
                      <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: color }} />
                      <span style={{ color: '#8B7355', fontSize: '0.73rem' }}>{model.provider}</span>
                    </td>
                    <td style={{ color: '#B8A88A', fontSize: '0.7rem' }}>{model.parameters}</td>
                    <td className="text-right" style={{ color: '#5D4E37' }}>{formatNumber(model.context_window)}</td>
                    <td className={`text-right font-bold ${getScoreTier(avg)}`} style={{ fontFamily: "'Fraunces', serif" }}>
                      {avg.toFixed(1)}
                    </td>
                    {BENCHMARK_FIELDS.map(field => {
                      const isTop = top3ByBenchmark[field]?.has(model.id)
                      const val = model.benchmarks[field]
                      return (
                        <td
                          key={field}
                          className={`text-right ${getScoreTier(val)} ${isTop ? 'font-bold' : ''}`}
                          style={isTop ? { background: 'rgba(45, 80, 22, 0.06)' } : undefined}
                        >
                          {val.toFixed(1)}
                        </td>
                      )
                    })}
                    <td className="text-right" style={{ color: model.pricing.input === 0 ? '#2D5016' : '#8B7355', fontWeight: model.pricing.input === 0 ? 700 : 400 }}>
                      {model.pricing.input === 0 ? '🌿 Free' : formatPrice(model.pricing.input)}
                    </td>
                    <td className="text-right" style={{ color: model.pricing.output === 0 ? '#2D5016' : '#8B7355', fontWeight: model.pricing.output === 0 ? 700 : 400 }}>
                      {model.pricing.output === 0 ? '🌿 Free' : formatPrice(model.pricing.output)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedModels.length === 0 && (
          <div className="v5-empty-state">
            <div className="icon">🍂</div>
            <div className="title">No models match</div>
            <div className="subtitle">try broadening your search — the garden has many hidden paths</div>
          </div>
        )}
      </div>

      {/* ====== LEGEND ====== */}
      <div className="v5-card v5-float-up-d3">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span style={{ color: '#2D5016', fontSize: '0.85rem' }}>🌿</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#8B7355' }}>
              Top 3 overall — the garden's finest
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: '0.73rem', fontWeight: 700, color: '#2D5016' }}>🌿 Free</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#8B7355' }}>
              Open-source wildflowers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '0.85rem', color: '#8B7355' }}>
              Click column headers to sort · highlighted cells are field leaders
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonView
