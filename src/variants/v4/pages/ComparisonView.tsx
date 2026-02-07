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

function getScoreTier(score: number): string {
  if (score >= 90) return 'v4-cell-excellent'
  if (score >= 80) return 'v4-cell-good'
  if (score >= 60) return 'v4-cell-moderate'
  return 'v4-cell-low'
}

function getRowTier(model: Model): string {
  const avg = calculateAverageBenchmark(model.benchmarks)
  if (avg >= 90) return 'tier-1'
  if (avg >= 80) return 'tier-2'
  return 'tier-3'
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
    // Also for average
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
          <span style={{ color: '#3B82F6' }}>
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </th>
  )

  return (
    <div className="space-y-3">
      {/* ====== HEADER ====== */}
      <div className="v4-panel v4-fade-in">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">≡</span>
            DATA TABLE — FULL MODEL COMPARISON MATRIX
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
              SHOWING
            </span>
            <span className="v4-panel-badge">{filteredAndSortedModels.length}/{models.length}</span>
          </div>
        </div>
      </div>

      {/* ====== FILTERS ====== */}
      <div className="v4-panel v4-fade-in-delay-1">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">⊞</span>
            FILTERS
          </div>
          {selectedProviders.length > 0 && (
            <button onClick={() => setSelectedProviders([])} className="v4-btn" style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}>
              CLEAR
            </button>
          )}
        </div>
        <div className="v4-panel-body">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH MODEL OR PROVIDER..."
              className="v4-input"
              style={{ width: '250px' }}
            />
            <div className="w-px h-5 bg-[#1E3A5F]" />
            <div className="flex flex-wrap gap-1.5">
              {providers.map(provider => (
                <button
                  key={provider}
                  onClick={() => toggleProvider(provider)}
                  className={`v4-tag ${selectedProviders.includes(provider) ? 'active' : ''}`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== THE TABLE ====== */}
      <div className="v4-panel v4-fade-in-delay-2">
        <div className="v4-panel-header">
          <div className="v4-panel-title">
            <span className="icon">▤</span>
            BENCHMARK MATRIX
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#64748B' }}>≥90</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#64748B' }}>≥80</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#64748B' }}>≥60</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: '#64748B' }}>&lt;60</span>
            </div>
          </div>
        </div>
        <div className="v4-panel-body p-0">
          <div className="overflow-x-auto" style={{ maxHeight: '70vh' }}>
            <table className="v4-table">
              <thead>
                <tr>
                  <SortHeader field="name" label="MODEL" />
                  <SortHeader field="provider" label="PROV" />
                  <SortHeader field="parameters" label="PARAMS" />
                  <SortHeader field="context_window" label="CTX" className="text-right" />
                  <SortHeader field="avg" label="AVG" className="text-right" />
                  {BENCHMARK_FIELDS.map(field => (
                    <SortHeader key={field} field={field as SortField} label={field.length > 7 ? field.substring(0, 6) : field} className="text-right" />
                  ))}
                  <SortHeader field="price_input" label="IN$" className="text-right" />
                  <SortHeader field="price_output" label="OUT$" className="text-right" />
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedModels.map((model) => {
                  const avg = calculateAverageBenchmark(model.benchmarks)
                  const isTopAvg = top3ByBenchmark['avg']?.has(model.id)
                  return (
                    <tr key={model.id} className={getRowTier(model)}>
                      <td className="whitespace-nowrap font-semibold" style={{ color: '#E2E8F0' }}>
                        {isTopAvg && <span style={{ color: '#22C55E', marginRight: '3px' }}>▲</span>}
                        {model.name}
                      </td>
                      <td style={{ color: '#64748B', fontSize: '0.65rem' }}>{model.provider}</td>
                      <td style={{ color: '#475569', fontSize: '0.6rem' }}>{model.parameters}</td>
                      <td className="text-right">{formatNumber(model.context_window)}</td>
                      <td className={`text-right font-bold ${getScoreTier(avg)}`}>
                        {avg.toFixed(1)}
                      </td>
                      {BENCHMARK_FIELDS.map(field => {
                        const isTop = top3ByBenchmark[field]?.has(model.id)
                        const val = model.benchmarks[field]
                        return (
                          <td
                            key={field}
                            className={`text-right ${getScoreTier(val)} ${isTop ? 'font-bold' : ''}`}
                            style={isTop ? { background: 'rgba(34,197,94,0.06)' } : undefined}
                          >
                            {val.toFixed(1)}
                          </td>
                        )
                      })}
                      <td className="text-right" style={{ color: model.pricing.input === 0 ? '#22C55E' : '#94A3B8' }}>
                        {model.pricing.input === 0 ? 'FREE' : formatPrice(model.pricing.input)}
                      </td>
                      <td className="text-right" style={{ color: model.pricing.output === 0 ? '#22C55E' : '#94A3B8' }}>
                        {model.pricing.output === 0 ? 'FREE' : formatPrice(model.pricing.output)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredAndSortedModels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div style={{ fontSize: '1.5rem', color: '#1E3A5F', marginBottom: '0.5rem' }}>∅</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.85rem', color: '#475569', letterSpacing: '0.08em' }}>
                NO MODELS MATCH CRITERIA
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#334155', marginTop: '0.25rem' }}>
                Adjust filters to reveal results
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== TABLE LEGEND ====== */}
      <div className="v4-panel v4-fade-in-delay-3">
        <div className="v4-panel-body">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 rounded" style={{ background: '#22C55E' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                TIER 1 — AVG ≥ 90
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 rounded" style={{ background: '#3B82F6' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                TIER 2 — AVG ≥ 80
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 rounded" style={{ background: '#F59E0B' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                TIER 3 — AVG &lt; 80
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#22C55E', fontSize: '0.7rem' }}>▲</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                TOP 3 OVERALL
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#22C55E' }}>FREE</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#64748B' }}>
                OPEN-SOURCE / FREE TIER
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonView
