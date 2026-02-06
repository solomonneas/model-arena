import ScatterPlot from '@/components/ScatterPlot'
import { Model } from '@/types/model'
import { brutalistTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

function ScatterView() {
  return (
    <div>
      {/* HEADER */}
      <div className="border-b-2 border-[#FF6600] pb-3 mb-6">
        <h1 className="font-['Archivo_Black'] text-3xl uppercase">PRICE × PERFORMANCE</h1>
        <p className="text-xs text-[#B0B0B0] mt-1 uppercase tracking-wider">
          COST PER 1M TOKENS (LOG) vs BENCHMARK SCORE // {models.length} MODELS
        </p>
      </div>

      {/* CHART */}
      <div className="v1-chart-container mb-6">
        <ScatterPlot models={models} theme={brutalistTheme} />
      </div>

      {/* DATA LEGEND */}
      <div className="border-2 border-[#333] p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-[#FF6600] mb-3">READING THE CHART //</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#B0B0B0]">
          <div className="border-l-2 border-[#FF6600] pl-3">
            <span className="text-white font-bold">X-AXIS:</span> Input price per 1M tokens. Logarithmic scale. Left = cheap.
          </div>
          <div className="border-l-2 border-[#FF6600] pl-3">
            <span className="text-white font-bold">Y-AXIS:</span> Benchmark score (selectable). Up = better.
          </div>
          <div className="border-l-2 border-[#333] pl-3">
            <span className="text-white font-bold">DOT SIZE:</span> Parameter count. Bigger = more params.
          </div>
          <div className="border-l-2 border-[#333] pl-3">
            <span className="text-white font-bold">DASHED LINE:</span> Pareto frontier — best price-to-performance ratio.
          </div>
          <div className="border-l-2 border-[#333] pl-3">
            <span className="text-white font-bold">TOP-LEFT:</span> Sweet spot. High performance, low cost.
          </div>
          <div className="border-l-2 border-[#333] pl-3">
            <span className="text-white font-bold">FREE MODELS:</span> Excluded (can't plot $0 on log scale).
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScatterView
