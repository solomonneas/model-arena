import { VariantTheme } from '@/types/theme'

export const nocTheme: VariantTheme = {
  colors: {
    primary: '#3B82F6',      // electric blue
    secondary: '#94A3B8',    // cool gray
    accent: '#22C55E',       // status green
    background: '#0B1426',   // navy void
    surface: '#162035',      // slate panel
    text: '#E2E8F0',         // light slate
    muted: '#64748B',        // muted gray
    border: '#1E3A5F',       // subtle blue border
    providerColors: {
      'OpenAI': '#22C55E',       // green
      'Anthropic': '#3B82F6',    // blue
      'Google': '#F59E0B',       // amber
      'Meta': '#A78BFA',         // violet
      'Mistral AI': '#EC4899',   // pink
      'DeepSeek': '#06B6D4',     // cyan
      'Alibaba': '#F97316',      // orange
      'Moonshot': '#FB923C',     // light orange
    },
  },
  typography: {
    heading: "'Barlow Condensed', 'Arial Narrow', sans-serif",
    body: "'Barlow Condensed', 'Arial Narrow', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  borderRadius: '0.375rem',
  chartStyle: {
    gridColor: '#1E3A5F',
    axisColor: '#334155',
    tooltipBg: '#162035',
    tooltipText: '#E2E8F0',
  },
}
