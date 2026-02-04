import { useState, useMemo } from 'react'
import { Model } from '@/types/model'
import { formatNumber, formatPrice } from '@/utils/formatters'

interface ComparisonTableProps {
  models: Model[]
  onModelSelect?: (modelId: string) => void
  selectedModels?: string[]
}

type SortField = 'name' | 'provider' | 'parameters' | 'context_window' |
  'MMLU' | 'HumanEval' | 'MATH' | 'GSM8K' | 'GPQA' | 'HellaSwag' | 'ARC' | 'TruthfulQA' |
  'price_input' | 'price_output'

type SortDirection = 'asc' | 'desc'

const BENCHMARK_FIELDS: Array<keyof Model['benchmarks']> = [
  'MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA', 'HellaSwag', 'ARC', 'TruthfulQA'
]

function ComparisonTable({ models, onModelSelect, selectedModels = [] }: ComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>('MMLU')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])

  // Get unique providers
  const providers = useMemo(() => {
    return Array.from(new Set(models.map(m => m.provider))).sort()
  }, [models])

  // Filter and sort models
  const filteredAndSortedModels = useMemo(() => {
    let filtered = models

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.provider.toLowerCase().includes(query)
      )
    }

    // Apply provider filter
    if (selectedProviders.length > 0) {
      filtered = filtered.filter(m => selectedProviders.includes(m.provider))
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal: any
      let bVal: any

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
          // Benchmark fields
          aVal = a.benchmarks[sortField as keyof Model['benchmarks']]
          bVal = b.benchmarks[sortField as keyof Model['benchmarks']]
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [models, searchQuery, selectedProviders, sortField, sortDirection])

  // Calculate top 3 for each benchmark
  const top3ByBenchmark = useMemo(() => {
    const result: Record<string, Set<string>> = {}

    BENCHMARK_FIELDS.forEach(field => {
      const sorted = [...models].sort((a, b) => b.benchmarks[field] - a.benchmarks[field])
      result[field] = new Set(sorted.slice(0, 3).map(m => m.id))
    })

    return result
  }, [models])

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
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    )
  }

  const handleRowClick = (modelId: string) => {
    onModelSelect?.(modelId)
  }

  const isTop3 = (modelId: string, benchmark: string) => {
    return top3ByBenchmark[benchmark]?.has(modelId)
  }

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-primary-600 transition-colors"
    >
      {label}
      {sortField === field && (
        <span className="text-primary-600">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Models
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or provider..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Provider Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Provider
          </label>
          <div className="flex flex-wrap gap-2">
            {providers.map(provider => (
              <label
                key={provider}
                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedProviders.includes(provider)}
                  onChange={() => toggleProvider(provider)}
                  className="mr-2 rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{provider}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedModels.length} of {models.length} models
          {selectedProviders.length > 0 && (
            <button
              onClick={() => setSelectedProviders([])}
              className="ml-2 text-primary-600 hover:text-primary-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="sticky left-0 bg-gray-50 text-left py-3 px-4 font-semibold text-gray-700 border-r border-gray-200">
                  <SortButton field="name" label="Model" />
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <SortButton field="provider" label="Provider" />
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  <SortButton field="parameters" label="Parameters" />
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  <SortButton field="context_window" label="Context" />
                </th>
                {BENCHMARK_FIELDS.map(field => (
                  <th key={field} className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                    <SortButton field={field} label={field} />
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                  <SortButton field="price_input" label="Price (In)" />
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">
                  <SortButton field="price_output" label="Price (Out)" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedModels.map((model) => (
                <tr
                  key={model.id}
                  onClick={() => handleRowClick(model.id)}
                  className={`border-b border-gray-100 hover:bg-primary-50 transition-colors duration-150 cursor-pointer ${
                    selectedModels.includes(model.id) ? 'bg-primary-100' : ''
                  }`}
                >
                  <td className="sticky left-0 bg-white py-3 px-4 font-medium text-gray-900 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      {selectedModels.includes(model.id) && (
                        <span className="text-primary-600">✓</span>
                      )}
                      {model.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{model.provider}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {model.parameters}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatNumber(model.context_window)}
                  </td>
                  {BENCHMARK_FIELDS.map(field => {
                    const isTopPerformer = isTop3(model.id, field)
                    return (
                      <td
                        key={field}
                        className={`py-3 px-4 text-right font-medium ${
                          isTopPerformer
                            ? 'text-primary-700 bg-primary-50 font-bold'
                            : 'text-gray-900'
                        }`}
                      >
                        {model.benchmarks[field].toFixed(1)}%
                      </td>
                    )
                  })}
                  <td className="py-3 px-4 text-right text-gray-600 whitespace-nowrap">
                    {model.pricing.input === 0 ? 'Free' : formatPrice(model.pricing.input)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 whitespace-nowrap">
                    {model.pricing.output === 0 ? 'Free' : formatPrice(model.pricing.output)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedModels.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No models match your filters. Try adjusting your search or provider selection.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-50 border border-primary-200 rounded"></div>
            <span>Top 3 performer in benchmark</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-100 border border-primary-300 rounded"></div>
            <span>Selected for comparison</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTable
