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

  // Top 3 per benchmark
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
    <th
      onClick={() => handleSort(field)}
      className="cursor-pointer select-none"
    >
      {label}
      {sortField === field && (
        <span className="text-[#FF6600] ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>
      )}
    </th>
  )

  return (
    <div>
      {/* HEADER */}
      <div className="border-b-2 border-[#FF6600] pb-3 mb-6">
        <h1 className="font-['Archivo_Black'] text-3xl uppercase">COMPARISON TABLE</h1>
        <p className="text-xs text-[#B0B0B0] mt-1 uppercase tracking-wider">
          {models.length} MODELS // RAW DATA // CLICK HEADERS TO SORT
        </p>
      </div>

      {/* FILTERS */}
      <div className="border-2 border-white p-4 mb-6">
        <div className="mb-4">
          <label className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0] block mb-2">SEARCH //</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="MODEL NAME OR PROVIDER..."
            className="v1-input w-full"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0] block mb-2">FILTER BY PROVIDER //</label>
          <div className="flex flex-wrap gap-1">
            {providers.map(provider => (
              <button
                key={provider}
                onClick={() => toggleProvider(provider)}
                className={`v1-provider-pill ${selectedProviders.includes(provider) ? 'active' : ''}`}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#B0B0B0] border-t border-[#333] pt-2">
          <span>SHOWING {filteredAndSortedModels.length} OF {models.length}</span>
          {selectedProviders.length > 0 && (
            <button
              onClick={() => setSelectedProviders([])}
              className="text-[#FF6600] uppercase tracking-wider hover:bg-[#FF6600] hover:text-black px-2 py-1"
            >
              CLEAR FILTERS
            </button>
          )}
        </div>
      </div>

      {/* THE TABLE */}
      <div className="overflow-x-auto border-2 border-white">
        <table className="v1-table">
          <thead>
            <tr>
              <SortHeader field="name" label="MODEL" />
              <SortHeader field="provider" label="PROVIDER" />
              <SortHeader field="parameters" label="PARAMS" />
              <SortHeader field="context_window" label="CTX" />
              {BENCHMARK_FIELDS.map(field => (
                <SortHeader key={field} field={field} label={field} />
              ))}
              <SortHeader field="price_input" label="IN $/1M" />
              <SortHeader field="price_output" label="OUT $/1M" />
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedModels.map((model) => (
              <tr key={model.id}>
                <td className="font-bold whitespace-nowrap">{model.name}</td>
                <td className="text-[#B0B0B0]">{model.provider}</td>
                <td className="text-[#B0B0B0]">{model.parameters}</td>
                <td className="text-right">{formatNumber(model.context_window)}</td>
                {BENCHMARK_FIELDS.map(field => {
                  const isTop = top3ByBenchmark[field]?.has(model.id)
                  return (
                    <td
                      key={field}
                      className={`text-right ${isTop ? 'top-performer' : ''}`}
                    >
                      {model.benchmarks[field].toFixed(1)}
                    </td>
                  )
                })}
                <td className="text-right">
                  {model.pricing.input === 0 ? 'FREE' : formatPrice(model.pricing.input)}
                </td>
                <td className="text-right">
                  {model.pricing.output === 0 ? 'FREE' : formatPrice(model.pricing.output)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedModels.length === 0 && (
        <div className="border-2 border-[#333] p-8 text-center text-[#B0B0B0] text-xs uppercase tracking-wider">
          NO MODELS MATCH FILTERS
        </div>
      )}

      {/* LEGEND */}
      <div className="border-t border-[#333] mt-4 pt-3 flex items-center gap-6 text-xs text-[#B0B0B0]">
        <div className="flex items-center gap-2">
          <span className="text-[#FF6600] font-bold">■</span>
          <span>TOP 3 PERFORMER</span>
        </div>
        <div className="flex items-center gap-2">
          <span>ROW HOVER = INVERT</span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonView
