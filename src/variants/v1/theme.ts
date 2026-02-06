import { VariantTheme } from '@/types/theme'

export const brutalistTheme: VariantTheme = {
  colors: {
    primary: '#FF6600',
    secondary: '#B0B0B0',
    accent: '#FF6600',
    background: '#000000',
    surface: '#000000',
    text: '#FFFFFF',
    muted: '#B0B0B0',
    border: '#FFFFFF',
    providerColors: {
      'OpenAI': '#FF6600',
      'Anthropic': '#FFFFFF',
      'Google': '#FF6600',
      'Meta': '#B0B0B0',
      'Mistral AI': '#FFFFFF',
      'DeepSeek': '#FF6600',
      'Alibaba': '#B0B0B0',
      'Moonshot': '#FFFFFF',
    },
  },
  typography: {
    heading: "'Archivo Black', sans-serif",
    body: "'Space Mono', monospace",
    mono: "'Space Mono', monospace",
  },
  borderRadius: '0',
  chartStyle: {
    gridColor: '#333333',
    axisColor: '#FFFFFF',
    tooltipBg: '#000000',
    tooltipText: '#FFFFFF',
  },
}
