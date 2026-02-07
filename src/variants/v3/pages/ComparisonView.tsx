import { useState, useMemo } from 'react'
import { Model } from '@/types/model'
import { formatNumber, formatPrice } from '@/utils/formatters'
import { BENCHMARK_FIELDS } from '@/data/constants'
import modelsData from '../../../../data/models.json'

type SortField = 'name' | 'provider' | 'parameters' | 'context_window' |
  'MMLU' | 'HumanEval' | 'MATH' | 'GSM8K' | 'GPQA' | 'HellaSwag' | 'ARC' | 'TruthfulQA' |
  'price_input' | 'price_output'
type SortDirection = 'asc' | 'desc'

const models: Model[] = modelsData.models

function ComparisonView() {
  const [sortField, setSortField] = useState<SortField>('MMLU')
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

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th onClick={() => handleSort(field)}>
      {label}
      {sortField === field && (
        <span className="v3-gold-accent ml-1">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>
  )

  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 pt-16 md:pt-20 pb-8">
        <div className="v3-fade-in">
          <div className="v3-section-title mb-4">Complete Reference</div>
          <h1 className="v3-headline" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            The<br />
            <span className="italic font-normal" style={{ color: '#C9A96E' }}>Compendium</span>
          </h1>
          <p className="v3-subheadline max-w-xl mt-4" style={{ fontSize: '1.1rem' }}>
            Every model, every metric—sorted, filtered, and ranked. The authoritative reference
            for frontier AI performance.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider-gold" />
      </div>

      {/* ====== FILTERS ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8">
        <div className="v3-fade-in-delay-1">
          <div className="v3-section-title mb-6">Refine</div>

          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model name or laboratory..."
              className="v3-input w-full md:w-96"
            />
          </div>

          <div className="mb-6">
            <div className="v3-label mb-3" style={{ fontSize: '0.55rem' }}>Filter by Laboratory</div>
            <div className="flex flex-wrap gap-2">
              {providers.map(provider => (
                <button
                  key={provider}
                  onClick={() => toggleProvider(provider)}
                  className={`v3-provider-pill ${selectedProviders.includes(provider) ? 'active' : ''}`}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E8E2D8] pt-4">
            <div className="v3-label" style={{ fontSize: '0.55rem' }}>
              <span className="v3-gold-accent">{filteredAndSortedModels.length}</span> of {models.length} models
            </div>
            {selectedProviders.length > 0 && (
              <button
                onClick={() => setSelectedProviders([])}
                className="v3-btn"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider" />
      </div>

      {/* ====== THE TABLE ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8 pb-16">
        <div className="v3-fade-in-delay-2">
          <div className="flex items-baseline justify-between mb-8">
            <div className="v3-section-title">Full Index</div>
            <div className="v3-label" style={{ fontSize: '0.55rem' }}>Click headers to sort</div>
          </div>

          <div className="overflow-x-auto">
            <table className="v3-table">
              <thead>
                <tr>
                  <SortHeader field="name" label="Model" />
                  <SortHeader field="provider" label="Laboratory" />
                  <SortHeader field="parameters" label="Params" />
                  <SortHeader field="context_window" label="Context" />
                  {BENCHMARK_FIELDS.map(field => (
                    <SortHeader key={field} field={field as SortField} label={field} />
                  ))}
                  <SortHeader field="price_input" label="Input" />
                  <SortHeader field="price_output" label="Output" />
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedModels.map((model) => (
                  <tr key={model.id}>
                    <td
                      className="font-semibold whitespace-nowrap"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem' }}
                    >
                      {model.name}
                    </td>
                    <td className="v3-label" style={{ fontSize: '0.65rem' }}>{model.provider}</td>
                    <td style={{ color: '#7A7A7A', fontSize: '0.75rem' }}>{model.parameters}</td>
                    <td className="text-right">{formatNumber(model.context_window)}</td>
                    {BENCHMARK_FIELDS.map(field => {
                      const isTop = top3ByBenchmark[field]?.has(model.id)
                      return (
                        <td
                          key={field}
                          className={`text-right ${isTop ? 'v3-top-performer' : ''}`}
                        >
                          {model.benchmarks[field].toFixed(1)}
                        </td>
                      )
                    })}
                    <td className="text-right">
                      {model.pricing.input === 0
                        ? <span className="v3-gold-accent italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Gratis</span>
                        : formatPrice(model.pricing.input)
                      }
                    </td>
                    <td className="text-right">
                      {model.pricing.output === 0
                        ? <span className="v3-gold-accent italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Gratis</span>
                        : formatPrice(model.pricing.output)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedModels.length === 0 && (
            <div className="border border-[#E8E2D8] py-16 px-8 text-center mt-4">
              <div className="v3-headline text-xl italic font-normal" style={{ color: '#C9A96E' }}>
                No models match your criteria
              </div>
              <p className="v3-subheadline mt-2" style={{ fontSize: '0.95rem' }}>
                Adjust your filters to reveal more results.
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-8 mt-6 pt-4 border-t border-[#E8E2D8]">
            <div className="flex items-center gap-2">
              <span className="v3-gold-accent font-bold">◆</span>
              <span className="v3-label" style={{ fontSize: '0.55rem' }}>Top 3 Performer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="v3-gold-accent italic" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.85rem' }}>Gratis</span>
              <span className="v3-label" style={{ fontSize: '0.55rem' }}>Free Tier</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ComparisonView
