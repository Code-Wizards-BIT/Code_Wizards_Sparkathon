"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Brain, Clock, TrendingUp, Zap, Shield, Database, MessageSquare, Cloud } from "lucide-react"

export function Features() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: BarChart3,
      title: "Interactive Heatmaps",
      description:
        "Visualize demand patterns across time, weather, and social sentiment with intuitive color-coded heatmaps.",
      details: [
        "24/7 real-time demand visualization",
        "Multi-dimensional data correlation",
        "Interactive time-based filtering",
        "Store-specific pattern analysis",
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms analyze multiple data sources to predict demand with 94% accuracy.",
      details: [
        "Transformer neural networks",
        "Multi-modal data fusion",
        "Continuous learning algorithms",
        "Predictive confidence scoring",
      ],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "24/7 tracking of inventory levels, demand patterns, and market conditions for instant alerts.",
      details: [
        "Live inventory tracking",
        "Instant alert notifications",
        "Performance dashboards",
        "Automated reporting",
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Forecast future demand based on historical patterns, weather forecasts, and social trends.",
      details: [
        "7-day demand forecasting",
        "Seasonal trend analysis",
        "Weather impact modeling",
        "Social sentiment integration",
      ],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    },
    {
      icon: Zap,
      title: "Smart Recommendations",
      description: "Automated suggestions for restocking, pricing, and inventory optimization to maximize efficiency.",
      details: [
        "Intelligent reorder points",
        "Dynamic pricing suggestions",
        "Inventory redistribution",
        "Waste reduction strategies",
      ],
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
    },
    {
      icon: Shield,
      title: "Waste Prevention",
      description: "Reduce food waste and overstock by up to 85% through precise demand forecasting and alerts.",
      details: ["Expiration date tracking", "Markdown optimization", "Donation coordination", "Sustainability metrics"],
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
    },
  ]

  const dataSources = [
    {
      icon: Database,
      title: "POS Data",
      description: "Real-time sales transactions",
      color: "bg-blue-100 text-blue-800",
    },
    {
      icon: MessageSquare,
      title: "Social Sentiment",
      description: "Twitter, Reddit, and review analysis",
      color: "bg-purple-100 text-purple-800",
    },
    {
      icon: Cloud,
      title: "Weather Data",
      description: "Temperature, precipitation, forecasts",
      color: "bg-green-100 text-green-800",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800">Core Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Intelligent Demand Forecasting</h2>
          <p className="text-xl text-gray-600">
            Advanced analytics that transform how you manage inventory, reduce waste, and optimize stock levels through
            AI-powered insights.
          </p>
        </div>

        {/* Data Sources */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Multi-Source Data Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {dataSources.map((source, index) => (
              <Card key={index} className="text-center border-2 hover:border-blue-200 transition-colors">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <source.icon className="w-8 h-8 text-gray-600" />
                  </div>
                  <Badge className={source.color}>{source.title}</Badge>
                  <p className="text-sm text-gray-600 mt-2">{source.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all border-2 ${
                    activeFeature === index ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          activeFeature === index ? "bg-blue-500" : "bg-gray-100"
                        }`}
                      >
                        <feature.icon
                          className={`w-6 h-6 ${activeFeature === index ? "text-white" : "text-gray-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                        {activeFeature === index && (
                          <ul className="mt-3 space-y-1">
                            {feature.details.map((detail, idx) => (
                              <li key={idx} className="flex items-center text-sm text-blue-700">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <Card className="overflow-hidden">
              <img
                src={features[activeFeature].image || "/placeholder.svg"}
                alt={features[activeFeature].title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=320&width=600"
                }}
              />
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-2">{features[activeFeature].title}</h4>
                <p className="text-gray-600">{features[activeFeature].description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
