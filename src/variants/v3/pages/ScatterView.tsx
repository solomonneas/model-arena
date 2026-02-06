import ScatterPlot from '@/components/ScatterPlot'
import { Model } from '@/types/model'
import { editorialTheme } from '../theme'
import modelsData from '../../../../data/models.json'

const models: Model[] = modelsData.models

function ScatterView() {
  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 pt-16 md:pt-20 pb-8">
        <div className="v3-fade-in">
          <div className="v3-section-title mb-4">Cost × Performance</div>
          <h1 className="v3-headline" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Value<br />
            <span className="italic font-normal" style={{ color: '#C9A96E' }}>Analysis</span>
          </h1>
          <p className="v3-subheadline max-w-xl mt-4" style={{ fontSize: '1.1rem' }}>
            Intelligence per dollar—the ultimate measure of accessibility.
            Where capability meets economy, the most compelling models emerge.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider-gold" />
      </div>

      {/* ====== SCATTER CHART ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8">
        <div className="v3-scale-in">
          <div className="v3-chart-container">
            <ScatterPlot models={models} theme={editorialTheme} />
          </div>
          <div className="v3-chart-caption text-center max-w-2xl mx-auto">
            Input price per million tokens (logarithmic scale) plotted against benchmark performance.
            Circle diameter reflects parameter count. The dashed frontier line traces the optimal
            price-to-performance boundary.
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider" />
      </div>

      {/* ====== READING GUIDE ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8 pb-16">
        <div className="v3-fade-in-delay-1">
          <div className="v3-section-title mb-8">Reading Guide</div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <div className="space-y-8">
              <div className="border-l-2 border-[#C9A96E] pl-5">
                <h4 className="v3-headline text-lg mb-2" style={{ fontWeight: 500 }}>
                  The Horizontal Axis
                </h4>
                <p className="v3-body text-sm" style={{ color: '#7A7A7A', lineHeight: '1.7' }}>
                  Input price per million tokens on a logarithmic scale. Models positioned
                  further left offer greater economy. Free-tier models are excluded as zero
                  cannot be represented logarithmically.
                </p>
              </div>
              <div className="border-l-2 border-[#8B9D83] pl-5">
                <h4 className="v3-headline text-lg mb-2" style={{ fontWeight: 500 }}>
                  The Vertical Axis
                </h4>
                <p className="v3-body text-sm" style={{ color: '#7A7A7A', lineHeight: '1.7' }}>
                  The selected benchmark score. Higher placement indicates superior performance
                  on the chosen evaluation metric.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="border-l-2 border-[#2D2D2D] pl-5">
                <h4 className="v3-headline text-lg mb-2" style={{ fontWeight: 500 }}>
                  The Sweet Spot
                </h4>
                <p className="v3-body text-sm" style={{ color: '#7A7A7A', lineHeight: '1.7' }}>
                  The upper-left quadrant represents the ideal: high capability at low cost.
                  Models here deliver the most intelligence per dollar invested.
                </p>
              </div>
              <div className="border-l-2 border-[#C9A96E] pl-5">
                <h4 className="v3-headline text-lg mb-2" style={{ fontWeight: 500 }}>
                  The Pareto Frontier
                </h4>
                <p className="v3-body text-sm" style={{ color: '#7A7A7A', lineHeight: '1.7' }}>
                  The dashed line connects models that offer the best performance at each
                  price point—no model above and to the left of this line exists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ScatterView
