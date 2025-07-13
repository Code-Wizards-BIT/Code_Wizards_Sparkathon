"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, MessageSquare, RefreshCw, X, TrendingDown, Percent, AlertTriangle } from "lucide-react"

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

// Generate seasonal heatmap data for 12 months
const generateSeasonalHeatmapData = (productId: string) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Create a seed based on productId for consistent data
  const seed = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000
    return x - Math.floor(x)
  }

  // Define seasonal patterns for different product types
  const seasonalPatterns: Record<string, { peakMonths: number[]; lowMonths: number[]; baseMultiplier: number }> = {
    "ice-cream": { peakMonths: [5, 6, 7, 8], lowMonths: [11, 0, 1, 2], baseMultiplier: 1.0 },
    "soup-cans": { peakMonths: [10, 11, 0, 1, 2], lowMonths: [5, 6, 7, 8], baseMultiplier: 0.8 },
    umbrella: { peakMonths: [3, 4, 9, 10], lowMonths: [6, 7, 11, 0], baseMultiplier: 0.6 },
    "coffee-beans": { peakMonths: [10, 11, 0, 1], lowMonths: [6, 7, 8], baseMultiplier: 1.2 },
    bananas: { peakMonths: [0, 1, 2, 9, 10, 11], lowMonths: [5, 6, 7], baseMultiplier: 1.1 },
    "chicken-breast": { peakMonths: [4, 5, 6, 10, 11], lowMonths: [1, 2, 8], baseMultiplier: 1.0 },
    "apples-red": { peakMonths: [8, 9, 10, 11], lowMonths: [3, 4, 5, 6], baseMultiplier: 0.9 },
    tomatoes: { peakMonths: [5, 6, 7, 8], lowMonths: [11, 0, 1, 2], baseMultiplier: 1.0 },
    "salmon-fillet": { peakMonths: [11, 0, 3, 4], lowMonths: [6, 7, 8], baseMultiplier: 1.1 },
    "potato-chips": { peakMonths: [6, 7, 11, 0], lowMonths: [2, 3, 9], baseMultiplier: 1.0 },
  }

  const pattern = seasonalPatterns[productId] || {
    peakMonths: [11, 0, 5, 6],
    lowMonths: [2, 3, 8, 9],
    baseMultiplier: 1.0,
  }

  return months.map((month, monthIndex) => {
    let baseValue = pattern.baseMultiplier * 0.5

    if (pattern.peakMonths.includes(monthIndex)) {
      baseValue = pattern.baseMultiplier * (0.8 + seededRandom(monthIndex) * 0.2) // High demand
    } else if (pattern.lowMonths.includes(monthIndex)) {
      baseValue = pattern.baseMultiplier * (0.2 + seededRandom(monthIndex + 12) * 0.2) // Low demand
    } else {
      baseValue = pattern.baseMultiplier * (0.4 + seededRandom(monthIndex + 24) * 0.3) // Medium demand
    }

    // Add some variation
    baseValue += (seededRandom(monthIndex + 36) - 0.5) * 0.1

    return {
      month,
      monthIndex,
      value: Math.max(0.1, Math.min(1, baseValue)),
      sales: Math.floor(baseValue * 1000 + seededRandom(monthIndex + 48) * 500),
      revenue: Math.floor(baseValue * 50000 + seededRandom(monthIndex + 60) * 25000),
    }
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

// Generate AI-powered sale suggestions
const generateSaleSuggestions = (productId: string) => {
  const productName = getProductName(productId)

  // AI analysis based on product characteristics
  const suggestions: Record<string, any> = {
    "ice-cream": {
      reason: "Winter season approaching - ice cream demand drops 60% in cold months",
      currentStock: 245,
      optimalStock: 120,
      overstockRisk: "High",
      suggestedDiscount: 25,
      timeframe: "2 weeks",
      aiConfidence: 92,
      strategy: "Bundle with hot beverages, promote as comfort food",
    },
    "soup-cans": {
      reason: "Summer season - soup demand decreases 40% in hot weather",
      currentStock: 180,
      optimalStock: 100,
      overstockRisk: "Medium",
      suggestedDiscount: 15,
      timeframe: "3 weeks",
      aiConfidence: 87,
      strategy: "Market as quick meal solution, bundle with bread",
    },
    umbrella: {
      reason: "Dry season forecast - 70% less rain expected next month",
      currentStock: 95,
      optimalStock: 30,
      overstockRisk: "Very High",
      suggestedDiscount: 35,
      timeframe: "1 week",
      aiConfidence: 95,
      strategy: "Emergency clearance, bundle with travel accessories",
    },
    "apples-red": {
      reason: "New harvest season - fresh supply will reduce demand for current stock",
      currentStock: 320,
      optimalStock: 200,
      overstockRisk: "Medium",
      suggestedDiscount: 20,
      timeframe: "10 days",
      aiConfidence: 89,
      strategy: "Promote for baking, bundle with cinnamon and pie crusts",
    },
    "salmon-fillet": {
      reason: "Post-holiday period - premium seafood demand drops 45%",
      currentStock: 85,
      optimalStock: 45,
      overstockRisk: "High",
      suggestedDiscount: 30,
      timeframe: "5 days",
      aiConfidence: 91,
      strategy: "Target health-conscious customers, promote omega-3 benefits",
    },
    "potato-chips": {
      reason: "Post-holiday snacking decline - 30% demand drop after festivities",
      currentStock: 450,
      optimalStock: 300,
      overstockRisk: "Medium",
      suggestedDiscount: 18,
      timeframe: "2 weeks",
      aiConfidence: 84,
      strategy: "Office lunch promotions, bulk discounts for families",
    },
  }

  // Default suggestion for products not specifically defined
  const defaultSuggestion = {
    reason: "Seasonal demand pattern analysis indicates potential overstock risk",
    currentStock: Math.floor(Math.random() * 200 + 100),
    optimalStock: Math.floor(Math.random() * 100 + 50),
    overstockRisk: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
    suggestedDiscount: Math.floor(Math.random() * 20 + 10),
    timeframe: ["1 week", "2 weeks", "3 weeks"][Math.floor(Math.random() * 3)],
    aiConfidence: Math.floor(Math.random() * 15 + 80),
    strategy: "Implement targeted promotions and strategic bundling",
  }

  return suggestions[productId] || defaultSuggestion
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
const seasonalCache: Record<string, any[]> = {}

const getHeatmapData = (productId: string) => {
  if (!heatmapCache[productId]) {
    heatmapCache[productId] = generateStaticHeatmapData(productId)
  }
  return heatmapCache[productId]
}

const getSeasonalData = (productId: string) => {
  if (!seasonalCache[productId]) {
    seasonalCache[productId] = generateSeasonalHeatmapData(productId)
  }
  return seasonalCache[productId]
}

const getIntensityColor = (value: number, isFuture: boolean) => {
  if (isFuture) return "bg-gray-200"

  if (value >= 0.8) return "bg-red-500"
  if (value >= 0.6) return "bg-red-400"
  if (value >= 0.4) return "bg-yellow-400"
  if (value >= 0.2) return "bg-green-400"
  return "bg-gray-200"
}

const getSeasonalIntensityColor = (value: number) => {
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

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Very High":
      return "bg-red-100 text-red-800 border-red-200"
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
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
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)

  // Use cached/static heatmap data
  const heatmapData = getHeatmapData(productId)
  const seasonalData = getSeasonalData(productId)
  const saleSuggestion = generateSaleSuggestions(productId)

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const hours = Array.from({ length: 24 }, (_, i) => i) // 0-23 (24 hours)

  const sentimentData = [
    { source: "Twitter", mentions: 1247, sentiment: 0.82, trend: "up" },
    { source: "Reddit", mentions: 456, sentiment: 0.75, trend: "stable" },
    { source: "Reviews", mentions: 89, sentiment: 0.91, trend: "up" },
  ]

  const getProductSpecificSeasonalAnalysis = (productId: string) => {
    switch (productId) {
      case "ice-cream":
        return "Ice cream shows strong seasonal patterns with 300% higher demand in summer months (Jun-Aug). Winter months see significant drops, requiring proactive inventory management."
      case "umbrella":
        return "Umbrella demand is highly seasonal and weather-dependent. Spring (Mar-May) and fall (Sep-Nov) show peak demand during rainy seasons."
      case "soup-cans":
        return "Soup demand peaks during cold months (Oct-Feb) with 250% higher sales. Summer months require careful inventory reduction to prevent overstock."
      case "coffee-beans":
        return "Coffee shows moderate seasonality with higher demand in winter months. Holiday seasons (Nov-Dec) show 40% increase in premium coffee sales."
      case "apples-red":
        return "Apple demand follows harvest cycles with peak demand in fall (Sep-Nov). Spring months show lower demand as stored apples lose freshness appeal."
      case "salmon-fillet":
        return "Salmon shows holiday seasonality with peaks during Thanksgiving and New Year. Summer grilling season also drives demand increases."
      default:
        return "This product shows moderate seasonal variation. Understanding these patterns helps optimize inventory levels and prevent both stockouts and overstock situations."
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Product Analytics - {getProductName(productId)}
            </CardTitle>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weekly">Weekly Pattern</TabsTrigger>
              <TabsTrigger value="seasonal">Seasonal Analysis</TabsTrigger>
              <TabsTrigger value="sale-suggestions">Sale Suggestions</TabsTrigger>
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

            <TabsContent value="seasonal" className="space-y-6">
              {/* Seasonal Heatmap */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Monthly Demand Pattern
                </h3>

                <div className="grid grid-cols-12 gap-2 mb-4">
                  {seasonalData.map((monthData, index) => (
                    <div
                      key={monthData.month}
                      className={`h-20 ${getSeasonalIntensityColor(monthData.value)} border border-white rounded-lg transition-transform hover:scale-105 cursor-pointer relative group`}
                      onMouseEnter={() => setHoveredMonth(index)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      title={`${monthData.month} - ${getIntensityLabel(monthData.value)} demand`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-medium">
                        <div>{monthData.month}</div>
                        <div>{(monthData.value * 100).toFixed(0)}%</div>
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                        <div className="font-medium">{monthData.month}</div>
                        <div>Demand: {getIntensityLabel(monthData.value)}</div>
                        <div>Sales: {formatNumber(monthData.sales)}</div>
                        <div>Revenue: ${formatNumber(monthData.revenue)}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Seasonal Legend */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-sm font-medium">Seasonal Demand:</span>
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
                </div>

                {hoveredMonth !== null && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm">
                      <strong>{seasonalData[hoveredMonth].month}</strong> -{" "}
                      {getIntensityLabel(seasonalData[hoveredMonth].value)} demand (
                      {(seasonalData[hoveredMonth].value * 100).toFixed(0)}%) •
                      {formatNumber(seasonalData[hoveredMonth].sales)} sales • $
                      {formatNumber(seasonalData[hoveredMonth].revenue)} revenue
                    </p>
                  </div>
                )}
              </div>

              {/* Seasonal Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Peak Season</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {seasonalData.reduce((max, current) => (current.value > max.value ? current : max)).month}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(
                        seasonalData.reduce((max, current) => (current.value > max.value ? current : max)).value * 100
                      ).toFixed(0)}
                      % demand intensity
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-800">Low Season</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {seasonalData.reduce((min, current) => (current.value < min.value ? current : min)).month}
                    </div>
                    <div className="text-sm text-gray-600">
                      {(
                        seasonalData.reduce((min, current) => (current.value < min.value ? current : min)).value * 100
                      ).toFixed(0)}
                      % demand intensity
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Seasonality</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {(
                        (Math.max(...seasonalData.map((d) => d.value)) -
                          Math.min(...seasonalData.map((d) => d.value))) *
                        100
                      ).toFixed(0)}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Variation range</div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Seasonal Impact Analysis
                </h4>
                <p className="text-sm text-gray-700">{getProductSpecificSeasonalAnalysis(productId)}</p>
              </div>
            </TabsContent>

            <TabsContent value="sale-suggestions" className="space-y-6">
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Percent className="w-5 h-5" />
                    AI-Powered Sale Recommendation
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      {saleSuggestion.aiConfidence}% Confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Alert Banner */}
                  <div className={`p-4 rounded-lg border-2 ${getRiskColor(saleSuggestion.overstockRisk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">{saleSuggestion.overstockRisk} Overstock Risk Detected</span>
                    </div>
                    <p className="text-sm">{saleSuggestion.reason}</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-gray-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{saleSuggestion.currentStock}</div>
                        <div className="text-sm text-gray-600">Current Stock</div>
                      </CardContent>
                    </Card>
                    <Card className="border border-gray-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">{saleSuggestion.optimalStock}</div>
                        <div className="text-sm text-gray-600">Optimal Stock</div>
                      </CardContent>
                    </Card>
                    <Card className="border border-gray-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          {saleSuggestion.currentStock - saleSuggestion.optimalStock}
                        </div>
                        <div className="text-sm text-gray-600">Excess Units</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Recommendation */}
                  <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-purple-800 flex items-center gap-2">
                        <Percent className="w-5 h-5" />
                        Recommended Action Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">Discount Strategy</h4>
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {saleSuggestion.suggestedDiscount}% OFF
                          </div>
                          <p className="text-sm text-gray-600">Optimal discount to clear excess inventory</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">Implementation Timeline</h4>
                          <div className="text-3xl font-bold text-purple-600 mb-2">{saleSuggestion.timeframe}</div>
                          <p className="text-sm text-gray-600">Recommended sale duration</p>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Marketing Strategy</h4>
                        <p className="text-sm text-gray-700">{saleSuggestion.strategy}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <h5 className="font-medium text-green-800 mb-1">Expected Outcome</h5>
                          <p className="text-sm text-green-700">
                            Reduce inventory by{" "}
                            {(
                              ((saleSuggestion.currentStock - saleSuggestion.optimalStock) /
                                saleSuggestion.currentStock) *
                              100
                            ).toFixed(0)}
                            % within {saleSuggestion.timeframe}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-800 mb-1">Revenue Impact</h5>
                          <p className="text-sm text-blue-700">
                            Estimated revenue: $
                            {(
                              (saleSuggestion.currentStock - saleSuggestion.optimalStock) *
                              15 *
                              (1 - saleSuggestion.suggestedDiscount / 100)
                            ).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Implementation Checklist */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-800">Implementation Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm">
                            Update pricing system with {saleSuggestion.suggestedDiscount}% discount
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm">Create promotional signage and marketing materials</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm">Implement bundling strategy as suggested</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm">Monitor daily sales performance</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm">Adjust strategy if needed after 3 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
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
