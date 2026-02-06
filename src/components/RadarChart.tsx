import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Model } from '@/types/model'
import { VariantTheme, defaultTheme } from '@/types/theme'

interface RadarChartProps {
  models: Model[]
  width?: number
  height?: number
  theme?: VariantTheme
}

interface RadarDataPoint {
  axis: string
  value: number
  model: Model
}

const RADAR_AXES = ['MMLU', 'HumanEval', 'MATH', 'GSM8K', 'GPQA']

// Default color palette for up to 4 models
const DEFAULT_MODEL_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
]

function RadarChart({ models, width = 600, height = 600, theme = defaultTheme }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width, height })

  // Derive model colors from theme provider colors or use defaults
  const modelColors = models.slice(0, 4).map((model, index) => {
    return theme.colors.providerColors[model.provider] || DEFAULT_MODEL_COLORS[index]
  })

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const isMobile = window.innerWidth < 640
        const newSize = Math.min(containerWidth, isMobile ? 400 : 700)
        setDimensions({ width: newSize, height: newSize })
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
      ? { top: 60, right: 60, bottom: 60, left: 60 }
      : { top: 80, right: 80, bottom: 80, left: 80 }
    const innerWidth = currentWidth - margin.left - margin.right
    const innerHeight = currentHeight - margin.top - margin.bottom
    const radius = Math.min(innerWidth, innerHeight) / 2

    const g = svg
      .append('g')
      .attr('transform', `translate(${currentWidth / 2}, ${currentHeight / 2})`)

    // Prepare data
    const allAxes = RADAR_AXES
    const levels = 5
    const angleSlice = (Math.PI * 2) / allAxes.length

    // Create radial scale (0-100 for benchmarks)
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius])

    // Draw circular grid
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius / levels) * level

      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', theme.chartStyle.gridColor)
        .attr('stroke-width', 1)
        .attr('opacity', 0.5)
    }

    // Draw axes lines
    allAxes.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2
      const lineCoords = {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      }

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', lineCoords.x)
        .attr('y2', lineCoords.y)
        .attr('stroke', theme.chartStyle.axisColor)
        .attr('stroke-width', 1.5)

      // Add axis labels
      const labelDistance = radius + (isMobile ? 25 : 30)
      const labelCoords = {
        x: labelDistance * Math.cos(angle),
        y: labelDistance * Math.sin(angle),
      }

      g.append('text')
        .attr('x', labelCoords.x)
        .attr('y', labelCoords.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', isMobile ? '11px' : '14px')
        .attr('font-weight', '600')
        .attr('font-family', theme.typography.body)
        .attr('fill', theme.colors.text)
        .text(axis)
    })

    // Add level labels
    for (let level = 1; level <= levels; level++) {
      const levelValue = (100 / levels) * level
      const levelRadius = (radius / levels) * level

      g.append('text')
        .attr('x', 5)
        .attr('y', -levelRadius)
        .attr('font-size', isMobile ? '8px' : '10px')
        .attr('font-family', theme.typography.mono)
        .attr('fill', theme.colors.muted)
        .text(levelValue.toFixed(0))
    }

    // Line generator for radar paths
    const radarLine = d3
      .lineRadial<RadarDataPoint>()
      .radius((d) => rScale(d.value))
      .angle((_d, i) => angleSlice * i - Math.PI / 2)
      .curve(d3.curveLinearClosed)

    // Draw each model's radar polygon
    models.slice(0, 4).forEach((model, modelIndex) => {
      const modelData: RadarDataPoint[] = allAxes.map((axis) => ({
        axis,
        value: model.benchmarks[axis] || 0,
        model,
      }))

      const color = modelColors[modelIndex]
      const isHovered = hoveredModel === model.id
      const isDimmed = hoveredModel !== null && hoveredModel !== model.id

      // Draw filled polygon
      g.append('path')
        .datum(modelData)
        .attr('class', `radar-area-${model.id}`)
        .attr('d', radarLine)
        .attr('fill', color)
        .attr('fill-opacity', isDimmed ? 0.05 : isHovered ? 0.3 : 0.15)
        .attr('stroke', color)
        .attr('stroke-width', isDimmed ? 1.5 : isHovered ? 3 : 2)
        .attr('opacity', isDimmed ? 0.3 : 1)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredModel(model.id))
        .on('mouseleave', () => setHoveredModel(null))
        .transition()
        .duration(750)
        .attrTween('d', function() {
          const interpolate = d3.interpolate(
            modelData.map((d) => ({ ...d, value: 0 })),
            modelData
          )
          return function(t) {
            return radarLine(interpolate(t)) || ''
          }
        })

      // Draw data points
      modelData.forEach((point, i) => {
        const angle = angleSlice * i - Math.PI / 2
        const x = rScale(point.value) * Math.cos(angle)
        const y = rScale(point.value) * Math.sin(angle)

        const pointRadius = isMobile
          ? isDimmed ? 2 : isHovered ? 5 : 3
          : isDimmed ? 3 : isHovered ? 6 : 4

        g.append('circle')
          .attr('class', `radar-point-${model.id}`)
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', pointRadius)
          .attr('fill', color)
          .attr('stroke', theme.colors.surface)
          .attr('stroke-width', isMobile ? 1.5 : 2)
          .attr('opacity', isDimmed ? 0.3 : 1)
          .style('cursor', 'pointer')
          .on('mouseenter', () => setHoveredModel(model.id))
          .on('mouseleave', () => setHoveredModel(null))
          .transition()
          .duration(750)
          .attr('cx', x)
          .attr('cy', y)
      })
    })
  }, [models, dimensions, hoveredModel, theme, modelColors])

  if (models.length === 0) {
    return (
      <div className="flex items-center justify-center h-96" style={{ color: theme.colors.muted }}>
        Select up to 4 models to compare
      </div>
    )
  }

  if (models.length > 4) {
    return (
      <div className="flex items-center justify-center h-96" style={{ color: theme.colors.muted }}>
        Please select no more than 4 models
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-6 px-2">
        {models.slice(0, 4).map((model, index) => {
          const color = modelColors[index]
          const isHovered = hoveredModel === model.id
          const isDimmed = hoveredModel !== null && hoveredModel !== model.id

          return (
            <div
              key={model.id}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 transition-all cursor-pointer"
              style={{
                backgroundColor: isHovered ? `${color}10` : 'transparent',
                opacity: isDimmed ? 0.4 : 1,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                borderRadius: theme.borderRadius,
              }}
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
              onTouchStart={() => setHoveredModel(model.id)}
            >
              <div
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 shadow-sm flex-shrink-0"
                style={{ backgroundColor: color, borderColor: theme.colors.surface }}
              />
              <div className="min-w-0">
                <div className="font-semibold text-xs sm:text-sm truncate" style={{ color: theme.colors.text }}>
                  {model.name}
                </div>
                <div className="text-xs truncate" style={{ color: theme.colors.muted }}>{model.provider}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RadarChart
