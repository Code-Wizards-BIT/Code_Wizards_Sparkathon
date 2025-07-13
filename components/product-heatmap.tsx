"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Cloud, MessageSquare, RefreshCw, X, Calendar } from "lucide-react"

// Static heatmap data that won't change - generated once per product
const generateStaticHeatmapData = (productId: string) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i) // 0-23 (24 hours)

  // Create a seed based on productId for consistent data
  const seed = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Simple seeded random function for consistent results
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000
    return x - Math.floor(x)
  }

  const productPatterns: Record<string, { peaks: number[]; weekendBoost: number; weatherSensitive: boolean }> = {
    "milk-whole": { peaks: [7, 8, 18], weekendBoost: 1.2, weatherSensitive: false },
    "bread-white": { peaks: [7, 8, 9], weekendBoost: 1.3, weatherSensitive: false },
    "ice-cream": { peaks: [14, 15, 16, 17, 18, 19], weekendBoost: 1.5, weatherSensitive: true },
    umbrella: { peaks: [8, 12, 17], weekendBoost: 0.8, weatherSensitive: true },
    "coffee-beans": { peaks: [6, 7, 8, 9, 10], weekendBoost: 1.4, weatherSensitive: false },
    "soup-cans": { peaks: [11, 12, 13], weekendBoost: 1.1, weatherSensitive: true },
    bananas: { peaks: [9, 10, 11, 15, 16, 17], weekendBoost: 1.2, weatherSensitive: false },
    "chicken-breast": { peaks: [16, 17, 18, 19], weekendBoost: 1.4, weatherSensitive: false },
    "yogurt-greek": { peaks: [7, 8, 9], weekendBoost: 1.1, weatherSensitive: false },
    "pasta-spaghetti": { peaks: [17, 18, 19], weekendBoost: 1.3, weatherSensitive: false },
    "apples-red": { peaks: [10, 11, 15, 16], weekendBoost: 1.2, weatherSensitive: false },
    "orange-juice": { peaks: [7, 8, 9, 10], weekendBoost: 1.2, weatherSensitive: false },
    "ground-beef": { peaks: [16, 17, 18], weekendBoost: 1.5, weatherSensitive: false },
    "cheese-cheddar": { peaks: [11, 12, 17, 18], weekendBoost: 1.3, weatherSensitive: false },
    "cereal-cheerios": { peaks: [6, 7, 8], weekendBoost: 1.4, weatherSensitive: false },
    tomatoes: { peaks: [10, 11, 16, 17, 18], weekendBoost: 1.2, weatherSensitive: false },
    "salmon-fillet": { peaks: [17, 18, 19], weekendBoost: 1.6, weatherSensitive: false },
    "potato-chips": { peaks: [14, 15, 19, 20, 21], weekendBoost: 1.4, weatherSensitive: false },
    "eggs-dozen": { peaks: [7, 8, 9], weekendBoost: 1.3, weatherSensitive: false },
    "lettuce-romaine": { peaks: [11, 12, 13], weekendBoost: 1.1, weatherSensitive: false },
  }

  // Get the specific pattern for this product, or default to milk pattern
  const pattern = productPatterns[productId] || productPatterns["milk-whole"]

  const now = new Date()
  const currentWeekStart = new Date(now)
  const dayOfWeek = (currentWeekStart.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
  currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek)
  currentWeekStart.setHours(0, 0, 0, 0)

  return days.map((day, dayIndex) => {
    const isWeekend = dayIndex >= 5
    const weekendMultiplier = isWeekend ? pattern.weekendBoost : 1.0

    return hours.map((hour) => {
      // Calculate the actual date for this cell
      const cellDate = new Date(currentWeekStart)
      cellDate.setDate(cellDate.getDate() + dayIndex)
      cellDate.setHours(hour, 0, 0, 0)

      // Check if this cell is in the future
      const isFuture = cellDate > now

      let baseValue = 0.1
      const randomIndex = dayIndex * 24 + hour

      // Apply peak hour multipliers
      if (pattern.peaks.includes(hour)) {
        baseValue = 0.6 + seededRandom(randomIndex) * 0.4 // High demand during peak hours
      } else if (pattern.peaks.some((peak) => Math.abs(peak - hour) === 1)) {
        baseValue = 0.3 + seededRandom(randomIndex + 100) * 0.3 // Medium demand around peak hours
      } else if (hour >= 22 || hour <= 5) {
        baseValue = 0.05 + seededRandom(randomIndex + 200) * 0.1 // Very low demand during night
      } else {
        baseValue = 0.15 + seededRandom(randomIndex + 300) * 0.25 // Normal demand during other hours
      }

      // Apply weekend boost
      baseValue *= weekendMultiplier

      // Add weather sensitivity for certain products
      if (pattern.weatherSensitive) {
        if (productId === "ice-cream") {
          // Ice cream has higher demand on hot days (simulated)
          if (dayIndex === 2 || dayIndex === 5 || dayIndex === 6) {
            // Wed, Sat, Sun are "hot days"
            baseValue *= 1.3
          }
        } else if (productId === "umbrella") {
          // Umbrella has spikes on rainy days
          if (dayIndex === 4) {
            // Friday is "rainy day"
            baseValue *= 3.0
          }
        } else if (productId.includes("soup")) {
          // Soup has higher demand on cold days
          if (dayIndex === 1 || dayIndex === 4) {
            // Tue, Fri are "cold days"
            baseValue *= 1.4
          }
        }
      }

      // Add some consistent variation but keep it deterministic
      baseValue += (seededRandom(randomIndex + 500) - 0.5) * 0.1

      return {
        value: Math.max(0, Math.min(1, baseValue)),
        isFuture,
        date: cellDate,
        sales: isFuture ? [] : generateMockSales(baseValue, cellDate, productId),
      }
    })
  })
}

