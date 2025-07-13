"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: "milk-whole",
    name: "Whole Milk",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
    currentStock: 45,
    demandLevel: "high",
    peakHours: "6-9 AM",
    weatherImpact: "High",
    sentiment: 0.8,
    price: "$3.49",
    trend: "up",
    wastage: 12,
    understock: 3,
  },
  {
    id: "bread-white",
    name: "White Bread",
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    currentStock: 23,
    demandLevel: "high",
    peakHours: "7-10 AM",
    weatherImpact: "Medium",
    sentiment: 0.7,
    price: "$2.99",
    trend: "up",
    wastage: 8,
    understock: 5,
  },
  {
    id: "ice-cream",
    name: "Vanilla Ice Cream",
    category: "Frozen",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop",
    currentStock: 67,
    demandLevel: "medium",
    peakHours: "2-8 PM",
    weatherImpact: "Very High",
    sentiment: 0.9,
    price: "$4.99",
    trend: "down",
    wastage: 15,
    understock: 2,
  },
  {
    id: "umbrella",
    name: "Compact Umbrella",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    currentStock: 12,
    demandLevel: "low",
    peakHours: "Variable",
    weatherImpact: "Extreme",
    sentiment: 0.6,
    price: "$12.99",
    trend: "up",
    wastage: 5,
    understock: 8,
  },
  {
    id: "coffee-beans",
    name: "Premium Coffee Beans",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    currentStock: 34,
    demandLevel: "high",
    peakHours: "6-11 AM",
    weatherImpact: "Low",
    sentiment: 0.85,
    price: "$8.99",
    trend: "stable",
    wastage: 6,
    understock: 4,
  },
  {
    id: "soup-cans",
    name: "Chicken Noodle Soup",
    category: "Canned Goods",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    currentStock: 89,
    demandLevel: "medium",
    peakHours: "11 AM-2 PM",
    weatherImpact: "High",
    sentiment: 0.75,
    price: "$1.99",
    trend: "up",
    wastage: 10,
    understock: 1,
  },
  {
    id: "bananas",
    name: "Fresh Bananas",
    category: "Produce",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
    currentStock: 156,
    demandLevel: "high",
    peakHours: "8 AM-6 PM",
    weatherImpact: "Medium",
    sentiment: 0.82,
    price: "$1.29",
    trend: "up",
    wastage: 25,
    understock: 2,
  },
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "Meat",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    currentStock: 78,
    demandLevel: "high",
    peakHours: "4-7 PM",
    weatherImpact: "Low",
    sentiment: 0.77,
    price: "$6.99",
    trend: "up",
    wastage: 18,
    understock: 6,
  },
  {
    id: "yogurt-greek",
    name: "Greek Yogurt",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    currentStock: 92,
    demandLevel: "medium",
    peakHours: "7-9 AM",
    weatherImpact: "Low",
    sentiment: 0.88,
    price: "$4.49",
    trend: "stable",
    wastage: 14,
    understock: 3,
  },
  {
    id: "pasta-spaghetti",
    name: "Spaghetti Pasta",
    category: "Pantry",
    image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop",
    currentStock: 145,
    demandLevel: "medium",
    peakHours: "5-8 PM",
    weatherImpact: "Low",
    sentiment: 0.73,
    price: "$2.49",
    trend: "stable",
    wastage: 7,
    understock: 2,
  },
  {
    id: "apples-red",
    name: "Red Apples",
    category: "Produce",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
    currentStock: 203,
    demandLevel: "high",
    peakHours: "9 AM-5 PM",
    weatherImpact: "Medium",
    sentiment: 0.85,
    price: "$2.99",
    trend: "up",
    wastage: 22,
    understock: 1,
  },
  {
    id: "orange-juice",
    name: "Fresh Orange Juice",
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    currentStock: 67,
    demandLevel: "medium",
    peakHours: "7-10 AM",
    weatherImpact: "Medium",
    sentiment: 0.79,
    price: "$3.99",
    trend: "stable",
    wastage: 11,
    understock: 4,
  },
  {
    id: "ground-beef",
    name: "Ground Beef",
    category: "Meat",
    image: "https://images.unsplash.com/photo-1588347818133-6b2e6d2e8d6a?w=400&h=300&fit=crop",
    currentStock: 54,
    demandLevel: "high",
    peakHours: "4-7 PM",
    weatherImpact: "Low",
    sentiment: 0.74,
    price: "$5.99",
    trend: "up",
    wastage: 16,
    understock: 7,
  },
  {
    id: "cheese-cheddar",
    name: "Cheddar Cheese",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
    currentStock: 89,
    demandLevel: "medium",
    peakHours: "11 AM-2 PM",
    weatherImpact: "Low",
    sentiment: 0.81,
    price: "$4.99",
    trend: "stable",
    wastage: 9,
    understock: 3,
  },
  {
    id: "cereal-cheerios",
    name: "Cheerios Cereal",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop",
    currentStock: 112,
    demandLevel: "medium",
    peakHours: "6-9 AM",
    weatherImpact: "Low",
    sentiment: 0.86,
    price: "$4.29",
    trend: "stable",
    wastage: 5,
    understock: 2,
  },
  {
    id: "tomatoes",
    name: "Fresh Tomatoes",
    category: "Produce",
    image: "https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=400&h=300&fit=crop",
    currentStock: 134,
    demandLevel: "high",
    peakHours: "10 AM-6 PM",
    weatherImpact: "High",
    sentiment: 0.76,
    price: "$2.49",
    trend: "up",
    wastage: 28,
    understock: 3,
  },
  {
    id: "salmon-fillet",
    name: "Salmon Fillet",
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
    currentStock: 43,
    demandLevel: "medium",
    peakHours: "5-8 PM",
    weatherImpact: "Low",
    sentiment: 0.83,
    price: "$12.99",
    trend: "up",
    wastage: 12,
    understock: 5,
  },
  {
    id: "potato-chips",
    name: "Potato Chips",
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop",
    currentStock: 187,
    demandLevel: "high",
    peakHours: "2-9 PM",
    weatherImpact: "Medium",
    sentiment: 0.78,
    price: "$3.49",
    trend: "up",
    wastage: 8,
    understock: 2,
  },
  {
    id: "eggs-dozen",
    name: "Dozen Eggs",
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&h=300&fit=crop",
    currentStock: 98,
    demandLevel: "high",
    peakHours: "7-10 AM",
    weatherImpact: "Low",
    sentiment: 0.84,
    price: "$2.79",
    trend: "stable",
    wastage: 13,
    understock: 4,
  },
  {
    id: "lettuce-romaine",
    name: "Romaine Lettuce",
    category: "Produce",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
    currentStock: 76,
    demandLevel: "medium",
    peakHours: "11 AM-3 PM",
    weatherImpact: "High",
    sentiment: 0.72,
    price: "$1.99",
    trend: "stable",
    wastage: 19,
    understock: 3,
  },
]

