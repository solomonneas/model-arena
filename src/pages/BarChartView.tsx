import { useState } from 'react'
import { Model } from '@/types/model'
import BarChart from '@/components/BarChart'
import { VariantTheme, defaultTheme } from '@/types/theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'
import modelsData from '../../data/models.json'

interface BarChartViewProps {
  theme?: VariantTheme
}

const models: Model[] = modelsData.models

function BarChartView({ theme = defaultTheme }: BarChartViewProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState('MMLU')

  return (
    <div className="space-y-6">
      {/* Benchmark Comparison */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="text-lg font-bold" style={{ color: theme.colors.text, fontFamily: theme.typography.heading }}>
            Benchmark Scores
          </h2>
          <select
            value={selectedBenchmark}
            onChange={(e) => setSelectedBenchmark(e.target.value)}
            className="px-3 py-1.5 rounded text-sm"
            style={{
              borderColor: theme.colors.border,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
            }}
          >
            {BENCHMARK_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <BarChart
          models={models}
          theme={theme}
          mode="benchmark"
          benchmarkField={selectedBenchmark}
          maxModels={15}
          sortDirection="desc"
        />
      </div>

      {/* Context Window Comparison */}
      <div>
        <BarChart
          models={models}
          theme={theme}
          mode="context"
          maxModels={15}
          sortDirection="desc"
          title="Context Window Comparison"
        />
      </div>

      {/* Pricing Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          models={models}
          theme={theme}
          mode="pricing"
          maxModels={12}
          sortDirection="desc"
          title="Input Pricing ($/1M tokens)"
        />
        <BarChart
          models={models}
          theme={theme}
          mode="output_price"
          maxModels={12}
          sortDirection="desc"
          title="Output Pricing ($/1M tokens)"
        />
      </div>
    </div>
  )
}

export default BarChartView
