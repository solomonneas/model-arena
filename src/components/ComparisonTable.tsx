import { useState, useMemo } from 'react'
import { Model, ModelBenchmarks } from '@/types/model'
import { formatNumber, formatPrice } from '@/utils/formatters'
import { BENCHMARK_FIELDS } from '@/data/constants'
import { VariantTheme, defaultTheme } from '@/types/theme'

interface ComparisonTableProps {
  models: Model[]
  onModelSelect?: (modelId: string) => void
  selectedModels?: string[]
  theme?: VariantTheme
}

type SortField = 'name' | 'provider' | 'parameters' | 'context_window' |
  keyof ModelBenchmarks |
  'price_input' | 'price_output'

type SortDirection = 'asc' | 'desc'

function ComparisonTable({ models, onModelSelect, selectedModels = [], theme = defaultTheme }: ComparisonTableProps) {
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

    // Type-safe sort value getters
    const getStringValue = (model: Model, field: 'name' | 'provider' | 'parameters'): string =>
      model[field].toLowerCase()

    const getNumericValue = (model: Model, field: SortField): number => {
      switch (field) {
        case 'context_window':
          return model.context_window
        case 'price_input':
          return model.pricing.input
        case 'price_output':
          return model.pricing.output
        default:
          return model.benchmarks[field as keyof ModelBenchmarks] ?? 0
      }
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison: number

      if (sortField === 'name' || sortField === 'provider' || sortField === 'parameters') {
        const aStr = getStringValue(a, sortField)
        const bStr = getStringValue(b, sortField)
        comparison = aStr.localeCompare(bStr)
      } else {
        const aNum = getNumericValue(a, sortField)
        const bNum = getNumericValue(b, sortField)
        comparison = aNum - bNum
      }

      return sortDirection === 'asc' ? comparison : -comparison
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
      className="flex items-center gap-1 transition-colors"
      style={{ color: theme.colors.text }}
    >
      {label}
      {sortField === field && (
        <span style={{ color: theme.colors.primary }}>
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-4 p-4 rounded-lg" style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius,
      }}>
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
            Search Models
          </label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or provider..."
            className="w-full px-4 py-2 rounded-lg transition-all"
            style={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
            }}
          />
        </div>

        {/* Provider Filter */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
            Filter by Provider
          </label>
          <div className="flex flex-wrap gap-2">
            {providers.map(provider => (
              <label
                key={provider}
                className="inline-flex items-center px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius,
                  backgroundColor: selectedProviders.includes(provider) ? `${theme.colors.primary}15` : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedProviders.includes(provider)}
                  onChange={() => toggleProvider(provider)}
                  className="mr-2 rounded"
                  style={{ accentColor: theme.colors.primary }}
                />
                <span className="text-sm" style={{ color: theme.colors.text }}>{provider}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm" style={{ color: theme.colors.muted }}>
          Showing {filteredAndSortedModels.length} of {models.length} models
          {selectedProviders.length > 0 && (
            <button
              onClick={() => setSelectedProviders([])}
              className="ml-2 underline"
              style={{ color: theme.colors.primary }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg" style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius,
      }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead style={{ backgroundColor: theme.colors.background, borderBottom: `1px solid ${theme.colors.border}` }}>
              <tr>
                <th className="sticky left-0 text-left py-3 px-4 font-semibold" style={{
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderRight: `1px solid ${theme.colors.border}`,
                }}>
                  <SortButton field="name" label="Model" />
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: theme.colors.text }}>
                  <SortButton field="provider" label="Provider" />
                </th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: theme.colors.text }}>
                  <SortButton field="parameters" label="Parameters" />
                </th>
                <th className="text-right py-3 px-4 font-semibold" style={{ color: theme.colors.text }}>
                  <SortButton field="context_window" label="Context" />
                </th>
                {BENCHMARK_FIELDS.map(field => (
                  <th key={field} className="text-right py-3 px-4 font-semibold whitespace-nowrap" style={{ color: theme.colors.text }}>
                    <SortButton field={field} label={field} />
                  </th>
                ))}
                <th className="text-right py-3 px-4 font-semibold whitespace-nowrap" style={{ color: theme.colors.text }}>
                  <SortButton field="price_input" label="Price (In)" />
                </th>
                <th className="text-right py-3 px-4 font-semibold whitespace-nowrap" style={{ color: theme.colors.text }}>
                  <SortButton field="price_output" label="Price (Out)" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedModels.map((model) => (
                <tr
                  key={model.id}
                  onClick={() => handleRowClick(model.id)}
                  className="transition-colors duration-150 cursor-pointer"
                  style={{
                    borderBottom: `1px solid ${theme.colors.border}`,
                    backgroundColor: selectedModels.includes(model.id) ? `${theme.colors.primary}15` : 'transparent',
                  }}
                >
                  <td className="sticky left-0 py-3 px-4 font-medium" style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    borderRight: `1px solid ${theme.colors.border}`,
                  }}>
                    <div className="flex items-center gap-2">
                      {selectedModels.includes(model.id) && (
                        <span style={{ color: theme.colors.primary }}>✓</span>
                      )}
                      {model.name}
                    </div>
                  </td>
                  <td className="py-3 px-4" style={{ color: theme.colors.muted }}>{model.provider}</td>
                  <td className="py-3 px-4" style={{ color: theme.colors.muted }}>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={{
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                    }}>
                      {model.parameters}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" style={{ color: theme.colors.muted }}>
                    {formatNumber(model.context_window)}
                  </td>
                  {BENCHMARK_FIELDS.map(field => {
                    const isTopPerformer = isTop3(model.id, field)
                    return (
                      <td
                        key={field}
                        className={`py-3 px-4 text-right font-medium ${isTopPerformer ? 'font-bold' : ''}`}
                        style={{
                          color: isTopPerformer ? theme.colors.primary : theme.colors.text,
                          backgroundColor: isTopPerformer ? `${theme.colors.primary}08` : 'transparent',
                        }}
                      >
                        {model.benchmarks[field].toFixed(1)}%
                      </td>
                    )
                  })}
                  <td className="py-3 px-4 text-right whitespace-nowrap" style={{ color: theme.colors.muted }}>
                    {model.pricing.input === 0 ? 'Free' : formatPrice(model.pricing.input)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap" style={{ color: theme.colors.muted }}>
                    {model.pricing.output === 0 ? 'Free' : formatPrice(model.pricing.output)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedModels.length === 0 && (
          <div className="text-center py-8" style={{ color: theme.colors.muted }}>
            No models match your filters. Try adjusting your search or provider selection.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 rounded-lg" style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius,
      }}>
        <div className="flex items-center gap-4 text-sm" style={{ color: theme.colors.muted }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: `${theme.colors.primary}08`, border: `1px solid ${theme.colors.primary}30` }}></div>
            <span>Top 3 performer in benchmark</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: `${theme.colors.primary}15`, border: `1px solid ${theme.colors.primary}40` }}></div>
            <span>Selected for comparison</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTable
