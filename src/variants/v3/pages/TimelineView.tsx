import Timeline from '@/components/Timeline'
import { editorialTheme } from '../theme'
import modelsData from '../../../../data/models.json'

function TimelineView() {
  return (
    <div>
      {/* ====== HERO ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 pt-16 md:pt-20 pb-8">
        <div className="v3-fade-in">
          <div className="v3-section-title mb-4">Temporal Analysis</div>
          <h1 className="v3-headline" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            The<br />
            <span className="italic font-normal" style={{ color: '#C9A96E' }}>Chronicle</span>
          </h1>
          <p className="v3-subheadline max-w-xl mt-4" style={{ fontSize: '1.1rem' }}>
            The narrative of frontier AI unfolds across time—each release marking a new chapter
            in the relentless pursuit of intelligence.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider-gold" />
      </div>

      {/* ====== TIMELINE CHART ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8">
        <div className="v3-scale-in">
          <div className="v3-chart-container">
            <Timeline models={modelsData.models} theme={editorialTheme} />
          </div>
          <div className="v3-chart-caption text-center max-w-2xl mx-auto">
            Each point represents a model release, plotted by date and average benchmark performance.
            Circle diameter reflects parameter count where known. Lines trace evolutionary lineage within model families.
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <hr className="v3-divider" />
      </div>

      {/* ====== EDITORIAL NOTES ====== */}
      <section className="max-w-6xl mx-auto px-8 md:px-12 py-8 pb-16">
        <div className="v3-fade-in-delay-1">
          <div className="v3-section-title mb-8">Reading Notes</div>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="border-l-2 border-[#C9A96E] pl-5">
                <h4
                  className="v3-headline text-lg mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Vertical Axis
                </h4>
                <p className="v3-body text-sm" style={{ color: '#7A7A7A', lineHeight: '1.7' }}>
                  The aggregate mean across all eight benchmarks—MMLU, HumanEval, MATH, GSM8K,
                  GPQA, HellaSwag, ARC, and TruthfulQA—providing a holistic performance indicator.
                </p>
              </div>
            </div>
            <div>
              <div className="border-l-2 border-[#8B9D83] pl-5">
                <h4
                  className="v3-headline text-lg mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Circle Diameter
                </h4>
                <p className="v3-body text-sm" style={{ color: '#7A7A7A', lineHeight: '1.7' }}>
                  Proportional to parameter count. Models with undisclosed architectures
                  are rendered at a default size for visual consistency.
                </p>
              </div>
            </div>
            <div>
              <div className="border-l-2 border-[#2D2D2D] pl-5">
                <h4
                  className="v3-headline text-lg mb-2"
                  style={{ fontWeight: 500 }}
                >
                  Connection Lines
                </h4>
                <p className="v3-body text-sm" style={{ color: '#7A7A7A', lineHeight: '1.7' }}>
                  Trace the evolutionary trajectory within model families—GPT, Claude, Gemini,
                  and others—revealing the pace of progress across lineages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TimelineView
