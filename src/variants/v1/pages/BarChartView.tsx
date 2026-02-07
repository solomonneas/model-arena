import { useState } from 'react'
import { Model, BenchmarkKey } from '@/types/model'
import BarChart from '@/components/BarChart'
import { brutalistTheme } from '../theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

function BarChartView() {
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>('MMLU')

  return (
    <div>
      {/* HEADER */}
      <div className="border-b-2 border-[#FF6600] pb-3 mb-6">
        <h1 className="font-['Archivo_Black'] text-3xl uppercase">BAR CHARTS</h1>
        <p className="text-xs text-[#B0B0B0] mt-1 uppercase tracking-wider">
          RANKED VISUALIZATIONS // BENCHMARKS · CONTEXT · PRICING
        </p>
      </div>

      {/* BENCHMARK BAR CHART */}
      <div className="border-2 border-white p-4 mb-6">
        <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0]">
            BENCHMARK RANKING //
          </span>
          <select
            value={selectedBenchmark}
            onChange={(e) => setSelectedBenchmark(e.target.value as BenchmarkKey)}
            className="v1-input text-xs px-2 py-1"
          >
            {BENCHMARK_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <BarChart
          models={models}
          theme={brutalistTheme}
          mode="benchmark"
          benchmarkField={selectedBenchmark}
          maxModels={15}
          sortDirection="desc"
        />
      </div>

      {/* CONTEXT WINDOW */}
      <div className="border-2 border-white p-4 mb-6">
        <div className="border-b border-[#333] pb-2 mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0]">
            CONTEXT WINDOW RANKING //
          </span>
        </div>
        <BarChart
          models={models}
          theme={brutalistTheme}
          mode="context"
          maxModels={15}
          sortDirection="desc"
        />
      </div>

      {/* PRICING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="border-2 border-white p-4">
          <div className="border-b border-[#333] pb-2 mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0]">
              INPUT PRICE RANKING //
            </span>
          </div>
          <BarChart
            models={models}
            theme={brutalistTheme}
            mode="pricing"
            maxModels={12}
            sortDirection="desc"
          />
        </div>
        <div className="border-2 border-white p-4">
          <div className="border-b border-[#333] pb-2 mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0]">
              OUTPUT PRICE RANKING //
            </span>
          </div>
          <BarChart
            models={models}
            theme={brutalistTheme}
            mode="output_price"
            maxModels={12}
            sortDirection="desc"
          />
        </div>
      </div>
    </div>
  )
}

export default BarChartView
