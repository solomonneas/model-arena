import { Model } from '@/types/model'
import { calculateAverageBenchmark } from './formatters'

export interface TimelineDataPoint {
  model: Model
  date: Date
  averageScore: number
  parameterSize: number | null
}

export interface ModelFamily {
  name: string
  models: TimelineDataPoint[]
  color: string
}

/**
 * Parse parameter string to number for sizing
 * Examples: "70B" -> 70, "8x7B MoE (12.9B active)" -> 12.9, "Unknown" -> null
 */
export function parseParameters(params: string): number | null {
  if (params === 'Unknown') return null

  // Check for MoE with active parameter count
  const moeMatch = params.match(/\(([0-9.]+)B active\)/)
  if (moeMatch) {
    return parseFloat(moeMatch[1])
  }

  // Check for regular parameter count
  const regularMatch = params.match(/([0-9.]+)B/)
  if (regularMatch) {
    return parseFloat(regularMatch[1])
  }

  return null
}

/**
 * Transform models into timeline data points
 */
export function prepareTimelineData(models: Model[]): TimelineDataPoint[] {
  return models.map(model => ({
    model,
    date: new Date(model.release_date),
    averageScore: calculateAverageBenchmark(model.benchmarks),
    parameterSize: parseParameters(model.parameters),
  }))
}

/**
 * Define model families based on naming patterns
 */
export function groupModelFamilies(dataPoints: TimelineDataPoint[]): ModelFamily[] {
  const familyMap = new Map<string, TimelineDataPoint[]>()

  // Define family patterns
  const families: Record<string, { pattern: RegExp; color: string }> = {
    'GPT': { pattern: /^(gpt|o1)/i, color: '#10b981' },
    'Claude': { pattern: /^claude/i, color: '#3b82f6' },
    'Gemini': { pattern: /^gemini/i, color: '#f59e0b' },
    'Llama': { pattern: /^llama/i, color: '#8b5cf6' },
    'Mistral': { pattern: /^(mistral|mixtral)/i, color: '#ec4899' },
    'DeepSeek': { pattern: /^deepseek/i, color: '#06b6d4' },
    'Qwen': { pattern: /^qwen/i, color: '#f97316' },
  }

  // Group models by family
  dataPoints.forEach(point => {
    for (const [familyName, { pattern }] of Object.entries(families)) {
      if (pattern.test(point.model.id)) {
        if (!familyMap.has(familyName)) {
          familyMap.set(familyName, [])
        }
        familyMap.get(familyName)!.push(point)
        break
      }
    }
  })

  // Sort models within each family by date
  return Array.from(familyMap.entries()).map(([name, models]) => ({
    name,
    models: models.sort((a, b) => a.date.getTime() - b.date.getTime()),
    color: families[name].color,
  }))
}

/**
 * Get provider colors for consistency
 */
export function getProviderColor(provider: string): string {
  const colors: Record<string, string> = {
    'OpenAI': '#10b981',
    'Anthropic': '#3b82f6',
    'Google': '#f59e0b',
    'Meta': '#8b5cf6',
    'Mistral AI': '#ec4899',
    'DeepSeek': '#06b6d4',
    'Alibaba': '#f97316',
  }

  return colors[provider] || '#6b7280'
}
