import { Link } from 'react-router-dom'

interface VariantInfo {
  id: number
  name: string
  description: string
  color: string
  accentColor: string
}

const variants: VariantInfo[] = [
  {
    id: 1,
    name: 'Brutalist',
    description: 'Raw concrete aesthetic with bold orange accents, monospace typography, and zero border-radius. Unapologetically stark.',
    color: '#FF6600',
    accentColor: '#1a1a1a',
  },
  {
    id: 2,
    name: 'Synthwave Terminal',
    description: 'Retro-futuristic dark theme with neon cyan and magenta accents, live system clock, and Orbitron typeface.',
    color: '#8b5cf6',
    accentColor: '#1A1A2E',
  },
  {
    id: 3,
    name: 'Luxury Editorial',
    description: 'Magazine-inspired layout with Playfair Display headings, antique gold accents, and warm cream backgrounds.',
    color: '#C9A96E',
    accentColor: '#FAF7F0',
  },
  {
    id: 4,
    name: 'NOC Dark Operator',
    description: 'Operations center aesthetic with a live status bar, electric blue highlights, and Barlow Condensed navigation.',
    color: '#3B82F6',
    accentColor: '#162035',
  },
  {
    id: 5,
    name: 'Organic',
    description: 'Warm parchment palette with forest green and terracotta, Fraunces serif headings, and flowing wave dividers.',
    color: '#2D5016',
    accentColor: '#F5EFE6',
  },
]

function VariantPicker() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Model Arena
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive LLM benchmark visualizations. Choose a design variant to explore
            radar charts, scatter plots, timelines, and comparison tables.
          </p>
        </div>
      </div>

      {/* Variant Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {variants.map((variant) => (
            <Link
              key={variant.id}
              to={`/${variant.id}`}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Preview Card */}
                <div
                  className="h-40 relative overflow-hidden"
                  style={{ backgroundColor: variant.accentColor }}
                >
                  {/* Decorative chart preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-end gap-2 h-24">
                      {[0.6, 0.8, 0.5, 0.9, 0.7, 0.85, 0.65].map((h, i) => (
                        <div
                          key={i}
                          className="w-4 rounded-t transition-all duration-500 group-hover:opacity-90"
                          style={{
                            height: `${h * 100}%`,
                            backgroundColor: variant.color,
                            opacity: 0.4 + (i * 0.08),
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Variant number badge */}
                  <div
                    className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: variant.color }}
                  >
                    {variant.id}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {variant.name}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {variant.description}
                  </p>

                  <div className="mt-4 flex items-center text-sm font-medium transition-colors"
                    style={{ color: variant.color }}
                  >
                    Explore variant →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Each variant shares the same model data and visualization components with a unique theme and layout.</p>
        </div>
      </div>
    </div>
  )
}

export default VariantPicker
