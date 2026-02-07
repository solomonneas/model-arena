import { Link } from 'react-router-dom'
import { Model, BenchmarkKey } from '@/types/model'
import { formatNumber, formatPrice } from '@/utils/formatters'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

const providers = [...new Set(models.map(m => m.provider))]
const benchmarkKeys: BenchmarkKey[] = ['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA', 'HellaSwag', 'ARC', 'TruthfulQA']
const maxContext = Math.max(...models.map(m => m.context_window))
const avgMMLU = (models.reduce((s, m) => s + m.benchmarks.MMLU, 0) / models.length).toFixed(1)
const topModel = [...models].sort((a, b) => b.benchmarks.MMLU - a.benchmarks.MMLU)[0]
const cheapestModel = [...models].filter(m => m.pricing.input > 0).sort((a, b) => a.pricing.input - b.pricing.input)[0]

function Home() {
  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 pt-16 md:pt-24 pb-12">
        <div className="v3-fade-in">
          <div className="v3-section-title mb-6">The Definitive Guide</div>
          <h1 className="v3-headline-massive mb-8">
            Frontier<br />
            <span className="italic font-normal" style={{ color: '#C9A96E' }}>Intelligence</span>
          </h1>
          <p className="v3-subheadline max-w-2xl">
            A curated examination of {models.length} frontier AI models across {providers.length} leading
            laboratories. Benchmarked, compared, and contextualized for the discerning observer.
          </p>
        </div>
      </section>

      {/* ====== GOLD DIVIDER ====== */}
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider-animated" />
      </div>

      {/* ====== KEY METRICS — ASYMMETRIC GRID ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-12">
        <div className="v3-fade-in-delay-1">
          <div className="v3-section-title mb-10">By the Numbers</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E8E2D8]">
            <div className="v3-stat-card bg-[#FAF7F0]">
              <div className="v3-stat-number">{models.length}</div>
              <div className="v3-stat-label">Models Surveyed</div>
            </div>
            <div className="v3-stat-card bg-[#FAF7F0]">
              <div className="v3-stat-number">{providers.length}</div>
              <div className="v3-stat-label">Laboratories</div>
            </div>
            <div className="v3-stat-card bg-[#FAF7F0]">
              <div className="v3-stat-number">{benchmarkKeys.length}</div>
              <div className="v3-stat-label">Benchmarks</div>
            </div>
            <div className="v3-stat-card bg-[#FAF7F0]">
              <div className="v3-stat-number">{formatNumber(maxContext)}</div>
              <div className="v3-stat-label">Max Context Window</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PULL QUOTE ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12">
        <div className="v3-fade-in-delay-2">
          <div className="md:ml-24 md:mr-12">
            <div className="v3-pullquote">
              The average MMLU score has reached {avgMMLU}%—a testament to the relentless
              pace of frontier research.
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider" />
      </div>

      {/* ====== FEATURED MODELS — EDITORIAL SPREAD ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8">
        <div className="v3-fade-in-delay-2">
          <div className="v3-section-title mb-10">Featured</div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {/* Top Performer */}
            <div>
              <div className="v3-data-callout">
                <div className="v3-data-callout-number">{topModel.benchmarks.MMLU.toFixed(1)}%</div>
                <div className="v3-data-callout-label">Highest MMLU Score</div>
              </div>
              <div className="mt-6">
                <h3 className="v3-headline text-2xl">{topModel.name}</h3>
                <p className="v3-label mt-2">{topModel.provider}</p>
                <p className="v3-body mt-4 text-base" style={{ color: '#7A7A7A' }}>
                  {topModel.description || `Leading the field with exceptional benchmark performance across all evaluated dimensions, setting a new standard for frontier AI capability.`}
                </p>
              </div>
            </div>

            {/* Most Accessible */}
            <div>
              <div className="v3-data-callout">
                <div className="v3-data-callout-number">{formatPrice(cheapestModel.pricing.input)}</div>
                <div className="v3-data-callout-label">Most Accessible (per 1M tokens)</div>
              </div>
              <div className="mt-6">
                <h3 className="v3-headline text-2xl">{cheapestModel.name}</h3>
                <p className="v3-label mt-2">{cheapestModel.provider}</p>
                <p className="v3-body mt-4 text-base" style={{ color: '#7A7A7A' }}>
                  {cheapestModel.description || `Democratizing access to frontier intelligence with remarkable price-to-performance ratio, making advanced AI capabilities widely attainable.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider-gold" />
      </div>

      {/* ====== EXPLORE — NAVIGATION CARDS ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-12">
        <div className="v3-fade-in-delay-3">
          <div className="v3-section-title mb-10">Explore the Collection</div>
          <div className="grid md:grid-cols-2 gap-px bg-[#E8E2D8]">
            <Link to="/3/comparison" className="v3-module-card bg-[#FAF7F0]">
              <div className="v3-module-card-title">The Compendium</div>
              <div className="v3-module-card-desc">
                A comprehensive table of every model—sorted, filtered, and ranked across all eight benchmarks.
              </div>
              <div className="v3-module-card-arrow">
                Explore <span>→</span>
              </div>
            </Link>
            <Link to="/3/radar" className="v3-module-card bg-[#FAF7F0]">
              <div className="v3-module-card-title">Radar Portraits</div>
              <div className="v3-module-card-desc">
                Overlay up to four models in an elegant multi-axis comparison of their capability profiles.
              </div>
              <div className="v3-module-card-arrow">
                Explore <span>→</span>
              </div>
            </Link>
            <Link to="/3/timeline" className="v3-module-card bg-[#FAF7F0]">
              <div className="v3-module-card-title">The Chronicle</div>
              <div className="v3-module-card-desc">
                The evolution of frontier AI mapped across time—from early entrants to today's leaders.
              </div>
              <div className="v3-module-card-arrow">
                Explore <span>→</span>
              </div>
            </Link>
            <Link to="/3/scatter" className="v3-module-card bg-[#FAF7F0]">
              <div className="v3-module-card-title">Value Analysis</div>
              <div className="v3-module-card-desc">
                Price versus performance—identifying the models that deliver the most intelligence per dollar.
              </div>
              <div className="v3-module-card-arrow">
                Explore <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider" />
      </div>

      {/* ====== FULL INDEX TABLE ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-12">
        <div className="v3-fade-in-delay-4">
          <div className="flex items-baseline justify-between mb-10">
            <div className="v3-section-title">The Index</div>
            <div className="v3-label" style={{ fontSize: '0.55rem' }}>{models.length} Models</div>
          </div>

          <div className="overflow-x-auto">
            <table className="v3-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Laboratory</th>
                  <th>Parameters</th>
                  <th>Context</th>
                  <th>MMLU</th>
                  <th>HumanEval</th>
                  <th>MATH</th>
                  <th>GSM8K</th>
                  <th>Input</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => {
                  const isTopMMLU = model.id === topModel.id
                  return (
                    <tr key={model.id}>
                      <td className="font-semibold whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem' }}>
                        {isTopMMLU && <span className="v3-gold-accent mr-1">◆</span>}
                        {model.name}
                      </td>
                      <td className="v3-label" style={{ fontSize: '0.65rem' }}>{model.provider}</td>
                      <td style={{ color: '#7A7A7A' }}>{model.parameters}</td>
                      <td className="text-right">{formatNumber(model.context_window)}</td>
                      <td className={`text-right ${isTopMMLU ? 'v3-top-performer' : ''}`}>
                        {model.benchmarks.MMLU.toFixed(1)}
                      </td>
                      <td className="text-right">{model.benchmarks.HumanEval.toFixed(1)}</td>
                      <td className="text-right">{model.benchmarks.MATH.toFixed(1)}</td>
                      <td className="text-right">{model.benchmarks.GSM8K.toFixed(1)}</td>
                      <td className="text-right">
                        {model.pricing.input === 0
                          ? <span className="v3-gold-accent italic">Gratis</span>
                          : formatPrice(model.pricing.input)
                        }
                      </td>
                      <td className="text-right">
                        {model.pricing.output === 0
                          ? <span className="v3-gold-accent italic">Gratis</span>
                          : formatPrice(model.pricing.output)
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ====== PROVIDERS ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 pb-12">
        <div className="border-t border-[#E8E2D8] pt-8">
          <div className="v3-section-title mb-6">Laboratories Represented</div>
          <div className="flex flex-wrap gap-3">
            {providers.map(p => {
              const count = models.filter(m => m.provider === p).length
              return (
                <span
                  key={p}
                  className="v3-provider-pill"
                >
                  {p} <span className="v3-gold-accent ml-1">{count}</span>
                </span>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
