import { Link } from 'react-router-dom'
import { formatNumber } from '@/utils/formatters'
import { useModels } from '@/hooks/useModels'

function Home() {
  const {
    models, providers, benchmarkKeys, maxContext,
    avgMMLU, topModelByMMLU: topModel,
    cheapestPaidModel: cheapestModel, freeModels,
  } = useModels()

  return (
    <div>
      {/* MASSIVE MODEL COUNT */}
      <div className="border-b-2 border-white pb-4 mb-6">
        <div className="v1-mega-number">{models.length}</div>
        <div className="text-xs uppercase tracking-[0.3em] text-[#B0B0B0] mt-1 font-data">
          FRONTIER AI MODELS INDEXED // {providers.length} PROVIDERS // {benchmarkKeys.length} BENCHMARKS
        </div>
      </div>

      {/* DENSE STAT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 v1-dense-grid mb-8">
        <div className="v1-stat">
          <div className="v1-stat-number">{models.length}</div>
          <div className="v1-stat-label">MODELS</div>
        </div>
        <div className="v1-stat">
          <div className="v1-stat-number">{providers.length}</div>
          <div className="v1-stat-label">PROVIDERS</div>
        </div>
        <div className="v1-stat">
          <div className="v1-stat-number">{benchmarkKeys.length}</div>
          <div className="v1-stat-label">BENCHMARKS</div>
        </div>
        <div className="v1-stat">
          <div className="v1-stat-number">{formatNumber(maxContext)}</div>
          <div className="v1-stat-label">MAX CONTEXT</div>
        </div>
        <div className="v1-stat">
          <div className="v1-stat-number">{avgMMLU}%</div>
          <div className="v1-stat-label">AVG MMLU</div>
        </div>
        <div className="v1-stat">
          <div className="v1-stat-number">{topModel.benchmarks.MMLU.toFixed(1)}%</div>
          <div className="v1-stat-label">TOP MMLU</div>
        </div>
        <div className="v1-stat">
          <div className="v1-stat-number">${cheapestModel.pricing.input.toFixed(2)}</div>
          <div className="v1-stat-label">CHEAPEST INPUT</div>
        </div>
        <div className="v1-stat">
          <div className="v1-stat-number">{freeModels.length}</div>
          <div className="v1-stat-label">FREE MODELS</div>
        </div>
      </div>

      {/* DIRECT LINKS */}
      <div className="border-t-2 border-b-2 border-white py-4 mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0] mb-3">NAVIGATION //</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          <Link to="/1/comparison" className="v1-link block border border-[#333] p-4 hover:bg-[#FF6600] hover:text-black hover:border-[#FF6600] group">
            <div className="font-['Archivo_Black'] text-lg uppercase">TABLE</div>
            <div className="text-xs text-[#B0B0B0] group-hover:text-black mt-1">RAW DATA DUMP</div>
          </Link>
          <Link to="/1/radar" className="v1-link block border border-[#333] p-4 hover:bg-[#FF6600] hover:text-black hover:border-[#FF6600] group">
            <div className="font-['Archivo_Black'] text-lg uppercase">RADAR</div>
            <div className="text-xs text-[#B0B0B0] group-hover:text-black mt-1">MULTI-AXIS COMPARE</div>
          </Link>
          <Link to="/1/timeline" className="v1-link block border border-[#333] p-4 hover:bg-[#FF6600] hover:text-black hover:border-[#FF6600] group">
            <div className="font-['Archivo_Black'] text-lg uppercase">TIMELINE</div>
            <div className="text-xs text-[#B0B0B0] group-hover:text-black mt-1">RELEASE HISTORY</div>
          </Link>
          <Link to="/1/scatter" className="v1-link block border border-[#333] p-4 hover:bg-[#FF6600] hover:text-black hover:border-[#FF6600] group">
            <div className="font-['Archivo_Black'] text-lg uppercase">SCATTER</div>
            <div className="text-xs text-[#B0B0B0] group-hover:text-black mt-1">PRICE vs PERF</div>
          </Link>
        </div>
      </div>

      {/* FULL MODEL DUMP TABLE */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between border-b-2 border-[#FF6600] pb-2 mb-0">
          <h2 className="font-['Archivo_Black'] text-xl uppercase">ALL MODELS</h2>
          <span className="text-xs text-[#B0B0B0]">{models.length} ENTRIES</span>
        </div>
        <div className="overflow-x-auto">
          <table className="v1-table">
            <thead>
              <tr>
                <th>MODEL</th>
                <th>PROVIDER</th>
                <th>PARAMS</th>
                <th>CTX</th>
                <th>MMLU</th>
                <th>HUMANEVAL</th>
                <th>MATH</th>
                <th>GSM8K</th>
                <th>IN $/1M</th>
                <th>OUT $/1M</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td className="font-bold whitespace-nowrap">{model.name}</td>
                  <td className="text-[#B0B0B0]">{model.provider}</td>
                  <td className="text-[#B0B0B0]">{model.parameters}</td>
                  <td className="text-right">{formatNumber(model.context_window)}</td>
                  <td className="text-right">{model.benchmarks.MMLU.toFixed(1)}</td>
                  <td className="text-right">{model.benchmarks.HumanEval.toFixed(1)}</td>
                  <td className="text-right">{model.benchmarks.MATH.toFixed(1)}</td>
                  <td className="text-right">{model.benchmarks.GSM8K.toFixed(1)}</td>
                  <td className="text-right">{model.pricing.input === 0 ? 'FREE' : `$${model.pricing.input.toFixed(2)}`}</td>
                  <td className="text-right">{model.pricing.output === 0 ? 'FREE' : `$${model.pricing.output.toFixed(2)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROVIDERS LIST */}
      <div className="border-t border-[#333] pt-4">
        <div className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0] mb-3">PROVIDERS //</div>
        <div className="flex flex-wrap gap-2">
          {providers.map(p => {
            const count = models.filter(m => m.provider === p).length
            return (
              <span key={p} className="border border-[#333] px-3 py-1 text-xs uppercase tracking-wider">
                {p} <span className="text-[#FF6600]">[{count}]</span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home