export function ProductGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [demandFilter, setDemandFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesDemand = demandFilter === "all" || product.demandLevel === demandFilter
    return matchesSearch && matchesCategory && matchesDemand
  })

  const getDemandColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStockStatus = (stock: number, demandLevel: string) => {
    if (demandLevel === "high" && stock < 50) return "Low Stock"
    if (demandLevel === "medium" && stock < 30) return "Low Stock"
    if (demandLevel === "low" && stock < 20) return "Low Stock"
    if (stock > 150) return "Overstock"
    return "Optimal"
  }

  const getStockColor = (status: string) => {
    switch (status) {
      case "Low Stock":
        return "text-red-600"
      case "Overstock":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Demand Analytics</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive product catalog with AI-powered demand forecasting, real-time heatmaps, and
              intelligent inventory optimization.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={demandFilter} onValueChange={setDemandFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Demand Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Demand Levels</SelectItem>
                <SelectItem value="high">High Demand</SelectItem>
                <SelectItem value="medium">Medium Demand</SelectItem>
                <SelectItem value="low">Low Demand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.currentStock, product.demandLevel)
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge className={getDemandColor(product.demandLevel)}>{product.demandLevel} demand</Badge>
                      {getTrendIcon(product.trend)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600">{product.category}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                      <span className={`font-medium ${getStockColor(stockStatus)}`}>{stockStatus}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Stock:</span>
                        <span className="ml-1 font-medium">{product.currentStock}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Peak:</span>
                        <span className="ml-1 font-medium">{product.peakHours}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Wastage:</span>
                        <span className="ml-1 font-medium text-red-600">{product.wastage}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Understock:</span>
                        <span className="ml-1 font-medium text-orange-600">{product.understock}%</span>
                      </div>
                    </div>

                    <Link href={`/product/${product.id}`}>
                      <Button className="w-full mt-4">View Demand Heatmap</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setDemandFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
