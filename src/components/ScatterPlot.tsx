import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Model } from '@/types/model'
import { parseParameters, getProviderColor } from '@/utils/timeline'
import { formatPrice } from '@/utils/formatters'

interface ScatterPlotProps {
  models: Model[]
  width?: number
  height?: number
}

interface ScatterDataPoint {
  model: Model
  price: number  // input price per 1M tokens
  benchmarkScore: number
  parameterSize: number | null
  provider: string
}

const BENCHMARK_OPTIONS = [
  { value: 'MMLU', label: 'MMLU (Knowledge)' },
  { value: 'HumanEval', label: 'HumanEval (Coding)' },
  { value: 'MATH', label: 'MATH (Mathematics)' },
  { value: 'GSM8K', label: 'GSM8K (Math Reasoning)' },
  { value: 'GPQA', label: 'GPQA (Graduate Science)' },
  { value: 'HellaSwag', label: 'HellaSwag (Common Sense)' },
  { value: 'ARC', label: 'ARC (Question Answering)' },
  { value: 'TruthfulQA', label: 'TruthfulQA (Truthfulness)' },
]

function ScatterPlot({ models, width = 800, height = 600 }: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [selectedBenchmark, setSelectedBenchmark] = useState('MMLU')
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width, height })

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const isMobile = window.innerWidth < 640
        const newWidth = Math.min(containerWidth, isMobile ? containerWidth : 1000)
        const newHeight = isMobile ? 400 : 600
        setDimensions({ width: newWidth, height: newHeight })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!svgRef.current || models.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width: currentWidth, height: currentHeight } = dimensions
    const isMobile = window.innerWidth < 640
    const margin = isMobile
      ? { top: 20, right: 20, bottom: 60, left: 60 }
      : { top: 40, right: 40, bottom: 80, left: 80 }
    const innerWidth = currentWidth - margin.left - margin.right
    const innerHeight = currentHeight - margin.top - margin.bottom

    // Prepare data
    const dataPoints: ScatterDataPoint[] = models
      .filter(m => m.benchmarks[selectedBenchmark] !== undefined && m.pricing.input > 0)
      .map(model => ({
        model,
        price: model.pricing.input,
        benchmarkScore: model.benchmarks[selectedBenchmark],
        parameterSize: parseParameters(model.parameters),
        provider: model.provider,
      }))

    if (dataPoints.length === 0) return

    // Create main group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3
      .scaleLog()
      .domain([
        d3.min(dataPoints, d => d.price)! * 0.5,
        d3.max(dataPoints, d => d.price)! * 1.5,
      ])
      .range([0, innerWidth])
      .nice()

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.max(0, d3.min(dataPoints, d => d.benchmarkScore)! - 10),
        Math.min(100, d3.max(dataPoints, d => d.benchmarkScore)! + 5),
      ])
      .range([innerHeight, 0])
      .nice()

    // Calculate median values for quadrant lines
    const medianPrice = d3.median(dataPoints, d => d.price)!
    const medianScore = d3.median(dataPoints, d => d.benchmarkScore)!

    // Draw quadrant backgrounds
    const quadrants = [
      { x: 0, y: 0, width: xScale(medianPrice), height: yScale(medianScore), label: 'Cheap & Good', class: 'quadrant-tl' },
      { x: xScale(medianPrice), y: 0, width: innerWidth - xScale(medianPrice), height: yScale(medianScore), label: 'Expensive & Good', class: 'quadrant-tr' },
      { x: 0, y: yScale(medianScore), width: xScale(medianPrice), height: innerHeight - yScale(medianScore), label: 'Cheap & Basic', class: 'quadrant-bl' },
      { x: xScale(medianPrice), y: yScale(medianScore), width: innerWidth - xScale(medianPrice), height: innerHeight - yScale(medianScore), label: 'Expensive & Basic', class: 'quadrant-br' },
    ]

    quadrants.forEach((quad, i) => {
      const opacity = i === 0 || i === 1 ? 0.03 : 0.01
      const fill = i === 0 ? '#10b981' : i === 1 ? '#f59e0b' : i === 2 ? '#93c5fd' : '#fca5a5'

      g.append('rect')
        .attr('x', quad.x)
        .attr('y', quad.y)
        .attr('width', quad.width)
        .attr('height', quad.height)
        .attr('fill', fill)
        .attr('opacity', opacity)
    })

    // Draw quadrant divider lines
    g.append('line')
      .attr('x1', xScale(medianPrice))
      .attr('x2', xScale(medianPrice))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(medianScore))
      .attr('y2', yScale(medianScore))
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')

    // Add quadrant labels
    if (!isMobile) {
      quadrants.forEach(quad => {
        g.append('text')
          .attr('x', quad.x + quad.width / 2)
          .attr('y', quad.y + 20)
          .attr('text-anchor', 'middle')
          .attr('fill', '#9ca3af')
          .attr('font-size', '12px')
          .attr('font-weight', '500')
          .attr('opacity', 0.7)
          .text(quad.label)
      })
    }

    // Calculate Pareto frontier
    const sortedByPrice = [...dataPoints].sort((a, b) => a.price - b.price)
    const paretoFrontier: ScatterDataPoint[] = []
    let maxScore = -Infinity

    for (const point of sortedByPrice) {
      if (point.benchmarkScore > maxScore) {
        paretoFrontier.push(point)
        maxScore = point.benchmarkScore
      }
    }

    // Draw Pareto frontier line
    if (paretoFrontier.length > 1) {
      const lineGenerator = d3
        .line<ScatterDataPoint>()
        .x(d => xScale(d.price))
        .y(d => yScale(d.benchmarkScore))
        .curve(d3.curveMonotoneX)

      g.append('path')
        .datum(paretoFrontier)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('d', lineGenerator)
        .attr('opacity', 0.5)
    }

    // Create size scale for parameter count
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(dataPoints.filter(d => d.parameterSize), d => d.parameterSize!)!])
      .range([4, 20])

    // Draw X axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(isMobile ? 3 : 5)
      .tickFormat(d => `$${d}`)

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', isMobile ? '10px' : '12px')

    // X axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + (isMobile ? 45 : 60))
      .attr('text-anchor', 'middle')
      .attr('fill', '#4b5563')
      .attr('font-size', isMobile ? '12px' : '14px')
      .attr('font-weight', '600')
      .text('Price per 1M tokens (log scale)')

    // Draw Y axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(isMobile ? 5 : 8)

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', isMobile ? '10px' : '12px')

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -(isMobile ? 45 : 60))
      .attr('text-anchor', 'middle')
      .attr('fill', '#4b5563')
      .attr('font-size', isMobile ? '12px' : '14px')
      .attr('font-weight', '600')
      .text(`${selectedBenchmark} Score`)

    // Draw grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(yScale)
          .ticks(isMobile ? 5 : 8)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-opacity', 0.5)

    // Draw data points
    const dots = g
      .selectAll('.dot')
      .data(dataPoints)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.price))
      .attr('cy', d => yScale(d.benchmarkScore))
      .attr('r', 0)
      .attr('fill', d => getProviderColor(d.provider))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')

    // Animate dots appearing
    dots
      .transition()
      .duration(800)
      .delay((_, i) => i * 20)
      .attr('r', d => d.parameterSize ? sizeScale(d.parameterSize) : 8)

    // Tooltip handling
    const tooltip = d3.select(tooltipRef.current)

    dots
      .on('mouseover', function (event, d) {
        setHoveredModel(d.model.id)

        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3)
          .attr('r', (d.parameterSize ? sizeScale(d.parameterSize) : 8) * 1.3)

        tooltip
          .style('display', 'block')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .html(`
            <div class="font-semibold mb-1">${d.model.name}</div>
            <div class="text-sm text-gray-600 mb-2">${d.provider}</div>
            <div class="text-xs space-y-1">
              <div><span class="font-medium">Price:</span> ${formatPrice(d.price)}/1M tokens</div>
              <div><span class="font-medium">${selectedBenchmark}:</span> ${d.benchmarkScore.toFixed(1)}</div>
              ${d.parameterSize ? `<div><span class="font-medium">Parameters:</span> ${d.parameterSize}B</div>` : ''}
              <div><span class="font-medium">Context:</span> ${(d.model.context_window / 1000).toFixed(0)}K tokens</div>
            </div>
          `)
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mouseout', function () {
        setHoveredModel(null)

        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('stroke-width', 2)
          .attr('r', d => d.parameterSize ? sizeScale(d.parameterSize) : 8)

        tooltip.style('display', 'none')
      })

  }, [models, selectedBenchmark, dimensions])

  return (
    <div ref={containerRef} className="w-full">
      {/* Benchmark selector */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="benchmark-select" className="text-sm font-medium text-gray-700">
            Y-Axis Benchmark:
          </label>
          <select
            id="benchmark-select"
            value={selectedBenchmark}
            onChange={(e) => setSelectedBenchmark(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            {BENCHMARK_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-gray-600">Anthropic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-gray-600">OpenAI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
            <span className="text-gray-600">Google</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
            <span className="text-gray-600">Meta</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
        />
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50"
        style={{ display: 'none' }}
      />

      {/* Info text */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <span className="font-medium">Circle size</span> represents parameter count.
          <span className="font-medium ml-2">Green dashed line</span> shows the Pareto frontier (best value models).
        </p>
      </div>
    </div>
  )
}

export default ScatterPlot
