"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, X, Calendar, Clock } from "lucide-react"
import { RETAIL_PRODUCTS } from "@/lib/retail-data-generator"

interface HeatmapData {
  timestamp: Date
  quantity: number
  revenue: number
  productId: string
  id: string
}

interface AdvancedHeatmapProps {
  data: HeatmapData[]
  selectedMonth: string
  onMonthChange: (month: string) => void
}

interface CellDetails {
  day: string
  hour: number
  date: Date
  sales: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    revenue: number
    timestamp: Date
  }>
}

export function AdvancedHeatmap({ data, selectedMonth, onMonthChange }: AdvancedHeatmapProps) {
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week, 1 = previous week, etc.
  const [selectedCell, setSelectedCell] = useState<CellDetails | null>(null)

  // Get current date and calculate week boundaries
  const now = new Date()
  const currentWeekStart = useMemo(() => {
    const date = new Date(now)
    const dayOfWeek = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
    date.setDate(date.getDate() - dayOfWeek - selectedWeek * 7)
    date.setHours(0, 0, 0, 0)
    return date
  }, [selectedWeek])

  const currentWeekEnd = useMemo(() => {
    const date = new Date(currentWeekStart)
    date.setDate(date.getDate() + 6)
    date.setHours(23, 59, 59, 999)
    return date
  }, [currentWeekStart])

  // Process data into day of week x hour grid for the selected week
  const heatmapData = useMemo(() => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Create a 2D map: [dayOfWeek][hour] = { count, revenue, sales }
    const dayHourMap = new Map<string, { count: number; revenue: number; sales: HeatmapData[] }>()

    // Initialize all day-hour combinations
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${dayIndex}-${hour}`
        dayHourMap.set(key, { count: 0, revenue: 0, sales: [] })
      }
    }

    // Filter data for the selected week and populate
    const weekData = data.filter((item) => {
      return item.timestamp >= currentWeekStart && item.timestamp <= currentWeekEnd
    })

    weekData.forEach((item) => {
      const dayOfWeek = (item.timestamp.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
      const hour = item.timestamp.getHours()

      const key = `${dayOfWeek}-${hour}`
      if (dayHourMap.has(key)) {
        const existing = dayHourMap.get(key)!
        dayHourMap.set(key, {
          count: existing.count + item.quantity,
          revenue: existing.revenue + item.revenue,
          sales: [...existing.sales, item],
        })
      }
    })

    // Convert to grid format
    const gridData = []
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dayData = []
      for (let hour = 0; hour < 24; hour++) {
        const key = `${dayIndex}-${hour}`
        const cellData = dayHourMap.get(key) || { count: 0, revenue: 0, sales: [] }

        // Calculate the actual date for this cell
        const cellDate = new Date(currentWeekStart)
        cellDate.setDate(cellDate.getDate() + dayIndex)
        cellDate.setHours(hour, 0, 0, 0)

        // Check if this cell is in the future
        const isFuture = cellDate > now

        dayData.push({
          dayOfWeek: dayIndex,
          hour,
          count: cellData.count,
          revenue: cellData.revenue,
          sales: cellData.sales,
          dayName: daysOfWeek[dayIndex],
          date: cellDate,
          isFuture,
        })
      }
      gridData.push(dayData)
    }

    return gridData
  }, [data, currentWeekStart, currentWeekEnd, now])

  const maxCount = useMemo(() => {
    return Math.max(...heatmapData.flat().map((d) => d.count), 1)
  }, [heatmapData])

  const getIntensityLevel = (count: number): number => {
    if (count === 0) return 0 // Very Low
    if (count <= maxCount * 0.2) return 1 // Low
    if (count <= maxCount * 0.4) return 2 // Medium
    if (count <= maxCount * 0.7) return 3 // High
    return 4 // Very High
  }

  const getIntensityColor = (level: number, isFuture: boolean): string => {
    if (isFuture) return "#F3F4F6" // Light gray for future dates

    const colors = [
      "#E5E7EB", // Very Low (Gray)
      "#4ADE80", // Low (Green)
      "#FBBF24", // Medium (Yellow)
      "#F87171", // High (Light Red)
      "#DC2626", // Very High (Dark Red)
    ]
    return colors[level] || colors[0]
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toFixed(2)
  }

  const totalSales = heatmapData.flat().reduce((sum, d) => sum + d.count, 0)
  const totalRevenue = heatmapData.flat().reduce((sum, d) => sum + d.revenue, 0)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i) // 0-23

  const handleCellClick = (cellData: any) => {
    if (cellData.isFuture || cellData.sales.length === 0) return

    const salesWithProductNames = cellData.sales.map((sale: HeatmapData) => {
      const product = RETAIL_PRODUCTS.find((p) => p.id === sale.productId)
      return {
        id: sale.id,
        productId: sale.productId,
        productName: product?.name || sale.productId,
        quantity: sale.quantity,
        revenue: sale.revenue,
        timestamp: sale.timestamp,
      }
    })

    setSelectedCell({
      day: cellData.dayName,
      hour: cellData.hour,
      date: cellData.date,
      sales: salesWithProductNames,
    })
  }

  const formatDateRange = () => {
    const start = currentWeekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: currentWeekStart.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
    const end = currentWeekEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: currentWeekEnd.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
    return `${start} - ${end}`
  }

  // Calculate max weeks we can go back (based on available data)
  const maxWeeksBack = useMemo(() => {
    if (data.length === 0) return 0
    const oldestDate = new Date(Math.min(...data.map((d) => d.timestamp.getTime())))
    const weeksDiff = Math.floor((now.getTime() - oldestDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
    return Math.max(0, weeksDiff)
  }, [data, now])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{formatNumber(totalSales)} total sales</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{formatDateRange()}</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            ${formatNumber(totalRevenue)} revenue
          </Badge>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Label className="text-gray-300 text-sm">Week Navigation</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent p-1 h-8 w-8"
              >
                <ChevronUp className="w-4 h-4 rotate-90" />
              </Button>

              <div className="w-20 h-2 bg-gray-700 rounded-full relative">
                <div
                  className="w-4 h-4 bg-cyan-500 rounded-full absolute top-1/2 transform -translate-y-1/2 transition-all duration-300"
                  style={{
                    left: `${(selectedWeek / Math.max(maxWeeksBack, 1)) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.min(maxWeeksBack, selectedWeek + 1))}
                disabled={selectedWeek >= maxWeeksBack}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent p-1 h-8 w-8"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Button>
            </div>
            <div className="text-xs text-gray-400">Week {selectedWeek === 0 ? "Current" : `-${selectedWeek}`}</div>
          </div>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        {/* Hour labels (X-axis) */}
        <div className="flex mb-2">
          <div className="w-12"></div>
          <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(24, minmax(0, 1fr))` }}>
            {hours.map((hour) => (
              <div key={hour} className="text-center text-xs text-gray-700 font-medium py-1">
                {hour}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="space-y-1">
          {daysOfWeek.map((day, dayIndex) => (
            <div key={day} className="flex">
              {/* Day label (Y-axis) */}
              <div className="w-12 flex items-center justify-start text-sm text-gray-700 font-medium">{day}</div>

              {/* Hour cells */}
              <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(24, minmax(0, 1fr))` }}>
                {hours.map((hour) => {
                  const cellData = heatmapData[dayIndex]?.[hour]
                  const level = cellData ? getIntensityLevel(cellData.count) : 0
                  const color = getIntensityColor(level, cellData?.isFuture || false)
                  const hasData = cellData && cellData.sales.length > 0

                  return (
                    <div
                      key={hour}
                      className={`h-8 border border-gray-300 transition-all duration-200 group relative ${
                        hasData && !cellData.isFuture
                          ? "cursor-pointer hover:ring-2 hover:ring-blue-400/50 hover:scale-105"
                          : cellData?.isFuture
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-default"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => hasData && !cellData.isFuture && handleCellClick(cellData)}
                      title={
                        cellData?.isFuture
                          ? `${day} ${hour}:00 - Future date`
                          : cellData
                            ? `${day} ${hour}:00 - ${formatNumber(cellData.count)} sales, $${formatNumber(cellData.revenue)} revenue${hasData ? " (Click for details)" : ""}`
                            : `${day} ${hour}:00 - No data`
                      }
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap border border-gray-600">
                        <div className="font-medium">
                          {day} {hour.toString().padStart(2, "0")}:00
                        </div>
                        {cellData?.isFuture ? (
                          <div className="text-gray-400">Future date</div>
                        ) : cellData ? (
                          <div className="text-gray-300">
                            <span title={cellData.count.toFixed(2)}>{formatNumber(cellData.count)}</span> sales •
                            <span title={`$${cellData.revenue.toFixed(2)}`}> ${formatNumber(cellData.revenue)}</span>
                            {hasData && <div className="text-blue-300 text-xs">Click for details</div>}
                          </div>
                        ) : (
                          <div className="text-gray-400">No data</div>
                        )}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <span className="text-sm font-medium text-gray-700">Demand Intensity:</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: "#E5E7EB" }}></div>
              <span className="text-sm text-gray-700">Very Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: "#4ADE80" }}></div>
              <span className="text-sm text-gray-700">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: "#FBBF24" }}></div>
              <span className="text-sm text-gray-700">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: "#F87171" }}></div>
              <span className="text-sm text-gray-700">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: "#DC2626" }}></div>
              <span className="text-sm text-gray-700">Very High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: "#F3F4F6" }}></div>
              <span className="text-sm text-gray-700">Future</span>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex justify-between items-center pt-4 text-sm text-gray-600 border-t border-gray-200 mt-6">
          <div>
            Weekly activity ({formatDateRange()}):
            <span className="text-gray-800 font-medium ml-1" title={totalSales.toFixed(2)}>
              {formatNumber(totalSales)} sales
            </span>
          </div>
          <div>
            Peak hour activity:
            <span className="text-red-600 font-medium ml-1" title={maxCount.toFixed(2)}>
              {formatNumber(maxCount)} sales
            </span>
          </div>
          <div>
            Total revenue:
            <span className="text-green-600 font-medium ml-1" title={`$${totalRevenue.toFixed(2)}`}>
              ${formatNumber(totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      {/* Cell Details Modal */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Sales Details - {selectedCell.day} {selectedCell.hour.toString().padStart(2, "0")}:00
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCell(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {selectedCell.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {selectedCell.hour.toString().padStart(2, "0")}:00
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {selectedCell.sales.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No sales recorded for this time slot</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {selectedCell.sales.map((sale, index) => (
                      <div key={sale.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{sale.productName}</h4>
                            <p className="text-sm text-gray-600">Product ID: {sale.productId}</p>
                            <p className="text-xs text-gray-500">
                              {sale.timestamp.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">${sale.revenue.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">Qty: {sale.quantity.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t bg-gray-50 p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    Total Items: {selectedCell.sales.reduce((sum, sale) => sum + sale.quantity, 0).toFixed(2)}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Total Revenue: ${selectedCell.sales.reduce((sum, sale) => sum + sale.revenue, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
