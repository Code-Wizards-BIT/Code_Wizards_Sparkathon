"use client"

import { useEffect, useRef, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"

interface ChartData {
  timestamp: Date
  quantity: number
  revenue: number
}

interface AdvancedSalesChartProps {
  data: ChartData[]
  aggregation: string
}

export function AdvancedSalesChart({ data, aggregation }: AdvancedSalesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processedData = useMemo(() => {
    if (data.length === 0) return []

    const grouped = new Map<string, { units: number; revenue: number; timestamp: Date }>()

    data.forEach((item) => {
      let key: string
      const date = new Date(item.timestamp)

      switch (aggregation) {
        case "hourly":
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
          break
        case "daily":
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
          break
        case "weekly":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`
          break
        default:
          key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
      }

      if (grouped.has(key)) {
        const existing = grouped.get(key)!
        grouped.set(key, {
          units: existing.units + item.quantity,
          revenue: existing.revenue + item.revenue,
          timestamp: existing.timestamp,
        })
      } else {
        grouped.set(key, {
          units: item.quantity,
          revenue: item.revenue,
          timestamp: date,
        })
      }
    })

    return Array.from(grouped.values()).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }, [data, aggregation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || processedData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const padding = 60
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Find max values
    const maxUnits = Math.max(...processedData.map((d) => d.units), 1)
    const maxRevenue = Math.max(...processedData.map((d) => d.revenue), 1)

    // Draw grid
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1

    // Vertical grid lines (hours)
    for (let i = 0; i <= 24; i += 4) {
      const x = padding + (i / 24) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
      ctx.stroke()

      // Hour labels
      ctx.fillStyle = "#9ca3af"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${i}:00`, x, rect.height - 10)
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Draw units line (cyan)
    ctx.strokeStyle = "#06b6d4"
    ctx.lineWidth = 3
    ctx.beginPath()

    processedData.forEach((point, index) => {
      const x = padding + (index / (processedData.length - 1)) * chartWidth
      const y = padding + chartHeight - (point.units / maxUnits) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw units points
    ctx.fillStyle = "#06b6d4"
    processedData.forEach((point, index) => {
      const x = padding + (index / (processedData.length - 1)) * chartWidth
      const y = padding + chartHeight - (point.units / maxUnits) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw revenue line (green)
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.beginPath()

    processedData.forEach((point, index) => {
      const x = padding + (index / (processedData.length - 1)) * chartWidth
      const y = padding + chartHeight - (point.revenue / maxRevenue) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw revenue points
    ctx.fillStyle = "#10b981"
    processedData.forEach((point, index) => {
      const x = padding + (index / (processedData.length - 1)) * chartWidth
      const y = padding + chartHeight - (point.revenue / maxRevenue) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Y-axis labels with 2 decimal places
    ctx.fillStyle = "#9ca3af"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"

    // Units scale (left)
    for (let i = 0; i <= 5; i++) {
      const value = (maxUnits / 5) * i
      const y = padding + chartHeight - (i / 5) * chartHeight
      ctx.fillStyle = "#06b6d4"
      ctx.fillText(value.toFixed(2), padding - 10, y + 4)
    }

    // Revenue scale (right)
    ctx.textAlign = "left"
    for (let i = 0; i <= 5; i++) {
      const value = (maxRevenue / 5) * i
      const y = padding + chartHeight - (i / 5) * chartHeight
      ctx.fillStyle = "#10b981"
      ctx.fillText(`$${value.toFixed(2)}`, padding + chartWidth + 10, y + 4)
    }

    // Legend
    ctx.fillStyle = "#f3f4f6"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "left"

    // Units legend
    ctx.fillStyle = "#06b6d4"
    ctx.beginPath()
    ctx.arc(padding + 20, 30, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#f3f4f6"
    ctx.fillText("Units Sold", padding + 35, 35)

    // Revenue legend
    ctx.fillStyle = "#10b981"
    ctx.beginPath()
    ctx.arc(padding + 140, 30, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#f3f4f6"
    ctx.fillText("Revenue ($)", padding + 155, 35)
  }, [processedData, aggregation])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toFixed(2)
  }

  const totalUnits = processedData.reduce((sum, d) => sum + d.units, 0)
  const totalRevenue = processedData.reduce((sum, d) => sum + d.revenue, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{processedData.length} data points</Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{aggregation} view</Badge>
        </div>

        <div className="text-sm text-gray-400">
          Total:
          <span className="ml-1" title={totalUnits.toFixed(2)}>
            {formatNumber(totalUnits)} units
          </span>
          {" • "}
          <span title={`$${totalRevenue.toFixed(2)}`}>${formatNumber(totalRevenue)}</span>
        </div>
      </div>

      <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
        {processedData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No data available for selected filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
