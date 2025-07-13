"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function LiveDashboard() {
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const storeData = [
    {
      store: "Store #1247 - Dallas, TX",
      sku: "iPhone 15 Pro",
      currentStock: 45,
      predictedDemand: 52,
      confidence: 94,
      status: "reorder",
      sentiment: 0.8,
      weather: "Sunny, 75°F",
    },
    {
      store: "Store #2891 - Miami, FL",
      sku: "Samsung Galaxy S24",
      currentStock: 78,
      predictedDemand: 23,
      confidence: 91,
      status: "optimal",
      sentiment: 0.6,
      weather: "Rainy, 82°F",
    },
    {
      store: "Store #3456 - Seattle, WA",
      sku: "MacBook Air M3",
      currentStock: 12,
      predictedDemand: 8,
      confidence: 89,
      status: "overstock",
      sentiment: 0.9,
      weather: "Cloudy, 58°F",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reorder":
        return "bg-red-100 text-red-800"
      case "optimal":
        return "bg-green-100 text-green-800"
      case "overstock":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reorder":
        return <AlertCircle className="w-4 h-4" />
      case "optimal":
        return <CheckCircle className="w-4 h-4" />
      case "overstock":
        return <TrendingDown className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className={`${isLive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                {isLive ? "LIVE" : "OFFLINE"}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">Live Demand Intelligence Dashboard</h2>
            <p className="text-lg text-gray-600">
              Real-time predictions across all stores • Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          <Tabs defaultValue="predictions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">Live Predictions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Stores</p>
                        <p className="text-2xl font-bold">4,847</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">SKUs Monitored</p>
                        <p className="text-2xl font-bold">127K</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg Confidence</p>
                        <p className="text-2xl font-bold">92.4%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {storeData.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-gray-900">{item.store}</h4>
                          <p className="text-sm text-gray-600">{item.sku}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-600">Current Stock</p>
                          <p className="text-xl font-bold">{item.currentStock}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-600">Predicted Demand</p>
                          <p className="text-xl font-bold text-blue-600">{item.predictedDemand}</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-600">Confidence</p>
                          <div className="flex items-center gap-2">
                            <Progress value={item.confidence} className="w-16" />
                            <span className="text-sm font-medium">{item.confidence}%</span>
                          </div>
                        </div>

                        <div className="text-center">
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 capitalize">{item.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Social Sentiment:</span> {(item.sentiment * 100).toFixed(0)}%
                          positive
                        </div>
                        <div>
                          <span className="font-medium">Weather:</span> {item.weather}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stockout Reduction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Before AI</span>
                        <span className="font-bold text-red-600">30.2%</span>
                      </div>
                      <Progress value={30.2} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>With AI</span>
                        <span className="font-bold text-green-600">10.1%</span>
                      </div>
                      <Progress value={10.1} className="h-2" />
                      <div className="text-center text-lg font-bold text-green-600">20.1% Reduction Achieved!</div>
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
                        <span>Before AI</span>
                        <span className="font-bold text-red-600">25.8%</span>
                      </div>
                      <Progress value={25.8} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span>With AI</span>
                        <span className="font-bold text-green-600">10.7%</span>
                      </div>
                      <Progress value={10.7} className="h-2" />
                      <div className="text-center text-lg font-bold text-green-600">15.1% Reduction Achieved!</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-900">Critical Reorder Alert</h4>
                      <p className="text-red-700">Store #1247 - iPhone 15 Pro predicted to stockout in 2 days</p>
                      <p className="text-sm text-red-600 mt-1">Confidence: 94% • Social buzz increasing 45%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <TrendingDown className="w-6 h-6 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-900">Overstock Warning</h4>
                      <p className="text-yellow-700">Store #3456 - MacBook Air M3 showing low demand trend</p>
                      <p className="text-sm text-yellow-600 mt-1">Consider promotional pricing or redistribution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-900">Optimal Performance</h4>
                      <p className="text-green-700">Store #2891 - All SKUs within optimal inventory ranges</p>
                      <p className="text-sm text-green-600 mt-1">Weather and social factors aligned with predictions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
