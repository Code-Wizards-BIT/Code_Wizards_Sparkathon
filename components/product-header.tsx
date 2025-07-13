"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"

const productData: Record<string, any> = {
  "milk-whole": {
    name: "Whole Milk",
    category: "Dairy",
    price: "$3.49",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
    currentStock: 45,
    demandLevel: "high",
    description: "Fresh whole milk with rich, creamy taste. High demand during morning hours.",
    wastage: 12,
    understock: 3,
  },
  "bread-white": {
    name: "White Bread",
    category: "Bakery",
    price: "$2.99",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    currentStock: 23,
    demandLevel: "high",
    description: "Soft white bread, perfect for breakfast and sandwiches. Peak demand in morning.",
    wastage: 8,
    understock: 5,
  },
  "ice-cream": {
    name: "Vanilla Ice Cream",
    category: "Frozen",
    price: "$4.99",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop",
    currentStock: 67,
    demandLevel: "medium",
    description: "Premium vanilla ice cream. Demand highly correlated with temperature.",
    wastage: 15,
    understock: 2,
  },
  umbrella: {
    name: "Compact Umbrella",
    category: "Accessories",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    currentStock: 12,
    demandLevel: "low",
    description: "Compact umbrella perfect for unexpected rain. Weather-dependent demand.",
    wastage: 5,
    understock: 8,
  },
  "coffee-beans": {
    name: "Premium Coffee Beans",
    category: "Beverages",
    price: "$8.99",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    currentStock: 34,
    demandLevel: "high",
    description: "Premium coffee beans with rich aroma. High morning demand.",
    wastage: 6,
    understock: 4,
  },
  "soup-cans": {
    name: "Chicken Noodle Soup",
    category: "Canned Goods",
    price: "$1.99",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
    currentStock: 89,
    demandLevel: "medium",
    description: "Classic chicken noodle soup. Demand increases during cold weather.",
    wastage: 10,
    understock: 1,
  },
  bananas: {
    name: "Fresh Bananas",
    category: "Produce",
    price: "$1.29",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
    currentStock: 156,
    demandLevel: "high",
    description: "Fresh bananas, perfect for snacking and smoothies.",
    wastage: 25,
    understock: 2,
  },
  "chicken-breast": {
    name: "Chicken Breast",
    category: "Meat",
    price: "$6.99",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    currentStock: 78,
    demandLevel: "high",
    description: "Fresh chicken breast, perfect for dinner preparations.",
    wastage: 18,
    understock: 6,
  },
  "yogurt-greek": {
    name: "Greek Yogurt",
    category: "Dairy",
    price: "$4.49",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    currentStock: 92,
    demandLevel: "medium",
    description: "Creamy Greek yogurt, high in protein and perfect for breakfast.",
    wastage: 14,
    understock: 3,
  },
  "pasta-spaghetti": {
    name: "Spaghetti Pasta",
    category: "Pantry",
    price: "$2.49",
    image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop",
    currentStock: 145,
    demandLevel: "medium",
    description: "Classic spaghetti pasta, perfect for family dinners.",
    wastage: 7,
    understock: 2,
  },
  "apples-red": {
    name: "Red Apples",
    category: "Produce",
    price: "$2.99",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop",
    currentStock: 203,
    demandLevel: "high",
    description: "Fresh red apples, crisp and sweet.",
    wastage: 22,
    understock: 1,
  },
  "orange-juice": {
    name: "Fresh Orange Juice",
    category: "Beverages",
    price: "$3.99",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    currentStock: 67,
    demandLevel: "medium",
    description: "Fresh squeezed orange juice, perfect for breakfast.",
    wastage: 11,
    understock: 4,
  },
  "ground-beef": {
    name: "Ground Beef",
    category: "Meat",
    price: "$5.99",
    image: "https://images.unsplash.com/photo-1588347818133-6b2e6d2e8d6a?w=400&h=300&fit=crop",
    currentStock: 54,
    demandLevel: "high",
    description: "Fresh ground beef, perfect for burgers and tacos.",
    wastage: 16,
    understock: 7,
  },
  "cheese-cheddar": {
    name: "Cheddar Cheese",
    category: "Dairy",
    price: "$4.99",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
    currentStock: 89,
    demandLevel: "medium",
    description: "Sharp cheddar cheese, perfect for sandwiches and cooking.",
    wastage: 9,
    understock: 3,
  },
  "cereal-cheerios": {
    name: "Cheerios Cereal",
    category: "Breakfast",
    price: "$4.29",
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400&h=300&fit=crop",
    currentStock: 112,
    demandLevel: "medium",
    description: "Classic Cheerios cereal, heart-healthy and delicious.",
    wastage: 5,
    understock: 2,
  },
  tomatoes: {
    name: "Fresh Tomatoes",
    category: "Produce",
    price: "$2.49",
    image: "https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=400&h=300&fit=crop",
    currentStock: 134,
    demandLevel: "high",
    description: "Fresh tomatoes, perfect for salads and cooking.",
    wastage: 28,
    understock: 3,
  },
  "salmon-fillet": {
    name: "Salmon Fillet",
    category: "Seafood",
    price: "$12.99",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
    currentStock: 43,
    demandLevel: "medium",
    description: "Fresh salmon fillet, rich in omega-3 fatty acids.",
    wastage: 12,
    understock: 5,
  },
  "potato-chips": {
    name: "Potato Chips",
    category: "Snacks",
    price: "$3.49",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop",
    currentStock: 187,
    demandLevel: "high",
    description: "Crispy potato chips, perfect for snacking.",
    wastage: 8,
    understock: 2,
  },
  "eggs-dozen": {
    name: "Dozen Eggs",
    category: "Dairy",
    price: "$2.79",
    image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&h=300&fit=crop",
    currentStock: 98,
    demandLevel: "high",
    description: "Fresh dozen eggs, perfect for breakfast and baking.",
    wastage: 13,
    understock: 4,
  },
  "lettuce-romaine": {
    name: "Romaine Lettuce",
    category: "Produce",
    price: "$1.99",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop",
    currentStock: 76,
    demandLevel: "medium",
    description: "Fresh romaine lettuce, perfect for salads and wraps.",
    wastage: 19,
    understock: 3,
  },
}

export function ProductHeader({ productId }: { productId: string }) {
  const product = productData[productId] || productData["milk-whole"]

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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <Badge className={getDemandColor(product.demandLevel)}>{product.demandLevel} demand</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg bg-gray-100"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=300&width=300"
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600">{product.category}</p>
          </div>

          <div className="text-3xl font-bold text-blue-600">{product.price}</div>

          <p className="text-gray-700">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{product.currentStock}</div>
              <div className="text-sm text-gray-600">Current Stock</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-sm text-gray-600">Trending Up</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{product.wastage}%</div>
              <div className="text-sm text-gray-600">Wastage Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{product.understock}%</div>
              <div className="text-sm text-gray-600">Understock Rate</div>
            </div>
          </div>

          {product.currentStock < 50 && product.demandLevel === "high" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Low stock alert - Consider reordering</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
