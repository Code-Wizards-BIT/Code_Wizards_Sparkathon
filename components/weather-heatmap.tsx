"use client"

import { useRef, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react"

interface WeatherData {
  timestamp: Date
  quantity: number
  revenue: number
  productId: string
}

interface WeatherHeatmapProps {
  data: WeatherData[]
}

// Simulated weather conditions based on date and season
const getWeatherCondition = (date: Date) => {
  const month = date.getMonth()
  const day = date.getDate()
  const hour = date.getHours()

  // Winter months (Dec, Jan, Feb)
  if (month === 11 || month === 0 || month === 1) {
    if (Math.random() < 0.3)
      return { type: "snow", temp: Math.floor(Math.random() * 20) + 20, icon: Snowflake, color: "#93c5fd" }
    if (Math.random() < 0.4)
      return { type: "cloudy", temp: Math.floor(Math.random() * 15) + 30, icon: Cloud, color: "#6b7280" }
    return { type: "clear", temp: Math.floor(Math.random() * 20) + 25, icon: Sun, color: "#fbbf24" }
  }

  // Summer months (Jun, Jul, Aug)
  if (month >= 5 && month <= 7) {
    if (Math.random() < 0.2)
      return { type: "rain", temp: Math.floor(Math.random() * 15) + 70, icon: CloudRain, color: "#3b82f6" }
    if (Math.random() < 0.3)
      return { type: "cloudy", temp: Math.floor(Math.random() * 20) + 75, icon: Cloud, color: "#6b7280" }
    return { type: "sunny", temp: Math.floor(Math.random() * 25) + 75, icon: Sun, color: "#f59e0b" }
  }

  // Spring/Fall
  if (Math.random() < 0.3)
    return { type: "rain", temp: Math.floor(Math.random() * 20) + 50, icon: CloudRain, color: "#3b82f6" }
  if (Math.random() < 0.4)
    return { type: "cloudy", temp: Math.floor(Math.random() * 25) + 55, icon: Cloud, color: "#6b7280" }
  return { type: "clear", temp: Math.floor(Math.random() * 30) + 50, icon: Sun, color: "#fbbf24" }
}

export function WeatherHeatmap({ data }: WeatherHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Weather impact analysis
  const weatherImpact = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Create a map for each day of the last 7 days
    const dayMap = new Map<
      string,
      {
        sales: number
        revenue: number
        weather: ReturnType<typeof getWeatherCondition>
        date: Date
      }
    >()

    // Initialize all days in the past 7 days
    for (let d = new Date(sevenDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0]
      dayMap.set(key, {
        sales: 0,
        revenue: 0,
        weather: getWeatherCondition(new Date(d)),
        date: new Date(d),
      })
    }

    // Populate with actual data
    data.forEach((item) => {
      const key = item.timestamp.toISOString().split("T")[0]
      if (dayMap.has(key)) {
        const existing = dayMap.get(key)!
        dayMap.set(key, {
          ...existing,
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + item.revenue,
        })
      }
    })

    const impact = Array.from(dayMap.values()).reduce(
      (acc, day) => {
        const type = day.weather.type
        if (!acc[type]) {
          acc[type] = { totalSales: 0, totalRevenue: 0, days: 0, avgTemp: 0 }
        }
        acc[type].totalSales += day.sales
        acc[type].totalRevenue += day.revenue
        acc[type].days += 1
        acc[type].avgTemp += day.weather.temp
        return acc
      },
      {} as Record<string, { totalSales: number; totalRevenue: number; days: number; avgTemp: number }>,
    )

    // Calculate averages
    Object.keys(impact).forEach((type) => {
      impact[type].avgTemp = Math.round(impact[type].avgTemp / impact[type].days)
    })

    return impact
  }, [data])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">7 days analyzed</Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Weather Impact</Badge>
        </div>
      </div>

      {/* Weather Impact Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(weatherImpact).map(([type, stats]) => {
          const IconComponent =
            type === "snow" ? Snowflake : type === "rain" ? CloudRain : type === "cloudy" ? Cloud : Sun
          const avgSales = Math.round(stats.totalSales / stats.days)

          return (
            <div key={type} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white capitalize">{type}</span>
              </div>
              <div className="text-xs text-gray-300">
                <div>
                  Avg Sales:
                  <span className="ml-1" title={avgSales.toString()}>
                    {formatNumber(avgSales)}/day
                  </span>
                </div>
                <div>Avg Temp: {stats.avgTemp}°F</div>
                <div>{stats.days} days</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
