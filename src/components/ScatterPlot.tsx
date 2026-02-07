import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Model, BenchmarkKey } from '@/types/model'
import { parseParameters } from '@/utils/timeline'
import { formatPrice } from '@/utils/formatters'
import { VariantTheme, defaultTheme } from '@/types/theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'
import { useResizeObserver } from '@/hooks/useResizeObserver'

interface ScatterPlotProps {
  models: Model[]
  width?: number
  height?: number
  theme?: VariantTheme
}

interface ScatterDataPoint {
  model: Model
  price: number  // input price per 1M tokens
  benchmarkScore: number
  parameterSize: number | null
  provider: string
}

function getProviderColorFromTheme(provider: string, theme: VariantTheme): string {
  return theme.colors.providerColors[provider] || '#6b7280'
}

function ScatterPlot({ models, width = 800, height = 600, theme = defaultTheme }: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedBenchmark, setSelectedBenchmark] = useState<BenchmarkKey>('MMLU')
  const [hoveredPoint, setHoveredPoint] = useState<{
    data: ScatterDataPoint
    x: number
    y: number
  } | null>(null)
  const [dimensions, setDimensions] = useState({ width, height })

  // Handle responsive sizing via ResizeObserver
  useResizeObserver(containerRef, (entry) => {
    const containerWidth = entry.contentRect.width
    const isMobile = containerWidth < 640
    const newWidth = Math.min(containerWidth, isMobile ? containerWidth : 1000)
    const newHeight = isMobile ? 400 : 600
    setDimensions({ width: newWidth, height: newHeight })
  })

  useEffect(() => {
    if (!svgRef.current || models.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width: currentWidth, height: currentHeight } = dimensions
    const isMobile = currentWidth < 640
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
      .attr('stroke', theme.chartStyle.gridColor)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')

    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(medianScore))
      .attr('y2', yScale(medianScore))
      .attr('stroke', theme.chartStyle.gridColor)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')

    // Add quadrant labels
    if (!isMobile) {
      quadrants.forEach(quad => {
        g.append('text')
          .attr('x', quad.x + quad.width / 2)
          .attr('y', quad.y + 20)
          .attr('text-anchor', 'middle')
          .attr('fill', theme.colors.muted)
          .attr('font-size', '12px')
          .attr('font-weight', '500')
          .attr('font-family', theme.typography.body)
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
        .attr('stroke', theme.colors.secondary)
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
      .style('fill', theme.colors.muted)

    // X axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + (isMobile ? 45 : 60))
      .attr('text-anchor', 'middle')
      .attr('fill', theme.colors.text)
      .attr('font-size', isMobile ? '12px' : '14px')
      .attr('font-weight', '600')
      .attr('font-family', theme.typography.body)
      .text('Price per 1M tokens (log scale)')

    // Draw Y axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(isMobile ? 5 : 8)

    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', isMobile ? '10px' : '12px')
      .style('fill', theme.colors.muted)

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -(isMobile ? 45 : 60))
      .attr('text-anchor', 'middle')
      .attr('fill', theme.colors.text)
      .attr('font-size', isMobile ? '12px' : '14px')
      .attr('font-weight', '600')
      .attr('font-family', theme.typography.body)
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
      .attr('stroke', theme.chartStyle.gridColor)
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
      .attr('fill', d => getProviderColorFromTheme(d.provider, theme))
      .attr('stroke', theme.colors.surface)
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer')

    // Animate dots appearing
    dots
      .transition()
      .duration(800)
      .delay((_, i) => i * 20)
      .attr('r', (d: ScatterDataPoint) => d.parameterSize ? sizeScale(d.parameterSize) : 8)

    // Tooltip handling via React state (no D3 .html() to avoid XSS)
    dots
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3)
          .attr('r', (d.parameterSize ? sizeScale(d.parameterSize) : 8) * 1.3)

        setHoveredPoint({
          data: d,
          x: event.pageX + 10,
          y: event.pageY - 10,
        })
      })
      .on('mousemove', function (event) {
        setHoveredPoint(prev => prev ? { ...prev, x: event.pageX + 10, y: event.pageY - 10 } : null)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8)
          .attr('stroke-width', 2)
          .attr('r', (d: ScatterDataPoint) => d.parameterSize ? sizeScale(d.parameterSize) : 8)

        setHoveredPoint(null)
      })

  }, [models, selectedBenchmark, dimensions, theme])

  // Get unique providers for legend
  const uniqueProviders = Array.from(new Set(models.map(m => m.provider)))

  return (
    <div ref={containerRef} className="w-full">
      {/* Benchmark selector */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="benchmark-select" className="text-sm font-medium" style={{ color: theme.colors.text }}>
            Y-Axis Benchmark:
          </label>
          <select
            id="benchmark-select"
            value={selectedBenchmark}
            onChange={(e) => setSelectedBenchmark(e.target.value as BenchmarkKey)}
            className="px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 text-sm"
            style={{
              borderColor: theme.colors.border,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: theme.borderRadius,
            }}
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
          {uniqueProviders.slice(0, 6).map(provider => (
            <div key={provider} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getProviderColorFromTheme(provider, theme) }}
              ></div>
              <span style={{ color: theme.colors.muted }}>{provider}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Container */}
      <div className="rounded-lg p-4" style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius,
      }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
        />
      </div>

      {/* React-rendered tooltip (XSS-safe) */}
      {hoveredPoint && (
        <div
          className="fixed pointer-events-none rounded-lg shadow-lg p-3 z-50"
          style={{
            left: hoveredPoint.x,
            top: hoveredPoint.y,
            backgroundColor: theme.chartStyle.tooltipBg,
            color: theme.chartStyle.tooltipText,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius,
          }}
        >
          <div className="font-semibold mb-1">{hoveredPoint.data.model.name}</div>
          <div className="text-sm mb-2" style={{ color: theme.colors.muted }}>
            {hoveredPoint.data.provider}
          </div>
          <div className="text-xs space-y-1">
            <div>
              <span className="font-medium">Price:</span>{' '}
              {formatPrice(hoveredPoint.data.price)}/1M tokens
            </div>
            <div>
              <span className="font-medium">{selectedBenchmark}:</span>{' '}
              {hoveredPoint.data.benchmarkScore.toFixed(1)}
            </div>
            {hoveredPoint.data.parameterSize && (
              <div>
                <span className="font-medium">Parameters:</span>{' '}
                {hoveredPoint.data.parameterSize}B
              </div>
            )}
            <div>
              <span className="font-medium">Context:</span>{' '}
              {(hoveredPoint.data.model.context_window / 1000).toFixed(0)}K tokens
            </div>
          </div>
        </div>
      )}

      {/* Info text */}
      <div className="mt-4 text-sm" style={{ color: theme.colors.muted }}>
        <p>
          <span className="font-medium">Circle size</span> represents parameter count.
          <span className="font-medium ml-2">Dashed line</span> shows the Pareto frontier (best value models).
        </p>
      </div>
    </div>
  )
}

export default ScatterPlot
