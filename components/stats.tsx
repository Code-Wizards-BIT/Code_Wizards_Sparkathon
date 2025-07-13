"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function Stats() {
  const [animatedValues, setAnimatedValues] = useState({
    waste: 0,
    accuracy: 0,
    savings: 0,
    efficiency: 0,
  })

  const finalValues = {
    waste: 85,
    accuracy: 94,
    savings: 847,
    efficiency: 92,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        waste: Math.floor(finalValues.waste * progress),
        accuracy: Math.floor(finalValues.accuracy * progress),
        savings: Math.floor(finalValues.savings * progress),
        efficiency: Math.floor(finalValues.efficiency * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedValues(finalValues)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      value: `${animatedValues.waste}%`,
      label: "Waste Reduction",
      description: "Less food waste through accurate demand prediction",
      color: "text-red-600",
      bgColor: "bg-red-100",
      progress: animatedValues.waste,
    },
    {
      value: `${animatedValues.accuracy}%`,
      label: "Forecast Accuracy",
      description: "Precise predictions using multi-source data analysis",
      color: "text-green-600",
      bgColor: "bg-green-100",
      progress: animatedValues.accuracy,
    },
    {
      value: `$${animatedValues.savings}M`,
      label: "Annual Savings",
      description: "Cost reduction from optimized inventory management",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: (animatedValues.savings / finalValues.savings) * 100,
    },
    {
      value: `${animatedValues.efficiency}%`,
      label: "Efficiency Gain",
      description: "Overall operational efficiency improvement",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progress: animatedValues.efficiency,
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Proven Results</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real impact from our AI-powered demand forecasting system deployed across 500+ Walmart stores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-2 hover:border-blue-200 transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
                <div className="space-y-3">
                  <div className="text-lg font-semibold text-gray-900">{stat.label}</div>
                  <Progress value={stat.progress} className="h-2" />
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">4,847</div>
              <div className="text-blue-800 font-medium">Active Stores</div>
              <div className="text-sm text-blue-600 mt-1">Across North America</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">127K</div>
              <div className="text-green-800 font-medium">SKUs Monitored</div>
              <div className="text-sm text-green-600 mt-1">Real-time tracking</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{"<50ms"}</div>
              <div className="text-purple-800 font-medium">Response Time</div>
              <div className="text-sm text-purple-600 mt-1">Lightning fast predictions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