// Generate mock sales data for clicked cells
const generateMockSales = (intensity: number, date: Date, productId: string) => {
  const numSales = Math.floor(intensity * 10) // Convert intensity to number of sales
  const sales = []

  for (let i = 0; i < numSales; i++) {
    const saleTime = new Date(date)
    saleTime.setMinutes(Math.floor(Math.random() * 60))
    saleTime.setSeconds(Math.floor(Math.random() * 60))

    sales.push({
      id: `sale-${date.getTime()}-${i}`,
      productId,
      productName: getProductName(productId),
      quantity: (Math.random() * 3 + 1).toFixed(2),
      revenue: (Math.random() * 50 + 10).toFixed(2),
      timestamp: saleTime,
    })
  }

  return sales
}

const getProductName = (productId: string) => {
  const productNames: Record<string, string> = {
    "milk-whole": "Whole Milk",
    "bread-white": "White Bread",
    "ice-cream": "Vanilla Ice Cream",
    umbrella: "Compact Umbrella",
    "coffee-beans": "Premium Coffee Beans",
    "soup-cans": "Chicken Noodle Soup",
    bananas: "Fresh Bananas",
    "chicken-breast": "Chicken Breast",
    "yogurt-greek": "Greek Yogurt",
    "pasta-spaghetti": "Spaghetti Pasta",
    "apples-red": "Red Apples",
    "orange-juice": "Fresh Orange Juice",
    "ground-beef": "Ground Beef",
    "cheese-cheddar": "Cheddar Cheese",
    "cereal-cheerios": "Cheerios Cereal",
    tomatoes: "Fresh Tomatoes",
    "salmon-fillet": "Salmon Fillet",
    "potato-chips": "Potato Chips",
    "eggs-dozen": "Dozen Eggs",
    "lettuce-romaine": "Romaine Lettuce",
  }
  return productNames[productId] || productId
}

// Cache the heatmap data to prevent regeneration
const heatmapCache: Record<string, any[][]> = {}

const getHeatmapData = (productId: string) => {
  if (!heatmapCache[productId]) {
    heatmapCache[productId] = generateStaticHeatmapData(productId)
  }
  return heatmapCache[productId]
}

const getIntensityColor = (value: number, isFuture: boolean) => {
  if (isFuture) return "bg-gray-200"

  if (value >= 0.8) return "bg-red-500"
  if (value >= 0.6) return "bg-red-400"
  if (value >= 0.4) return "bg-yellow-400"
  if (value >= 0.2) return "bg-green-400"
  return "bg-gray-200"
}

const getIntensityLabel = (value: number) => {
  if (value >= 0.8) return "Very High"
  if (value >= 0.6) return "High"
  if (value >= 0.4) return "Medium"
  if (value >= 0.2) return "Low"
  return "Very Low"
}

interface CellDetails {
  day: string
  hour: number
  date: Date
  sales: Array<{
    id: string
    productId: string
    productName: string
    quantity: string
    revenue: string
    timestamp: Date
  }>
}

