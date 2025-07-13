"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  hour: number
  units: number
  revenue: number
}

interface SalesChartProps {
  data: ChartData[]
}

export function SalesChart({ data }: SalesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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
    const maxUnits = Math.max(...data.map((d) => d.units), 1)
    const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

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

    data.forEach((point, index) => {
      const x = padding + (point.hour / 24) * chartWidth
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
    data.forEach((point) => {
      const x = padding + (point.hour / 24) * chartWidth
      const y = padding + chartHeight - (point.units / maxUnits) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw revenue line (green)
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding + (point.hour / 24) * chartWidth
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
    data.forEach((point) => {
      const x = padding + (point.hour / 24) * chartWidth
      const y = padding + chartHeight - (point.revenue / maxRevenue) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Y-axis labels
    ctx.fillStyle = "#9ca3af"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"

    // Units scale (left)
    for (let i = 0; i <= 5; i++) {
      const value = (maxUnits / 5) * i
      const y = padding + chartHeight - (i / 5) * chartHeight
      ctx.fillStyle = "#06b6d4"
      ctx.fillText(Math.round(value).toString(), padding - 10, y + 4)
    }

    // Revenue scale (right)
    ctx.textAlign = "left"
    for (let i = 0; i <= 5; i++) {
      const value = (maxRevenue / 5) * i
      const y = padding + chartHeight - (i / 5) * chartHeight
      ctx.fillStyle = "#10b981"
      ctx.fillText(`$${Math.round(value)}`, padding + chartWidth + 10, y + 4)
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
  }, [data])

  return (
    <div className="relative w-full h-80 bg-gray-900 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
