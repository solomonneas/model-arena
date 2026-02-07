import { useMemo } from 'react'
import { Model, BenchmarkKey } from '@/types/model'
import { calculateAverageBenchmark } from '@/utils/formatters'
import modelsData from '../../data/models.json'

/** All benchmark keys used across the app */
const BENCHMARK_KEYS: BenchmarkKey[] = [
  'MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA', 'HellaSwag', 'ARC', 'TruthfulQA'
]

export interface ModelStats {
  /** All loaded models */
  models: Model[]
  /** Unique provider names (sorted) */
  providers: string[]
  /** All benchmark keys */
  benchmarkKeys: BenchmarkKey[]
  /** Max context window across all models */
  maxContext: number
  /** Average MMLU score as a formatted string (e.g. "78.3") */
  avgMMLU: string
  /** Average aggregate score across all benchmarks */
  avgScore: number
  /** Top model by MMLU */
  topModelByMMLU: Model
  /** Models sorted by average benchmark score (descending) */
  topModels: Model[]
  /** The single top model by aggregate score */
  topModel: Model
  /** Cheapest paid model (input price > 0), sorted by input price */
  cheapestPaidModel: Model
  /** Most recent models by release_date (up to 5) */
  latestModels: Model[]
  /** Models with free input pricing */
  freeModels: Model[]
  /** Total number of models */
  count: number
  /** Total number of providers */
  providerCount: number
}

/**
 * Shared hook that loads model data and computes commonly-used
 * derived stats. Memoized so it's safe to call from any component
 * without duplicating computation.
 */
export function useModels(): ModelStats {
  const models: Model[] = modelsData.models

  return useMemo(() => {
    const providers = [...new Set(models.map(m => m.provider))].sort()

    const maxContext = Math.max(...models.map(m => m.context_window))

    const avgMMLU = (
      models.reduce((s, m) => s + m.benchmarks.MMLU, 0) / models.length
    ).toFixed(1)

    const avgScore =
      models.reduce((s, m) => s + calculateAverageBenchmark(m.benchmarks), 0) /
      models.length

    const topModelByMMLU = [...models].sort(
      (a, b) => b.benchmarks.MMLU - a.benchmarks.MMLU
    )[0]

    const topModels = [...models].sort(
      (a, b) =>
        calculateAverageBenchmark(b.benchmarks) -
        calculateAverageBenchmark(a.benchmarks)
    )

    const topModel = topModels[0]

    const cheapestPaidModel = [...models]
      .filter(m => m.pricing.input > 0)
      .sort((a, b) => a.pricing.input - b.pricing.input)[0]

    const latestModels = [...models]
      .sort(
        (a, b) =>
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      )
      .slice(0, 5)

    const freeModels = models.filter(m => m.pricing.input === 0)

    return {
      models,
      providers,
      benchmarkKeys: BENCHMARK_KEYS,
      maxContext,
      avgMMLU,
      avgScore,
      topModelByMMLU,
      topModels,
      topModel,
      cheapestPaidModel,
      latestModels,
      freeModels,
      count: models.length,
      providerCount: providers.length,
    }
  }, [models])
}
