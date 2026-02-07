export type BenchmarkKey = 'MMLU' | 'HumanEval' | 'MATH' | 'GSM8K' | 'GPQA' | 'HellaSwag' | 'ARC' | 'TruthfulQA';

export type ModelBenchmarks = Record<BenchmarkKey, number> & Record<string, number>;

export interface ModelPricing {
  input: number;  // per million tokens
  output: number; // per million tokens
  currency: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  release_date: string;
  parameters: string;  // e.g., "7B", "70B", "GPT-4 scale"
  context_window: number;
  max_output_tokens?: number;
  modalities?: string[];
  training_cutoff?: string;
  supports_thinking?: boolean;
  supports_tool_use?: boolean;
  benchmarks: ModelBenchmarks;
  pricing: ModelPricing;
  description?: string;
  tags?: string[];
}

export interface ModelData {
  models: Model[];
  lastUpdated: string;
}
