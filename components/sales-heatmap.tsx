"use client"

import { useEffect, useRef } from "react"

interface HeatmapData {
  location: { lat: number; lng: number }
  quantity: number
  revenue: number
}

interface SalesHeatmapProps {
  data: HeatmapData[]
}

export function SalesHeatmap({ data }: SalesHeatmapProps) {
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

    if (data.length === 0) {
      // Show empty state
      ctx.fillStyle = "#6b7280"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("No sales data available", rect.width / 2, rect.height / 2)
      return
    }

    // Find bounds
    const lats = data.map((d) => d.location.lat)
    const lngs = data.map((d) => d.location.lng)
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    // Add padding
    const latPadding = (maxLat - minLat) * 0.1 || 0.01
    const lngPadding = (maxLng - minLng) * 0.1 || 0.01

    const bounds = {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLng: minLng - lngPadding,
      maxLng: maxLng + lngPadding,
    }

    // Convert lat/lng to canvas coordinates
    const latLngToCanvas = (lat: number, lng: number) => {
      const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * rect.width
      const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * rect.height
      return { x, y }
    }

    // Draw grid
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * rect.width
      const y = (i / 10) * rect.height

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, rect.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()
    }

    // Create heatmap effect
    const maxQuantity = Math.max(...data.map((d) => d.quantity))

    data.forEach((point) => {
      const { x, y } = latLngToCanvas(point.location.lat, point.location.lng)
      const intensity = point.quantity / maxQuantity
      const radius = Math.max(10, intensity * 30)

      // Create radial gradient for heat effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

      if (intensity > 0.7) {
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.8)") // red
        gradient.addColorStop(0.5, "rgba(245, 101, 101, 0.4)")
        gradient.addColorStop(1, "rgba(239, 68, 68, 0)")
      } else if (intensity > 0.4) {
        gradient.addColorStop(0, "rgba(251, 191, 36, 0.8)") // yellow
        gradient.addColorStop(0.5, "rgba(252, 211, 77, 0.4)")
        gradient.addColorStop(1, "rgba(251, 191, 36, 0)")
      } else {
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.8)") // green
        gradient.addColorStop(0.5, "rgba(74, 222, 128, 0.4)")
        gradient.addColorStop(1, "rgba(34, 197, 94, 0)")
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()

      // Add center dot
      ctx.fillStyle = intensity > 0.7 ? "#dc2626" : intensity > 0.4 ? "#d97706" : "#16a34a"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Add legend
    ctx.fillStyle = "#f3f4f6"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Sales Density:", 10, 20)

    // Legend colors
    const legendItems = [
      { color: "#dc2626", label: "High" },
      { color: "#d97706", label: "Medium" },
      { color: "#16a34a", label: "Low" },
    ]

    legendItems.forEach((item, index) => {
      const y = 35 + index * 20
      ctx.fillStyle = item.color
      ctx.beginPath()
      ctx.arc(20, y, 6, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = "#f3f4f6"
      ctx.fillText(item.label, 35, y + 4)
    })
  }, [data])

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
      <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-lg p-3">
        <p className="text-sm text-gray-300">{data.length} sales events</p>
      </div>
    </div>
  )
}