export function ProductHeatmap({ productId }: { productId: string }) {
  const [selectedView, setSelectedView] = useState("weekly")
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number; value: number } | null>(null)
  const [selectedCell, setSelectedCell] = useState<CellDetails | null>(null)

  // Use cached/static heatmap data
  const heatmapData = getHeatmapData(productId)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i) // 0-23 (24 hours)

  const weatherData = [
    { day: "Mon", temp: 72, condition: "Sunny", impact: "Medium" },
    { day: "Tue", temp: 68, condition: "Cloudy", impact: "Low" },
    { day: "Wed", temp: 85, condition: "Hot", impact: "High" },
    { day: "Thu", temp: 78, condition: "Sunny", impact: "Medium" },
    { day: "Fri", temp: 65, condition: "Rainy", impact: "High" },
    { day: "Sat", temp: 88, condition: "Very Hot", impact: "Very High" },
    { day: "Sun", temp: 82, condition: "Sunny", impact: "High" },
  ]

  const sentimentData = [
    { source: "Twitter", mentions: 1247, sentiment: 0.82, trend: "up" },
    { source: "Reddit", mentions: 456, sentiment: 0.75, trend: "stable" },
    { source: "Reviews", mentions: 89, sentiment: 0.91, trend: "up" },
  ]

  const getProductSpecificWeatherAnalysis = (productId: string) => {
    switch (productId) {
      case "ice-cream":
        return "Ice cream demand increases significantly with temperature. Hot days (85°F+) show 40-60% higher sales."
      case "umbrella":
        return "Umbrella sales spike dramatically during rainy weather. Demand can increase by 300-500% on rainy days."
      case "soup-cans":
        return "Soup demand increases during cold and rainy weather. Temperature drops below 60°F show 25-40% higher sales."
      case "coffee-beans":
        return "Coffee demand remains steady regardless of weather, with slight increases during cold mornings."
      case "bananas":
      case "apples-red":
      case "tomatoes":
      case "lettuce-romaine":
        return "Fresh produce demand is moderately affected by weather. Hot weather may reduce shelf life and increase turnover."
      default:
        return "Weather has moderate impact on this product. Seasonal patterns and special weather events may affect demand."
    }
  }

  const handleCellClick = (dayIndex: number, hourIndex: number) => {
    const cellData = heatmapData[dayIndex][hourIndex]
    if (cellData.isFuture || cellData.sales.length === 0) return

    setSelectedCell({
      day: days[dayIndex],
      hour: hourIndex,
      date: cellData.date,
      sales: cellData.sales,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Demand Heatmap - Weekly Pattern (24-Hour Format)
            </CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weekly">Weekly View</TabsTrigger>
              <TabsTrigger value="weather">Weather Impact</TabsTrigger>
              <TabsTrigger value="sentiment">Social Sentiment</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-4">
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  {/* Hour labels */}
                  <div className="flex mb-2">
                    <div className="w-16"></div>
                    {hours.map((hour) => (
                      <div key={hour} className="w-8 text-xs text-center text-gray-600">
                        {hour}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  {days.map((day, dayIndex) => (
                    <div key={day} className="flex items-center mb-1">
                      <div className="w-16 text-sm font-medium text-gray-700">{day}</div>
                      {hours.map((hour, hourIndex) => {
                        const cellData = heatmapData[dayIndex][hourIndex]
                        const hasData = cellData.sales.length > 0
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className={`w-8 h-8 ${getIntensityColor(cellData.value, cellData.isFuture)} border border-white transition-transform hover:scale-110 hover:z-10 relative ${
                              hasData && !cellData.isFuture
                                ? "cursor-pointer hover:ring-2 hover:ring-blue-400/50"
                                : cellData.isFuture
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-default"
                            }`}
                            onMouseEnter={() => setHoveredCell({ day: dayIndex, hour, value: cellData.value })}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => handleCellClick(dayIndex, hourIndex)}
                            title={
                              cellData.isFuture
                                ? `${day} ${hour}:00 - Future time`
                                : `${day} ${hour}:00 - ${getIntensityLabel(cellData.value)} demand (${(cellData.value * 100).toFixed(0)}%)${hasData ? " - Click for details" : ""}`
                            }
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm font-medium">Demand Intensity:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border"></div>
                  <span className="text-xs">Very Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 border"></div>
                  <span className="text-xs">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 border"></div>
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 border"></div>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 border"></div>
                  <span className="text-xs">Very High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border opacity-50"></div>
                  <span className="text-xs">Future</span>
                </div>
              </div>

              {hoveredCell && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm">
                    <strong>
                      {days[hoveredCell.day]} {hoveredCell.hour}:00
                    </strong>{" "}
                    - {getIntensityLabel(hoveredCell.value)} demand ({(hoveredCell.value * 100).toFixed(0)}%)
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {weatherData.map((weather, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{weather.day}</span>
                        <Cloud className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-blue-600">{weather.temp}°F</div>
                        <div className="text-sm text-gray-600">{weather.condition}</div>
                        <Badge
                          className={
                            weather.impact === "Very High"
                              ? "bg-red-100 text-red-800"
                              : weather.impact === "High"
                                ? "bg-orange-100 text-orange-800"
                                : weather.impact === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                          }
                        >
                          {weather.impact} Impact
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2">Weather Impact Analysis</h4>
                <p className="text-sm text-gray-700">{getProductSpecificWeatherAnalysis(productId)}</p>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sentimentData.map((data, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{data.source}</span>
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-purple-600">{data.mentions}</div>
                        <div className="text-sm text-gray-600">Mentions</div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-semibold text-green-600">
                            {(data.sentiment * 100).toFixed(0)}%
                          </div>
                          <Badge className="bg-green-100 text-green-800">Positive</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium mb-2">Sentiment Impact Analysis</h4>
                <p className="text-sm text-gray-700">
                  High positive sentiment (82% average) correlates with increased demand. Social media buzz typically
                  leads actual sales by 2-3 days, providing early demand signals for inventory optimization.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
                            <div className="text-lg font-semibold text-green-600">
                              ${Number.parseFloat(sale.revenue).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Qty: {Number.parseFloat(sale.quantity).toFixed(2)}
                            </div>
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
                    Total Items:{" "}
                    {selectedCell.sales.reduce((sum, sale) => sum + Number.parseFloat(sale.quantity), 0).toFixed(2)}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Total Revenue: $
                    {selectedCell.sales.reduce((sum, sale) => sum + Number.parseFloat(sale.revenue), 0).toFixed(2)}
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
