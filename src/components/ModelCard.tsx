import { Model } from '@/types/model'
import { formatNumber, formatDate, formatPrice } from '@/utils/formatters'

interface ModelCardProps {
  model: Model
}

function ModelCard({ model }: ModelCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{model.name}</h3>
          <p className="text-sm text-gray-600">{model.provider}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {model.parameters}
        </span>
      </div>

      {model.description && (
        <p className="text-sm text-gray-600 mb-4">{model.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Released</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(model.release_date)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Context</p>
          <p className="text-sm font-medium text-gray-900">{formatNumber(model.context_window)}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Key Benchmarks</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-600">MMLU</p>
            <p className="text-lg font-semibold text-gray-900">{model.benchmarks.MMLU.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">HumanEval</p>
            <p className="text-lg font-semibold text-gray-900">{model.benchmarks.HumanEval.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">MATH</p>
            <p className="text-lg font-semibold text-gray-900">{model.benchmarks.MATH.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Pricing per 1M tokens</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Input</p>
            <p className="text-sm font-medium text-gray-900">{formatPrice(model.pricing.input)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Output</p>
            <p className="text-sm font-medium text-gray-900">{formatPrice(model.pricing.output)}</p>
          </div>
        </div>
      </div>

      {model.tags && model.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModelCard
