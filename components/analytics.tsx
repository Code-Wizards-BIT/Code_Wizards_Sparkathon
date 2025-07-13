"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Package, Trash2 } from "lucide-react"

// Dynamic analytics data based on time range
const getAnalyticsData = (timeRange: string) => {
  const baseData = {
    "7d": {
      overview: {
        totalProducts: 20,
        totalRevenue: 284729,
        wasteReduction: 85,
        forecastAccuracy: 94.2,
        stockoutPrevention: 96,
        overstockReduction: 82,
      },
      categoryAnalytics: [
        {
          category: "Produce",
          products: 5,
          avgWastage: 22.8,
          avgUnderstock: 2.2,
          revenue: 45679,
          trend: "up",
          topProduct: "Fresh Bananas",
        },
        {
          category: "Dairy",
          products: 4,
          avgWastage: 12.0,
          avgUnderstock: 3.25,
          revenue: 67843,
          trend: "up",
          topProduct: "Whole Milk",
        },
        {
          category: "Meat",
          products: 2,
          avgWastage: 17.0,
          avgUnderstock: 6.5,
          revenue: 53422,
          trend: "stable",
          topProduct: "Chicken Breast",
        },
        {
          category: "Beverages",
          products: 2,
          avgWastage: 8.5,
          avgUnderstock: 4.0,
          revenue: 34568,
          trend: "up",
          topProduct: "Premium Coffee Beans",
        },
        {
          category: "Bakery",
          products: 1,
          avgWastage: 8.0,
          avgUnderstock: 5.0,
          revenue: 23457,
          trend: "up",
          topProduct: "White Bread",
        },
        {
          category: "Frozen",
          products: 1,
          avgWastage: 15.0,
          avgUnderstock: 2.0,
          revenue: 18943,
          trend: "down",
          topProduct: "Vanilla Ice Cream",
        },
        {
          category: "Snacks",
          products: 1,
          avgWastage: 8.0,
          avgUnderstock: 2.0,
          revenue: 15679,
          trend: "up",
          topProduct: "Potato Chips",
        },
        {
          category: "Seafood",
          products: 1,
          avgWastage: 12.0,
          avgUnderstock: 5.0,
          revenue: 12346,
          trend: "up",
          topProduct: "Salmon Fillet",
        },
      ],
      productPerformance: [
        { name: "Fresh Bananas", wastage: 25, understock: 2, revenue: 8943, efficiency: 88 },
        { name: "Fresh Tomatoes", wastage: 28, understock: 3, revenue: 7654, efficiency: 85 },
        { name: "Red Apples", wastage: 22, understock: 1, revenue: 9877, efficiency: 91 },
        { name: "Whole Milk", wastage: 12, understock: 3, revenue: 23457, efficiency: 92 },
        { name: "Chicken Breast", wastage: 18, understock: 6, revenue: 23457, efficiency: 82 },
      ],
      alerts: [
        { type: "critical", product: "Fresh Tomatoes", message: "High wastage rate detected (28%)", priority: "high" },
        { type: "warning", product: "Ground Beef", message: "Frequent understocking (7% rate)", priority: "medium" },
        { type: "info", product: "Red Apples", message: "Optimal performance maintained", priority: "low" },
      ],
    },
    "30d": {
      overview: {
        totalProducts: 20,
        totalRevenue: 1247293,
        wasteReduction: 78,
        forecastAccuracy: 92.8,
        stockoutPrevention: 89,
        overstockReduction: 75,
      },
      categoryAnalytics: [
        {
          category: "Produce",
          products: 5,
          avgWastage: 26.2,
          avgUnderstock: 3.8,
          revenue: 198765,
          trend: "up",
          topProduct: "Fresh Bananas",
        },
        {
          category: "Dairy",
          products: 4,
          avgWastage: 14.5,
          avgUnderstock: 4.1,
          revenue: 289432,
          trend: "up",
          topProduct: "Whole Milk",
        },
        {
          category: "Meat",
          products: 2,
          avgWastage: 19.2,
          avgUnderstock: 8.2,
          revenue: 234567,
          trend: "stable",
          topProduct: "Chicken Breast",
        },
        {
          category: "Beverages",
          products: 2,
          avgWastage: 10.8,
          avgUnderstock: 5.5,
          revenue: 156789,
          trend: "up",
          topProduct: "Premium Coffee Beans",
        },
        {
          category: "Bakery",
          products: 1,
          avgWastage: 11.2,
          avgUnderstock: 6.8,
          revenue: 98765,
          trend: "stable",
          topProduct: "White Bread",
        },
        {
          category: "Frozen",
          products: 1,
          avgWastage: 18.5,
          avgUnderstock: 3.2,
          revenue: 87654,
          trend: "up",
          topProduct: "Vanilla Ice Cream",
        },
        {
          category: "Snacks",
          products: 1,
          avgWastage: 9.8,
          avgUnderstock: 3.1,
          revenue: 76543,
          trend: "up",
          topProduct: "Potato Chips",
        },
        {
          category: "Seafood",
          products: 1,
          avgWastage: 15.2,
          avgUnderstock: 7.2,
          revenue: 65432,
          trend: "stable",
          topProduct: "Salmon Fillet",
        },
      ],
      productPerformance: [
        { name: "Fresh Bananas", wastage: 28, understock: 4, revenue: 45678, efficiency: 85 },
        { name: "Fresh Tomatoes", wastage: 32, understock: 5, revenue: 38765, efficiency: 82 },
        { name: "Red Apples", wastage: 25, understock: 2, revenue: 42345, efficiency: 88 },
        { name: "Whole Milk", wastage: 15, understock: 4, revenue: 98765, efficiency: 89 },
        { name: "Chicken Breast", wastage: 21, understock: 8, revenue: 87654, efficiency: 79 },
      ],
      alerts: [
        {
          type: "critical",
          product: "Fresh Tomatoes",
          message: "Wastage increased to 32% over 30 days",
          priority: "high",
        },
        { type: "critical", product: "Chicken Breast", message: "Understocking trend worsening", priority: "high" },
        {
          type: "warning",
          product: "Vanilla Ice Cream",
          message: "Seasonal demand fluctuations detected",
          priority: "medium",
        },
        { type: "info", product: "Premium Coffee", message: "Consistent performance maintained", priority: "low" },
      ],
    },
    "90d": {
      overview: {
        totalProducts: 20,
        totalRevenue: 3847293,
        wasteReduction: 72,
        forecastAccuracy: 91.4,
        stockoutPrevention: 84,
        overstockReduction: 68,
      },
      categoryAnalytics: [
        {
          category: "Produce",
          products: 5,
          avgWastage: 29.8,
          avgUnderstock: 5.2,
          revenue: 567890,
          trend: "stable",
          topProduct: "Fresh Bananas",
        },
        {
          category: "Dairy",
          products: 4,
          avgWastage: 16.8,
          avgUnderstock: 5.8,
          revenue: 876543,
          trend: "up",
          topProduct: "Whole Milk",
        },
        {
          category: "Meat",
          products: 2,
          avgWastage: 22.1,
          avgUnderstock: 9.8,
          revenue: 654321,
          trend: "down",
          topProduct: "Chicken Breast",
        },
        {
          category: "Beverages",
          products: 2,
          avgWastage: 12.5,
          avgUnderstock: 6.8,
          revenue: 456789,
          trend: "stable",
          topProduct: "Premium Coffee Beans",
        },
        {
          category: "Bakery",
          products: 1,
          avgWastage: 13.8,
          avgUnderstock: 8.2,
          revenue: 345678,
          trend: "down",
          topProduct: "White Bread",
        },
        {
          category: "Frozen",
          products: 1,
          avgWastage: 22.8,
          avgUnderstock: 4.5,
          revenue: 298765,
          trend: "up",
          topProduct: "Vanilla Ice Cream",
        },
        {
          category: "Snacks",
          products: 1,
          avgWastage: 11.2,
          avgUnderstock: 4.8,
          revenue: 234567,
          trend: "stable",
          topProduct: "Potato Chips",
        },
        {
          category: "Seafood",
          products: 1,
          avgWastage: 18.5,
          avgUnderstock: 8.8,
          revenue: 187654,
          trend: "down",
          topProduct: "Salmon Fillet",
        },
      ],
      productPerformance: [
        { name: "Fresh Bananas", wastage: 32, understock: 6, revenue: 134567, efficiency: 82 },
        { name: "Fresh Tomatoes", wastage: 35, understock: 7, revenue: 123456, efficiency: 79 },
        { name: "Red Apples", wastage: 28, understock: 4, revenue: 145678, efficiency: 85 },
        { name: "Whole Milk", wastage: 18, understock: 6, revenue: 298765, efficiency: 86 },
        { name: "Chicken Breast", wastage: 24, understock: 10, revenue: 234567, efficiency: 76 },
      ],
      alerts: [
        {
          type: "critical",
          product: "Fresh Tomatoes",
          message: "Quarterly wastage at 35% - urgent action needed",
          priority: "high",
        },
        {
          type: "critical",
          product: "Chicken Breast",
          message: "Consistent understocking over 90 days",
          priority: "high",
        },
        { type: "warning", product: "Bakery Items", message: "Seasonal decline in performance", priority: "medium" },
        {
          type: "warning",
          product: "Seafood",
          message: "Supply chain disruptions affecting availability",
          priority: "medium",
        },
        { type: "info", product: "Frozen Foods", message: "Summer season boost in ice cream sales", priority: "low" },
      ],
    },
    "1y": {
      overview: {
        totalProducts: 20,
        totalRevenue: 15847293,
        wasteReduction: 65,
        forecastAccuracy: 89.8,
        stockoutPrevention: 78,
        overstockReduction: 62,
      },
      categoryAnalytics: [
        {
          category: "Produce",
          products: 5,
          avgWastage: 34.2,
          avgUnderstock: 7.8,
          revenue: 2345678,
          trend: "down",
          topProduct: "Fresh Bananas",
        },
        {
          category: "Dairy",
          products: 4,
          avgWastage: 19.5,
          avgUnderstock: 8.2,
          revenue: 3876543,
          trend: "stable",
          topProduct: "Whole Milk",
        },
        {
          category: "Meat",
          products: 2,
          avgWastage: 25.8,
          avgUnderstock: 12.5,
          revenue: 2987654,
          trend: "down",
          topProduct: "Chicken Breast",
        },
        {
          category: "Beverages",
          products: 2,
          avgWastage: 15.2,
          avgUnderstock: 9.2,
          revenue: 1987654,
          trend: "up",
          topProduct: "Premium Coffee Beans",
        },
        {
          category: "Bakery",
          products: 1,
          avgWastage: 17.5,
          avgUnderstock: 11.8,
          revenue: 1456789,
          trend: "stable",
          topProduct: "White Bread",
        },
        {
          category: "Frozen",
          products: 1,
          avgWastage: 28.2,
          avgUnderstock: 6.8,
          revenue: 1234567,
          trend: "up",
          topProduct: "Vanilla Ice Cream",
        },
        {
          category: "Snacks",
          products: 1,
          avgWastage: 13.8,
          avgUnderstock: 7.2,
          revenue: 987654,
          trend: "up",
          topProduct: "Potato Chips",
        },
        {
          category: "Seafood",
          products: 1,
          avgWastage: 22.8,
          avgUnderstock: 13.2,
          revenue: 765432,
          trend: "down",
          topProduct: "Salmon Fillet",
        },
      ],
      productPerformance: [
        { name: "Fresh Bananas", wastage: 38, understock: 9, revenue: 567890, efficiency: 78 },
        { name: "Fresh Tomatoes", wastage: 42, understock: 11, revenue: 456789, efficiency: 74 },
        { name: "Red Apples", wastage: 32, understock: 6, revenue: 654321, efficiency: 82 },
        { name: "Whole Milk", wastage: 22, understock: 8, revenue: 1234567, efficiency: 83 },
        { name: "Chicken Breast", wastage: 28, understock: 13, revenue: 987654, efficiency: 72 },
      ],
      alerts: [
        {
          type: "critical",
          product: "Fresh Tomatoes",
          message: "Annual wastage at 42% - major process review needed",
          priority: "high",
        },
        {
          type: "critical",
          product: "Chicken Breast",
          message: "Chronic understocking affecting customer satisfaction",
          priority: "high",
        },
        {
          type: "critical",
          product: "Seafood Category",
          message: "Significant supply chain challenges throughout year",
          priority: "high",
        },
        {
          type: "warning",
          product: "Produce Category",
          message: "Overall category showing declining efficiency",
          priority: "medium",
        },
        {
          type: "warning",
          product: "Frozen Foods",
          message: "Seasonal volatility impacting annual performance",
          priority: "medium",
        },
        {
          type: "info",
          product: "Beverages",
          message: "Category showing consistent growth year-over-year",
          priority: "low",
        },
        { type: "info", product: "Snacks", message: "Steady performance with room for optimization", priority: "low" },
      ],
    },
  }

  return baseData[timeRange as keyof typeof baseData] || baseData["7d"]
}

