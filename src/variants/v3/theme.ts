import { VariantTheme } from '@/types/theme'

export const editorialTheme: VariantTheme = {
  colors: {
    primary: '#C9A96E',      // antique gold
    secondary: '#8B9D83',    // muted sage
    accent: '#C9A96E',       // antique gold accents
    background: '#FAF7F0',   // cream
    surface: '#FFFFFF',      // white
    text: '#1C1C1C',         // deep charcoal
    muted: '#7A7A7A',        // soft gray
    border: '#E8E2D8',       // warm border
    providerColors: {
      'OpenAI': '#8B9D83',       // sage
      'Anthropic': '#C9A96E',    // gold
      'Google': '#B8860B',       // dark goldenrod
      'Meta': '#A0522D',        // sienna
      'Mistral AI': '#6B7B6F',  // muted green
      'DeepSeek': '#8B7D6B',    // warm taupe
      'Alibaba': '#9B8E7E',     // mushroom
      'Moonshot': '#87796F',    // warm gray
    },
  },
  typography: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Cormorant Garamond', Garamond, serif",
    mono: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
  borderRadius: '0',
  chartStyle: {
    gridColor: '#E8E2D8',
    axisColor: '#C9A96E',
    tooltipBg: '#FFFFFF',
    tooltipText: '#1C1C1C',
  },
}
