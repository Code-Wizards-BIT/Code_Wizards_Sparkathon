"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Target } from "lucide-react"

// Product-specific data based on characteristics and heatmap patterns
const getProductInsights = (productId: string) => {
  const productInsightsData: Record<string, any> = {
    "milk-whole": {
      peakHours: "6-9 AM",
      peakDays: "Saturday, Sunday",
      avgDemand: 85,
      forecast: "High demand expected tomorrow morning (7-9 AM)",
      recommendations: [
        "Restock before 6 AM daily",
        "Increase weekend inventory by 30%",
        "Monitor expiration dates closely",
      ],
      alerts: [
        { type: "warning", message: "Stock running low for morning rush" },
        { type: "info", message: "Weekend demand spike predicted" },
      ],
      performance: {
        forecastAccuracy: 94,
        wasteReduction: 18,
        stockoutsPrevented: 12,
        overstockAvoided: 4,
        revenueProtected: 3247,
      },
    },
    "bread-white": {
      peakHours: "7-10 AM",
      peakDays: "Saturday, Sunday",
      avgDemand: 78,
      forecast: "Moderate demand expected with morning peak",
      recommendations: [
        "Fresh delivery before 7 AM",
        "Monitor weekend breakfast rush",
        "Consider promotional pricing for day-old bread",
      ],
      alerts: [
        { type: "success", message: "Optimal stock levels maintained" },
        { type: "info", message: "Fresh delivery scheduled for tomorrow" },
      ],
      performance: {
        forecastAccuracy: 91,
        wasteReduction: 22,
        stockoutsPrevented: 8,
        overstockAvoided: 6,
        revenueProtected: 1876,
      },
    },
    "ice-cream": {
      peakHours: "2-8 PM",
      peakDays: "Friday, Saturday, Sunday",
      avgDemand: 65,
      forecast: "Very high demand expected due to hot weather (88°F)",
      recommendations: [
        "Increase stock for hot days (80°F+)",
        "Monitor weather forecasts closely",
        "Prepare for weekend surge",
      ],
      alerts: [
        { type: "warning", message: "Hot weather spike incoming" },
        { type: "info", message: "Weekend demand surge expected" },
      ],
      performance: {
        forecastAccuracy: 89,
        wasteReduction: 12,
        stockoutsPrevented: 15,
        overstockAvoided: 2,
        revenueProtected: 4521,
      },
    },
    umbrella: {
      peakHours: "Variable",
      peakDays: "Weather dependent",
      avgDemand: 25,
      forecast: "Extreme spike expected due to rain forecast",
      recommendations: [
        "Monitor weather alerts closely",
        "Increase stock before rainy days",
        "Consider promotional bundling",
      ],
      alerts: [
        { type: "warning", message: "Rain forecast - demand spike expected" },
        { type: "info", message: "Low baseline demand maintained" },
      ],
      performance: {
        forecastAccuracy: 87,
        wasteReduction: 8,
        stockoutsPrevented: 3,
        overstockAvoided: 12,
        revenueProtected: 892,
      },
    },
    "coffee-beans": {
      peakHours: "6-11 AM",
      peakDays: "Monday, Tuesday",
      avgDemand: 82,
      forecast: "High demand expected during morning hours",
      recommendations: [
        "Ensure fresh stock for morning rush",
        "Monitor Monday morning surge",
        "Consider premium blend promotions",
      ],
      alerts: [
        { type: "success", message: "Consistent demand pattern maintained" },
        { type: "info", message: "Premium blend performing well" },
      ],
      performance: {
        forecastAccuracy: 96,
        wasteReduction: 15,
        stockoutsPrevented: 18,
        overstockAvoided: 3,
        revenueProtected: 5634,
      },
    },
    "soup-cans": {
      peakHours: "11 AM-2 PM",
      peakDays: "Tuesday, Friday",
      avgDemand: 58,
      forecast: "Increased demand expected due to cold weather",
      recommendations: ["Stock up before cold fronts", "Monitor lunch hour demand", "Consider variety pack promotions"],
      alerts: [
        { type: "info", message: "Cold weather driving demand increase" },
        { type: "success", message: "Lunch hour sales steady" },
      ],
      performance: {
        forecastAccuracy: 88,
        wasteReduction: 25,
        stockoutsPrevented: 6,
        overstockAvoided: 8,
        revenueProtected: 1456,
      },
    },
    bananas: {
      peakHours: "9 AM-6 PM",
      peakDays: "Wednesday, Saturday",
      avgDemand: 92,
      forecast: "High demand with quick turnover expected",
      recommendations: [
        "Monitor ripeness levels closely",
        "Increase delivery frequency",
        "Consider markdown timing optimization",
      ],
      alerts: [
        { type: "warning", message: "High wastage risk - monitor ripeness" },
        { type: "info", message: "Consistent high demand maintained" },
      ],
      performance: {
        forecastAccuracy: 85,
        wasteReduction: 30,
        stockoutsPrevented: 22,
        overstockAvoided: 1,
        revenueProtected: 2134,
      },
    },
    "chicken-breast": {
      peakHours: "4-7 PM",
      peakDays: "Thursday, Friday, Sunday",
      avgDemand: 74,
      forecast: "High demand expected for dinner preparations",
      recommendations: [
        "Fresh delivery before dinner rush",
        "Monitor weekend meal prep demand",
        "Ensure proper refrigeration",
      ],
      alerts: [
        { type: "success", message: "Dinner rush demand well-managed" },
        { type: "info", message: "Weekend meal prep trend continuing" },
      ],
      performance: {
        forecastAccuracy: 92,
        wasteReduction: 20,
        stockoutsPrevented: 14,
        overstockAvoided: 5,
        revenueProtected: 4789,
      },
    },
  }

  return (
    productInsightsData[productId] ||
    productInsightsData["milk-whole"] || {
      peakHours: "Variable",
      peakDays: "Weekends",
      avgDemand: 70,
      forecast: "Moderate demand expected",
      recommendations: ["Monitor stock levels", "Track demand patterns", "Optimize inventory"],
      alerts: [{ type: "info", message: "Standard monitoring in place" }],
      performance: {
        forecastAccuracy: 90,
        wasteReduction: 15,
        stockoutsPrevented: 10,
        overstockAvoided: 5,
        revenueProtected: 2500,
      },
    }
  )
}

export function DemandInsights({ productId }: { productId: string }) {
  const insights = getProductInsights(productId)

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-blue-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Average Demand</span>
              <span className="text-sm font-bold">{insights.avgDemand}%</span>
            </div>
            <Progress value={insights.avgDemand} className="h-2" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Peak Hours</div>
                <div className="text-xs text-gray-600">{insights.peakHours}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium">Peak Days</div>
                <div className="text-xs text-gray-600">{insights.peakDays}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            24h Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{insights.forecast}</p>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.alerts.map((alert: any, index: number) => (
            <div key={index} className={`flex items-start gap-3 p-3 border rounded-lg ${getAlertColor(alert.type)}`}>
              {getAlertIcon(alert.type)}
              <p className="text-sm">{alert.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {insights.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Historical Performance */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{insights.performance.forecastAccuracy}%</div>
              <div className="text-xs text-green-700">Forecast Accuracy</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{insights.performance.wasteReduction}%</div>
              <div className="text-xs text-blue-700">Waste Reduction</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Stockouts Prevented</span>
              <span className="font-medium">{insights.performance.stockoutsPrevented}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Overstock Avoided</span>
              <span className="font-medium">{insights.performance.overstockAvoided}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Revenue Protected</span>
              <span className="font-medium">${insights.performance.revenueProtected.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
