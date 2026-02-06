import Timeline from '@/components/Timeline'
import { brutalistTheme } from '../theme'
import modelsData from '../../../../data/models.json'

function TimelineView() {
  return (
    <div>
      {/* HEADER */}
      <div className="border-b-2 border-[#FF6600] pb-3 mb-6">
        <h1 className="font-['Archivo_Black'] text-3xl uppercase">TIMELINE</h1>
        <p className="text-xs text-[#B0B0B0] mt-1 uppercase tracking-wider">
          MODEL RELEASE DATES // CAPABILITY SCORES OVER TIME
        </p>
      </div>

      {/* CHART */}
      <div className="v1-chart-container mb-6">
        <div className="border-b border-[#333] pb-2 mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B0B0B0]">
            SCATTER: DATE × AVG BENCHMARK // DOT SIZE = PARAM COUNT
          </span>
        </div>
        <Timeline models={modelsData.models} theme={brutalistTheme} />
      </div>

      {/* INFO */}
      <div className="border-2 border-[#333] p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-[#FF6600] mb-3">DATA NOTES //</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#B0B0B0]">
          <div className="border-l-2 border-[#333] pl-3">
            <span className="text-white font-bold">Y-AXIS:</span> Average across all benchmarks (MMLU, HumanEval, MATH, GSM8K, GPQA, HellaSwag, ARC, TruthfulQA)
          </div>
          <div className="border-l-2 border-[#333] pl-3">
            <span className="text-white font-bold">DOT SIZE:</span> Proportional to parameter count. Unknown params = default size.
          </div>
          <div className="border-l-2 border-[#333] pl-3">
            <span className="text-white font-bold">LINES:</span> Connect models within the same family (GPT, Claude, Gemini, etc.)
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineView
