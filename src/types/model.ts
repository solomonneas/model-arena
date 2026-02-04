export interface ModelBenchmarks {
  MMLU: number;
  HumanEval: number;
  MATH: number;
  GSM8K: number;
  HellaSwag: number;
  ARC: number;
  TruthfulQA: number;
  [key: string]: number;
}

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
  benchmarks: ModelBenchmarks;
  pricing: ModelPricing;
  description?: string;
  tags?: string[];
}

export interface ModelData {
  models: Model[];
  lastUpdated: string;
}
