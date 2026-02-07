import { ModelBenchmarks } from '@/types/model'

/**
 * All benchmark fields available in the model data.
 * Used across comparison tables, scatter plots, and radar charts.
 */
export const BENCHMARK_FIELDS: Array<keyof ModelBenchmarks> = [
  'MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA', 'HellaSwag', 'ARC', 'TruthfulQA'
]

/**
 * Benchmark options with human-readable labels for dropdowns/selectors.
 */
export const BENCHMARK_OPTIONS: Array<{ value: keyof ModelBenchmarks; label: string }> = [
  { value: 'MMLU', label: 'MMLU (Knowledge)' },
  { value: 'HumanEval', label: 'HumanEval (Coding)' },
  { value: 'MATH', label: 'MATH (Mathematics)' },
  { value: 'GSM8K', label: 'GSM8K (Math Reasoning)' },
  { value: 'GPQA', label: 'GPQA (Graduate Science)' },
  { value: 'HellaSwag', label: 'HellaSwag (Common Sense)' },
  { value: 'ARC', label: 'ARC (Question Answering)' },
  { value: 'TruthfulQA', label: 'TruthfulQA (Truthfulness)' },
]

/**
 * Subset of benchmarks used in radar chart visualization.
 */
export const RADAR_AXES: Array<keyof ModelBenchmarks> = [
  'MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA'
]

/**
 * Default color palette for model comparison (up to 4 models).
 */
export const DEFAULT_MODEL_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
]
