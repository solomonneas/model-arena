export interface VariantTheme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    muted: string
    border: string
    providerColors: Record<string, string>
  }
  typography: {
    heading: string
    body: string
    mono: string
  }
  borderRadius: string
  chartStyle: {
    gridColor: string
    axisColor: string
    tooltipBg: string
    tooltipText: string
  }
}

export const defaultTheme: VariantTheme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    providerColors: {
      'OpenAI': '#10b981',
      'Anthropic': '#3b82f6',
      'Google': '#f59e0b',
      'Meta': '#8b5cf6',
      'Mistral AI': '#ec4899',
      'DeepSeek': '#06b6d4',
      'Alibaba': '#f97316',
      'Moonshot': '#FF6B35',
    },
  },
  typography: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, monospace',
  },
  borderRadius: '0.5rem',
  chartStyle: {
    gridColor: '#e5e7eb',
    axisColor: '#d1d5db',
    tooltipBg: '#ffffff',
    tooltipText: '#111827',
  },
}