export function Analytics() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [timeRange, setTimeRange] = useState("7d")

  const analyticsData = getAnalyticsData(timeRange)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <BarChart3 className="w-4 h-4 text-yellow-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <BarChart3 className="w-4 h-4 text-blue-600" />
    }
  }

  const filteredCategories =
    selectedCategory === "all"
      ? analyticsData.categoryAnalytics
      : analyticsData.categoryAnalytics.filter((cat) => cat.category === selectedCategory)

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d":
        return "Last 7 Days"
      case "30d":
        return "Last 30 Days"
      case "90d":
        return "Last 90 Days"
      case "1y":
        return "Last Year"
      default:
        return "Last 7 Days"
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Analytics Dashboard</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {analyticsData.categoryAnalytics.map((cat) => (
                    <SelectItem key={cat.category} value={cat.category}>
                      {cat.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-center mb-6">
              <Badge className="bg-blue-100 text-blue-800">Showing data for: {getTimeRangeLabel(timeRange)}</Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.totalProducts}</p>
                      </div>
                      <Package className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold">
                          ${(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Waste Reduction</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.wasteReduction}%</p>
                      </div>
                      <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Forecast Accuracy</p>
                        <p className="text-2xl font-bold">{analyticsData.overview.forecastAccuracy}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stockout Prevention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Prevention Rate</span>
                        <span className="font-bold text-green-600">{analyticsData.overview.stockoutPrevention}%</span>
                      </div>
                      <Progress value={analyticsData.overview.stockoutPrevention} className="h-3" />
                      <p className="text-sm text-gray-600">
                        AI predictions prevented {Math.floor(analyticsData.overview.stockoutPrevention * 0.8)} stockout
                        incidents in this period
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Overstock Reduction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Reduction Rate</span>
                        <span className="font-bold text-blue-600">{analyticsData.overview.overstockReduction}%</span>
                      </div>
                      <Progress value={analyticsData.overview.overstockReduction} className="h-3" />
                      <p className="text-sm text-gray-600">
                        Optimized inventory levels reduced overstock by $
                        {Math.floor(
                          analyticsData.overview.overstockReduction *
                            (timeRange === "1y" ? 50 : timeRange === "90d" ? 15 : timeRange === "30d" ? 5 : 1),
                        )}
                        K
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category, index) => (
                  <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                        {getTrendIcon(category.trend)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Products:</span>
                          <span className="ml-1 font-medium">{category.products}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Revenue:</span>
                          <span className="ml-1 font-medium">${(category.revenue / 1000).toFixed(0)}K</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Wastage:</span>
                          <span className="ml-1 font-medium text-red-600">{category.avgWastage}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Understock:</span>
                          <span className="ml-1 font-medium text-orange-600">{category.avgUnderstock}%</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">Top Product:</p>
                        <p className="font-medium">{category.topProduct}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Wastage Level</span>
                          <span>{category.avgWastage}%</span>
                        </div>
                        <Progress value={category.avgWastage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Product Performance - {getTimeRangeLabel(timeRange)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.productPerformance.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-gray-600">Wastage: </span>
                              <span className="font-medium text-red-600">{product.wastage}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Understock: </span>
                              <span className="font-medium text-orange-600">{product.understock}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Revenue: </span>
                              <span className="font-medium">${(product.revenue / 1000).toFixed(0)}K</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{product.efficiency}%</div>
                          <div className="text-xs text-gray-600">Efficiency</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Alerts - {getTimeRangeLabel(timeRange)}</h3>
                <p className="text-sm text-gray-600">
                  {analyticsData.alerts.length} alerts detected for the selected time period
                </p>
              </div>
              <div className="space-y-4">
                {analyticsData.alerts.map((alert, index) => (
                  <Card key={index} className={`border-l-4 ${getAlertColor(alert.type)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{alert.product}</h4>
                            <Badge
                              variant={
                                alert.priority === "high"
                                  ? "destructive"
                                  : alert.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {alert.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm">{alert.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
