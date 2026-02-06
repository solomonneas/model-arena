import { VariantTheme } from '@/types/theme'

export const synthwaveTheme: VariantTheme = {
  colors: {
    primary: '#00FFD4',      // terminal cyan
    secondary: '#FF00FF',    // hot magenta
    accent: '#39FF14',       // phosphor green
    background: '#0A0A0F',   // void black
    surface: '#1A1A2E',      // dark chrome
    text: '#00FFD4',         // terminal cyan text
    muted: '#4A4A6A',        // dimmed chrome
    border: '#2A2A4E',       // subtle border
    providerColors: {
      'OpenAI': '#39FF14',
      'Anthropic': '#00FFD4',
      'Google': '#FF00FF',
      'Meta': '#FF6B35',
      'Mistral AI': '#FFFF00',
      'DeepSeek': '#00BFFF',
      'Alibaba': '#FF4500',
      'Moonshot': '#FF1493',
    },
  },
  typography: {
    heading: "'Orbitron', sans-serif",
    body: "'IBM Plex Mono', monospace",
    mono: "'IBM Plex Mono', monospace",
  },
  borderRadius: '0',
  chartStyle: {
    gridColor: '#1A1A2E',
    axisColor: '#00FFD4',
    tooltipBg: '#0A0A0F',
    tooltipText: '#00FFD4',
  },
}
