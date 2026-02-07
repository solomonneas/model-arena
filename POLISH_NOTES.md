# Model Arena - Polish Notes

## Missing Models (Priority)

### Anthropic
- Claude Opus 4.5
- Claude Opus 4.6

### OpenAI
- GPT 5
- GPT 5.2
- GPT 5.3 (Codex)

### Moonshot (Kimi)
- Kimi K2
- Kimi K2.5
- Kimi Code (kimi-for-coding)

Add all of these with accurate benchmark data, pricing, and capability comparisons.

## Frontend Redesign
- Apply the **frontend-design skill** with **5 distinct visual variants**
- Use the `templates/frontend-5-variants/` scaffold
- Each variant should have a completely different aesthetic
- Current UI needs a full overhaul, not just data updates

## Other Notes
- Review existing model data for accuracy (benchmarks may be outdated)
- Ensure comparison charts/visualizations scale with the added models

## Polish Pass Needed (2026-02-07)

### What's Good (Keep)
- Multiple frontend variants - user likes having different design options

### What Needs Fixing
1. **Model data accuracy** - Many parameters are wrong/missing
   - Example: Opus 4.6 listed as released 2026-01-20 (incorrect)
   - Need to verify ALL model release dates, parameter counts, context windows, pricing
2. **Missing parameters** - Models need more complete specs
   - Training data cutoff dates
   - Supported modalities (text, image, audio, video)
   - API pricing (input/output per MTok)
   - Max output tokens
   - Reasoning/thinking support
   - Function calling / tool use support
3. **More visualizations** - Add more bar charts
   - Context window comparison
   - Pricing comparison (input vs output)
   - Benchmark scores (if available)
   - Parameter count comparison
   - Speed/latency comparison
