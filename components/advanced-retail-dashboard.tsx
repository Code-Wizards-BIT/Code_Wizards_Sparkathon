"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  TrendingUp,
  DollarSign,
  Package,
  Filter,
  Plus,
  X,
  BarChart3,
  Activity,
  Download,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { AdvancedHeatmap } from "@/components/advanced-heatmap"
import { AdvancedSalesChart } from "@/components/advanced-sales-chart"
import { AIInsights } from "@/components/ai-insights"
import { generateRetailDataset, type RetailSalesEvent, RETAIL_PRODUCTS } from "@/lib/retail-data-generator"

interface SellerEntry {
  id: string
  time: string
  productId: string
  quantity: number
  location: { lat: number; lng: number }
  timestamp: Date
}

interface MainFilters {
  products: string[]
  categories: string[]
  timeOfDay: string
  month: string
  year: string
  timeRange: number[]
}

interface GraphFilters {
  products: string[]
  dateRange: string
  aggregation: string
  timeOfDay: string
}

export function AdvancedRetailDashboard() {
  const [showSellerPanel, setShowSellerPanel] = useState(false)
  const [salesData, setSalesData] = useState<RetailSalesEvent[]>([])
  const [sellerEntries, setSellerEntries] = useState<SellerEntry[]>([])
  const [selectedHeatmapMonth, setSelectedHeatmapMonth] = useState("current")
  const [mainFilters, setMainFilters] = useState<MainFilters>({
    products: [],
    categories: [],
    timeOfDay: "all",
    month: "all",
    year: "all",
    timeRange: [0, 23],
  })
  const [graphFilters, setGraphFilters] = useState<GraphFilters>({
    products: [],
    dateRange: "7d",
    aggregation: "hourly",
    timeOfDay: "all",
  })

  // Seller panel form state
  const [selectedTime, setSelectedTime] = useState("12:00")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)

  // Initialize with retail dataset
  useEffect(() => {
    const retailData = generateRetailDataset()
    setSalesData(retailData)
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(RETAIL_PRODUCTS.map((p) => p.category))]
  }, [])

  // Filter data based on main filters
  const filteredData = useMemo(() => {
    let filtered = [
      ...salesData,
      ...sellerEntries.map((entry) => ({
        id: entry.id,
        productId: entry.productId,
        quantity: entry.quantity,
        revenue: RETAIL_PRODUCTS.find((p) => p.id === entry.productId)?.price || 0 * entry.quantity,
        location: entry.location,
        timestamp: entry.timestamp,
        hour: entry.timestamp.getHours(),
        month: entry.timestamp.getMonth(),
        year: entry.timestamp.getFullYear(),
        storeId: "store-001",
        customerId: `customer-${Math.random().toString(36).substr(2, 9)}`,
        category: RETAIL_PRODUCTS.find((p) => p.id === entry.productId)?.category || "Other",
      })),
    ]

    if (mainFilters.products.length > 0) {
      filtered = filtered.filter((item) => mainFilters.products.includes(item.productId))
    }

    if (mainFilters.categories.length > 0) {
      filtered = filtered.filter((item) => {
        const product = RETAIL_PRODUCTS.find((p) => p.id === item.productId)
        return product && mainFilters.categories.includes(product.category)
      })
    }

    if (mainFilters.timeOfDay !== "all") {
      const timeRanges = {
        morning: [6, 11],
        afternoon: [12, 17],
        evening: [18, 23],
        night: [0, 5],
      }
      const [start, end] = timeRanges[mainFilters.timeOfDay as keyof typeof timeRanges] || [0, 23]
      filtered = filtered.filter((item) => item.hour >= start && item.hour <= end)
    }

    // Apply time range slider
    filtered = filtered.filter((item) => item.hour >= mainFilters.timeRange[0] && item.hour <= mainFilters.timeRange[1])

    if (mainFilters.month !== "all") {
      const monthNum = Number.parseInt(mainFilters.month)
      filtered = filtered.filter((item) => item.month === monthNum)
    }

    if (mainFilters.year !== "all") {
      const yearNum = Number.parseInt(mainFilters.year)
      filtered = filtered.filter((item) => item.year === yearNum)
    }

    return filtered
  }, [salesData, sellerEntries, mainFilters])

  // Filter data for graph based on graph filters
  const graphData = useMemo(() => {
    let filtered = filteredData

    if (graphFilters.products.length > 0) {
      filtered = filtered.filter((item) => graphFilters.products.includes(item.productId))
    }

    if (graphFilters.timeOfDay !== "all") {
      const timeRanges = {
        morning: [6, 11],
        afternoon: [12, 17],
        evening: [18, 23],
        night: [0, 5],
      }
      const [start, end] = timeRanges[graphFilters.timeOfDay as keyof typeof timeRanges] || [0, 23]
      filtered = filtered.filter((item) => item.hour >= start && item.hour <= end)
    }

    // Apply date range filter
    const now = new Date()
    const dateRanges = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    }
    const days = dateRanges[graphFilters.dateRange as keyof typeof dateRanges] || 7
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    filtered = filtered.filter((item) => item.timestamp >= cutoffDate)

    return filtered
  }, [filteredData, graphFilters])

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalUnits = filteredData.reduce((sum, item) => sum + item.quantity, 0)
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0)
    const uniqueProducts = new Set(filteredData.map((item) => item.productId)).size
    const avgOrderValue = totalRevenue / filteredData.length || 0

    // Category breakdown
    const categoryStats = RETAIL_PRODUCTS.reduce(
      (acc, product) => {
        const categoryData = filteredData.filter((item) => item.productId === product.id)
        if (categoryData.length > 0) {
          acc[product.category] =
            (acc[product.category] || 0) + categoryData.reduce((sum, item) => sum + item.revenue, 0)
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalUnits,
      totalRevenue,
      uniqueProducts,
      avgOrderValue,
      categoryStats,
    }
  }, [filteredData])

  // Get available years from data
  const availableYears = useMemo(() => {
    const years = new Set(salesData.map((item) => item.year))
    return Array.from(years).sort((a, b) => b - a)
  }, [salesData])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toFixed(2)
  }

  const handleAddSellerEntry = () => {
    if (!selectedProduct || !selectedTime) return

    const [hours, minutes] = selectedTime.split(":").map(Number)
    const now = new Date()
    const timestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)

    // Generate random location within a realistic area
    const baseLocation = { lat: 40.7128, lng: -74.006 } // NYC
    const newEntry: SellerEntry = {
      id: `seller-${Date.now()}`,
      time: selectedTime,
      productId: selectedProduct,
      quantity,
      location: {
        lat: baseLocation.lat + (Math.random() - 0.5) * 0.02,
        lng: baseLocation.lng + (Math.random() - 0.5) * 0.02,
      },
      timestamp,
    }

    setSellerEntries((prev) => [...prev, newEntry])

    // Reset form
    setSelectedTime("12:00")
    setSelectedProduct("")
    setQuantity(1)
  }

  const handleDownloadData = async (type: "product" | "store") => {
    const dataToDownload =
      type === "product" && mainFilters.products.length === 1
        ? filteredData.filter((item) => item.productId === mainFilters.products[0])
        : filteredData

    // Import jsPDF dynamically
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    // Create comprehensive report content
    doc.setFontSize(20)
    doc.text(`${type === "product" ? "Product" : "Store"} Analytics Report`, 20, 20)

    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35)
    doc.text(`Total Sales: ${dataToDownload.reduce((sum, d) => sum + d.quantity, 0).toFixed(2)}`, 20, 45)
    doc.text(`Total Revenue: $${dataToDownload.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}`, 20, 55)
    doc.text(`Unique Products: ${new Set(dataToDownload.map((d) => d.productId)).size}`, 20, 65)

    const dateRange = {
      from: new Date(Math.min(...dataToDownload.map((d) => d.timestamp.getTime()))).toLocaleDateString(),
      to: new Date(Math.max(...dataToDownload.map((d) => d.timestamp.getTime()))).toLocaleDateString(),
    }
    doc.text(`Date Range: ${dateRange.from} - ${dateRange.to}`, 20, 75)

    // Add sample data
    doc.setFontSize(16)
    doc.text("Sample Data:", 20, 95)

    let yPos = 110
    dataToDownload.slice(0, 20).forEach((item, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      const product = RETAIL_PRODUCTS.find((p) => p.id === item.productId)?.name || item.productId
      doc.setFontSize(10)
      doc.text(
        `${index + 1}. ${product} - Qty: ${item.quantity.toFixed(2)}, Revenue: $${item.revenue.toFixed(2)}`,
        20,
        yPos,
      )
      yPos += 8
    })

    // Save the PDF
    doc.save(`${type}-analytics-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const handleProductToggle = (productId: string, checked: boolean) => {
    setMainFilters((prev) => ({
      ...prev,
      products: checked ? [...prev.products, productId] : prev.products.filter((id) => id !== productId),
    }))
  }

  const handleCategoryToggle = (category: string, checked: boolean) => {
    setMainFilters((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((cat) => cat !== category),
    }))
  }

  const handleGraphProductToggle = (productId: string, checked: boolean) => {
    setGraphFilters((prev) => ({
      ...prev,
      products: checked ? [...prev.products, productId] : prev.products.filter((id) => id !== productId),
    }))
  }

  const clearAllFilters = () => {
    setMainFilters({
      products: [],
      categories: [],
      timeOfDay: "all",
      month: "all",
      year: "all",
      timeRange: [0, 23],
    })
    setGraphFilters({
      products: [],
      dateRange: "7d",
      aggregation: "hourly",
      timeOfDay: "all",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Advanced Retail Analytics
              </h1>
              <p className="text-gray-400">Real-time insights with AI-powered recommendations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSellerPanel(!showSellerPanel)}
              variant="outline"
              size="sm"
              className="border-cyan-500/30 bg-cyan-500/10  hover: text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sale
            </Button>
            <Button
              onClick={clearAllFilters}
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 bg-red-500/10 "
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Seller Panel */}
        {showSellerPanel && (
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Plus className="w-5 h-5" />
                Add New Sale Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Time</Label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-xl">
                      {RETAIL_PRODUCTS.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddSellerEntry} className="w-full bg-cyan-600 hover:bg-cyan-700">
                    Add Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Smart Filters */}
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="w-5 h-5 text-purple-400" />
              Filters
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {mainFilters.products.length + mainFilters.categories.length} active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Filters */}
            <div className="space-y-3">
              <Label className="text-gray-300 font-medium">Products</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {RETAIL_PRODUCTS.slice(0, 12).map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={product.id}
                      checked={mainFilters.products.includes(product.id)}
                      onCheckedChange={(checked) => handleProductToggle(product.id, checked as boolean)}
                      className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor={product.id} className="text-sm text-gray-300 cursor-pointer">
                      {product.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700/50" />

            {/* Category Filters */}
            <div className="space-y-3">
              <Label className="text-gray-300 font-medium">Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={mainFilters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryToggle(category, checked as boolean)}
                      className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor={category} className="text-sm text-gray-300 cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700/50" />

            {/* Time and Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Time of Day</Label>
                <Select
                  value={mainFilters.timeOfDay}
                  onValueChange={(value) => setMainFilters((prev) => ({ ...prev, timeOfDay: value }))}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-xl">
                    <SelectItem value="all">All Day</SelectItem>
                    <SelectItem value="morning">Morning (6-11)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12-17)</SelectItem>
                    <SelectItem value="evening">Evening (18-23)</SelectItem>
                    <SelectItem value="night">Night (0-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Month</Label>
                <Select
                  value={mainFilters.month}
                  onValueChange={(value) => setMainFilters((prev) => ({ ...prev, month: value }))}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-xl">
                    <SelectItem value="all">All Months</SelectItem>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Year</Label>
                <Select
                  value={mainFilters.year}
                  onValueChange={(value) => setMainFilters((prev) => ({ ...prev, year: value }))}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-xl">
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">
                  Hour Range: {mainFilters.timeRange[0]}:00 - {mainFilters.timeRange[1]}:00
                </Label>
                <Slider
                  value={mainFilters.timeRange}
                  onValueChange={(value) => setMainFilters((prev) => ({ ...prev, timeRange: value }))}
                  max={23}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Sales</p>
                  <p className="text-2xl font-bold text-black" title={analytics.totalUnits.toFixed(2)}>
                    {formatNumber(analytics.totalUnits)}
                  </p>
                  <p className="text-xs text-gray-400">units sold</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-black" title={`$${analytics.totalRevenue.toFixed(2)}`}>
                    ${formatNumber(analytics.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-400">gross revenue</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Products</p>
                  <p className="text-2xl font-bold text-black">{analytics.uniqueProducts}</p>
                  <p className="text-xs text-gray-400">unique items</p>
                </div>
                <Package className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Avg Order</p>
                  <p className="text-2xl font-bold text-black" title={`$${analytics.avgOrderValue.toFixed(2)}`}>
                    ${formatNumber(analytics.avgOrderValue)}
                  </p>
                  <p className="text-xs text-gray-400">per transaction</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-red-400" />
              Sales Activity Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdvancedHeatmap
              data={filteredData}
              selectedMonth={selectedHeatmapMonth}
              onMonthChange={setSelectedHeatmapMonth}
            />
          </CardContent>
        </Card>

        {/* Sales Chart with Graph Filters */}
        <Card className="bg-gradient-to-br from-800/60 to-gray-900/60 border-black-700/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Sales Performance Chart
              </CardTitle>

              {/* Graph-specific filters */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-300 text-sm">Products:</Label>
                  <div className="flex gap-2">
                    {RETAIL_PRODUCTS.slice(0, 4).map((product) => (
                      <div key={product.id} className="flex items-center space-x-1">
                        <Checkbox
                          id={`graph-${product.id}`}
                          checked={graphFilters.products.includes(product.id)}
                          onCheckedChange={(checked) => handleGraphProductToggle(product.id, checked as boolean)}
                          className="border-gray-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                        />
                        <Label htmlFor={`graph-${product.id}`} className="text-xs text-gray-300 cursor-pointer">
                          {product.name.split(" ")[0]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Select
                  value={graphFilters.dateRange}
                  onValueChange={(value) => setGraphFilters((prev) => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-xl">
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="90d">90 Days</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={graphFilters.aggregation}
                  onValueChange={(value) => setGraphFilters((prev) => ({ ...prev, aggregation: value }))}
                >
                  <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 backdrop-blur-xl">
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AdvancedSalesChart data={graphData} aggregation={graphFilters.aggregation} />
          </CardContent>
        </Card>

        {/* AI Insights */}
        <AIInsights data={filteredData} categoryStats={analytics.categoryStats} />

        {/* Download Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleDownloadData("store")}
            variant="outline"
            className="border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Store Report
          </Button>
          {mainFilters.products.length === 1 && (
            <Button
              onClick={() => handleDownloadData("product")}
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Product Report
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
