import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Model } from '@/types/model'
import {
  prepareTimelineData,
  groupModelFamilies,
  TimelineDataPoint,
} from '@/utils/timeline'
import { formatDate } from '@/utils/formatters'
import { VariantTheme, defaultTheme } from '@/types/theme'

interface TimelineProps {
  models: Model[]
  width?: number
  height?: number
  theme?: VariantTheme
}

interface TooltipData {
  x: number
  y: number
  model: Model
  score: number
}

function getProviderColorFromTheme(provider: string, theme: VariantTheme): string {
  return theme.colors.providerColors[provider] || '#6b7280'
}

function Timeline({ models, width = 1200, height = 600, theme = defaultTheme }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width, height })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const animationRef = useRef<number | null>(null)

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const isMobile = window.innerWidth < 768
        const newWidth = Math.min(containerWidth, isMobile ? 700 : 1200)
        const newHeight = isMobile ? 500 : 600
        setDimensions({ width: newWidth, height: newHeight })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const timelineData = prepareTimelineData(models)
    if (timelineData.length === 0) return

    const dates = timelineData.map(d => d.date.getTime()).sort((a, b) => a - b)
    const minDate = dates[0]
    const maxDate = dates[dates.length - 1]
    const duration = 5000 // 5 seconds for full animation

    const startTime = Date.now()
    const startValue = currentDate ? currentDate.getTime() : minDate

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const currentTimestamp = startValue + (maxDate - startValue) * progress
      setCurrentDate(new Date(currentTimestamp))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsPlaying(false)
        setCurrentDate(new Date(maxDate))
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, models])

  useEffect(() => {
    if (!svgRef.current || models.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width: currentWidth, height: currentHeight } = dimensions
    const isMobile = window.innerWidth < 768
    const margin = isMobile
      ? { top: 40, right: 40, bottom: 60, left: 60 }
      : { top: 60, right: 80, bottom: 80, left: 80 }

    const innerWidth = currentWidth - margin.left - margin.right
    const innerHeight = currentHeight - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Prepare data
    const timelineData = prepareTimelineData(models)
    const families = groupModelFamilies(timelineData)

    // Set up scales
    const dateExtent = d3.extent(timelineData, d => d.date) as [Date, Date]
    const xScale = d3
      .scaleTime()
      .domain(dateExtent)
      .range([0, innerWidth])
      .nice()

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.floor(d3.min(timelineData, d => d.averageScore) || 0) - 5,
        Math.ceil(d3.max(timelineData, d => d.averageScore) || 100) + 5,
      ])
      .range([innerHeight, 0])
      .nice()

    // Size scale for parameter count (radius)
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(timelineData, d => d.parameterSize || 0) || 100])
      .range([isMobile ? 4 : 6, isMobile ? 20 : 30])

    // Draw axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(isMobile ? 4 : 8)
      .tickFormat(d => d3.timeFormat('%Y')(d as Date))

    const yAxis = d3.axisLeft(yScale).ticks(isMobile ? 5 : 8)

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .attr('font-size', isMobile ? '11px' : '12px')
      .attr('fill', theme.colors.muted)

    g.append('g')
      .call(yAxis)
      .attr('class', 'axis')
      .selectAll('text')
      .attr('font-size', isMobile ? '11px' : '12px')
      .attr('fill', theme.colors.muted)

    // Axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + (isMobile ? 45 : 60))
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '12px' : '14px')
      .attr('font-weight', '600')
      .attr('font-family', theme.typography.body)
      .attr('fill', theme.colors.text)
      .text('Release Date')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', isMobile ? -45 : -60)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '12px' : '14px')
      .attr('font-weight', '600')
      .attr('font-family', theme.typography.body)
      .attr('fill', theme.colors.text)
      .text('Average Capability Score')

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', theme.chartStyle.gridColor)

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', theme.chartStyle.gridColor)

    // Draw family connection lines
    families.forEach(family => {
      if (family.models.length < 2) return

      const line = d3
        .line<TimelineDataPoint>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.averageScore))
        .curve(d3.curveMonotoneX)

      const visibleModels = currentDate
        ? family.models.filter(m => m.date <= currentDate)
        : family.models

      if (visibleModels.length < 2) return

      const path = g
        .append('path')
        .datum(visibleModels)
        .attr('fill', 'none')
        .attr('stroke', family.color)
        .attr('stroke-width', isMobile ? 1.5 : 2)
        .attr('stroke-opacity', 0.3)
        .attr('d', line)

      // Animate line drawing
      const totalLength = (path.node() as SVGPathElement).getTotalLength()
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(750)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
    })

    // Draw model dots
    const visibleData = currentDate
      ? timelineData.filter(d => d.date <= currentDate)
      : timelineData

    const dots = g
      .selectAll('.model-dot')
      .data(visibleData)
      .enter()
      .append('circle')
      .attr('class', 'model-dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.averageScore))
      .attr('r', 0)
      .attr('fill', d => getProviderColorFromTheme(d.model.provider, theme))
      .attr('stroke', theme.colors.surface)
      .attr('stroke-width', isMobile ? 1.5 : 2)
      .attr('opacity', 0.85)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', isMobile ? 2 : 3)

        const svgRect = svgRef.current!.getBoundingClientRect()
        setTooltip({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top,
          model: d.model,
          score: d.averageScore,
        })
      })
      .on('mousemove', function (event) {
        const svgRect = svgRef.current!.getBoundingClientRect()
        setTooltip(prev =>
          prev
            ? {
                ...prev,
                x: event.clientX - svgRect.left,
                y: event.clientY - svgRect.top,
              }
            : null
        )
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.85)
          .attr('stroke-width', isMobile ? 1.5 : 2)

        setTooltip(null)
      })

    // Animate dots appearing
    dots
      .transition()
      .duration(500)
      .delay((_d, i) => i * 30)
      .attr('r', d => (d.parameterSize ? sizeScale(d.parameterSize) : isMobile ? 6 : 8))
  }, [models, dimensions, currentDate, theme])

  const handlePlayPause = () => {
    if (!isPlaying) {
      const timelineData = prepareTimelineData(models)
      const dates = timelineData.map(d => d.date.getTime()).sort((a, b) => a - b)
      const minDate = dates[0]
      const maxDate = dates[dates.length - 1]

      // If at end, restart from beginning
      if (currentDate && currentDate.getTime() >= maxDate) {
        setCurrentDate(new Date(minDate))
      }
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentDate(null)
  }

  if (models.length === 0) {
    return (
      <div className="flex items-center justify-center h-96" style={{ color: theme.colors.muted }}>
        No models available to display
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible rounded-lg shadow-sm"
        style={{
          maxWidth: '100%',
          height: 'auto',
          backgroundColor: theme.colors.surface,
        }}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none rounded-lg shadow-lg p-3 z-50"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 10,
            maxWidth: '250px',
            backgroundColor: theme.chartStyle.tooltipBg,
            color: theme.chartStyle.tooltipText,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius,
          }}
        >
          <div className="font-bold text-sm mb-1">
            {tooltip.model.name}
          </div>
          <div className="text-xs space-y-1" style={{ color: theme.colors.muted }}>
            <div className="flex justify-between">
              <span>Provider:</span>
              <span className="font-medium" style={{ color: theme.chartStyle.tooltipText }}>{tooltip.model.provider}</span>
            </div>
            <div className="flex justify-between">
              <span>Released:</span>
              <span className="font-medium" style={{ color: theme.chartStyle.tooltipText }}>{formatDate(tooltip.model.release_date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Parameters:</span>
              <span className="font-medium" style={{ color: theme.chartStyle.tooltipText }}>{tooltip.model.parameters}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Score:</span>
              <span className="font-medium" style={{ color: theme.chartStyle.tooltipText }}>{tooltip.score.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handlePlayPause}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm"
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius,
          }}
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm"
          style={{
            backgroundColor: theme.colors.border,
            color: theme.colors.text,
            borderRadius: theme.borderRadius,
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>

        {currentDate && (
          <div className="text-sm font-medium" style={{ color: theme.colors.muted }}>
            {d3.timeFormat('%B %Y')(currentDate)}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-4">
        <div className="text-sm font-semibold" style={{ color: theme.colors.text }}>Providers</div>
        <div className="flex flex-wrap gap-3">
          {Array.from(new Set(models.map(m => m.provider))).map(provider => (
            <div key={provider} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 shadow-sm"
                style={{
                  backgroundColor: getProviderColorFromTheme(provider, theme),
                  borderColor: theme.colors.surface,
                }}
              />
              <span className="text-xs sm:text-sm" style={{ color: theme.colors.text }}>{provider}</span>
            </div>
          ))}
        </div>

        <div className="text-xs mt-2" style={{ color: theme.colors.muted }}>
          Dot size represents parameter count (when available)
        </div>
      </div>
    </div>
  )
}

export default Timeline
