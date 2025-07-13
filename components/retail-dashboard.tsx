"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Package,
  Filter,
  Plus,
  X,
  BarChart3,
  ArrowRight,
  Zap,
  Brain,
  Target,
} from "lucide-react"
import { SalesHeatmap } from "@/components/sales-heatmap"
import { SalesChart } from "@/components/sales-chart"
import { generateInitialDataset, type SalesEvent, type Product } from "@/lib/data-generator"
import Link from "next/link"
import { ProblemStatement } from "@/components/problem-statement"
import { SolutionOverview } from "@/components/solution-overview"
import { Architecture } from "@/components/architecture"
import { Results } from "@/components/results"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Stats } from "@/components/stats"

interface SellerEntry {
  id: string
  time: string
  productId: string
  quantity: number
  location: { lat: number; lng: number }
  timestamp: Date
}

interface Filters {
  products: string[]
  timeOfDay: string
  month: string
}

export function RetailDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showSellerPanel, setShowSellerPanel] = useState(false)
  const [salesData, setSalesData] = useState<SalesEvent[]>([])
  const [sellerEntries, setSellerEntries] = useState<SellerEntry[]>([])
  const [filters, setFilters] = useState<Filters>({
    products: [],
    timeOfDay: "all",
    month: "all",
  })

  // Seller panel form state
  const [selectedTime, setSelectedTime] = useState("12:00")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)

  // Initialize with demo dataset
  useEffect(() => {
    const initialData = generateInitialDataset()
    setSalesData(initialData)
  }, [])

  // Available products
  const products: Product[] = [
    { id: "coffee", name: "Premium Coffee", price: 4.99, category: "Beverages" },
    { id: "sandwich", name: "Artisan Sandwich", price: 8.99, category: "Food" },
    { id: "pastry", name: "Fresh Pastry", price: 3.49, category: "Bakery" },
    { id: "juice", name: "Fresh Juice", price: 5.99, category: "Beverages" },
    { id: "salad", name: "Garden Salad", price: 7.99, category: "Food" },
    { id: "muffin", name: "Blueberry Muffin", price: 2.99, category: "Bakery" },
    { id: "smoothie", name: "Protein Smoothie", price: 6.99, category: "Beverages" },
    { id: "wrap", name: "Chicken Wrap", price: 9.99, category: "Food" },
  ]

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    let filtered = [
      ...salesData,
      ...sellerEntries.map((entry) => ({
        id: entry.id,
        productId: entry.productId,
        quantity: entry.quantity,
        revenue: products.find((p) => p.id === entry.productId)?.price || 0 * entry.quantity,
        location: entry.location,
        timestamp: entry.timestamp,
        hour: entry.timestamp.getHours(),
        month: entry.timestamp.getMonth(),
      })),
    ]

    if (filters.products.length > 0) {
      filtered = filtered.filter((item) => filters.products.includes(item.productId))
    }

    if (filters.timeOfDay !== "all") {
      const timeRanges = {
        morning: [6, 11],
        afternoon: [12, 17],
        evening: [18, 23],
        night: [0, 5],
      }
      const [start, end] = timeRanges[filters.timeOfDay as keyof typeof timeRanges] || [0, 23]
      filtered = filtered.filter((item) => item.hour >= start && item.hour <= end)
    }

    if (filters.month !== "all") {
      const monthNum = Number.parseInt(filters.month)
      filtered = filtered.filter((item) => item.month === monthNum)
    }

    return filtered
  }, [salesData, sellerEntries, filters, products])

  // Calculate analytics
  const analytics = useMemo(() => {
    const totalUnits = filteredData.reduce((sum, item) => sum + item.quantity, 0)
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0)
    const uniqueProducts = new Set(filteredData.map((item) => item.productId)).size
    const avgOrderValue = totalRevenue / filteredData.length || 0

    // Hourly data for chart
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const hourData = filteredData.filter((item) => item.hour === hour)
      return {
        hour,
        units: hourData.reduce((sum, item) => sum + item.quantity, 0),
        revenue: hourData.reduce((sum, item) => sum + item.revenue, 0),
      }
    })

    return {
      totalUnits,
      totalRevenue,
      uniqueProducts,
      avgOrderValue,
      hourlyData,
    }
  }, [filteredData])

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

  const handleProductFilterChange = (productId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      products: checked ? [...prev.products, productId] : prev.products.filter((id) => id !== productId),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Package className="w-8 h-8 text-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Walmart Demand Forecasting
                  </h1>
                  <p className="text-sm text-gray-400">Hyper-Local Retail Intelligence Platform</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Live System
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/analytics-v2">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Advanced Analytics
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="problem"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <Target className="w-4 h-4 mr-2" />
              Problem
            </TabsTrigger>
            <TabsTrigger
              value="solution"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <Brain className="w-4 h-4 mr-2" />
              Solution
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="architecture"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400 transition-all duration-300"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview" className="space-y-8">
              <Stats />
              <Features />
            </TabsContent>

            <TabsContent value="problem">
              <ProblemStatement />
            </TabsContent>

            <TabsContent value="solution">
              <SolutionOverview />
            </TabsContent>

            <TabsContent value="dashboard">
              {/* Main Panel */}
              <div className={`flex-1 transition-all duration-300 ${showSellerPanel ? "mr-96" : ""}`}>
                <div className="p-6 space-y-6 h-full overflow-auto">
                  {/* Analytics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Total Units</p>
                            <p className="text-2xl font-bold text-cyan-400">{analytics.totalUnits.toLocaleString()}</p>
                          </div>
                          <Package className="w-8 h-8 text-cyan-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Revenue</p>
                            <p className="text-2xl font-bold text-green-400">
                              ${analytics.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Products</p>
                            <p className="text-2xl font-bold text-purple-400">{analytics.uniqueProducts}</p>
                          </div>
                          <BarChart3 className="w-8 h-8 text-purple-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Avg Order</p>
                            <p className="text-2xl font-bold text-yellow-400">${analytics.avgOrderValue.toFixed(2)}</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-yellow-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Filters */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Filter className="w-5 h-5" />
                        Filters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Product Filter */}
                        <div className="space-y-2">
                          <Label className="text-gray-300">Products</Label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {products.map((product) => (
                              <div key={product.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={product.id}
                                  checked={filters.products.includes(product.id)}
                                  onCheckedChange={(checked) =>
                                    handleProductFilterChange(product.id, checked as boolean)
                                  }
                                  className="border-gray-600 data-[state=checked]:bg-cyan-500"
                                />
                                <Label htmlFor={product.id} className="text-sm text-gray-300">
                                  {product.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Time of Day Filter */}
                        <div className="space-y-2">
                          <Label className="text-gray-300">Time of Day</Label>
                          <Select
                            value={filters.timeOfDay}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, timeOfDay: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="all">All Day</SelectItem>
                              <SelectItem value="morning">Morning (6-11)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12-17)</SelectItem>
                              <SelectItem value="evening">Evening (18-23)</SelectItem>
                              <SelectItem value="night">Night (0-5)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Month Filter */}
                        <div className="space-y-2">
                          <Label className="text-gray-300">Month</Label>
                          <Select
                            value={filters.month}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, month: value }))}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="all">All Months</SelectItem>
                              <SelectItem value="0">January</SelectItem>
                              <SelectItem value="1">February</SelectItem>
                              <SelectItem value="2">March</SelectItem>
                              <SelectItem value="3">April</SelectItem>
                              <SelectItem value="4">May</SelectItem>
                              <SelectItem value="5">June</SelectItem>
                              <SelectItem value="6">July</SelectItem>
                              <SelectItem value="7">August</SelectItem>
                              <SelectItem value="8">September</SelectItem>
                              <SelectItem value="9">October</SelectItem>
                              <SelectItem value="10">November</SelectItem>
                              <SelectItem value="11">December</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {(filters.products.length > 0 || filters.timeOfDay !== "all" || filters.month !== "all") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFilters({ products: [], timeOfDay: "all", month: "all" })}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Heatmap */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <MapPin className="w-5 h-5" />
                        Sales Density Heatmap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SalesHeatmap data={filteredData} />
                    </CardContent>
                  </Card>

                  {/* Sales Chart */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <BarChart3 className="w-5 h-5" />
                        Sales & Revenue Today
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SalesChart data={analytics.hourlyData} />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Seller Panel */}
              <div
                className={`fixed right-0 top-20 h-[calc(100vh-80px)] w-96 bg-gray-800 border-l border-gray-700 transform transition-transform duration-300 z-30 ${
                  showSellerPanel ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="p-6 space-y-6 h-full overflow-auto">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Add Sale Entry</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSellerPanel(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Time Picker */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">Time</Label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    {/* Product Selector */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">Product</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label className="text-gray-300">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <Button
                      onClick={handleAddSellerEntry}
                      disabled={!selectedProduct || !selectedTime}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Sale Entry
                    </Button>
                  </div>

                  {/* Recent Entries */}
                  {sellerEntries.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Recent Entries</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {sellerEntries
                          .slice(-10)
                          .reverse()
                          .map((entry) => {
                            const product = products.find((p) => p.id === entry.productId)
                            return (
                              <div key={entry.id} className="p-3 bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-white">{product?.name}</p>
                                    <p className="text-sm text-gray-400">
                                      {entry.time} • Qty: {entry.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-green-400 font-medium">
                                      ${((product?.price || 0) * entry.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="architecture">
              <Architecture />
            </TabsContent>

            <TabsContent value="results">
              <Results />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
