import { VariantTheme } from '@/types/theme'

export const organicTheme: VariantTheme = {
  colors: {
    primary: '#2D5016',       // forest green
    secondary: '#C4623D',     // terracotta
    accent: '#7EB8DA',        // sky blue
    background: '#F5EFE6',    // warm parchment
    surface: '#FDFAF5',       // lighter parchment
    text: '#3E2723',          // deep earth
    muted: '#8B7355',         // warm muted
    border: '#D4C4A8',        // soft sand
    providerColors: {
      'OpenAI': '#2D5016',       // forest green
      'Anthropic': '#C4623D',    // terracotta
      'Google': '#7EB8DA',       // sky blue
      'Meta': '#6B8F4E',         // moss
      'Mistral AI': '#D4A574',   // clay
      'DeepSeek': '#8B6F47',     // walnut
      'Alibaba': '#A67B5B',      // sienna
      'Moonshot': '#B8860B',     // dark goldenrod
    },
  },
  typography: {
    heading: "'Fraunces', 'Georgia', serif",
    body: "'Nunito Sans', 'Helvetica Neue', sans-serif",
    mono: "'Caveat', cursive",
  },
  borderRadius: '1rem',
  chartStyle: {
    gridColor: '#D4C4A8',
    axisColor: '#B8A88A',
    tooltipBg: '#FDFAF5',
    tooltipText: '#3E2723',
  },
}
