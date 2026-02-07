import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Model } from '@/types/model'
import { VariantTheme, defaultTheme } from '@/types/theme'
import { BENCHMARK_OPTIONS } from '@/data/constants'

interface BarChartProps {
  models: Model[]
  width?: number
  height?: number
  theme?: VariantTheme
  /** Which data to display */
  mode?: 'benchmark' | 'context' | 'pricing' | 'output_price'
  /** For benchmark mode, which benchmark to show */
  benchmarkField?: string
  /** Max models to show (default 15) */
  maxModels?: number
  /** Sort direction */
  sortDirection?: 'asc' | 'desc'
  /** Title override */
  title?: string
}

function getProviderColor(provider: string, theme: VariantTheme): string {
  return theme.colors.providerColors[provider] || '#6b7280'
}

function BarChart({
  models,
  width = 800,
  height = 500,
  theme = defaultTheme,
  mode = 'benchmark',
  benchmarkField = 'MMLU',
  maxModels = 15,
  sortDirection = 'desc',
  title,
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width, height })
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const isMobile = window.innerWidth < 640
        const newWidth = Math.min(containerWidth, isMobile ? containerWidth : 1000)
        const newHeight = isMobile ? 400 : Math.max(350, maxModels * 28 + 80)
        setDimensions({ width: newWidth, height: newHeight })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [maxModels])

  useEffect(() => {
    if (!svgRef.current || models.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width: w, height: h } = dimensions
    const isMobile = window.innerWidth < 640
    const margin = isMobile
      ? { top: 20, right: 50, bottom: 30, left: 120 }
      : { top: 20, right: 60, bottom: 40, left: 160 }
    const innerWidth = w - margin.left - margin.right
    const innerHeight = h - margin.top - margin.bottom

    // Get value function based on mode
    const getValue = (model: Model): number => {
      switch (mode) {
        case 'benchmark':
          return model.benchmarks[benchmarkField] ?? 0
        case 'context':
          return model.context_window / 1000 // Show in K
        case 'pricing':
          return model.pricing.input
        case 'output_price':
          return model.pricing.output
        default:
          return 0
      }
    }

    const getLabel = (): string => {
      switch (mode) {
        case 'benchmark': {
          const opt = BENCHMARK_OPTIONS.find(o => o.value === benchmarkField)
          return opt ? opt.label : benchmarkField
        }
        case 'context':
          return 'Context Window (K tokens)'
        case 'pricing':
          return 'Input Price ($/1M tokens)'
        case 'output_price':
          return 'Output Price ($/1M tokens)'
        default:
          return ''
      }
    }

    // Sort and limit
    const sorted = [...models]
      .filter(m => {
        if (mode === 'pricing' || mode === 'output_price') return getValue(m) > 0
        return true
      })
      .sort((a, b) => sortDirection === 'desc' ? getValue(b) - getValue(a) : getValue(a) - getValue(b))
      .slice(0, maxModels)

    if (sorted.length === 0) return

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const yScale = d3
      .scaleBand()
      .domain(sorted.map(m => m.name))
      .range([0, innerHeight])
      .padding(0.25)

    const xMax = d3.max(sorted, d => getValue(d))!
    const xScale = d3
      .scaleLinear()
      .domain([0, xMax * 1.1])
      .range([0, innerWidth])

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisBottom(xScale)
          .ticks(isMobile ? 4 : 6)
          .tickSize(innerHeight)
          .tickFormat(() => '')
      )
      .attr('transform', 'translate(0, 0)')
      .selectAll('line')
      .attr('stroke', theme.chartStyle.gridColor)
      .attr('stroke-opacity', 0.4)

    // Remove grid domain line
    g.select('.grid .domain').remove()

    // Bars
    const bars = g
      .selectAll('.bar')
      .data(sorted)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => yScale(d.name)!)
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('width', 0)
      .attr('fill', d => getProviderColor(d.provider, theme))
      .attr('rx', parseFloat(theme.borderRadius) > 0 ? 3 : 0)
      .attr('opacity', 0.85)
      .style('cursor', 'pointer')
      .on('mouseenter', function (_e, d) {
        setHoveredBar(d.id)
        d3.select(this).attr('opacity', 1)
      })
      .on('mouseleave', function () {
        setHoveredBar(null)
        d3.select(this).attr('opacity', 0.85)
      })

    // Animate bars
    bars
      .transition()
      .duration(600)
      .delay((_d, i) => i * 30)
      .attr('width', d => xScale(getValue(d)))

    // Value labels at the end of bars
    const valueLabels = g
      .selectAll('.value-label')
      .data(sorted)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('y', d => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr('x', 0)
      .attr('dy', '0.35em')
      .attr('font-size', isMobile ? '10px' : '11px')
      .attr('font-weight', '600')
      .attr('font-family', theme.typography.mono)
      .attr('fill', theme.colors.text)

    valueLabels
      .transition()
      .duration(600)
      .delay((_d, i) => i * 30)
      .attr('x', d => xScale(getValue(d)) + 6)
      .tween('text', function (d) {
        const target = getValue(d)
        const interp = d3.interpolateNumber(0, target)
        return function (t) {
          const val = interp(t)
          if (mode === 'benchmark') {
            (this as SVGTextElement).textContent = `${val.toFixed(1)}%`
          } else if (mode === 'context') {
            (this as SVGTextElement).textContent = `${val.toFixed(0)}K`
          } else {
            (this as SVGTextElement).textContent = `$${val.toFixed(2)}`
          }
        }
      })

    // Y axis (model names)
    g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0))
      .selectAll('text')
      .attr('font-size', isMobile ? '9px' : '11px')
      .attr('font-family', theme.typography.body)
      .attr('fill', theme.colors.text)
      .style('font-weight', (_d, i) => i < 3 ? '700' : '400')

    // Remove y-axis domain line
    g.select('.domain').attr('stroke', theme.chartStyle.axisColor).attr('opacity', 0.3)

    // X axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(isMobile ? 4 : 6)
      .tickFormat(d => {
        if (mode === 'benchmark') return `${d}%`
        if (mode === 'context') return `${d}K`
        return `$${d}`
      })

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', isMobile ? '10px' : '11px')
      .attr('fill', theme.colors.muted)

    // X axis label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + (isMobile ? 28 : 35))
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '11px' : '12px')
      .attr('font-weight', '500')
      .attr('font-family', theme.typography.body)
      .attr('fill', theme.colors.muted)
      .text(getLabel())

  }, [models, dimensions, mode, benchmarkField, maxModels, sortDirection, theme, hoveredBar])

  return (
    <div ref={containerRef} className="w-full">
      {title && (
        <div className="mb-2 text-sm font-semibold" style={{ color: theme.colors.text, fontFamily: theme.typography.body }}>
          {title}
        </div>
      )}
      <div style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius,
        padding: '0.75rem',
      }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  )
}

export default BarChart
